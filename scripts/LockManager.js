import { cModuleName, LnKutils, cLockTypeDoor } from "./utils/LnKutils.js";
import { LnKFlags } from "./helpers/LnKFlags.js";

//does everything Lock related (basicly GM side)
class LockManager {
	//DECLARATIONS
	//basics
	static useLock(pLock, pCharacter, pKeyItemID) {} //handels pLock use of pCharacter with item of pItemID
	
	static LockuseRequest(pSceneID, pLocktype, pLockID, pCharacterID, pKeyItemID) {} //called when a player request to use a lock, handeld by gm
	
	static async newLockKey(pLock) {} //create a new item key for pLock
	
	//lock type
	static ToggleDoorLock(pDoor) {} //locks or unlocks pDoor
	
	//IMPLEMENTATIONS
	//basics
	static useLock(pLockType, pLock, pCharacter, pKeyItemID) {
		let vKey = LnKutils.TokenInventory(pCharacter).get(pKeyItemID);
		
		if (vKey) {
			if (LnKutils.Intersection(LnKFlags.IDKeys(pLock), LnKFlags.IDKeys(vKey)).length) {
				//key fits
				
				switch(pLockType) {
					case cLockTypeDoor:
							LockManager.ToggleDoorLock(pLock);
						break;
				}
			}
		};
	}
	
	static LockuseRequest(pSceneID, pLocktype, pLockID, pCharacterID, pKeyItemID) {
		if (game.user.isGM) {
			//only relevant for GMs
			
			let vScene = game.scenes.get(pSceneID);
			let vLock;
			let vCharacter;
			
			if (vScene) {
				vLock = LnKutils.LockfromID(pLockID, pLocktype, vScene);
				vCharacter = LnKutils.TokenfromID(pCharacterID, vScene);
				
				LockManager.useLock(pLocktype, vLock, vCharacter, pKeyItemID);
			}
		}
	}
	
	static async newLockKey(pLock) {
		if (pLock) {
			let vItem = await LnKutils.createKeyItem();
			
			LnKFlags.linkKeyLock(vItem, pLock);
		}
	}
	
	//lock type
	static ToggleDoorLock(pDoor) {
		console.log(pDoor);
		switch (pDoor.ds) {
			case 0:
			case 1:
				pDoor.update({ds : 2});
				
				break;
			case 2:
				pDoor.update({ds : 0});
				
				break;
		}
	} 
}

//Hooks
Hooks.on(cModuleName + "." + "DoorRClick", (pDoorDocument, pInfos) => {
	if (game.user.isGM && pInfos.shiftKey) {
		LockManager.newLockKey(pDoorDocument);
	}
});

//wrap and export functions
function LockuseRequest({ pSceneID, pLocktype, pLockID, pCharacterID, pKeyItemID } = {}) {return LockManager.LockuseRequest(pSceneID, pLocktype, pLockID, pCharacterID, pKeyItemID); }

export { LockuseRequest }