import { cModuleName, LnKutils, cLUisGM, cLUuseKey, cLUpickLock } from "./utils/LnKutils.js";
import { cLockTypeDoor, cLockTypeLootPf2e } from "./utils/LnKutils.js";
import { LnKFlags } from "./helpers/LnKFlags.js";
import { LnKPopups } from "./helpers/LnKPopups.js";

//does everything Lock related
class LockManager {
	//DECLARATIONS
	//basics
	static useLockKey(pLock, pCharacter, pKeyItemID) {} //handels pLock use of pCharacter with item of pItemID
	
	static useLockPick(pLock, pCharacter, pRollresult) {} //handels pLock use of pCharacter with a lock pick and result pRollresults
	
	static LockuseRequest(puseData) {} //called when a player request to use a lock, handeld by gm
	
	//LockKeys
	static async newLockKey(pLock) {} //create a new item key for pLock
	
	//events
	static onLock(pLock, pLockusetype) {} //calledif a lock is locked
	
	static onunLock(pLock, pLockusetype) {} //calledif a lock is unlocked
	
	//lock type
	static async ToggleLock(pLock, pLockusetype) {} //locks or unlocks
	
	static async ToggleDoorLock(pDoor, pLockusetype) {} //locks or unlocks pDoor
	
	static isUnlocked(pObject, pPopup = false) {} //if pObject is currently unlocked
	
	static TokenisUnlocked(pToken, pPopup = false) {} //if pToken is currently unlocked
	
	static UserCanopenToken(pToken, pPopup = false) {} //if the current user can open pToken
	
	//copy paste
	static copyLock(pLock) {} //copy the Locks Key IDs
	
	static async pasteLock(pLockType, pLock) {} //paste the Key IDs to the Lock 
	
	//IMPLEMENTATIONS
	//basics
	static useLockKey(pLock, pCharacter, pKeyItemID) {
		let vKey = LnKutils.TokenInventory(pCharacter).get(pKeyItemID);
		
		if (vKey) {
			if (LnKFlags.matchingIDKeys(pLock, vKey)) {
				//key fits
				LockManager.ToggleLock(pLock, cLUuseKey);
			}
		};
	}
	
	static useLockPick(pLock, pCharacter, pRollresult) {
		if (LnKutils.beatsDC(pRollresult, LnKFlags.LockDC(pLock))) {
			LockManager.ToggleLock(pLock, cLUpickLock);
		}
		else {
			LnKPopups.TextPopUpID(pLock, "pickLockfailed"); //MESSAGE POPUP
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
						case cLUpickLock:
							LockManager.useLockPick(vLock, vCharacter, puseData.Rollresult);
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
				await LnKFlags.MackeLockable(pLock)
			}		
			
			let vItem = await LnKutils.createKeyItem();
			
			LnKFlags.linkKeyLock(vItem, pLock);
		}
	}
	
	//events
	static onLock(pLock, pLockusetype) {
		switch(LnKutils.Locktype(pLock)) {
			case cLockTypeDoor:
				LnKPopups.TextPopUpID(pLock, "lockedDoor"); //MESSAGE POPUP
				break;
			case cLockTypeLootPf2e:
			default:
				LnKPopups.TextPopUpID(pLock, "lockedToken", {pLockName : pLock.name}); //MESSAGE POPUP
		}
		
		Hooks.call(cModuleName+".onLock", LnKutils.Locktype(pLock), pLock);
	}
	
	static onunLock(pLock, pLockusetype) {
		switch(LnKutils.Locktype(pLock)) {
			case cLockTypeDoor:
				LnKPopups.TextPopUpID(pLock, "unlockedDoor"); //MESSAGE POPUP
				break;
			case cLockTypeLootPf2e:
			default:
				LnKPopups.TextPopUpID(pLock, "unlockedToken", {pLockName : pLock.name}); //MESSAGE POPUP
		}
		
		Hooks.call(cModuleName+".onunLock", LnKutils.Locktype(pLock), pLock);
	}
	
	//lock type
	static async ToggleLock(pLock, pLockusetype) {
		if ((pLockusetype == cLUisGM) || (game.settings.get(cModuleName, "allowLocking") || !LockManager.isUnlocked(pLock))) {
			//if setting is set to false, only GM can lock locks
			switch(LnKutils.Locktype(pLock)) {
				case cLockTypeDoor:
					LockManager.ToggleDoorLock(pLock, pLockusetype);
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
					break;
			}
		}
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
		LnKFlags.copyIDKeys(pLock);
	}
	
	static async pasteLock(pLock) {
		if (pLock && LnKutils.isLockCompatible(pLock)) {
			//make sure pLock is actually a Lock
			
			if (LnKutils.isTokenLock(pLock)) {
				//tokens are not lockable by default
				await LnKFlags.MackeLockable(pLock)
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

//wrap and export functions
function LockuseRequest(puseData = {}) {return LockManager.LockuseRequest(puseData); }

function isUnlocked(pObject, pPopup = false) {return LockManager.isUnlocked(pObject, pPopup)} //if pObject is currently unlocked

export { LockuseRequest, isUnlocked }