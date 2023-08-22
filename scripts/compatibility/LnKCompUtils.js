import { cModuleName } from "../utils/LnKutils.js";
import { LnKFlags } from "../helpers/LnKFlags.js";
import { Geometricutils } from "../utils/Geometricutils.js";

//Module Names
const cStairways = "stairways";
const cArmReach = "foundryvtt-arms-reach";
const cArmReachold = "arms-reach";
const cItemPiles = "item-piles";
const cLibWrapper = "lib-wrapper";
const cRideable = "Rideable";
const cMonksEJ = "monks-enhanced-journal";

//specific: Item Piles, Rideable
const cLockTypeLootIP = "LTIPLoot"; //type for ItemPile
//const cLockTypeRideable = "LTRideable"; //type for Rideable

const cIPLoottype = "pile"; //type of loot tokens in Item Piles

//general
const ccompTokenLockTypes = [cLockTypeLootIP];

export { cStairways, cArmReach, cArmReachold, cItemPiles, cLibWrapper, cMonksEJ}
export { cLockTypeLootIP };

class LnKCompUtils {
	//DECLARATIONS
	//basic
	static isactiveModule(pModule) {} //determines if module with id pModule is active
	
	static async Locktype(pDocument) {} //returns Locktype of pDocument (if any)
	
	static async isTokenLocktype(pLocktype) {} //returns if pLocktype belongs to a Token
	
	//specific: Foundry ArmsReach, ArmsReach
	static ARReachDistance() {} //[ArmReach]gives the current arms reach distance
	
	static ARWithinLockingDistance(pCharacter, pLock) {} //[ArmReach] returns if pCharacter is close enought to pLock to interact
	
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
	
	static async Locktype(pDocument) {	
		if (pDocument && pDocument.actor) {
			if (LnKCompUtils.isactiveModule(cItemPiles)) {
				if (pDocument.getFlag(cItemPiles, "data.type") == cIPLoottype) {
					return cLockTypeLootIP;
				}
			}
			/*
			if (LnKCompUtils.isactiveModule(cRideable)) {
				if (pDocument.getFlag(cRideable, "issetRideableFlag")) {
					return cLockTypeRideable;
				}
			}
			*/
		}
		
		let vLocktype = {type : ""};

		await Hooks.call(cModuleName + ".Locktype", pDocument, vLocktype);
		
		if (typeof vLocktype.type == "string") { //make sure return value if correct
			return vLocktype.type;
		}
		
		return "";		
	} 
	
	static async isTokenLocktype(pLocktype) {
		let vLockInfo = {isTokenLocktype : false}
		/*
		if (pLocktype == cLockTypeRideable && LnKCompUtils.isactiveModule(cRideable)) {
			//for rideable Option
			return game.settings.get(cRideable, "LocknKeyintegration")
		}
		*/
		await Hooks.call(cModuleName + ".isTokenLocktype", pLocktype, vLockInfo);
		
		if (vLockInfo.isTokenLocktype == true) { //make sure return value if correct
			return true;
		}
		
		return ccompTokenLockTypes.includes(pLocktype);
	}
	
	//specific: Foundry ArmsReach
	static ARReachDistance() {
		if (LnKCompUtils.isactiveModule(cArmReach)) {
			return game.settings.get(cArmReach, "globalInteractionMeasurement");
		}
		
		if (LnKCompUtils.isactiveModule(cArmReachold)) {
			return game.settings.get(cArmReachold, "globalInteractionDistance");
		}
	}
	
	static ARWithinLockingDistance(pCharacter, pLock) {
		if (LnKCompUtils.isactiveModule(cArmReach)) {
			if (game.modules.get(cArmReach).api) {
				return game.modules.get(cArmReach).api.isReachable(pCharacter, pLock);
			}
			else {
				return Geometricutils.ObjectDistance(pCharacter, pLock) <= LnKCompUtils.ARReachDistance();
			}
		}		
		
		if (LnKCompUtils.isactiveModule(cArmReachold)) {
			if (game.modules.get(cArmReachold).api) {
				return game.modules.get(cArmReachold).api.isReachable(pCharacter, pLock);
			}
			else {
				return Geometricutils.ObjectDistance(pCharacter, pLock) <= LnKCompUtils.ARReachDistance();
			}
		}	
		
		return true;//if anything fails
	}
	
	//specific: ItemPiles
	static setIPLock(pItemPile, pLocked) { //DEPRICATED, here to solve potential bugs with old data
		pItemPile.setFlag(cItemPiles,"data.enabled", /*!pLocked*/true)
	}
}

export { LnKCompUtils };