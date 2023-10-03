import { LnKCompUtils, cItemPiles, cMonksEJ } from "./LnKCompUtils.js";
import { cLockTypeLootIP } from "./LnKCompUtils.js";
import { LnKutils, cModuleName } from "../utils/LnKutils.js";
import { isUnlocked, UserCanopenToken } from "../LockManager.js";
import { LnKFlags, cLockableF, cLockedF } from "../helpers/LnKFlags.js";

//LnKCompatibility will take care of compatibility with other modules in regards to calls, currently supported:

class LnKCompatibility {
	//DECLARATIONS
	
	//specific: ItemPiles
	static onLock(pLockType, pLock) {} //called if a object is locked
	
	static onunLock(pLockType, pLock) {} //called if a object is locked
	
	static async synchIPLock(pLock, vUpdate) {} //called if an item pile is updated manually
	
	static onIPinteraction(pLock, pInfos) {} //called when someone interacts with a itempile token
	
	//IMPLEMENTATIONS
	static onLock(pLockType, pLock) {
		switch (pLockType) {
			case cLockTypeLootIP:
				LnKCompUtils.setIPLock(pLock, true);
				break;
		}
	}
	
	static onunLock(pLockType, pLock) {
		switch (pLockType) {
			case cLockTypeLootIP:
				LnKCompUtils.setIPLock(pLock, false);
				break;
		}	
	}
	
	static async synchIPLock(pLock) {
		if (await LnKutils.Locktype(pLock) == cLockTypeLootIP) {
			LnKCompUtils.setIPLock(pLock, LnKFlags.isLocked(pLock));
		}
	}
	
	static onIPinteraction(pLock, pInfos) {
		if (!game.user.isGM) {
			isUnlocked(pLock, true);
		}
	} //called when someone interacts with a token
}

//Hook into other modules
Hooks.once("init", () => {
	if (LnKCompUtils.isactiveModule(cItemPiles)) {
		Hooks.on(cModuleName+".onLock", (...args) => {LnKCompatibility.onLock(...args)}); //DEPRICATED, here to solve potential bugs with old data
		
		Hooks.on(cModuleName+".onunLock", (...args) => {LnKCompatibility.onunLock(...args)}); //DEPRICATED, here to solve potential bugs with old data
		
		Hooks.on("closeTokenConfig", (vTokenConfig) => {LnKCompatibility.synchIPLock(vTokenConfig.document)}); //DEPRICATED, here to solve potential bugs with old data

		Hooks.on("item-piles-preOpenInterface", (pItemPile, pCharacter) => {if (!UserCanopenToken(pItemPile.token, true)) {return false}})
	}
	
	if (LnKCompUtils.isactiveModule(cMonksEJ)) {
		libWrapper.ignore_conflicts(cModuleName, cMonksEJ, "Token.prototype._onClickRight");
	}	
});