import { cModuleName, Translate, LnKutils, cLUisGM, cLUuseKey, cLUusePasskey, cLUchangePasskey, cLUIdentity, cLUaddIdentity, cLUpickLock, cLUbreakLock, cLUCustomCheck, cLUFreeCircumvent } from "./utils/LnKutils.js";
import { cLockTypeDoor, cLockTypeTile, cLockTypeLootPf2e } from "./utils/LnKutils.js";
import { LnKFlags } from "./helpers/LnKFlags.js";
import { LnKPopups } from "./helpers/LnKPopups.js";
import { LnKSound } from "./helpers/LnKSound.js";
import { cCustomPopup } from "./helpers/LnKFlags.js";
import { LnKCompUtils } from "./compatibility/LnKCompUtils.js";

const cLnKKeyIcon = "fa-key";
const cLnKcheck = "fa-solid fa-check";
const cLnKcross = "fa-solid fa-xmark";

//does everything Lock related
class LockManager {
	//DECLARATIONS
	//basics
	static async useLockKey(pLock, pCharacter, pKeyItemID, puseData = {}) {} //handels pLock use of pCharacter with item of pItemID
	
	static async useLockPasskey(pLock, pCharacter, pPasskey, puseData = {}) {} //handels pLock use of pCharacter with Passkey pPasskey
	
	static async changeLockPasskey(pLock, pCharacter, pPasskey, puseData = {}) {} //handels pLock use of pCharacter with Passkey pPasskey to change passkey
	
	static async useLockIdentity(pLock, pCharacter, pIdentityMatch, puseData = {}) {} //handels pLock use of pCharacter with Identity pIdentityMatch
	
	static async addLockIdentity(pLock, pCharacter, pUser, pIdentityTypes, puseData = {}) {} //handels the addtition of new Identity to a lock
	
	static async circumventLock(pLock, pCharacter, pUsedItemID, pRollresult, pDiceresult, pMethodtype, puseData = {}) {} //handels pLock use of pCharacter with a pMethodtype [cLUpickLock, cLUbreakLock, cLUCustomCheck] and result pRollresults
	
	static async oncircumventLockresult(pLock, pCharacter, pUsedItemID, pResultDegree, pMethodtype, pChatMessages = false, puseData = {}) {} //called when pCharacter tries to circumvent pLock using pMethodtype with pResultDegree
	
	static useFreeCircumvent(pLock, pCharacter, puseData = {}) {} //handels use of free lock circumvents (e.g. knock spell)
	
	static async LockuseRequest(puseData) {} //called when a player request to use a lock, handeld by gm
	
	static requestLockonClose(pLock) {} //request the GM to lock a lock on close door
	
	static LockonCloseRequest(pData) {} //called when a player requests a lock on close
	
	//LockKeys
	static async newLockKey(pLock) {} //create a new item key for pLock
	
	static createKeycreationDialog(pLock) {} //used to create a popup with the options to create a new key for pLock
	
	//events
	static async onLock(pLock, pLockusetype) {} //calledif a lock is locked
	
	static async onunLock(pLock, pLockusetype) {} //calledif a lock is unlocked
	
	//lock type
	static async ToggleLock(pLock, pLockusetype) {} //locks or unlocks
	
	static async ToggleDoorLock(pDoor, pLockusetype) {} //locks or unlocks pDoor
	
	static async onBreakLock(pLock) {} //makes it, so that the Lock is no longer Lockable (if setting is active)
	
	static async isUnlocked(pObject, pPopup = false) {} //if pObject is currently unlocked
	
	static TokenisUnlocked(pToken) {} //if pToken is currently unlocked
	
	static UserCanopenToken(pToken, pPopup = false) {} //if the current user can open pToken
	
	static async LockedMessage(pObject) {} //emmits a locked message
	
	//copy paste
	static copyLock(pLock) {} //copy the Locks Key IDs
	
	static async pasteLock(pLockType, pLock) {} //paste the Key IDs to the Lock 
	
	//ons
	static onpreupdateWall(pWall, pChanges, pInfos, pUser) {} //called when a wall preupdates
	
	static onLockLClick(pDocument, pInfos, pType) {} //called when a lock is left clicked
	
	static onLockRClick(pDocument, pInfos, pType) {} //called when a lock is right clicked
	
	//IMPLEMENTATIONS
	//basics
	static async useLockKey(pLock, pCharacter, pKeyItemID, puseData = {}) {
		let vKey = (await LnKutils.TokenInventory(pCharacter)).find(vItem => vItem.id == pKeyItemID);
		
		let vOutcome = 0;
		
		if (vKey) {
			if (LnKFlags.matchingIDKeys(vKey, pLock, game.settings.get(cModuleName, "UseKeynameasID"))) {
				if (game.settings.get(cModuleName, "JamedLockKeyunusable") && LnKFlags.Lockisjammed(pLock)) {
					//lock is jammed and cant be opened by key
					LnKPopups.TextPopUpID(pLock, "Lockisjammed"); //MESSAGE POPUP
				}
				else {
					//key fits
					LockManager.ToggleLock(pLock, cLUuseKey);
					
					vOutcome = 1;
					
					if (LnKFlags.RemoveKeyonUse(vKey)) {
						//remove one from stack, which will also delte if no key left
						LnKutils.removeoneItem(vKey, pCharacter);
					}
				}
			}
		}
		
		Hooks.call(cModuleName + ".LockUse", pLock, pCharacter, {UseType : cLUuseKey, Outcome : vOutcome, useData : puseData});
	}
	
	static async useLockPasskey(pLock, pCharacter, pPasskey, puseData = {}) {
		let vOutcome = 0;
		
		if (LnKFlags.MatchingPasskey(pLock, pPasskey)) {
			//Passkey matches
			LockManager.ToggleLock(pLock, cLUuseKey);
			
			vOutcome = 1;
		}	
		else {
			LnKPopups.TextPopUpID(pLock, "WrongPassword"); //MESSAGE POPUP
		}
		
		Hooks.call(cModuleName + ".LockUse", pLock, pCharacter, {UseType : cLUusePasskey, Outcome : vOutcome, useData : puseData});
	}
	
	static async changeLockPasskey(pLock, pCharacter, pPasskey, puseData = {}) {
		let vOutcome = 0;
		
		if (LnKFlags.PasskeyChangeable(pLock) && LnKFlags.MatchingPasskey(pLock, pPasskey)) {
			if (puseData.NewPasskey.length > 0) {
				//Passkey matches
				LnKFlags.setPassKey(pLock, puseData.NewPasskey);
				
				LnKPopups.TextPopUpID(pLock, "PasswordChanged"); //MESSAGE POPUP
				
				vOutcome = 1;
			}
			else {
				LnKPopups.TextPopUpID(pLock, "NoPasswordLength"); //MESSAGE POPUP
			}
		}	
		else {
			LnKPopups.TextPopUpID(pLock, "WrongPassword"); //MESSAGE POPUP
		}
		
		Hooks.call(cModuleName + ".LockUse", pLock, pCharacter, {UseType : cLUusePasskey, Outcome : vOutcome, useData : puseData});
	}
	
	static async useLockIdentity(pLock, pCharacter, pIdentityMatch, puseData = {}) {
		let vOutcome = 0;
		
		if (LnKFlags.MatchingIdentityKeys(pLock, [pIdentityMatch])) {
			//Passkey matches
			LockManager.ToggleLock(pLock, cLUIdentity);
			
			vOutcome = 1;
		}	
		else {
			LnKPopups.TextPopUpID(pLock, "WrongIdentity"); //MESSAGE POPUP
		}
		
		Hooks.call(cModuleName + ".LockUse", pLock, pCharacter, {UseType : cLUIdentity, Outcome : vOutcome, useData : puseData});
	}
	
	static async addLockIdentity(pLock, pCharacter, pUser, pIdentityTypes, puseData = {}) {
		if (pCharacter && pUser) {
			let vDisplayContent = [];
			
			let vIdentities = [];
			
			for (let vtype of pIdentityTypes) {
				let vObjectType, vIdentifier;
				[vObjectType, vIdentifier] = vtype.split(".");
				
				let vObject;
				
				switch (vObjectType) {
					case "token":
						vObject = pCharacter;
						break;
					case "actor":
						vObject = pCharacter.actor;
						break;
					case "user":
						vObject = pUser;
						break;
				}
				
				if (vObject && vObject[vIdentifier]) {
					vIdentities.push(vObject[vIdentifier]);
					
					vDisplayContent.push(Translate("Titles.IdentifierofType", {pIdentifier : vIdentifier, pType : vObjectType, pName : vObject.name}));
				}
			}
			
			function confirmAction() {
				LnKFlags.addIdentityKeys(pLock, vIdentities); 
				if (puseData.options?.makeLockable) {
					LnKFlags.makeLockable(pLock, puseData.options.startasLocked);
				}
				Hooks.call(cModuleName + ".LockUse", pLock, pCharacter, {UseType : cLUaddIdentity, Outcome : 1, useData : puseData});
			}
			
			if (game.settings.get(cModuleName, "AutoAcceptIdentityAddition")) {
				confirmAction();
			}
			else {
				new Dialog({
					title: Translate("Titles.addIdentity"),
					content: `<label>${Translate("Titles.addIdentityMessage", {pPlayerName : pUser.name, pIdentities : vDisplayContent.join(",")})}</label>`,
					buttons: {
						confirmButton: {
							label: Translate("Titles.confirm"),
							callback: (html) => {confirmAction()},
							icon: `<i class="${cLnKcheck}"></i>`
						},
						abbortButtom: {
							label: Translate("Titles.abbort"),
							callback: (html) => {Hooks.call(cModuleName + ".LockUse", pLock, pCharacter, {UseType : cLUaddIdentity, Outcome : 0, useData : puseData});},
							icon: `<i class="${cLnKcross}"></i>`
						}
					},
					default: Translate("Titles.confirm")
				}).render(true);
			}
		}
	}
	
	static async circumventLock(pLock, pCharacter, pUsedItemID, pRollresult, pDiceresult, pMethodtype, puseData = {}) {
		//only handles custom successDegree
		let vSuccessDegree;
		
		vSuccessDegree = await LnKutils.successDegree(pRollresult, pDiceresult, LnKFlags.LockDCtype(pLock, pMethodtype), pCharacter, {RollType : pMethodtype});
		
		LockManager.oncircumventLockresult(pLock, pCharacter, pUsedItemID, vSuccessDegree, pMethodtype, true, puseData)
	}
	
	static async oncircumventLockresult(pLock, pCharacter, pUsedItemID, pResultDegree, pMethodtype, pChatMessages = false, puseData = {}) {
		let vCritMessagesuffix = ".default";
		let vusedItem;	
		
		if (LnKFlags.isLockable(pLock)) {
			if ((pResultDegree > 1) || (pResultDegree < 0)) {
				vCritMessagesuffix = ".crit";
			}
			
			if (pUsedItemID && pUsedItemID.length > 0) {
				vusedItem = (await LnKutils.TokenInventory(pCharacter)).find(vItem => vItem.id == pUsedItemID);
			}	
			
			if (pResultDegree > 0) {
				//success
				switch (pMethodtype) {
							case cLUpickLock:
								if (await LnKFlags.changeLockPicksuccesses(pLock, pResultDegree)) {
									//only toggle lock if enough seccesses have been achieved
									LockManager.ToggleLock(pLock, pMethodtype);
								}
								
								if (pChatMessages) {
									if (game.settings.get(cModuleName, "MentionLockPickItem") && vusedItem && vusedItem.name) {
										await ChatMessage.create({user: game.user.id, content : Translate("ChatMessage.LockPicksuccessLPName"+vCritMessagesuffix, {pName : pCharacter.name, pLPName : vusedItem.name})}); //CHAT MESSAGE
									}
									else {
										await ChatMessage.create({user: game.user.id, content : Translate("ChatMessage.LockPicksuccess"+vCritMessagesuffix, {pName : pCharacter.name})}); //CHAT MESSAGE
									}
								}
								
								break;
							case cLUbreakLock:
								if (await LockManager.ToggleLock(pLock, pMethodtype)) {	
									//something could fail during Lock toggle								
									await LockManager.onBreakLock(pLock);
								}
								
								if (pChatMessages) {
									await ChatMessage.create({user: game.user.id, content : Translate("ChatMessage.LockBreaksuccess"+vCritMessagesuffix, {pName : pCharacter.name})}); //CHAT MESSAGE
								}
								
								break;
							case cLUCustomCheck:
								LockManager.ToggleLock(pLock, pMethodtype);
								
								if (pChatMessages) {
									await ChatMessage.create({user: game.user.id, content : Translate("ChatMessage.CustomChecksuccess"+vCritMessagesuffix, {pName : pCharacter.name, pCheckName : game.settings.get(cModuleName, "CustomCircumventName")})}); //CHAT MESSAGE
								}		
								
								break;
				}
			}
			else {
				//failure
				switch (pMethodtype) {
							case cLUpickLock:
								let vRemoveLP = game.settings.get(cModuleName, "RemoveLPoncritFail") && (pResultDegree < 0) && vusedItem;
								
								if (pChatMessages) {
									if (game.settings.get(cModuleName, "MentionLockPickItem") && vusedItem && vusedItem.name) {
										if (vRemoveLP) {
											await ChatMessage.create({user: game.user.id, content : Translate("ChatMessage.LockPickfailLPNameremove"+vCritMessagesuffix, {pName : pCharacter.name, pLPName : vusedItem.name})}); //CHAT MESSAGE
										}
										else {
											await ChatMessage.create({user: game.user.id, content : Translate("ChatMessage.LockPickfailLPName"+vCritMessagesuffix, {pName : pCharacter.name, pLPName : vusedItem.name})}); //CHAT MESSAGE
										}
									}
									else {
										await ChatMessage.create({user: game.user.id, content : Translate("ChatMessage.LockPickfail"+vCritMessagesuffix, {pName : pCharacter.name})}); //CHAT MESSAGE
									}
								}
								
								await LnKFlags.ReduceLPAttempts(pLock);
								
								if (pResultDegree < 0) {
									if (vRemoveLP) {
										let vtoRemove;
										
										if (LnKFlags.hasReplacementItem(vusedItem)) {
											vtoRemove = (await LnKutils.TokenInventory(pCharacter)).find(vItem => LnKutils.isLockPickItem(vItem, LnKFlags.ReplacementItems(vusedItem)));
										}
										
										if (!vtoRemove) {
											vtoRemove = vusedItem;
										}
										
										//if crit fail and LP item was found and set to do so, remove Lockpick from inventory
										LnKutils.removeoneItem(vtoRemove, pCharacter);
										LnKPopups.TextPopUpID(pLock, "Lockpickbroke", {}, true); //MESSAGE POPUP
									}
									
									if (game.settings.get(cModuleName, "JamLockonLPcritFail")) {
										LnKFlags.JamLock(pLock);
										LnKPopups.TextPopUpID(pLock, "jammedLock", {}, true); //MESSAGE POPUP
									}
									
									LnKPopups.TextPopUpQueue(pLock); //MESSAGE POPUP
								}
								else {
									LnKPopups.TextPopUpID(pLock, "pickLockfailed"); //MESSAGE POPUP
								}
								
								break;
							case cLUbreakLock:
								LnKPopups.TextPopUpID(pLock, "breakLockfailed"); //MESSAGE POPUP
								
								if (pChatMessages) {
									await ChatMessage.create({user: game.user.id, content : Translate("ChatMessage.LockBreakfail"+vCritMessagesuffix, {pName : pCharacter.name})}); //CHAT MESSAGE
								}
								break;
							case cLUCustomCheck:
								LnKPopups.TextPopUpID(pLock, "customcheckfailed", {pCheckName : game.settings.get(cModuleName, "CustomCircumventName")}); //MESSAGE POPUP
								
								if (pChatMessages) {
									await ChatMessage.create({user: game.user.id, content : Translate("ChatMessage.CustomCheckFail"+vCritMessagesuffix, {pName : pCharacter.name, pCheckName : game.settings.get(cModuleName, "CustomCircumventName")})}); //CHAT MESSAGE
								}
								break;
								
				}
			}
			
			Hooks.call(cModuleName + ".LockUse", pLock, pCharacter, {UseType : pMethodtype, Outcome : pResultDegree, useData : puseData});
		}
		else {
			LnKPopups.TextPopUpID(pLock, "NotaLock"); //MESSAGE POPUP
		}	
	}
	
	static useFreeCircumvent(pLock, pCharacter, puseData = {}) {
		if (LnKFlags.hasFreeLockCircumvent(pCharacter)) {
			LnKFlags.removeFreeLockCircumvent(pCharacter);
			
			let vToggled = LockManager.ToggleLock(pLock, cLUFreeCircumvent);
			
			Hooks.call(cModuleName + ".LockUse", pLock, pCharacter, {UseType : cLUFreeCircumvent, Outcome : Number(vToggled), useData : puseData});
		}
	}
	
	static async LockuseRequest(puseData) {
		if (game.user.isGM) {
			//only relevant for GMs
			
			let vScene = game.scenes.get(puseData.SceneID);
			let vLock;
			let vCharacter;
			
			if (vScene) {
				vLock = LnKutils.LockfromID(puseData.LockID, puseData.Locktype, vScene);
				
				if ((await LnKutils.isLockCompatible(vLock) || puseData.useType == cLUisGM)) {
					vCharacter = LnKutils.TokenfromID(puseData.CharacterID, vScene);
					
					switch (puseData.useType) {
						case cLUuseKey:
							//a key was used on the lock
							LockManager.useLockKey(vLock, vCharacter, puseData.KeyItemID, puseData);
							break;
						case cLUusePasskey:
							LockManager.useLockPasskey(vLock, vCharacter, puseData.EnteredPasskey, puseData);
							break;
						case cLUchangePasskey:
							LockManager.changeLockPasskey(vLock, vCharacter, puseData.OldPasskey, puseData);
							break;
						case cLUIdentity:
							LockManager.useLockIdentity(vLock, vCharacter, puseData.IdentityMatch, puseData);
							break;
						case cLUaddIdentity:
							LockManager.addLockIdentity(vLock, vCharacter, game.users.get(puseData.userID), puseData.IdentityTypes, puseData);
							break;
						case cLUpickLock:
						case cLUbreakLock:
						case cLUCustomCheck:
							if (!puseData.useSystemRoll || (puseData.useType == cLUCustomCheck)) {
								LockManager.circumventLock(vLock, vCharacter, puseData.UsedItemID, puseData.Rollresult, puseData.Diceresult, puseData.useType, puseData);
							}
							else {
								//use systems result
								LockManager.oncircumventLockresult(vLock, vCharacter, puseData.UsedItemID, puseData.Systemresult, puseData.useType, false, puseData);
							}
							break;
						case cLUFreeCircumvent:
								LockManager.useFreeCircumvent(vLock, vCharacter, puseData);
							break;
					}
				}
			}
		}
	}
	
	static requestLockonClose(pLock) {
		let vData = {sceneID : pLock.parent.id, lockID : pLock.id};
		
		if (game.user.isGM) {
			LockManager.LockonCloseRequest(vData);
		}
		else {
			game.socket.emit("module."+cModuleName, {pFunction : "LockonCloseRequest", pData : vData});
		}
	}
	
	static LockonCloseRequest(pData) {
		let vScene = game.scenes.get(pData.sceneID);
		
		if (vScene) {
			let vLock = vScene.walls.get(pData.lockID);
			if (vLock.door > 0) {
				if (LnKFlags.isLockonClose(vLock)) {
					LockManager.ToggleLock(vLock, cLUisGM);
				}
			}
		}
	}
	
	//LockKeys
	static async newLockKey(pLock) {
		if (pLock && await LnKutils.isLockCompatible(pLock)) {
			//make sure pLock is actually a Lock
			
			if (game.settings.get(cModuleName, "KeyitemCreationPopup")) {
				LockManager.createKeycreationDialog(pLock);
			}
			else {
				if (LnKutils.isTokenLock(pLock)) {
					//tokens are not lockable by default
					await LnKFlags.makeLockable(pLock);
				}	
				
				let vItem = await LnKutils.createKeyItem();
			
				LnKFlags.linkKeyLock(vItem, pLock);
			}
		}
	}
	
	static createKeycreationDialog(pLock) {
		let vFilter = "";
		
		if (game.settings.get(cModuleName, "LimitKeyFolders")) {
			//filter by ancestor name
			vFilter = game.settings.get(cModuleName, "DefaultKeyFolder");
		}
		
		let vFolders = LnKutils.getItemFolders(vFilter);
		
		let vHTML = `<label>${Translate("Titles.Keyname")}</label>
					<input type="text" id="Keyname" name="Keyname" value="${Translate("Words.Key")}">`;
		
		if (game.settings.get(cModuleName, "KeyitemCreationIDOption")) {
			vHTML = vHTML + `<label>${Translate("Titles.KeyID")}</label>
							<input type="text" id="KeyID" name="Keyname" value="">`;
		}		
					
		vHTML = vHTML + `<label>${Translate("Titles.Keyfolder")}</label>
						<select name="Folder">`;
		
		for (let i = 0; i < vFolders.length; i++) {
			if (vFolders[i][0] == game.settings.get(cModuleName, "DefaultKeyFolder")) {
				//default select
				vHTML = vHTML + `<option value="${vFolders[i][1]}" selected>${vFolders[i][0]}</option>`;
			}
			else {
				vHTML = vHTML + `<option value="${vFolders[i][1]}">${vFolders[i][0]}</option>`;
			}
		}
		
		vHTML = vHTML + `</select>`;
		
		let a = new Dialog({
			title: Translate("Titles.Keycreation"),
			content: vHTML,
			buttons: {
				confirmbutton: {
					label: Translate("Titles.ConfirmKeycreation"),
					callback: async (html) => {
						let vID = html.find("input#KeyID")?.val();
						
						if (!vID) {
							vID = "";
						}
						
						if (LnKutils.isTokenLock(pLock)) {
							//tokens are not lockable by default
							await LnKFlags.makeLockable(pLock);
						}	
						
						let vItem = await LnKutils.createKeyItem(html.find("input#Keyname").val(), html.find("[name=Folder]").find("option:selected").val());
						LnKFlags.linkKeyLock(vItem, pLock, vID);
					},
					icon: `<i class="fas ${cLnKKeyIcon}"></i>`
				}
			},
			default: Translate("Titles.ConfirmPasskey")
		}).render(true);	
	}
	
	//events
	static async onLock(pLock, pLockusetype) {
		let vLocktype = await LnKutils.Locktype(pLock);
		switch(vLocktype) {
			case cLockTypeDoor:
			case cLockTypeTile:
				LnKPopups.TextPopUpID(pLock, "lockedDoor"); //MESSAGE POPUP
				break;
			case cLockTypeLootPf2e:
			default:
				LnKPopups.TextPopUpID(pLock, "lockedToken", {pLockName : pLock.name}); //MESSAGE POPUP
		}
		
		LnKCompUtils.LockPuzzle(pLock);
		
		LnKSound.PlayunLockSound(pLock);
		
		Hooks.callAll(cModuleName+".onLock", vLocktype, pLock);
	}
	
	static async onunLock(pLock, pLockusetype) {
		let vLocktype = await LnKutils.Locktype(pLock);
		switch(vLocktype) {
			case cLockTypeDoor:
			case cLockTypeTile:
				LnKPopups.TextPopUpID(pLock, "unlockedDoor"); //MESSAGE POPUP
				break;
			case cLockTypeLootPf2e:
			default:
				LnKPopups.TextPopUpID(pLock, "unlockedToken", {pLockName : pLock.name}); //MESSAGE POPUP
		}
		
		LnKSound.PlayLockSound(pLock);
		
		Hooks.callAll(cModuleName+".onunLock", vLocktype, pLock);
	}
	
	//lock type
	static async ToggleLock(pLock, pLockusetype) {
		let vValidToggle;
		
		if (pLock) {
			switch (pLockusetype) {
				case cLUisGM:
					vValidToggle = true; //GMs can allways toggle
					break
				case cLUbreakLock:
					vValidToggle = !(await LockManager.isUnlocked(pLock)); //only locked doors can be toggled through break
					break;
				case cLUFreeCircumvent:
					vValidToggle = !(await LockManager.isUnlocked(pLock)) && LnKFlags.canbeCircumventedFree(pLock);
					break;
				case cLUpickLock:
				case cLUCustomCheck:
				case cLUuseKey:
				case cLUIdentity:
				default:
					vValidToggle = game.settings.get(cModuleName, "allowLocking") || !(await LockManager.isUnlocked(pLock)); //locks can only be locked if allowd in settings
					break;
			}
			
			if (vValidToggle) {
				//if setting is set to false, only GM can lock locks
				let vLocktype = await LnKutils.Locktype(pLock);
				
				if (pLockusetype == cLUisGM && await LnKutils.isLockCompatible(pLock)) {
					await LnKFlags.makeLockable(pLock);
				}
				
				let vSuccess = true;
				
				switch(vLocktype) {
					case cLockTypeDoor:
						await LockManager.ToggleDoorLock(pLock, pLockusetype);
						
						vSuccess = true;
						break;
					case cLockTypeLootPf2e:
					default:
						await LnKFlags.invertLockedstate(pLock);
						
						vSuccess = true;
						break;
				}
				
				if (vSuccess && vLocktype != cLockTypeDoor) {
					if (LnKFlags.isLocked(pLock)) {
						LockManager.onLock(pLock, pLockusetype);
					}
					else {
						LockManager.onunLock(pLock, pLockusetype);
					}
						
					return true;
				}
			}
			else {
				//give reasons for Invalid
				if (await LockManager.isUnlocked(pLock)) {
					switch (pLockusetype) {
						case cLUbreakLock:
							LnKPopups.TextPopUpID(pLock, "cantLock.break"); //MESSAGE POPUP
							break;
						case cLUFreeCircumvent:
							if (!LnKFlags.canbeCircumventedFree(pLock)) {
								LnKPopups.TextPopUpID(pLock, "cantcircumventFree"); //MESSAGE POPUP
							}
							else {
								LnKPopups.TextPopUpID(pLock, "cantLock.default"); //MESSAGE POPUP
							}
						case cLUpickLock:
						case cLUCustomCheck:
						case cLUuseKey:
							LnKPopups.TextPopUpID(pLock, "cantLock.default"); //MESSAGE POPUP
							break;
					}
				}
			}
		}
		
		return false;
	} 
	
	static async ToggleDoorLock(pDoor, pLockusetype) {
		switch (pDoor.ds) {
			case 0:
			case 1:
				//lock
				await pDoor.update({ds : 2});
				
				LockManager.onLock(pDoor, pLockusetype);
				break;
			case 2:
				//unlock
				await pDoor.update({ds : 0});
				
				LockManager.onunLock(pDoor, pLockusetype);
				break;
		}
	} 
	
	static async onBreakLock(pLock) {
		if (game.settings.get(cModuleName, "LockBreakunlockable")) {
			await LnKFlags.disableLock(pLock);
		}
		
		//LnKPopups.TextPopUpID(pLock, "brokeLock"); //MESSAGE POPUP
	}
	
	static async isUnlocked(pObject, pPopup = false) {
		let vLocktype = await LnKutils.Locktype(pObject);
		let vUnlocked = true;
		let vMessage;
		
		if (vLocktype == cLockTypeDoor) {
			vUnlocked = (pObject.ds != 2);
		}
		else {
			if (LnKutils.isTokenLock(vLocktype)) {
				vUnlocked = LockManager.TokenisUnlocked(pObject);
			}
			else {
				vUnlocked = !LnKFlags.isLocked(pObject);
			}
		}
		
		if (pPopup && !vUnlocked) {
			LockManager.LockedMessage(pObject);
		}
		
		return vUnlocked;
	}
	
	static TokenisUnlocked(pToken) {		
		return !(LnKFlags.isLocked(pToken));
	}
	
	static UserCanopenToken(pToken, pPopup = false) {	
		let vUnlocked = game.user.isGM || LockManager.TokenisUnlocked(pToken) || (pToken.isOwner && game.settings.get(cModuleName, "alwaysopenOwned"));
		
		if (pPopup && !vUnlocked) {
			LockManager.LockedMessage(pToken);
		}
		
		return vUnlocked;
	}
	
	static async LockedMessage(pObject) {
		let vLocktype = await LnKutils.Locktype(pObject);
		
		let vMessage = LnKFlags.getCustomPopups(pObject, cCustomPopup.LockLocked);
		
		LnKSound.PlayLockedSound(pObject);
		
		if (vMessage.length) {
			LnKPopups.TextPopUp(pObject, vMessage);
		}
		else {
			if (vLocktype == cLockTypeDoor || vLocktype == LockTypeTile) {
				LnKPopups.TextPopUpID(pObject, "DoorisLocked"); //MESSAGE POPUP
			}
			
			if (LnKutils.isTokenLock(vLocktype) && pObject.name) {
				LnKPopups.TextPopUpID(pObject, "TokenisLocked", {pLockName : pObject.name}); //MESSAGE POPUP
			}
		}		
	} 
	
	//copy paste
	static copyLock(pLock) {
		LnKFlags.copyIDKeys(pLock);
	}
	
	static async pasteLock(pLock) {
		if (pLock && await LnKutils.isLockCompatible(pLock)) {
			//make sure pLock is actually a Lock
			
			if (LnKutils.isTokenLock(pLock)) {
				//tokens are not lockable by default
				await LnKFlags.makeLockable(pLock)
			}
			
			LnKFlags.pasteIDKeys(pLock);
		}
	}
	
	//ons
	static onpreupdateWall(pWall, pChanges, pInfos, pUser) {
		if (pWall.door > 0) {
			if (pChanges.ds == 0 && pWall.ds == 1) {
				if (LnKFlags.isLockonClose(pWall)) {
					LockManager.requestLockonClose(pWall)
				}
			}
		}
	}
	
	static onLockLClick(pDocument, pInfos, pType) {
		if (game.user.isGM && pInfos.ctrlKey && game.settings.get(cModuleName, "useGMquickKeys")) {//GM CTRL: paste lock IDs
			LockManager.pasteLock(pDocument);
		}
		
		if (pType == "Wall") {
			if (!game.user.isGM) {
				LockManager.isUnlocked(pDocument, true);
			}
		}
	}
	
	static onLockRClick(pDocument, pInfos, pType) {
		if (game.user.isGM && pInfos.shiftKey) {//GM SHIFT: create new key
			LockManager.newLockKey(pDocument);
		}
		
		if (game.user.isGM && pInfos.ctrlKey && game.settings.get(cModuleName, "useGMquickKeys")) {//GM CTRL: copy lock IDs
			LockManager.copyLock(pDocument);
		}
		
		if (pType == "Token" || pType == "Tile") {
			if (game.user.isGM && pInfos.altKey && game.settings.get(cModuleName, "useGMquickKeys")) {//GM ALT: toggle lock state
				LockManager.ToggleLock(pDocument, cLUisGM);
			}	
		}
	}
}

//Hooks
Hooks.on(cModuleName + "." + "DoorRClick", (pDoorDocument, pInfos) => {
	LockManager.onLockRClick(pDoorDocument, pInfos, "Wall");
});

Hooks.on(cModuleName + "." + "DoorLClick", (pDoorDocument, pInfos) => {	
	LockManager.onLockLClick(pDoorDocument, pInfos, "Wall");
});

Hooks.on(cModuleName + "." + "TokenRClick", async (pTokenDocument, pInfos) => {
	if (await LnKutils.isLockCompatible(pTokenDocument)) {
		LockManager.onLockRClick(pTokenDocument, pInfos, "Token");
	}
});

Hooks.on(cModuleName + "." + "TokenLClick", (pTokenDocument, pInfos) => {
	LockManager.onLockLClick(pTokenDocument, pInfos, "Token");
});

Hooks.on(cModuleName + "." + "TokendblClick", (pTokenDocument, pInfos) => { //for sheet opening
	if (!game.user.isGM) {//CLIENT: check if token unlocked
		return LockManager.UserCanopenToken(pTokenDocument, true);
	}
	
	return true; //if anything fails
});

Hooks.on(cModuleName + "." + "TileRClick", async (pTileDocument, pInfos) => {
	LockManager.onLockRClick(pTileDocument, pInfos, "Tile");
});

Hooks.on(cModuleName + "." + "TileLClick", (pTileDocument, pInfos) => {
	LockManager.onLockLClick(pTileDocument, pInfos, "Tile");
});

Hooks.on(cModuleName + "." + "LockuseRequest", (pData) => {
	LockManager.LockuseRequest(pData);
});


Hooks.on("createWall", (pWall, pSettings, pInfos, pUserID) => { //will be removed if foundry includes a core setting
	if (game.user.isGM) {
		if (pSettings.door != 0) {
			if (game.settings.get(cModuleName, "DefaultLockSound") != "off") {
				let vSound = game.settings.get(cModuleName, "DefaultLockSound");
				
				//some sounds have to be filtered
				switch (vSound) {
					case "futuristic":
						vSound = "futuristicFast";
						break;
					case "shutter":
						vSound = "slidingMetal"; //find pendant
						break;
					case "sliding":
						vSound = "slidingWood";
						break;
					case "stone":
						vSound = "stoneBasic";
						break;
					case "wood":
						vSound = "woodBasic";
						break;
				}
				
				pWall.update({doorSound : vSound}) ;
			}
		}
	}
});

Hooks.on("preUpdateWall", (pWall, pChanges, pInfos, pUser) => {
	LockManager.onpreupdateWall(pWall, pChanges, pInfos, pUser);
});


//wrap and export functions
function LockuseRequest(puseData = {}) {return LockManager.LockuseRequest(puseData); }

function isUnlocked(pObject, pPopup = false) {return LockManager.isUnlocked(pObject, pPopup)} //if pObject is currently unlocked

function UserCanopenToken(pToken, pPopup = false) {return LockManager.UserCanopenToken(pToken, pPopup)} //if the current user can open pToken

function LockonCloseRequest(pData) {return LockManager.LockonCloseRequest(pData)};

export { LockuseRequest, isUnlocked, UserCanopenToken, LockonCloseRequest }

//wrap export macro functions, GM only
function TogglehoveredLockGM() {if (game.user.isGM) { return LockManager.ToggleLock(LnKutils.hoveredObject(), cLUisGM)}};

function CopyhoveredLockGM() {if (game.user.isGM) { return LockManager.copyLock(LnKutils.hoveredObject())}};

function PastehoveredLockGM() {if (game.user.isGM) { return LockManager.pasteLock(LnKutils.hoveredObject());}};

function CreateNewKeyhoveredGM() {if (game.user.isGM) {return LockManager.newLockKey(LnKutils.hoveredObject())}};

export { TogglehoveredLockGM, CopyhoveredLockGM, PastehoveredLockGM, CreateNewKeyhoveredGM}

export { LockManager }
