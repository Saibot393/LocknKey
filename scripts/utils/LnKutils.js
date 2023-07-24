import { LnKCompUtils, cArmReach, cArmReachold } from "../compatibility/LnKCompUtils.js";
import { Geometricutils } from "./Geometricutils.js";

//CONSTANTS
const cModuleName = "LocknKey"; //name of Module

const cPopUpID = "Popup";

const cEmptySymbol = "-";

//System names
const cPf2eName = "pf2e"; //name of Pathfinder 2. edition system
const cPf1eName = "pf1"; //name of Pathfinder 1. edition system
const cDnD5e = "dnd5e"; //name of D&D 5e system
const cAdvanced5e = "a5e"; //name of the advanced D&D 5e system
const cStarFinderName = "sfrpg"; //name of Starfinder system
const c13thage = "archmage"; //name of the 13th age system
const cCoC7 = "CoC7"; //name of call of cthulhu 7 system
const cWarhammer4e = "wfrp4e"; //name of the warhammer 4e system
const cDarkEye5e = "dsa5"; //name of the black eye 5e system
const cBitD = "blades-in-the-dark"; //name of the blades in the dark system
const cCyberpunkRED = "cyberpunk-red-core"; //name of the cyberpunk red core system

//Lock Types
const cLockTypeDoor = "LTDoor"; //type for door locks
const cLockTypeLootPf2e = "LTLootPf2e"; //type for Token

const cTokenLockTypes = [cLockTypeLootPf2e];//All Lock types belonging to Tokens

//Lock use TYPES
const cLUisGM = "LockuseGM"; //if a Lock is used by a GM
const cLUuseKey = "LockuseKey"; //if a Key is used on a lock
const cLUpickLock = "LockusePick"; //if a Lock pick is used on a lock

//Tokentype
const cPf2eLoottype = "loot"; //type of loot tokens in Pf2e

export {cModuleName, cPopUpID, cLockTypeDoor, cLockTypeLootPf2e, cLUisGM, cLUuseKey, cLUpickLock}

function Translate(pName, pWords = {}){
	let vText = game.i18n.localize(cModuleName+"."+pName);
	
	for (let vWord of Object.keys(pWords)) {
		vText = vText.replace("{" + vWord + "}", pWords[vWord]);
	}
		
	return vText;
}

class LnKutils {
	//DELCARATIONS	
	//Identification
	static isPf2e() {} //used for special Pf2e functions
	
	//system defaults
	static Systemdefaultitemtype() {} //returns the default type of item for keys in the current system
	
	static SystemdefaultLockPickItem() {} //returns the default Lock Pick item in the current system
	
	static SystemdefaultLPformula() {} //returns the default formula for Lock Picking in the current system
	
	//ID handling
	static TokenfromID (pID, pScene = null) {} //returns the Token matching pID
	
	static WallfromID(pID, pScene = null) {} //returns the Wall matching pID
	
	static LockfromID (pID, pLockType, pScene = null) {} //returns the Lock (Door or Token) matching pID
	
	//Token/Character Controls
	static selectedTokens() {} //get array of all selected tokens
	
	static targetedToken() {} //get first selected token
	
	static hoveredToken() {} //get first hovered token
	
	static PrimaryCharacter() {} //returns the first selected token document if available or the default character document
	
	//items
	static async createKeyItem(pName = Translate("Word.Key")) {} // creates new key item and returns the document
	
	static Keyitemtype() {} //returns the used type of item for keys
	
	static TokenInventory(pToken) {} //returns inventory of pToken
	
	static LockPickItem() {} //returns the name/id of the Lock Pick item
	
	static hasLockPickItem(pInventory) {} //returns if pInventory includes LockPick item
	
	//locks
	static async Locktype(pDocument) {} //returns Locktype of pDocument (if any)
	
	static async isLockCompatible(pDocument) {} //returns if Token can have a lock
	
	static isTokenLock(pLock) {} //returns if pLock is a Token
	
	static async isTokenLocktype(pLocktype) {} //returns if pLocktype belongs to a Token
	
	static isWall(pObject) {} //returns if pObject is a Wall
	
	static isToken(pObject) {} //returns if pObject is a Token
	
	static LockuseDistance() {} //returns the distance over which a lock can be used
	
	static WithinLockingDistance(pCharacter, pLock) {} //returns if pLock is within the use Distanc of pUser
	
	static beatsDC(pRollresult, pDC) {} //returns if pRollresult beats pDC
	
	static LPformula() {} //returns the formale used for Lock picking rolls
	
	//arrays
	static Intersection(pArray1, pArray2) {} //returns the intersection of pArray1 and pArray2
	
	//IMPLEMENTATIONS
	//Identification	
	static isPf2e() {
		return game.system.id === cPf2eName;
	}
	
	//system defaults
	static Systemdefaultitemtype() {
		switch (game.system.id) {
			case cPf2eName:
				return "equipment";
				break;
			case cDnD5e:
				return "tool";
			case cStarFinderName:
				return "technological";
				break;
			case cAdvanced5e:
				return "object";
				break;
			case c13thage:
				return "tool";
				break;
			case cCoC7:
				return "item";
				break;
			case cWarhammer4e:
				return "cargo";
				break;
			case cDarkEye5e:
				return "equipment";
				break;
			case cPf1eName:
				return "equipment";
				break;
			case cBitD:
				return "item";
				break;
			case cCyberpunkRED:
				return "gear";
				break;
			default:
				//default fall backs
				if (game.items.documentClass.TYPES.includes("object")) {
					return "object"
				}
				if (game.items.documentClass.TYPES.includes("item")) {
					return "item"
				}
				if (game.items.documentClass.TYPES.includes("tool")) {
					return "tool"
				}
				if (game.items.documentClass.TYPES.includes("equipment")) {
					return "equipment"
				}
				return game.items.documentClass.TYPES[0];
				break;
		}
	}
	
	static SystemdefaultLockPickItem() {
		switch (game.system.id) {
			case cPf2eName:
				return "zvLyCVD8g2PdHJAc";
				break;
			case cDnD5e:
				return "woWZ1sO5IUVGzo58";
				break;
			case cPf1eName:
				return "Tools, Thieves'";
				break;
			default:
				return "";
		}		
	}
	
	static SystemdefaultLPformula() {
		switch (game.system.id) {
			case cPf2eName:
				return "1d20 + @actor.skills.thievery.mod";
				break;
			case cDnD5e:
				return "1d20 + @actor.system.abilities.dex.mod + @actor.system.tools.thief.total";
				break;
			default:
				return "";
		}
	}
	
	//ID handling
	static TokenfromID (pID, pScene = null) {
		if (pScene) {
			let vDocument = pScene.tokens.find(vDocument => vDocument.id === pID);
			
			if (vDocument) {
				return vDocument;
			}
			else {
				return null;
			}
		}
		else {
			//default scene
			let vToken = canvas.tokens.placeables.find(vToken => vToken.id === pID);
			
			if (vToken) {
				return vToken.document;
			}
			else {
				return null;
			}
		}
	} 
	
	static WallfromID(pID, pScene = null) {
		if (pScene) {
			let vDocument = pScene.walls.get(pID);
			
			if (vDocument) {
				return vDocument;
			}
			else {
				return null;
			}
		}
		else {
			//default scene
			let vWall = canvas.walls.get(pID);
			if (vWall) {
				return vWall.document;
			}
			else {
				return null;
			}
		}		
	}
	
	static LockfromID (pID, pLockType, pScene = null) {
		switch(pLockType) {
			case cLockTypeDoor:
				return LnKutils.WallfromID(pID, pScene);
				break;
			case cLockTypeLootPf2e:
			default:
				return LnKutils.TokenfromID(pID, pScene);
		}
	}
	
	//Token/Character Controls
	static selectedTokens() {
		return canvas.tokens.controlled.map(pToken => pToken.document);
	}
	
	static targetedToken() {
		if (game.user.targets.ids.length) {
			return canvas.tokens.placeables.find(velement => velement.id === game.user.targets.ids[0]).document;
		}
		else {
			return null;
		}
	}
	
	static hoveredToken() {
		if (canvas.tokens.hover) {
			return canvas.tokens.hover.document;
		}
		else {
			return null;
		}
	}
	
	static PrimaryCharacter() {
		let vCharacter = LnKutils.selectedTokens()[0];
		
		if (!vCharacter || !vCharacter.isOwner) {
			//select a token representing the standard character of the player
			vCharacter = canvas.scene.tokens.find(vToken => vToken.actor.id == game.user.character.id);
		}
		
		return vCharacter;
	}
	
	//items
	static async createKeyItem(pName = Translate("Words.Key")) {
		let vDocument = Item.create({name : pName, type : LnKutils.Keyitemtype(), img:"icons/sundries/misc/key-steel.webp"});//game.items.createDocument({name : pName, type : LnKutils.Systemitemtype(), img:"icons/sundries/misc/key-steel.webp"});	
		
		return vDocument;//await vDocument.constructor.create(vDocument);
	}
	
	static Keyitemtype() {
		if (game.items.documentClass.TYPES.includes(game.settings.get(cModuleName, "KeyItemtype"))) {
			return game.settings.get(cModuleName, "KeyItemtype")
		}
		else {
			return LnKutils.Systemdefaultitemtype();
		}
	}
	
	static TokenInventory(pToken) {
		return pToken.actor.items;
	}
	
	static LockPickItem() {
		if (game.settings.get(cModuleName, "LockPickItem").length) {
			return game.settings.get(cModuleName, "LockPickItem")
		}
		else {
			return LnKutils.SystemdefaultLockPickItem();
		}
	}
	
	static hasLockPickItem(pInventory) {
		if (LnKutils.LockPickItem() == "" || LnKutils.LockPickItem() == cEmptySymbol) {
			//Lock pick item is disabled
			return true;
		}
		
		if (pInventory.find(vItem => vItem.name.includes(LnKutils.LockPickItem()))) {
			//filter by name
			return true;
		}
		
		if (pInventory.filter(vItem => vItem.flags.core).filter(vItem => vItem.flags.core.sourceId).find(vItem => vItem.flags.core.sourceId.includes(LnKutils.LockPickItem()))) {
			//filter by compendium id
			return true;
		}
		
		return false;
	}
	
	//locks
	static async Locktype(pDocument) {
		var vLocktype = await LnKCompUtils.Locktype(pDocument);
		
		if (vLocktype.length) {
			return vLocktype;
		}
		 
		if (pDocument) {
			if (LnKutils.isWall(pDocument)) {
				return cLockTypeDoor;
			}
			
			if (LnKutils.isToken(pDocument)) {
				if (LnKutils.isPf2e()) {
					if (pDocument.actor.type == cPf2eLoottype) {
						return cLockTypeLootPf2e;
					}
				}
			}
		}
		
		return "";
	}	
	
	static async isLockCompatible(pDocument) {	
		return ((await LnKutils.Locktype(pDocument)).length);
	}
	
	static isTokenLock(pLock) {
		return LnKutils.isTokenLocktype(LnKutils.Locktype(pLock));
	}
	
	static async isTokenLocktype(pLocktype) {
		return cTokenLockTypes.includes(pLocktype) || (await LnKCompUtils.isTokenLocktype(pLocktype));
	}
	
	static isWall(pObject) {
		return Boolean(pObject.collectionName == "walls");
	}
	
	static isToken(pObject) {
		return Boolean(pObject.collectionName == "tokens");
	}
	
	static LockuseDistance() {	
		if ((LnKCompUtils.isactiveModule(cArmReach) || LnKCompUtils.isactiveModule(cArmReachold)) && game.settings.get(cModuleName, "UseArmReachDistance")) {
			return LnKCompUtils.ARReachDistance();
		}
		
		if (game.settings.get(cModuleName, "LockDistance") >= 0) {
			return game.settings.get(cModuleName, "LockDistance");
		}
		else {
			return Infinity;
		}		
	}
	
	static WithinLockingDistance(pCharacter, pLock) {
		if ((LnKCompUtils.isactiveModule(cArmReach) || LnKCompUtils.isactiveModule(cArmReachold)) && game.settings.get(cModuleName, "UseArmReachDistance")) {
			return LnKCompUtils.ARWithinLockingDistance(pCharacter, pLock);
		}
						
		return Geometricutils.ObjectDistance(pCharacter, pLock) <= LnKutils.LockuseDistance();
	}
	
	static beatsDC(pRollresult, pDC) {
		return pRollresult >= pDC;
	}
	
	static LPformula() {
		if (game.settings.get(cModuleName, "LockPickFormula").length) {
			return game.settings.get(cModuleName, "LockPickFormula");
		}
		else {
			return LnKutils.SystemdefaultLPformula();
		}
	}
	
	//arrays
	static Intersection(pArray1, pArray2) {
		return pArray1.filter(vElement => pArray2.includes(vElement)).filter(vElement => vElement.length);
	}
}

export { Translate, LnKutils }