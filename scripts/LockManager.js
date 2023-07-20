import { cModuleName, LnKutils } from "./utils/LnKutils.js";
import { cLockTypeDoor, cLockTypeLootPf2e } from "./utils/LnKutils.js";
import { LnKFlags } from "./helpers/LnKFlags.js";

import { LnKPopups } from "./helpers/LnKPopups.js";

//does everything Lock related
class LockManager {
	//DECLARATIONS
	//basics
	static useLock(pLock, pCharacter, pKeyItemID) {} //handels pLock use of pCharacter with item of pItemID
	
	static LockuseRequest(pSceneID, pLocktype, pLockID, pCharacterID, pKeyItemID) {} //called when a player request to use a lock, handeld by gm
	
	//LockKeys
	static async newLockKey(pLocktype, pLock) {} //create a new item key for pLock
	
	//events
	static onLock(pLocktype, pLock) {} //calledif a lock is locked
	
	static onunLock(pLocktype, pLock) {} //calledif a lock is unlocked
	
	//lock type
	static async ToggleLock(pLockType, pLock) {} //locks or unlocks
	
	static async ToggleDoorLock(pDoor) {} //locks or unlocks pDoor
	
	static TokenisUnlocked(pToken, pPopup = false) {} //if pToken is currently unlocked
	
	//copy paste
	static copyLock(pLock) {} //copy the Locks Key IDs
	
	static pasteLock(pLock) {} //paste the Key IDs to the Lock 
	
	//IMPLEMENTATIONS
	//basics
	static useLock(pLockType, pLock, pCharacter, pKeyItemID) {
		let vKey = LnKutils.TokenInventory(pCharacter).get(pKeyItemID);
		
		if (vKey) {
			if (LnKutils.Intersection(LnKFlags.IDKeys(pLock), LnKFlags.IDKeys(vKey)).length) {
				//key fits
				LockManager.ToggleLock(pLockType, pLock);
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
				console.log(vLock);	
				LockManager.useLock(pLocktype, vLock, vCharacter, pKeyItemID);
			}
		}
	}
	
	//LockKeys
	static async newLockKey(pLocktype, pLock) {
		if (LnKutils.isLockCompatible(pLock)) {
			if (pLock && LnKutils.isLockCompatible(pLock)) {
				//make sure pLock is actually a Lock
				
				if (LnKutils.isTokenLock(pLocktype)) {
					//tokens are not lockable by default
					await LnKFlags.MackeLockable(pLock)
				}		
				
				let vItem = await LnKutils.createKeyItem();
				
				LnKFlags.linkKeyLock(vItem, pLock);
			}
		}
	}
	
	//events
	static onLock(pLocktype, pLock) {
		LnKPopups.TextPopUpID(pLock, "lockedLock", {pLockName : pLock.name}); //MESSAGE POPUP
	}
	
	static onunLock(pLocktype, pLock) {
		LnKPopups.TextPopUpID(pLock, "unlockedLock", {pLockName : pLock.name}); //MESSAGE POPUP
	}
	
	//lock type
	static async ToggleLock(pLockType, pLock) {
		switch(pLockType) {
			case cLockTypeDoor:
				LockManager.ToggleDoorLock(pLock);
				break;
			case cLockTypeLootPf2e:
			default:
				await LnKFlags.invertLockedstate(pLock);
				
				if (LnKFlags.isLocked(pLock)) {
					LockManager.onLock(pLockType, pLock);
				}
				else {
					LockManager.onunLock(pLockType, pLock);
				}
				break;
		}
	} 
	
	static async ToggleDoorLock(pDoor) {
		switch (pDoor.ds) {
			case 0:
			case 1:
				//lock
				await pDoor.update({ds : 2});
				
				LockManager.onLock(cLockTypeDoor, pDoor);
				break;
			case 2:
				//unlock
				await pDoor.update({ds : 0});
				
				LockManager.onunLock(cLockTypeDoor, pDoor);
				break;
		}
	} 
	
	static TokenisUnlocked(pToken, pPopup = false) {
		let vUnlocked = !(LnKFlags.isLocked(pToken));
		
		if (pPopup && !vUnlocked) {
			LnKPopups.TextPopUpID(pToken, "TokenisLocked", {pLockName : pToken.name}); //MESSAGE POPUP
		}
		
		return !(LnKFlags.isLocked(pToken));
	}
	
	//copy paste
	static copyLock(pLock) {
		LnKFlags.copyIDKeys(pLock);
	}
	
	static pasteLock(pLock) {
		LnKFlags.pasteIDKeys(pLock);
	}
}

//Hooks
Hooks.on(cModuleName + "." + "DoorRClick", (pDoorDocument, pInfos) => {
	if (game.user.isGM && pInfos.shiftKey) {//GM SHIFT: create new key
		LockManager.newLockKey(cLockTypeDoor, pDoorDocument);
	}
	
	if (game.user.isGM && pInfos.ctrlKey) {//GM CTRL: copy lock IDs
		LockManager.copyLock(pDoorDocument);
	}
});

Hooks.on(cModuleName + "." + "DoorLClick", (pDoorDocument, pInfos) => {	
	if (game.user.isGM && pInfos.ctrlKey) {//GM CTRL: paste lock IDs
		LockManager.copyLock(pDoorDocument);
	}
});

Hooks.on(cModuleName + "." + "TokenRClick", (pTokenDocument, pInfos) => {
	if (game.user.isGM && pInfos.shiftKey) {//GM SHIFT: create new key
		LockManager.newLockKey(LnKutils.Locktype(pTokenDocument), pTokenDocument);
	}
	
	if (game.user.isGM && pInfos.ctrlKey) {//GM CTRL: copy lock IDs
		LockManager.pasteLock(pDoorDocument);
	}
	
	if (game.user.isGM && pInfos.altKey) {//GM ALT: toggle lock state
		LockManager.ToggleLock(LnKutils.Locktype(pTokenDocument), pTokenDocument);
	}
});

Hooks.on(cModuleName + "." + "TokenLClick", (pTokenDocument, pInfos) => {
	if (game.user.isGM && pInfos.ctrlKey) {//GM CTRL: paste lock IDs
		LockManager.pasteLock(pDoorDocument);
	}
});

Hooks.on(cModuleName + "." + "TokendblClick", (pTokenDocument, pInfos) => { //for sheet opening
	if (!game.user.isGM) {//CLIENT: check if token unlocked
		return LockManager.TokenisUnlocked(pTokenDocument, true);
	}
	
	return true; //if anything fails
});

//wrap and export functions
function LockuseRequest({ pSceneID, pLocktype, pLockID, pCharacterID, pKeyItemID } = {}) {return LockManager.LockuseRequest(pSceneID, pLocktype, pLockID, pCharacterID, pKeyItemID); }

export { LockuseRequest }