import * as FCore from "../CoreVersionComp.js";
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

const cQuantity = "quantity"; //name of the quantity attribut of items in most systems

//Lock Types
const cLockTypeDoor = "LTDoor"; //type for door locks

const cTokenLockTypes = [cLockTypeLootPf2e];//All Lock types belonging to Tokens

//Lock use TYPES
const cLUisGM = "LockuseGM"; //if a Lock is used by a GM
const cLUuseKey = "LockuseKey"; //if a Key is used on a lock
const cLUusePasskey = "LockusePasskey"; //if a Passkey (paasword or PIN) is used on lock
const cLUpickLock = "LockusePick"; //if a Lock pick is used on a lock
const cLUbreakLock = "LockuseBreak"; //if a Lock is broken

export {cModuleName, cPopUpID, cLockTypeDoor, cLockTypeLootPf2e, cLUisGM, cLUuseKey, cLUusePasskey, cLUpickLock, cLUbreakLock}

function Translate(pName, pWords = {}){
	let vText = game.i18n.localize(cModuleName+"."+pName);
	
	for (let vWord of Object.keys(pWords)) {
		vText = vText.replace("{" + vWord + "}", pWords[vWord]);
	}
		
	return vText;
}

var vlastSearchedItemtype; //Saves the last item type for which a path was searched
var vlastItempath; //Saves the last path that was found for lastSearchedItemtype

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
	
	static hoveredWall() {} //get first hovered wall
	
	static hoveredObject() {} //get first hovered object
	
	static PrimaryCharacter() {} //returns the first selected token document if available or the default character document
	
	//items
	static async createKeyItem(pName = Translate("Word.Key"), pFolder = "") {} // creates new key item and returns the document
	
	static Keyitemtype() {} //returns the used type of item for keys
	
	static async TokenInventory(pToken, pfiltered = false) {} //returns inventory of pToken
	
	static LockPickItems() {} //returns an array of names/ids of Lock Pick items
	
	static isLockPickItem(pItem, pSpecialLockpicks = []) {} //if item qualifies as LockPick item
	
	static hasLockPickItem(pInventory, pSpecialLockpicks = []) {} //returns if pInventory includes LockPick item
	
	static LockPickItemsin(pInventory) {} //returns all valid Lock pick items in pInventory
	
	static async ItemQuantityPath(pItem, pItemtype = "") {} //returns the path to the items quantity in form of an array ([] if no path found)
	
	static setItemquantity(pItem, pset, pCharacter = undefined) {} //trys to set quantity of pItem to pset
	
	static async getItemquantity(pItem, pPath = []) {} //trys to get quantity of pItem, returns Infinity otherwise
	
	static async changeItemquantity(pItem, pdelta, pCharacter = undefined) {} //trys to change the quantity of pItem
	
	static async removeoneItem(pItem, pCharacter) {} //trys to reduce quantity by one, if not possible, deletes item
	
	static getItemFolders() {} //returns an array of all Folders, including array with the name and the ID
	
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
	
	static successDegree(pRollresult, pDiceDetails, pDC) {} //returns the degree of success of pRollresult and pRolldetails based on the pDC and the world crit settings
	
	static LPformulaWorld() {} //returns the worlds formula used for Lock picking rolls
	
	static LBformulaWorld() {} //returns the worlds formula used for Lock breaking rolls
	
	static formulaWorld(pType) {} //returns the worlds formula used for pType [cLUpickLock, cLUbreakLock]
	
	static useMultiSuccess(pObject) {} //returns of MultiSuccess is active for pObject
	
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
	
	static hoveredWall() {
		if (canvas.walls.hover) {
			return canvas.walls.hover.document;
		}
		else {
			return null;
		}		
	}
	
	static hoveredObject() {
		if (LnKutils.hoveredWall()) {
			return LnKutils.hoveredWall();
		}
		else {
			return LnKutils.hoveredToken();
		}
	}
	
	static PrimaryCharacter() {
		let vCharacter = LnKutils.selectedTokens()[0];
		
		if ((!vCharacter || !vCharacter.isOwner) && game.user.character) {
			//select a token representing the standard character of the player
			vCharacter = canvas.scene.tokens.find(vToken => vToken.actor.id == game.user.character?.id);
		}
		
		return vCharacter;
	}
	
	//items
	static async createKeyItem(pName = Translate("Words.Key"), pFolder = "") {
		let vDocument = Item.create({name : pName, type : LnKutils.Keyitemtype(), img:"icons/sundries/misc/key-steel.webp", folder : pFolder});//game.items.createDocument({name : pName, type : LnKutils.Systemitemtype(), img:"icons/sundries/misc/key-steel.webp"});	
		
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
	
	static async TokenInventory(pToken, pfiltered = false) {
		let vItems;
		
		vItems = LnKSystemutils.SystemInventory(pToken);
		
		if (pfiltered) {
			/* too slow
			let vOldItems = pToken.actor.items.map(vItem => vItem);
			let vItems = [];
			
			for (let i = 0; i <= vOldItems.length - 1; i++) {
				
				if (await LnKutils.getItemquantity(vOldItems[i]) > 0) {
					vItems[vItems.length] = vOldItems[i];
				}
			}
			return vItems;
			*/
			//only return items that have at least 1 in stack (if quantity can be found easily)
			return vItems.filter(vItem => !Number.isInteger(vItem.quantity) || (vItem.quantity > 0));
		}
		
		return vItems;
	}
	
	static LockPickItems() {
		if (game.settings.get(cModuleName, "LockPickItem").length) {
			return game.settings.get(cModuleName, "LockPickItem").split(cDelimiter)
		}
		else {
			return LnKSystemutils.SystemdefaultLockPickItem().split(cDelimiter);
		}
	}
	
	static isLockPickItem(pItem, pSpecialLockpicks = []) {
		//if either name or id matches
		let vLockpickItems = LnKutils.LockPickItems();
		
		if (pSpecialLockpicks.length) {
			vLockpickItems = pSpecialLockpicks;
		}
		
		return (LnKutils.includesone(pItem.name, vLockpickItems) || (pItem.flags.core?.sourceId && LnKutils.includesone(pItem.flags.core.sourceId, vLockpickItems)) || LnKutils.includesone(pItem.id, vLockpickItems) || (pItem.ciKey && LnKutils.includesone(pItem.ciKey, vLockpickItems)));
	}
	
	static hasLockPickItem(pInventory, pSpecialLockpicks = []) {
		if (LnKutils.LockPickItems().find(vElement => vElement == cEmptySymbol)) {
			//Lock pick item is disabled
			return true;
		}

		if (LnKutils.LockPickItems().length == 0) {
			//No pick item defined
			return false;
		}

		return pInventory.find(vItem => LnKutils.isLockPickItem(vItem, pSpecialLockpicks));
	}
	
	static LockPickItemsin(pInventory) {
		return pInventory.filter(vItem => LnKutils.isLockPickItem(vItem));
	}
	
	static async ItemQuantityPath(pItem, pItemtype = "") {
		let vPath = [];
		
		if (pItem) {
			let vsubPath;
			let vPrimeKeys = Object.keys(pItem);
			
			if (pItemtype == vlastSearchedItemtype) {
				//if item path already known just return it
				return vlastItempath;
			}
			
			if (vPrimeKeys.length) {
				if (vPrimeKeys.includes(cQuantity)) {
					//if found return quantity path directly
					vPath.push(cQuantity)
				}
				else {
					//if not found search sub paths
					for (let i = 0; i < vPrimeKeys.length; i++) {
						if (vPath.length == 0) {
							//only (recursive)search if not already found
							vsubPath = LnKutils.ItemQuantityPath(pItem[vPrimeKeys[i]]);
							
							if (vsubPath.length > 0) {
								//subpath includes quantity, unshift path name into start of array and be done
								vPath = vsubPath;
								
								vPath.unshift(vPrimeKeys[i]);
							}				
						}
					}
				}
			}
			
			if (vPath.length > 0) {
				//to potentially increase the next searches speed
				vlastSearchedItemtype = pItemtype;
				vlastItempath = vPath;
			}
		}
		
		return vPath;
	}
	
	static async setItemquantity(pItem, pset, pCharacter = undefined) {		
		if (pItem) {
			if (pset <= 0 && pCharacter) {
				//special easy case
				pCharacter.actor.deleteEmbeddedDocuments("Item", [pItem.id]);
				
				return true;
			}
			 
			let vPath = (await LnKutils.ItemQuantityPath(pItem.system, pItem.type)); 
			let vUpdate = {};
			
			vUpdate[vPath.join(".")] = pset;
			
			pItem.update({system : vUpdate});
			
			return true;
		}
		
		return false;
	}
	
	static async getItemquantity(pItem, pPath = []) {
		if (pItem) {
			let vBuffer = pItem.system;
			let vPath = pPath; 
			
			if (vPath.length <= 0) {
				vPath = await LnKutils.ItemQuantityPath(pItem.system, [pItem.type]); 
			}
			
			if (vPath.length > 0) {
				for(let i = 0; i < vPath.length; i++) {	
					//last one will be quantity
					if (vBuffer) {
						vBuffer = vBuffer[vPath[i]]
					}
				}
				
				return vBuffer;
			}	

			return Infinity;
		}
		else {
			return 0;
		}
	}
	
	static async changeItemquantity(pItem, pdelta, pCharacter = undefined) {
		if (pItem) {
			let vPath = await LnKutils.ItemQuantityPath(pItem.system, [pItem.type]); 
			let vcurrentValue = await LnKutils.getItemquantity(pItem, vPath);
			let vUpdate = {};
			
			if (vcurrentValue + pdelta <= 0 && pCharacter) {
				//special easy case
				pCharacter.actor.deleteEmbeddedDocuments("Item", [pItem.id]);
				
				return true;
			}		
			
			vUpdate[vPath.join(".")] = vcurrentValue + pdelta;
			
			pItem.update({system : vUpdate});

			return true;
		}
		
		return false;		
	}
	
	static async removeoneItem(pItem, pCharacter) {
		if (!(await LnKutils.changeItemquantity(pItem, -1, pCharacter))) {
			await pCharacter.actor.deleteEmbeddedDocuments("Item", [pItem.id]);
		}
	}
	
	static getItemFolders() {
		return [["",""]].concat(game.items.directory.folders.map(vFolder => [vFolder.name, vFolder.id]));
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
	
	static successDegree(pRollresult, pDiceDetails, pDC) {
		let vsuccessDegree;
		
		if (pRollresult >= pDC) {
			vsuccessDegree = 1; //S
		}
		else {
			vsuccessDegree = 0; //F
		}
		
		if (game.settings.get(cModuleName, "CritMethod") == "CritMethod-natCrit") {
			//normal crit
			if (pDiceDetails[0] == 20) {
				vsuccessDegree = 2; //crit S
			}
			
			if (pDiceDetails[0] == 1) {
				vsuccessDegree = -1;//crit F
			}
		}
		
		if (game.settings.get(cModuleName, "CritMethod") == "CritMethod-natCritpm10") {
		
			//+-10 crit
			if (vsuccessDegree == 1) {
				if (pRollresult >= (pDC + 10)) {
					vsuccessDegree = 2;//crit S
				}
			}
			
			if (vsuccessDegree == 0) {
				if (pRollresult <= (pDC - 10)) {
					vsuccessDegree = -1;//crit F
				}
			}	
			
			//normal crit
			if (pDiceDetails[0] == 20) {
				vsuccessDegree = vsuccessDegree + 1; //crit S
			}
			
			if (pDiceDetails[0] == 1) {
				vsuccessDegree = vsuccessDegree - 1;//crit F
			}
		}
		
		vsuccessDegree = Math.min(2, Math.max(-1, vsuccessDegree)); //make sure vsuccessDegree is in [-1, 2]
		
		return vsuccessDegree;
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
	
	static useMultiSuccess(pObject) {
		let vScene = FCore.sceneof(pObject);
		
		if (vScene && game.settings.get(cModuleName, "onlyCombatMultiSuccess")) {
			//lock if combat is active in scene of pObject
			return game.combats.find(vCombat => vCombat.scene.id == vScene.id && vCombat.started)
		}
		
		return true;
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