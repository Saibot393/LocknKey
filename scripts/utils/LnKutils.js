//CONSTANTS
const cModuleName = "LocknKey"; //name of Module

const cPopUpID = "Popup";

//System names
const cPf2eName = "pf2e"; //name of Pathfinder 2. edition system

//Door Types
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
	
	static TokenInventory(pToken) {} //returns inventoryof pToken
	
	//locks
	static Locktype(pDocument) {} //returns Locktype of pDocument (if any)
	
	static isLockCompatible(pDocument) {} //returns if Token can have a lock
	
	static isTokenLock(pLock) {} //returns if pLock is a Token
	
	static isTokenLocktype(pLocktype) {} //returns if pLocktype belongs to a Token
	
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
			let vDocument = pScene.walls.find(vDocument => vDocument.id === pID);
			
			if (vDocument) {
				return vDocument;
			}
			else {
				return null;
			}
		}
		else {
			//default scene
			let vWall = canvas.walls.placeables.find(vWall => vWall.id === pID);
			
			if (vToken) {
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
		
		if (!vCharacter) {
			vCharacter = game.user.character;
		}
		
		return vCharacter;
	}
	
	//items
	static async createKeyItem(pName = Translate("Word.Key")) {
		let vDocument =  game.items.createDocument({name : pName, type : "equipment", img:"icons/sundries/misc/key-steel.webp"});	
		
		return await vDocument.constructor.create(vDocument);
	}
	
	static TokenInventory(pToken) {
		console.log(pToken);
		return pToken.actor.items;
	}
	
	//locks
	static Locktype(pDocument) {
		if (pDocument.collectionName == "walls") {
			return cLockTypeDoor;
		}
		
		if (LnKutils.isPf2e()) {
			console.log(pDocument);
			console.log(pDocument.actor);
			if (pDocument.actor.type == cPf2eLoottype) {
				return cLockTypeLootPf2e;
			}
		}
		
		return "";
	}	
	
	static isLockCompatible(pDocument) {			
		return (LnKutils.Locktype(pDocument) != "");
	}
	
	static isTokenLock(pLock) {
		return LnKutils.isTokenLocktype(LnKutils.Locktype(pLock));
	}
	
	static isTokenLocktype(pLocktype) {
		return cTokenLockTypes.includes(pLocktype);
	}
	
	//arrays
	static Intersection(pArray1, pArray2) {
		return pArray1.filter(vElement => pArray2.includes(vElement)).filter(vElement => vElement.length);
	}
}

export { Translate, LnKutils }