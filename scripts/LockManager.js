import { cModuleName, Translate, LnKutils, cLUisGM, cLUuseKey, cLUusePasskey, cLUpickLock, cLUbreakLock } from "./utils/LnKutils.js";
import { cLockTypeDoor, cLockTypeLootPf2e } from "./utils/LnKutils.js";
import { LnKFlags } from "./helpers/LnKFlags.js";
import { LnKPopups } from "./helpers/LnKPopups.js";
import { LnKSound } from "./helpers/LnKSound.js";
import { cCustomPopup } from "./helpers/LnKFlags.js";

const cLnKKeyIcon = "fa-key";

//does everything Lock related
class LockManager {
	//DECLARATIONS
	//basics
	static async useLockKey(pLock, pCharacter, pKeyItemID) {} //handels pLock use of pCharacter with item of pItemID
	
	static async useLockPasskey(pLock, pCharacter, pPasskey) {} //handels pLock use of pCharacter with Passkey pPasskey
	
	static async circumventLock(pLock, pCharacter, pUsedItemID, pRollresult, pDiceresult, pMethodtype) {} //handels pLock use of pCharacter with a pMethodtype [cLUpickLock, cLUbreakLock] and result pRollresults
	
	static async oncircumventLockresult(pLock, pCharacter, pUsedItemID, pResultDegree, pMethodtype, pChatMessages = false) {} //called when pCharacter tries to circumvent pLock using pMethodtype with pResultDegree
	
	static LockuseRequest(puseData) {} //called when a player request to use a lock, handeld by gm
	
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
	
	//IMPLEMENTATIONS
	//basics
	static async useLockKey(pLock, pCharacter, pKeyItemID) {
		let vKey = (await LnKutils.TokenInventory(pCharacter)).find(vItem => vItem.id == pKeyItemID);
		
		if (vKey) {
			if (LnKFlags.matchingIDKeys(vKey, pLock, game.settings.get(cModuleName, "UseKeynameasID"))) {
				if (game.settings.get(cModuleName, "JamedLockKeyunusable") && LnKFlags.Lockisjammed(pLock)) {
					//lock is jammed and cant be opened by key
					LnKPopups.TextPopUpID(pLock, "Lockisjammed"); //MESSAGE POPUP
				}
				else {
					//key fits
					LockManager.ToggleLock(pLock, cLUuseKey);
					
					if (LnKFlags.RemoveKeyonUse(vKey)) {
						//remove one from stack, which will also delte if no key left
						LnKutils.removeoneItem(vKey, pCharacter);
					}
				}
			}
		}
	}
	
	static async useLockPasskey(pLock, pCharacter, pPasskey) {
		if (LnKFlags.MatchingPasskey(pLock, pPasskey)) {
			//Passkey matches
			LockManager.ToggleLock(pLock, cLUuseKey);
		}	
		else {
			LnKPopups.TextPopUpID(pLock, "WrongPassword"); //MESSAGE POPUP
		}
	}
	
	static async circumventLock(pLock, pCharacter, pUsedItemID, pRollresult, pDiceresult, pMethodtype) {
		//only handles custom successDegree
		let vSuccessDegree;
		
		vSuccessDegree = LnKutils.successDegree(pRollresult, pDiceresult, LnKFlags.LockDCtype(pLock, pMethodtype));
		
		LockManager.oncircumventLockresult(pLock, pCharacter, pUsedItemID, vSuccessDegree, pMethodtype, true)
	}
	
	static async oncircumventLockresult(pLock, pCharacter, pUsedItemID, pResultDegree, pMethodtype, pChatMessages = false) {
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
										await ChatMessage.create({user: game.user.id, flavor : Translate("ChatMessage.LockPicksuccessLPName"+vCritMessagesuffix, {pName : pCharacter.name, pLPName : vusedItem.name})}); //CHAT MESSAGE
									}
									else {
										await ChatMessage.create({user: game.user.id, flavor : Translate("ChatMessage.LockPicksuccess"+vCritMessagesuffix, {pName : pCharacter.name})}); //CHAT MESSAGE
									}
								}
								
								break;
							case cLUbreakLock:
								if (await LockManager.ToggleLock(pLock, pMethodtype)) {	
									//something could fail during Lock toggle								
									await LockManager.onBreakLock(pLock);
								}
								
								if (pChatMessages) {
									await ChatMessage.create({user: game.user.id, flavor : Translate("ChatMessage.LockBreaksuccess"+vCritMessagesuffix, {pName : pCharacter.name})}); //CHAT MESSAGE
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
											await ChatMessage.create({user: game.user.id, flavor : Translate("ChatMessage.LockPickfailLPNameremove"+vCritMessagesuffix, {pName : pCharacter.name, pLPName : vusedItem.name})}); //CHAT MESSAGE
										}
										else {
											await ChatMessage.create({user: game.user.id, flavor : Translate("ChatMessage.LockPickfailLPName"+vCritMessagesuffix, {pName : pCharacter.name, pLPName : vusedItem.name})}); //CHAT MESSAGE
										}
									}
									else {
										await ChatMessage.create({user: game.user.id, flavor : Translate("ChatMessage.LockPickfail"+vCritMessagesuffix, {pName : pCharacter.name})}); //CHAT MESSAGE
									}
								}
								
								if (pResultDegree < 0) {
									if (vRemoveLP) {
										//if crit fail and LP item was found and set to do so, remove Lockpick from inventory
										LnKutils.removeoneItem(vusedItem, pCharacter);
										LnKPopups.TextPopUpID(pLock, "Lockpickbroke"); //MESSAGE POPUP
									}
									
									if (game.settings.get(cModuleName, "JamLockonLPcritFail")) {
										LnKFlags.JamLock(pLock);
										LnKPopups.TextPopUpID(pLock, "jammedLock"); //MESSAGE POPUP
									}
								}
								else {
									LnKPopups.TextPopUpID(pLock, "pickLockfailed"); //MESSAGE POPUP
								}
								
								break;
							case cLUbreakLock:
								LnKPopups.TextPopUpID(pLock, "breakLockfailed"); //MESSAGE POPUP
								
								if (pChatMessages) {
									await ChatMessage.create({user: game.user.id, flavor : Translate("ChatMessage.LockBreakfail"+vCritMessagesuffix, {pName : pCharacter.name})}); //CHAT MESSAGE
								}
								break;
				}
			}
		}
		else {
			LnKPopups.TextPopUpID(pLock, "NotaLock"); //MESSAGE POPUP
		}		
	}
	
	static LockuseRequest(puseData) {
		if (game.user.isGM) {
			//only relevant for GMs
			
			let vScene = game.scenes.get(puseData.SceneID);
			let vLock;
			let vCharacter;
			
			if (vScene) {
				vLock = LnKutils.LockfromID(puseData.LockID, puseData.Locktype, vScene);
				
				if ((LnKutils.isLockCompatible(vLock) || puseData.useType == cLUisGM)) {
					vCharacter = LnKutils.TokenfromID(puseData.CharacterID, vScene);
					
					switch (puseData.useType) {
						case cLUuseKey:
							//a key was used on the lock
							LockManager.useLockKey(vLock, vCharacter, puseData.KeyItemID);
							break;
						case cLUusePasskey:
							LockManager.useLockPasskey(vLock, vCharacter, puseData.EnteredPasskey);
							break;
						case cLUpickLock:
						case cLUbreakLock:
							if (!puseData.usePf2eRoll) {
								LockManager.circumventLock(vLock, vCharacter, puseData.UsedItemID, puseData.Rollresult, puseData.Diceresult, puseData.useType);
							}
							else {
								//use Pf2e systems result
								LockManager.oncircumventLockresult(vLock, vCharacter, puseData.UsedItemID, puseData.Pf2eresult, puseData.useType);
							}
							break;
					}
				}
			}
		}
	}
	
	//LockKeys
	static async newLockKey(pLock) {
		if (pLock && LnKutils.isLockCompatible(pLock)) {
			//make sure pLock is actually a Lock
			
			if (LnKutils.isTokenLock(pLock)) {
				//tokens are not lockable by default
				await LnKFlags.makeLockable(pLock)
			}		
			
			if (game.settings.get(cModuleName, "KeyitemCreationPopup")) {
				LockManager.createKeycreationDialog(pLock);
			}
			else {
				let vItem = await LnKutils.createKeyItem();
			
				LnKFlags.linkKeyLock(vItem, pLock);
			}
		}
	}
	
	static createKeycreationDialog(pLock) {
		let vHTML = `<label>${Translate("Titles.Keyname")}</label>
					<input type="text" id="Keyname" name="Keyname" value="${Translate("Words.Key")}">
					<label>${Translate("Titles.Keyfolder")}</label>
					<select name="Folder">`;
					
		let vFolder = LnKutils.getItemFolders();
		
		for (let i = 0; i < vFolder.length; i++) {
			vHTML = vHTML + `<option value="${vFolder[i][1]}">${vFolder[i][0]}</option>`;
		}
		
		vHTML = vHTML + `</select>`;
		
		let a = new Dialog({
			title: Translate("Titles.Keycreation"),
			content: vHTML,
			buttons: {
				button1: {
					label: Translate("Titles.ConfirmKeycreation"),
					callback: async (html) => {
						let vItem = await LnKutils.createKeyItem(html.find("input#Keyname").val(), html.find("[name=Folder]").find("option:selected").val());
						LnKFlags.linkKeyLock(vItem, pLock);
					},
					icon: `<i class="fas ${cLnKKeyIcon}"></i>`
				}
			},
			default: Translate("Titles.ConfirmPasskey")
		}).render(true);	

		console.log(a);
	}
	
	//events
	static async onLock(pLock, pLockusetype) {
		let vLocktype = await LnKutils.Locktype(pLock);
		switch(vLocktype) {
			case cLockTypeDoor:
				LnKPopups.TextPopUpID(pLock, "lockedDoor"); //MESSAGE POPUP
				break;
			case cLockTypeLootPf2e:
			default:
				LnKPopups.TextPopUpID(pLock, "lockedToken", {pLockName : pLock.name}); //MESSAGE POPUP
		}
		
		LnKSound.PlayunLockSound(pLock);
		
		Hooks.callAll(cModuleName+".onLock", vLocktype, pLock);
	}
	
	static async onunLock(pLock, pLockusetype) {
		let vLocktype = await LnKutils.Locktype(pLock);
		switch(vLocktype) {
			case cLockTypeDoor:
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
				case cLUpickLock:
				case cLUuseKey:
				default:
					vValidToggle = game.settings.get(cModuleName, "allowLocking") || !(await LockManager.isUnlocked(pLock)); //locks can only be locked if allowd in settings
					break;
			}
			
			if (vValidToggle) {
				//if setting is set to false, only GM can lock locks
				let vLocktype = await LnKutils.Locktype(pLock);
				
				if (pLockusetype == cLUisGM) {
					await LnKFlags.makeLockable(pLock);
				}
				
				switch(vLocktype) {
					case cLockTypeDoor:
						await LockManager.ToggleDoorLock(pLock, pLockusetype);
						
						return true;
						break;
					case cLockTypeLootPf2e:
					default:
						await LnKFlags.invertLockedstate(pLock);
						
						if (LnKFlags.isLocked(pLock)) {
							LockManager.onLock(pLock, pLockusetype);
						}
						else {
							LockManager.onunLock(pLock, pLockusetype);
						}
						
						return true;
						break;
				}
			}
			else {
				//give reasons for Invalid
				if (await LockManager.isUnlocked(pLock)) {
					switch (pLockusetype) {
						case cLUbreakLock:
							LnKPopups.TextPopUpID(pLock, "cantLock.break"); //MESSAGE POPUP
							break;
						case cLUpickLock:
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
				vUnlocked = LockManager.UserCanopenToken(pObject);
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
		let vUnlocked = LockManager.TokenisUnlocked(pToken) || (pToken.isOwner && game.settings.get(cModuleName, "alwaysopenOwned"));
		
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
			if (vLocktype == cLockTypeDoor) {
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
		if (pLock && LnKutils.isLockCompatible(pLock)) {
			//make sure pLock is actually a Lock
			
			if (LnKutils.isTokenLock(pLock)) {
				//tokens are not lockable by default
				await LnKFlags.makeLockable(pLock)
			}
			
			LnKFlags.pasteIDKeys(pLock);
		}
	}
}

//Hooks
Hooks.on(cModuleName + "." + "DoorRClick", (pDoorDocument, pInfos) => {
	if (game.user.isGM && pInfos.shiftKey) {//GM SHIFT: create new key
		LockManager.newLockKey(pDoorDocument);
	}
	
	if (game.user.isGM && pInfos.ctrlKey && game.settings.get(cModuleName, "useGMquickKeys")) {//GM CTRL: copy lock IDs
		LockManager.copyLock(pDoorDocument);
	}
});

Hooks.on(cModuleName + "." + "DoorLClick", (pDoorDocument, pInfos) => {	
	if (game.user.isGM && pInfos.ctrlKey && game.settings.get(cModuleName, "useGMquickKeys")) {//GM CTRL: paste lock IDs
		LockManager.pasteLock(pDoorDocument);
	}
	
	if (!game.user.isGM) {
		LockManager.isUnlocked(pDoorDocument, true);
	}
});

Hooks.on(cModuleName + "." + "TokenRClick", (pTokenDocument, pInfos) => {
	if (game.user.isGM && pInfos.shiftKey) {//GM SHIFT: create new key
		LockManager.newLockKey(pTokenDocument);
	}
	
	if (game.user.isGM && pInfos.ctrlKey && game.settings.get(cModuleName, "useGMquickKeys")) {//GM CTRL: copy lock IDs
		LockManager.copyLock(pTokenDocument);
	}
	
	if (game.user.isGM && pInfos.altKey && game.settings.get(cModuleName, "useGMquickKeys")) {//GM ALT: toggle lock state
		LockManager.ToggleLock(pTokenDocument, cLUisGM);
	}
});

Hooks.on(cModuleName + "." + "TokenLClick", (pTokenDocument, pInfos) => {
	if (game.user.isGM && pInfos.ctrlKey && game.settings.get(cModuleName, "useGMquickKeys")) {//GM CTRL: paste lock IDs
		LockManager.pasteLock(pTokenDocument);
	}
});

Hooks.on(cModuleName + "." + "TokendblClick", (pTokenDocument, pInfos) => { //for sheet opening
	if (!game.user.isGM) {//CLIENT: check if token unlocked
		return LockManager.UserCanopenToken(pTokenDocument, true);
	}
	
	return true; //if anything fails
});

Hooks.on(cModuleName + "." + "LockuseRequest", (pData) => {
	LockManager.LockuseRequest(pData);
});

//wrap and export functions
function LockuseRequest(puseData = {}) {return LockManager.LockuseRequest(puseData); }
function isUnlocked(pObject, pPopup = false) {return LockManager.isUnlocked(pObject, pPopup)} //if pObject is currently unlocked

export { LockuseRequest, isUnlocked }

//wrap export macro functions, GM only
function TogglehoveredLockGM() {if (game.user.isGM) { return LockManager.ToggleLock(LnKutils.hoveredObject(), cLUisGM)}};

function CopyhoveredLockGM() {if (game.user.isGM) { return LockManager.copyLock(LnKutils.hoveredObject())}};

function PastehoveredLockGM() {if (game.user.isGM) { return LockManager.pasteLock(LnKutils.hoveredObject());}};

function CreateNewKeyhoveredGM() {if (game.user.isGM) {return LockManager.newLockKey(LnKutils.hoveredObject())}};

export { TogglehoveredLockGM, CopyhoveredLockGM, PastehoveredLockGM, CreateNewKeyhoveredGM}
