import { LnKCompUtils, cArmReach, cArmReachold } from "../compatibility/LnKCompUtils.js";
import { LnKSystemutils, cPf2eLoottype, cLockTypeLootPf2e } from "./LnKSystemutils.js";
import { Geometricutils } from "./Geometricutils.js";

//CONSTANTS
const cModuleName = "LocknKey"; //name of Module

const cPopUpID = "Popup";

const cDelimiter = ";"; //used to speretae id strings

const cEmptySymbol = "-";

const cFormulaOperators = "+-*/%";

const cSimCount = 500; //how many times rolls should be simulated to calculate the average (keep as low as possible)

//Lock Types
const cLockTypeDoor = "LTDoor"; //type for door locks

const cTokenLockTypes = [cLockTypeLootPf2e];//All Lock types belonging to Tokens

//Lock use TYPES
const cLUisGM = "LockuseGM"; //if a Lock is used by a GM
const cLUuseKey = "LockuseKey"; //if a Key is used on a lock
const cLUpickLock = "LockusePick"; //if a Lock pick is used on a lock
const cLUbreakLock = "LockuseBreak"; //if a Lock is broken

export {cModuleName, cPopUpID, cLockTypeDoor, cLockTypeLootPf2e, cLUisGM, cLUuseKey, cLUpickLock, cLUbreakLock}

function Translate(pName, pWords = {}){
	let vText = game.i18n.localize(cModuleName+"."+pName);
	
	for (let vWord of Object.keys(pWords)) {
		vText = vText.replace("{" + vWord + "}", pWords[vWord]);
	}
		
	return vText;
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
	
	static Keyitemtype() {} //returns the used type of item for keys
	
	static TokenInventory(pToken) {} //returns inventory of pToken
	
	static LockPickItems() {} //returns an array of names/ids of Lock Pick items
	
	static isLockPickItem(pItem) {} //if item qualifies as LockPick item
	
	static hasLockPickItem(pInventory) {} //returns if pInventory includes LockPick item
	
	static LockPickItemsin(pInventory) {} //returns all valid Lock pick items in pInventory
	
	static LockBreakItemsin(pInventory) {} //returns all valid Lock break items in pInventory
	
	//locks
	static async Locktype(pDocument) {} //returns Locktype of pDocument (if any)
	
	static async isLockCompatible(pDocument) {} //returns if Token can have a lock
	
	static isTokenLock(pLock) {} //returns if pLock is a Token
	
	static async isTokenLocktype(pLocktype) {} //returns if pLocktype belongs to a Token
	
	static isWall(pObject) {} //returns if pObject is a Wall
	
	static DoorisLocked(pDoor) {} //returns of pDoor is locked
	
	static isToken(pObject) {} //returns if pObject is a Token
	
	static LockuseDistance() {} //returns the distance over which a lock can be used
	
	static WithinLockingDistance(pCharacter, pLock) {} //returns if pLock is within the use Distanc of pUser
	
	static beatsDC(pRollresult, pDC) {} //returns if pRollresult beats pDC
	
	static successDegree(pRollresult, pDC) {} //returns the degree of success of pRollresult based on the pDC and the world crit settings
	
	static LPformulaWorld() {} //returns the worlds formula used for Lock picking rolls
	
	static LBformulaWorld() {} //returns the worlds formula used for Lock breaking rolls
	
	static formulaWorld(pType) {} //returns the worlds formula used for pType [cLUpickLock, cLUbreakLock]
	
	//arrays
	static Intersection(pArray1, pArray2) {} //returns the intersection of pArray1 and pArray2
	
	static includesone(pString, pIncludes) {} //returns if string contains a string included in pIncludes array
	
	//rolls
	static StitchFormula(pFormulaA, pFormulaB) {} //stitches two roll formulsa together and returns the stitchedresult
	
	static StitchFormulas(pFormulas) {} //stitches an array of roll formulas together and returns the stitchedresult
	
	static async AverageResult(pFormula, pData = {}) {} //returns the average result of Roll formula pFormula
	
	static async HighestExpectedRollID(pRolls, pData = {}) {} //takes an array of rolls and returs the id of the highest expected roll result
	
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
			return LnKSystemutils.Systemdefaultitemtype();
		}
	}
	
	static TokenInventory(pToken) {
		return pToken.actor.items;
	}
	
	static LockPickItems() {
		if (game.settings.get(cModuleName, "LockPickItem").length) {
			return game.settings.get(cModuleName, "LockPickItem").split(cDelimiter)
		}
		else {
			return LnKSystemutils.SystemdefaultLockPickItem().split(cDelimiter);
		}
	}
	
	static isLockPickItem(pItem) {
		//if either name or id matches
		return (LnKutils.includesone(pItem.name, LnKutils.LockPickItems()) || (pItem.flags.core && pItem.flags.core.sourceId && LnKutils.includesone(pItem.flags.core.sourceId, LnKutils.LockPickItems())));
	}
	
	static hasLockPickItem(pInventory) {
		console.log(LnKutils.LockPickItems());
		if (LnKutils.LockPickItems().find(vElement => vElement == cEmptySymbol)) {
			//Lock pick item is disabled
			return true;
		}

		if (LnKutils.LockPickItems().length == 0) {
			//No pick item defined
			return false;
		}

		return pInventory.find(vItem => LnKutils.isLockPickItem(vItem));
	}
	
	static LockPickItemsin(pInventory) {
		return pInventory.filter(vItem => LnKutils.isLockPickItem(vItem));
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
				if (LnKSystemutils.isPf2e()) {
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
	
	static DoorisLocked(pDoor) {
		return (pDoor.ds == 2);
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
	
	static successDegree(pRollresult, pDC) {
		return -1; //critical fail
		return 0; //fail
		return 1; //success
		return 2; //critical success
	}
	
	static LPformulaWorld() {
		if (game.settings.get(cModuleName, "LockPickFormula").length) {
			return game.settings.get(cModuleName, "LockPickFormula");
		}
		else {
			return LnKSystemutils.SystemdefaultLPformula();
		}
	}
	
	static LBformulaWorld() {
		if (game.settings.get(cModuleName, "LockBreakFormula").length) {
			return game.settings.get(cModuleName, "LockBreakFormula");
		}
		else {
			return LnKSystemutils.SystemdefaultLBformula();
		}		
	}
	
	static formulaWorld(pType) {
		switch (pType) {
			case cLUpickLock:
				return LnKutils.LPformulaWorld();
				break;
			case cLUbreakLock:
				return LnKutils.LBformulaWorld();
				break;
			default:
				return "";
				break;
		}
	}
	
	//arrays
	static Intersection(pArray1, pArray2) {
		return pArray1.filter(vElement => pArray2.includes(vElement)).filter(vElement => vElement.length);
	}
	
	static includesone(pString, pIncludes) {
		return pIncludes.find(vInclude => pString.includes(vInclude));
	}
	
	//rolls
	static StitchFormula(pFormulaA, pFormulaB) {
		let vFormula = pFormulaA.trimEnd();
		let cStitch = " ";
		
		if (!pFormulaB.length) {
			//b has no content
			return pFormulaA;
		}
		
		if (!pFormulaA.length) {
			//a has no content
			return pFormulaB;
		}
		
		if (!cFormulaOperators.includes(vFormula[vFormula.length-1])  && !cFormulaOperators.includes(pFormulaB.trimStart()[0])) {
			//standard stitcher for formulas if no other operator is defined
			cStitch = " + ";
		}
		
		vFormula = vFormula + cStitch + pFormulaB;
		
		return vFormula;
	}
	
	static StitchFormulas(pFormulas) {
		let vFormula = pFormulas[0];
		
		for (let i = 1; i < pFormulas.length; i++) {
			vFormula = LnKutils.StitchFormula(vFormula, pFormulas[i]);
		}
		
		return vFormula;
	} 
	
	static async AverageResult(pFormula, pData = {}) {
		if (pFormula == "") {
			//catch empty formulas
			return 0;
		}
		
		let vFormula = Roll.replaceFormulaData(pFormula, pData);
		
		if (vFormula.includes("d") || vFormula.includes("D")) {
			//Dice are used, simulate multiple times
			return (await Roll.simulate(vFormula, cSimCount)).reduce((va, vb) => {return va + vb})/cSimCount;
		}
		else {
			//no Dice used => deterministic
			return (await Roll.simulate(vFormula, cSimCount))[0];
		}
	}
	
	static async HighestExpectedRollID(pRolls, pData = {}) {
		if (pRolls.length = 1) {
			//no comparison necessary
			return 0;
		}
		
		let vID = 0;
		let vHighest = 0;
		let vCurrent;
		
		for (let i = 0; i < pRolls.length; i++) {
			//simulate all rolls and save if highest yet
			vCurrent = await LnKutils.AverageResult(pRolls[i], pData);
			
			if (vCurrent > vHighest) {
				vHighest = vCurrent;
				
				vID = i;
			}
		}
		
		return vID;
	}
}

export { Translate, LnKutils }