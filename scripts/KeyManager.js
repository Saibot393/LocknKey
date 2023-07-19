import { cModuleName, LnKutils } from "./utils/LnKutils.js";
import { cLockTypeDoor, cLockTypeLootPf2e } from "./utils/LnKutils.js";
import { LnKFlags } from "./helpers/LnKFlags.js";

//does everything Key related (basicly player side)
class KeyManager {
	//DECLARATIONS
	static async onatemptedKeyuse(pLockObject, pLockType) {} //called if a player tries to usa a key on pLockObject 
	
	//IMPLEMENTATIONS
	static async onatemptedKeyuse(pLockObject, pLockType) {
		let vLockIDs = LnKFlags.IDKeys(pLockObject);		
		let vCharacter = LnKutils.PrimaryCharacter();
		let vKeyItems;
		let vFittingKey;
		
		if (vLockIDs.length && vCharacter && LnKutils.TokenInventory(vCharacter)) {
			vKeyItems = LnKutils.TokenInventory(vCharacter).filter(vItem => vItem.flags.hasOwnProperty(cModuleName));
			
			//only key which contains keyid matching at least one key id of pLockObject fits
			vFittingKey = vKeyItems.find(vKey => LnKutils.Intersection(vLockIDs, LnKFlags.IDKeys(vKey)).length);
		}
		
		if (vFittingKey) {		
			game.socket.emit("module."+cModuleName, {pFunction : "LockuseRequest", pData : {pSceneID : pLockObject.object.scene.id, pLocktype : pLockType, pLockID : pLockObject.id, pCharacterID : vCharacter.id, pKeyItemID : vFittingKey.id}});
		}
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