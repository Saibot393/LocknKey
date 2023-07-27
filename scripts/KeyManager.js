import { cModuleName, Translate, LnKutils, cLUuseKey, cLUpickLock } from "./utils/LnKutils.js";
import { Geometricutils } from "./utils/Geometricutils.js";
import { cLockTypeDoor, cLockTypeLootPf2e } from "./utils/LnKutils.js";
import { LnKFlags } from "./helpers/LnKFlags.js";
import { LnKPopups } from "./helpers/LnKPopups.js";

//does everything Key related (including lock picks, they are basically keys, right?)
class KeyManager {
	//DECLARATIONS
	static async onatemptedKeyuse(pLockObject) {} //called if a player tries to usa a key on pLockObject 
	
	static async onatemptedLockPick(pLockObject, pLockType) {} //called if a player tries to pick pLockObject 
	
	static onKeyContext(pHTML, pButtons) {} //adds buttons to item context
	
	static KeyItems(pInventory) {} //returns all Key items in pInventory
	
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
	
	static async onatemptedLockPick(pLockObject) {
		let vCharacter = LnKutils.PrimaryCharacter();
		let vRoll;
		let vRollData;
		let vRollFormula = "";
		let vLockType = await LnKutils.Locktype(pLockObject);
		
		let vValidItems;
		let vBestItem = null;
			
		if (vCharacter) {
			if (LnKutils.WithinLockingDistance(vCharacter, pLockObject)) {
				//set roll data
				vRollData = {actor : vCharacter.actor};
				
				if (LnKutils.hasLockPickItem(LnKutils.TokenInventory(vCharacter))) {
					
					//filter valid items for operation
					vValidItems = LnKutils.LockPickItemsin(LnKutils.TokenInventory(vCharacter));
					if (vValidItems.length) {
						//find best item
						vBestItem = vValidItems[LnKutils.HighestExpectedRollID(vValidItems.map(vItem => LnKFlags.LPFormula(vItem)), vRollData)];
						
						//create roll formula
						vRollFormula = LnKFlags.LPFormula(vBestItem);
					}
					
					if (!vBestItem || !LnKFlags.LPFormulaOverride(vBestItem)) {
						//no lock pick used or lock pick does not override
						vRollFormula = LnKutils.StitchFormula(LnKFlags.LPFormula(vCharacter), vRollFormula);
							
						if (!LnKFlags.LPFormulaOverride(vCharacter)) {
							vRollFormula = LnKutils.StitchFormula(LnKutils.LPformulaWorld(), vRollFormula);
						}
					}
					
					if (!vRollFormula.length) {
						//if nothing has been set
						vRollFormula = 0;
					}
					
					//roll dice according to formula
					vRoll =  new Roll(vRollFormula, vRollData);
					
					Hooks.call(cModuleName+".DiceRoll", cLUpickLock, vCharacter);//SOUND
					
					await vRoll.evaluate();
					
					//ouput dice result in chat
					await ChatMessage.create({user: game.user.id, flavor : Translate("ChatMessage.LockPick", {pName : vCharacter.name}),rolls : [vRoll], type : 5}); //CHAT MESSAGE
					
					//try lock with dice result
					game.socket.emit("module."+cModuleName, {pFunction : "LockuseRequest", pData : {useType : cLUpickLock, SceneID : pLockObject.object.scene.id, Locktype : vLockType, LockID : pLockObject.id, CharacterID : vCharacter.id, Rollresult : vRoll.total, Diceresults : vRoll.dice.map(vdice => vdice.total)}});
				}
				else {
					LnKPopups.TextPopUpID(pLockObject, "noLockPickItem"); //MESSAGE POPUP
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
}

//Hooks
Hooks.on(cModuleName + "." + "DoorRClick", (pDoorDocument, pInfos) => {//Door Lock use
	if (!game.user.isGM) {//CLIENT: use key
		if (!game.paused || !game.settings.get(cModuleName, "preventUseinPause")) {//use on pause check
			if (pInfos.shiftKey) {
				KeyManager.onatemptedLockPick(pDoorDocument);
			}
			else {
				KeyManager.onatemptedKeyuse(pDoorDocument);
			}
		}
		else {
			LnKPopups.TextPopUpID(pDoorDocument, "GamePaused"); //MESSAGE POPUP
		}
	}
});

Hooks.on(cModuleName + "." + "TokenRClick", (pTokenDocument, pInfos) => {//Token Lock use
	if (!game.user.isGM) {//CLIENT: use key
		if (!game.paused || !game.settings.get(cModuleName, "preventUseinPause")) {//use on pause check
			if (pInfos.shiftKey) {
				KeyManager.onatemptedLockPick(pTokenDocument);
			}
			else {
				KeyManager.onatemptedKeyuse(pTokenDocument);
			}
		}
		else {
			LnKPopups.TextPopUpID(pTokenDocument, "GamePaused"); //MESSAGE POPUP
		}
	}
}); 

Hooks.on('getItemDirectoryEntryContext', KeyManager.onKeyContext); //register Key context