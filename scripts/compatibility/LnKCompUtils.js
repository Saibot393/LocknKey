import { cModuleName } from "../utils/LnKutils.js";
import { LnKFlags } from "../helpers/LnKFlags.js";

//Module Names
const cStairways = "stairways";
const cArmReach = "foundryvtt-arms-reach";
const cArmReachold = "arms-reach";
const cItemPiles = "item-piles";
const cLibWrapper = "lib-wrapper";

//specific: Item Piles
const cLockTypeLootIP = "LTLootPf2e"; //type for Token

const cIPLoottype = "pile"; //type of loot tokens in Item Piles

//general
const ccompTokenLockTypes = [cLockTypeLootIP];

export { cStairways, cArmReach, cArmReachold, cItemPiles, cLibWrapper}
export { cLockTypeLootIP };

class LnKCompUtils {
	//DECLARATIONS
	//basic
	static isactiveModule(pModule) {} //determines if module with id pModule is active
	
	static Locktype(pDocument) {} //returns Locktype of pDocument (if any)
	
	static isTokenLocktype(pLocktype) {} //returns if pLocktype belongs to a Token
	
	//specific: Foundry ArmsReach, ArmsReach
	static ARReachDistance() {} //gives the current arms reach distance
	
	//specific: ItemPiles
	static setIPLock(pItemPile, pLocked) {} //enables/disables pItemPile´based on pLocked
	
	
	//IMPLEMENTATIONS
	//basic
	static isactiveModule(pModule) {
		if (game.modules.find(vModule => vModule.id == pModule)) {
			return game.modules.find(vModule => vModule.id == pModule).active;
		}
		
		return false;
	};
	
	static Locktype(pDocument) {
		if (pDocument && pDocument.actor) {
			if (LnKCompUtils.isactiveModule(cItemPiles)) {
				if (pDocument.getFlag("item-piles", "data.type") == cIPLoottype) {
					return cLockTypeLootIP;
				}
			}
		}
		
		return "";		
	} 
	
	static isTokenLocktype(pLocktype) {
		return ccompTokenLockTypes.includes(pLocktype);
	}
	
	//specific: Foundry ArmsReach
	static ARReachDistance() {
		if (RideableCompUtils.isactiveModule(cArmReach)) {
			return game.settings.get(cArmReach, "globalInteractionMeasurement");
		}
		
		if (RideableCompUtils.isactiveModule(cArmReachold)) {
			return game.settings.get(cArmReachold, "globalInteractionDistance");
		}
	}
	
	//specific: ItemPiles
	static setIPLock(pItemPile, pLocked) {
		pItemPile.setFlag(cItemPiles,"data.enabled", !pLocked)
	}
}

export { LnKCompUtils };