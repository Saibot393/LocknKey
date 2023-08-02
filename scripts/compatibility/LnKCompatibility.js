import { LnKCompUtils, cItemPiles } from "./LnKCompUtils.js";
import { cLockTypeLootIP } from "./LnKCompUtils.js";
import { LnKutils, cModuleName } from "../utils/LnKutils.js";
import { isUnlocked } from "../LockManager.js";
import { LnKFlags, cLockableF, cLockedF } from "../helpers/LnKFlags.js";

//LnKCompatibility will take care of compatibility with other modules in regards to calls, currently supported:

class LnKCompatibility {
	//DECLARATIONS
	
	//specific: ItemPiles
	static onLock(pLockType, pLock) {} //called if a object is locked
	
	static onunLock(pLockType, pLock) {} //called if a object is locked
	
	static async synchIPLock(pLock, vUpdate) {} //called if an item pile is updated manually
	
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
}

//Hook into other modules
Hooks.once("init", () => {
	if (LnKCompUtils.isactiveModule(cItemPiles)) {
		Hooks.on(cModuleName+".onLock", (...args) => {LnKCompatibility.onLock(...args)});
		
		Hooks.on(cModuleName+".onunLock", (...args) => {LnKCompatibility.onunLock(...args)});
		
		Hooks.on("closeTokenConfig", (vTokenConfig) => {LnKCompatibility.synchIPLock(vTokenConfig.document)});
		
		//Hooks.on("item-piles-preClickItemPile", (vItemPile) => {isUnlocked(vItemPile, true);}); //just for messages
	}
});