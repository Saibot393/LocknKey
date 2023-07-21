import { LnKCompUtils, cArmReach, cArmReachold } from "../compatibility/LnKCompUtils.js";

//CONSTANTS
const cModuleName = "LocknKey"; //name of Module

const cPopUpID = "Popup";

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

//Lock Types
const cLockTypeDoor = "LTDoor"; //type for door locks
const cLockTypeLootPf2e = "LTLootPf2e"; //type for Token

const cTokenLockTypes = [cLockTypeLootPf2e];//All Lock types belonging to Tokens

//Tokentype
const cPf2eLoottype = "loot"; //type of loot tokens in Pf2e

export {cModuleName, cPopUpID, cLockTypeDoor, cLockTypeLootPf2e}

function Translate(pName){
	return game.i18n.localize(cModuleName+"."+pName);
}

class LnKutils {
	//DELCARATIONS	
	//Identification
	static isPf2e() {} //used for special Pf2e functions
	
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
	
	static Systemdefaultitemtype() {} //returns the default type of item for keys in the current system
	
	static Systemitemtype() {} //returns the used type of item for keys in the current system
	
	static TokenInventory(pToken) {} //returns inventoryof pToken
	
	static isKeyItem(pItem) {} //returns if pItem is a key item
	
	//locks
	static Locktype(pDocument) {} //returns Locktype of pDocument (if any)
	
	static isLockCompatible(pDocument) {} //returns if Token can have a lock
	
	static isTokenLock(pLock) {} //returns if pLock is a Token
	
	static isTokenLocktype(pLocktype) {} //returns if pLocktype belongs to a Token
	
	static isWall(pObject) {} //returns if pObject is a Wall
	
	static isToken(pObject) {} //returns if pObject is a Token
	
	static LockuseDistance() {} //returns the distance over which a lock can be used
	
	//arrays
	static Intersection(pArray1, pArray2) {} //returns the intersection of pArray1 and pArray2
	
	//IMPLEMENTATIONS
	//Identification	
	static isPf2e() {
		return game.system.id === cPf2eName;
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
		let vDocument = Item.create({name : pName, type : LnKutils.Systemitemtype(), img:"icons/sundries/misc/key-steel.webp"});//game.items.createDocument({name : pName, type : LnKutils.Systemitemtype(), img:"icons/sundries/misc/key-steel.webp"});	
		
		return vDocument;//await vDocument.constructor.create(vDocument);
	}
	
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
	
	static Systemitemtype() {
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
	
	//locks
	static Locktype(pDocument) {
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
		
		return LnKCompUtils.Locktype(pDocument);
	}	
	
	static isLockCompatible(pDocument) {			
		return (LnKutils.Locktype(pDocument) != "");
	}
	
	static isTokenLock(pLock) {
		return LnKutils.isTokenLocktype(LnKutils.Locktype(pLock));
	}
	
	static isTokenLocktype(pLocktype) {
		return cTokenLockTypes.includes(pLocktype) || LnKCompUtils.isTokenLocktype(pLocktype);
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
	
	//arrays
	static Intersection(pArray1, pArray2) {
		return pArray1.filter(vElement => pArray2.includes(vElement)).filter(vElement => vElement.length);
	}
}

export { Translate, LnKutils }