import { cModuleName, Translate, LnKutils } from "./utils/LnKutils.js";
import { Geometricutils } from "./utils/Geometricutils.js";
import { cLockTypeDoor, cLockTypeLootPf2e } from "./utils/LnKutils.js";
import { LnKFlags } from "./helpers/LnKFlags.js";
import { LnKPopups } from "./helpers/LnKPopups.js";

//does everything Key related
class KeyManager {
	//DECLARATIONS
	static async onatemptedKeyuse(pLockObject, pLockType) {} //called if a player tries to usa a key on pLockObject 
	
	static onKeyContext(pHTML, pButtons) {} //adds buttons to item context
	
	static KeyItems(pInventory) {} //returns all Key items in pInventory
	
	//IMPLEMENTATIONS
	static async onatemptedKeyuse(pLockObject, pLockType) {	
		let vCharacter = LnKutils.PrimaryCharacter();
		let vKeyItems;
		let vFittingKey;
		
		if (Geometricutils.ObjectDistance(vCharacter, pLockObject) <= LnKutils.LockuseDistance()) {
			//check if lock is in reach
			
			if (pLockObject && vCharacter && LnKutils.TokenInventory(vCharacter)) {
				vKeyItems = KeyManager.KeyItems(LnKutils.TokenInventory(vCharacter));
				
				//only key which contains keyid matching at least one key id of pLockObject fits
				vFittingKey = vKeyItems.find(vKey => LnKFlags.matchingIDKeys(vKey, pLockObject));
				
				if (vFittingKey) {	
					game.socket.emit("module."+cModuleName, {pFunction : "LockuseRequest", pData : {pSceneID : pLockObject.object.scene.id, pLocktype : pLockType, pLockID : pLockObject.id, pCharacterID : vCharacter.id, pKeyItemID : vFittingKey.id}});
				}
			}
		}
		else {
			LnKPopups.TextPopUpID(pLockObject, "Lockoutofreach", {pLockName : pLockObject.name}); //MESSAGE POPUP
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
Hooks.on(cModuleName + "." + "DoorRClick", (pDoorDocument, pInfos) => {
	if (!game.user.isGM) {//CLIENT: use key
		KeyManager.onatemptedKeyuse(pDoorDocument, cLockTypeDoor);
	}
});

Hooks.on(cModuleName + "." + "TokenRClick", (pTokenDocument, pInfos) => {
	if (!game.user.isGM) {//CLIENT: use key
		KeyManager.onatemptedKeyuse(pTokenDocument, LnKutils.Locktype(pTokenDocument));
	}
}); 

Hooks.on('getItemDirectoryEntryContext', KeyManager.onKeyContext);