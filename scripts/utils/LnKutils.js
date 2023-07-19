//CONSTANTS
const cModuleName = "LocknKey"; //name of Module

//Door Types
const cLockTypeDoor = "LTDoor"; //type for door locks

function Translate(pName){
  return game.i18n.localize(cModuleName+"."+pName);
}

class LnKutils {
	//DELCARATIONS
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
	
	//arrays
	static Intersection(pArray1, pArray2) {} //returns the intersection of pArray1 and pArray2
	
	//IMPLEMENTATIONS
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
				LnKutils.WallfromID(pID, pScene);
				break;
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
	
	//arrays
	static Intersection(pArray1, pArray2) {
		return pArray1.filter(vElement => pArray2.includes(vElement));
	}
}

Hooks.on("ready", function() {
	LnKutils.createKeyItem();
});

export { cModuleName, cLockTypeDoor, Translate, LnKutils }