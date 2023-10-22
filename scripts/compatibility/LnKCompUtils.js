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
const cMATT = "monks-active-tiles";

//specific: Item Piles, Rideable
const cLockTypeLootIP = "LTIPLoot"; //type for ItemPile
//const cLockTypeRideable = "LTRideable"; //type for Rideable

const cIPPiletype = "pile"; //type of loot tokens in Item Piles
const cIPContainertype = "container"; //type of container tokens in Item Piles
const cIPVaulttype = "vault"; //type of container tokens in Item Piles

const cIPtypes = [cIPPiletype, cIPContainertype, cIPVaulttype];

//Trigger conditions for MATT
const cTCNever = "never";
const cTCAlways = "always";
const cTCFailure = "failure";
const cTCcritFailure = "critfailure";
const cTCSuccess = "success";

const cTConditions = [cTCNever, cTCAlways, cTCFailure, cTCcritFailure, cTCSuccess];
const cSimpleTConditions = [cTCNever, cTCAlways, cTCFailure, cTCSuccess];

const cMATTTriggerTileF = "MATTTriggerTileFlag";
const cMATTTriggerConditionsF = "MATTTriggerConditionsFlag";

export {cMATTTriggerConditionsF, cMATTTriggerTileF, cTConditions, cSimpleTConditions, cTCNever, cTCAlways, cTCFailure, cTCcritFailure, cTCSuccess}

//general
const ccompTokenLockTypes = [cLockTypeLootIP];

export { cStairways, cArmReach, cArmReachold, cItemPiles, cLibWrapper, cMonksEJ, cMATT}
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
	static async setIPLock(pItemPile, pLocked) {} //enables/disables pItemPile´based on pLocked
	
	//specific: MATT
	static async MATTTriggerTile(pLock) {} //returns Tile triggered by pLock actions
	
	static MATTTriggerTileID(pLock) {} //returns the ID of the triggered tile of this lock
	
	static setMATTTriggercondition(pLock, pInfos) {} //sets the MATT trigger condition of pLock
	
	static MattTriggerCondition(pLock, pType) {} //returns the MATT trigger condition of pLock for pType
	
	static MATTTriggered(pLock, pType, pOutcome) {} //returns if a triiger of pType with pOutcome triggers the MATT tile of pLock
	
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
				if (cIPtypes.includes(pDocument.getFlag(cItemPiles, "data.type"))) {
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
				return game.modules.get(cArmReach).api.isReachable(pCharacter.object, pLock.object);
			}
			else {
				return Geometricutils.ObjectDistance(pCharacter, pLock) <= LnKCompUtils.ARReachDistance();
			}
		}		
		
		if (LnKCompUtils.isactiveModule(cArmReachold)) {
			if (game.modules.get(cArmReachold).api) {
				console.log(pCharacter, pLock);
				return game.modules.get(cArmReachold).api.isReachable(pCharacter.object, pLock.object);
			}
			else {
				return Geometricutils.ObjectDistance(pCharacter, pLock) <= LnKCompUtils.ARReachDistance();
			}
		}	
		
		return true;//if anything fails
	}
	
	//specific: ItemPiles
	static async setIPLock(pItemPile, pLocked) { //DEPRICATED, here to solve potential bugs with old data
		//pItemPile.setFlag(cItemPiles,"data.enabled", /*!pLocked*/true);	
		
		//pItemPile.setFlag(cItemPiles,"data.locked", /*!pLocked*/pLocked);

		if (pLocked) {
			await game.itempiles?.API?.lockItemPile(pItemPile);
			
			//pItemPile.update({flags : {"item-piles" : {data : {locked : false}}}}); //locking item piles prevents some features from working
		}
		else {
			game.itempiles?.API?.unlockItemPile(pItemPile);
		}
	}
	
	//specific: MATT
	static async MATTTriggerTile(pLock) {
		let vID = pLock?.flags[cMATT]?.entity.id; //from MATT
		
		if (vID) {
			return fromUuid(vID);
		}
		
		if (pLock?.flags[cModuleName]) {
			vID = pLock?.flags[cModuleName][cMATTTriggerTileF]; //from LnK
		}		
		
		if (vID) {
			return pLock.parent.tiles.get(vID);
		}
	}
	
	static MATTTriggerTileID(pLock) {
		let vID = pLock?.flags[cMATTTriggerTileF]; //from LnK
		
		if (vID) {
			return vID;
		}
		
		vID = pLock?.flags[cMATT]?.entity.id; //from MATT
		
		if (vID) {
			return vID;
		}		
		
		return "";
	}
	
	static setMATTTriggercondition(pLock, pType, pCondition) {
		if (pLock) {
			pLock.setFlag(cModuleName, cMATTTriggerConditionsF + "." + pType, pCondition);
		}
	}
	
	static MattTriggerCondition(pLock, pType) {
		let vTriggerCondition;
		
		let vFlags = pLock.flags[cModuleName];
		
		if (vFlags?.hasOwnProperty(cMATTTriggerConditionsF)) {
			vTriggerCondition = vFlags[cMATTTriggerConditionsF][pType];
		}
		
		if (cTConditions.includes(vTriggerCondition)) {
			return vTriggerCondition;
		}
		else {
			return cTCNever;
		}
	}
	
	static MATTTriggered(pLock, pInfos) {
		switch (LnKCompUtils.MattTriggerCondition(pLock, pInfos.UseType)) {
			case cTCAlways:
				return true;
				break;
			case cTCFailure:
				return pInfos.Outcome <= 0;
				break;
			case cTCcritFailure:
				return pInfos.Outcome < 0;
				break;
			case cTCSuccess:
				return pInfos.Outcome > 0;
				break;
			case cTCNever:
			default:
				return false;
				break;
		}
	}
}

export { LnKCompUtils };
