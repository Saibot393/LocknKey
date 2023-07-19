import { cModuleName, LnKutils, cLockTypeDoor } from "./utils/LnKutils.js";
import { LnKFlags } from "./helpers/LnKFlags.js";

class LockManager {
	//DECLARATIONS
	//basics
	static useLock(pLock, pCharacter, pKeyID) {} //handels pLock use of pCharacter with item of pItemID
	
	static LockuseRequest(pSceneID, pLocktype, pLockID, pCharacterID, pKeyID);
	
	//lock type
	static ToggleDoorLock(pDoor) {} //locks or unlocks pDoor
	
	//IMPLEMENTATIONS
	//basics
	static useLock(pLockType, pLock, pCharacter, pKeyID) {
		let vKey = pCharacter.items.get(pKeyID);
		
		if (vKey) {
			if (LnKutils.Intersection(LnKFlags.IDKeys(pLock), LnKFlags.IDKeys(vKey)).length) {
				//key fits
				
				switch(pLockType) {
					case cLockTypeDoor:
					
						break;
				}
			}
		};
	}
	
	static LockuseRequest(pSceneID, pLocktype, pLockID, pCharacterID, pKeyID) {
		if (game.user.isGM) {
			//only relevant for GMs
			
			let vScene = game.scenes.get(pSceneID);
			let vLock;
			let vCharacter;
			
			if (vScene) {
				vLock = LnKutils.LockfromID(pLockID, vScene);
				vCharacter = LnKutils.TokenfromID(pCharacterID, vScene);
				
				LockManager.useLock(vLock, vCharacter, pKeyID);
			}
		}
	}
	
	//lock type
	static ToggleDoorLock(pDoor) {
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

//wrap and export functions
function LockuseRequest({ pSceneID, pLocktype, pLockID, pCharacterID, pKeyID } = {}) {return LockManager.LockuseRequest(pSceneID, pLocktype, pLockID, pCharacterID, pKeyID); }

export { LockuseRequest }