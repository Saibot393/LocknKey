import { cModuleName, Translate, LnKutils, cLUuseKey, cLUpickLock, cLUbreakLock } from "./utils/LnKutils.js";
import { Geometricutils } from "./utils/Geometricutils.js";
import { cLockTypeDoor, cLockTypeLootPf2e } from "./utils/LnKutils.js";
import { LnKFlags } from "./helpers/LnKFlags.js";
import { LnKPopups } from "./helpers/LnKPopups.js";

//does everything Key related (including lock picks, they are basically keys, right?)
class KeyManager {
	//DECLARATIONS
	static async onatemptedKeyuse(pLockObject) {} //called if a player tries to usa a key on pLockObject 
	
	static async onatemptedcircumventLock(pLockObject, pUseType) {} //called if a player tries to circumvent pLockObject using pUsetype [cLUpickLock, cLUbreakLock]
	
	static onKeyContext(pHTML, pButtons) {} //adds buttons to item context
	
	static KeyItems(pInventory) {} //returns all Key items in pInventory
	
	//support
	static async cancircumventLock(pCharacter, pLock, puseMethod) {} //if pCharacter can circumvent pLock using puseMethod
	
	static async circumventLockroll(pCharacter, pLock, puseMethod, pRollData) {} //the (best) roll used to circumvent pLock using puseMethod
	
	//IMPLEMENTATIONS
	static async onatemptedKeyuse(pLockObject) {	
		let vCharacter = LnKutils.PrimaryCharacter();
		let vKeyItems;
		let vFittingKey;
		let vLockType = await LnKutils.Locktype(pLockObject);
		
		if (LnKutils.WithinLockingDistance(vCharacter, pLockObject)) {
			//check if lock is in reach
			
			if (pLockObject && vCharacter && LnKutils.TokenInventory(vCharacter)) {
				vKeyItems = KeyManager.KeyItems(LnKutils.TokenInventory(vCharacter));
				
				//only key which contains keyid matching at least one key id of pLockObject fits
				vFittingKey = vKeyItems.find(vKey => LnKFlags.matchingIDKeys(vKey, pLockObject));
				
				if (vFittingKey) {	
					game.socket.emit("module."+cModuleName, {pFunction : "LockuseRequest", pData : {useType : cLUuseKey, SceneID : pLockObject.object.scene.id, Locktype : vLockType, LockID : pLockObject.id, CharacterID : vCharacter.id, KeyItemID : vFittingKey.id}});
				}
			}
		}
		else {
			LnKPopups.TextPopUpID(pLockObject, "Lockoutofreach", {pLockName : pLockObject.name}); //MESSAGE POPUP
		}
	}
	
	static async onatemptedcircumventLock(pLockObject, pUseType) {
		let vCharacter = LnKutils.PrimaryCharacter();
		let vRoll;
		let vRollData;
		let vRollFormula = "";
		let vLockType = await LnKutils.Locktype(pLockObject);
			
		if (vCharacter) {
			if (LnKutils.WithinLockingDistance(vCharacter, pLockObject)) {
				//set roll data
				vRollData = {actor : vCharacter.actor};
				
				if (await KeyManager.cancircumventLock(vCharacter, pLockObject, pUseType)) {
					
					vRollFormula = await KeyManager.circumventLockroll(vCharacter, pLockObject, pUseType, vRollData);
					
					//roll dice according to formula
					vRoll =  new Roll(vRollFormula, vRollData);
					
					Hooks.call(cModuleName+".DiceRoll", cLUpickLock, vCharacter);//SOUND
					
					await vRoll.evaluate();
					
					//ouput dice result in chat
					switch (pUseType) {
						case cLUpickLock:
							await ChatMessage.create({user: game.user.id, flavor : Translate("ChatMessage.LockPick", {pName : vCharacter.name}),rolls : [vRoll], type : 5}); //CHAT MESSAGE
							break;
						case cLUbreakLock:
							await ChatMessage.create({user: game.user.id, flavor : Translate("ChatMessage.LockBreak", {pName : vCharacter.name}),rolls : [vRoll], type : 5}); //CHAT MESSAGE
							break;
					}
					
					
					//try lock with dice result
					game.socket.emit("module."+cModuleName, {pFunction : "LockuseRequest", pData : {useType : pUseType, SceneID : pLockObject.object.scene.id, Locktype : vLockType, LockID : pLockObject.id, CharacterID : vCharacter.id, Rollresult : vRoll.total, Diceresults : vRoll.dice.map(vdice => vdice.total)}});
				}
				else {
					if (pUseType == cLUpickLock) {
						LnKPopups.TextPopUpID(pLockObject, "noLockPickItem"); //MESSAGE POPUP
					}
				}
			}
			else {
				LnKPopups.TextPopUpID(pLockObject, "Lockoutofreach", {pLockName : pLockObject.name}); //MESSAGE POPUP
			}
		}
	}
	
	static onKeyContext(pHTML, pButtons) {
		pButtons.push({
			name: Translate("Context.KeyCopy"),
			icon: '<i class="fa-regular fa-key"></i>',
			condition: (pElement) => {
				let vID = pElement.data('document-id');
				let vItem = game.items.get(vID);
				//handle only key items
				return vItem.flags.hasOwnProperty(cModuleName);
			},
			callback: async (pElement) => {
				let vID = pElement.data('document-id');
				let vItem = game.items.get(vID);
				LnKFlags.copyIDKeys(vItem);
			}
		});
		
		pButtons.push({
			name: Translate("Context.KeyPaste"),
			icon: '<i class="fa-solid fa-key"></i>',
			condition: (pElement) => {
				let vID = pElement.data('document-id');
				let vItem = game.items.get(vID);
				//handle only key items
				return vItem.flags.hasOwnProperty(cModuleName);
			},
			callback: async (pElement) => {
				let vID = pElement.data('document-id');
				let vItem = game.items.get(vID);
				LnKFlags.pasteIDKeys(vItem);
			}
		});
	} 
	
	static KeyItems(pInventory) {
		return pInventory.filter(vItem => vItem.flags.hasOwnProperty(cModuleName));
	}
	
	//support
	static async cancircumventLock(pCharacter, pLock, puseMethod) {
		switch (puseMethod) {
			case cLUpickLock:
				return LnKutils.hasLockPickItem(LnKutils.TokenInventory(pCharacter));
				break;
			case cLUbreakLock:
				return true; //no item required
				break;			
			default:
				return false;
				break;
		}
	}
	
	static async circumventLockroll(pCharacter, pLock, puseMethod, pRollData) {
		let vValidItems;
		let vBestItem;
		let vRollFormula = "";
		
		//filter valid items for operation
		vValidItems = LnKutils.TokenInventory(pCharacter).filter(vItem => LnKFlags.HasFormula(vItem, puseMethod));
		
		if (vValidItems.length) {
			//find best item		
			vBestItem = vValidItems[await LnKutils.HighestExpectedRollID(vValidItems.map(vItem => LnKFlags.Formula(vItem, puseMethod)), pRollData)];
			
			console.log(vBestItem);
			
			//create roll formula
			vRollFormula = LnKFlags.Formula(vBestItem, puseMethod);
		}
		
		if (!vBestItem || !LnKFlags.FormulaOverride(vBestItem, puseMethod)) {
			//no lock pick used or lock pick does not override
			vRollFormula = LnKutils.StitchFormula(LnKFlags.Formula(pCharacter, puseMethod), vRollFormula);
				
			if (!LnKFlags.FormulaOverride(pCharacter, puseMethod)) {
				vRollFormula = LnKutils.StitchFormula(LnKutils.formulaWorld(puseMethod), vRollFormula);
			}
		}
		
		if (!vRollFormula.length) {
			//if nothing has been set
			vRollFormula = "0";
		}
		
		return vRollFormula;
	}
}

function onLockRightClick(pDocument, pInfos) {
	if (!game.user.isGM) {//CLIENT: use key
		if (!game.paused || !game.settings.get(cModuleName, "preventUseinPause")) {//use on pause check
			if (pInfos.shiftKey) {
				KeyManager.onatemptedcircumventLock(pDocument, cLUpickLock);
			}
			else {
				if (pInfos.altKey) {
					KeyManager.onatemptedcircumventLock(pDocument, cLUbreakLock);
				}
				else {
					KeyManager.onatemptedKeyuse(pDocument);
				}
			}
		}
		else {
			LnKPopups.TextPopUpID(pDocument, "GamePaused"); //MESSAGE POPUP
		}
	}	
}

//Hooks
Hooks.on(cModuleName + "." + "DoorRClick", (pDoorDocument, pInfos) => {//Door Lock use
	onLockRightClick(pDoorDocument, pInfos);
});

Hooks.on(cModuleName + "." + "TokenRClick", (pTokenDocument, pInfos) => {//Token Lock use
	onLockRightClick(pTokenDocument, pInfos);
}); 

Hooks.on('getItemDirectoryEntryContext', KeyManager.onKeyContext); //register Key context