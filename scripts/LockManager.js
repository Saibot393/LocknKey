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
	static async newLockKey(pLock) {} //create a new item key for pLock
	
	//events
	static onLock(pLock) {} //calledif a lock is locked
	
	static onunLock(pLock) {} //calledif a lock is unlocked
	
	//lock type
	static async ToggleLock(pLock, pfromGM = false) {} //locks or unlocks
	
	static async ToggleDoorLock(pDoor) {} //locks or unlocks pDoor
	
	static isUnlocked(pObject, pPopup = false) {} //if pObject is currently unlocked
	
	static TokenisUnlocked(pToken, pPopup = false) {} //if pToken is currently unlocked
	
	static UserCanopenToken(pToken, pPopup = false) {} //if the current user can open pToken
	
	//copy paste
	static copyLock(pLock) {} //copy the Locks Key IDs
	
	static async pasteLock(pLockType, pLock) {} //paste the Key IDs to the Lock 
	
	//IMPLEMENTATIONS
	//basics
	static useLock(pLockType, pLock, pCharacter, pKeyItemID) {
		let vKey = LnKutils.TokenInventory(pCharacter).get(pKeyItemID);
		
		if (vKey) {
			if (LnKFlags.matchingIDKeys(pLock, vKey)) {
				//key fits
				LockManager.ToggleLock(pLock);
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
	static async newLockKey(pLock) {
		if (pLock && LnKutils.isLockCompatible(pLock)) {
			//make sure pLock is actually a Lock
			
			if (LnKutils.isTokenLock(pLock)) {
				//tokens are not lockable by default
				await LnKFlags.MackeLockable(pLock)
			}		
			
			let vItem = await LnKutils.createKeyItem();
			
			LnKFlags.linkKeyLock(vItem, pLock);
		}
	}
	
	//events
	static onLock(pLock) {
		switch(LnKutils.Locktype(pLock)) {
			case cLockTypeDoor:
				LnKPopups.TextPopUpID(pLock, "lockedDoor"); //MESSAGE POPUP
				break;
			case cLockTypeLootPf2e:
			default:
				LnKPopups.TextPopUpID(pLock, "lockedToken", {pLockName : pLock.name}); //MESSAGE POPUP
		}
	}
	
	static onunLock(pLock) {
		switch(LnKutils.Locktype(pLock)) {
			case cLockTypeDoor:
				LnKPopups.TextPopUpID(pLock, "unlockedDoor"); //MESSAGE POPUP
				break;
			case cLockTypeLootPf2e:
			default:
				LnKPopups.TextPopUpID(pLock, "unlockedToken", {pLockName : pLock.name}); //MESSAGE POPUP
		}
	}
	
	//lock type
	static async ToggleLock(pLock, pfromGM = false) {
		if (pfromGM || game.settings.get(cModuleName, "allowLocking") || !LockManager.isUnlocked(pLock)) {
			//if setting is set to false, only GM can lock locks
			switch(LnKutils.Locktype(pLock)) {
				case cLockTypeDoor:
					LockManager.ToggleDoorLock(pLock);
					break;
				case cLockTypeLootPf2e:
				default:
					await LnKFlags.invertLockedstate(pLock);
					
					if (LnKFlags.isLocked(pLock)) {
						LockManager.onLock(pLock);
					}
					else {
						LockManager.onunLock(pLock);
					}
					break;
			}
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
	
	static isUnlocked(pObject, pPopup = false) {
		switch (LnKutils.Locktype(pObject)) {
			case cLockTypeDoor:
				if (pObject.ds == 2) {
						if (pPopup) {
							LnKPopups.TextPopUpID(pToken, "DoorisLocked"); //MESSAGE POPUP
						}
					
					return false;
				}
				return true;
			case cLockTypeLootPf2e:
			default:
				return LockManager.TokenisUnlocked(pObject, pPopup)
		}
	}
	
	static TokenisUnlocked(pToken, pPopup = false) {
		let vUnlocked = !(LnKFlags.isLocked(pToken));
		
		if (pPopup && !vUnlocked) {
			LnKPopups.TextPopUpID(pToken, "TokenisLocked", {pLockName : pToken.name}); //MESSAGE POPUP
		}
		
		return !(LnKFlags.isLocked(pToken));
	}
	
	static UserCanopenToken(pToken, pPopup = false) {
		return LockManager.TokenisUnlocked(pToken, pPopup) || (pToken.isOwner && game.settings.get(cModuleName, "alwaysopenOwned"))
	}
	
	//copy paste
	static copyLock(pLock) {
		console.log(pLock);
		LnKFlags.copyIDKeys(pLock);
	}
	
	static async pasteLock(pLock) {
		console.log(pLock);
		if (pLock && LnKutils.isLockCompatible(pLock)) {
			console.log("check");
			//make sure pLock is actually a Lock
			
			if (LnKutils.isTokenLock(pLock)) {
				//tokens are not lockable by default
				await LnKFlags.MackeLockable(pLock)
			}
			
			LnKFlags.pasteIDKeys(pLock);
			
			console.log(pLock);
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
});

Hooks.on(cModuleName + "." + "TokenRClick", (pTokenDocument, pInfos) => {
	if (game.user.isGM && pInfos.shiftKey) {//GM SHIFT: create new key
		LockManager.newLockKey(pTokenDocument);
	}
	
	if (game.user.isGM && pInfos.ctrlKey && game.settings.get(cModuleName, "useGMquickKeys")) {//GM CTRL: copy lock IDs
		LockManager.copyLock(pTokenDocument);
	}
	
	if (game.user.isGM && pInfos.altKey && game.settings.get(cModuleName, "useGMquickKeys")) {//GM ALT: toggle lock state
		LockManager.ToggleLock(pTokenDocument, true);
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

//wrap and export functions
function LockuseRequest({ pSceneID, pLocktype, pLockID, pCharacterID, pKeyItemID } = {}) {return LockManager.LockuseRequest(pSceneID, pLocktype, pLockID, pCharacterID, pKeyItemID); }

export { LockuseRequest }