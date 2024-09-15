import * as FCore from "../CoreVersionComp.js";
import { LnKCompUtils, cArmReach, cArmReachold } from "../compatibility/LnKCompUtils.js";
import { LnKSystemutils, cPf2eLoottype, cLockTypeLootPf2e } from "./LnKSystemutils.js";
import { Geometricutils } from "./Geometricutils.js";
import { LnKFlags } from "../helpers/LnKFlags.js";

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
const cLockTypeTile = "LTTile"; //type for tile locks

const cTokenLockTypes = [cLockTypeLootPf2e];//All Lock types belonging to Tokens

//Lock use TYPES
const cLUisGM = "LockuseGM"; //when a Lock is used by a GM
const cLUuseKey = "LockuseKey"; //when a Key is used on a lock
const cLUusePasskey = "LockusePasskey"; //when a Passkey (paasword or PIN) is used on lock
const cLUchangePasskey = "LockchangePasskey"; //when a Passkey (paasword or PIN) is used on lock
const cLUIdentity = "LockuseIdentity"; //when the identity (token, actor, player) is used on lock
const cLUaddIdentity = "LockuseaddIdentity" //when an Identity is added as lock identity
const cLUpickLock = "LockusePick"; //when a Lock pick is used on a lock
const cLUbreakLock = "LockuseBreak"; //when a Lock is broken
const cLUCustomCheck = "LockuseCustom"; //when a custom check is applied
const cLUFreeCircumvent = "LockuseFree"; //when a lock gets circumvented via e.g. a knock spell
const cUPickPocket = "UsePickPocket"; //when a character is pickpocketed

export {cModuleName, cDelimiter, cPopUpID, cLockTypeDoor, cLockTypeTile, cLockTypeLootPf2e, cLUisGM, cLUuseKey, cLUusePasskey, cLUchangePasskey, cLUIdentity, cLUaddIdentity, cLUpickLock, cLUbreakLock, cLUCustomCheck, cLUFreeCircumvent, cUPickPocket}

function Translate(pName, pWords = {}){
	let vText = game.i18n.localize(cModuleName+"."+pName);
	
	for (let vWord of Object.keys(pWords)) {
		vText = vText.replace("{" + vWord + "}", pWords[vWord]);
	}
		
	return vText;
}

function TranslateClean(pName){
	let vText = game.i18n.localize(pName);
		
	return vText;
}

var vlastSearchedItemtype; //Saves the last item type for which a path was searched
var vlastItempath; //Saves the last path that was found for lastSearchedItemtype

class LnKutils {
	//DELCARATIONS		
	//ID handling
	static TokenfromID (pID, pScene = null) {} //returns the Token matching pID
	
	static TilefromID (pID, pScene = null) {} //returns the Tile matching pID
	
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
	static async createKeyItem(pName = Translate("Word.Key"), pFolder = "", pImage = "") {} // creates new key item and returns the document
	
	static Keyitemtype() {} //returns the used type of item for keys
	
	static async TokenInventory(pToken, pfiltered = false) {} //returns inventory of pToken
	
	static LockPickItems() {} //returns an array of names/ids of Lock Pick items
	
	static isLockPickItem(pItem, pSpecialLockpicks = []) {} //if item qualifies as LockPick item
	
	static hasLockPickItem(pInventory, pSpecialLockpicks = []) {} //returns if pInventory includes LockPick item
	
	static LockPickItemsin(pInventory) {} //returns all valid Lock pick items in pInventory
	
	static async ItemQuantityPath(pItem, pItemtype = "", pSearchDepth = 10) {} //returns the path to the items quantity in form of an array ([] if no path found)
	
	static setItemquantity(pItem, pset, pCharacter = undefined) {} //trys to set quantity of pItem to pset
	
	static async getItemquantity(pItem, pPath = []) {} //trys to get quantity of pItem, returns Infinity otherwise
	
	static async changeItemquantity(pItem, pdelta, pCharacter = undefined) {} //trys to change the quantity of pItem
	
	static async removeoneItem(pItem, pCharacter) {} //trys to reduce quantity by one, if not possible, deletes item
	
	static getItemFolders(pFilterDirectory = "") {} //returns an array of all Folders, including array with the name and the ID
	
	//locks
	static async Locktype(pDocument) {} //returns Locktype of pDocument (if any)
	
	static async isLockCompatible(pDocument) {} //returns if Token can have a lock
	
	static isTokenLock(pLock) {} //returns if pLock is a Token
	
	static async isTokenLocktype(pLocktype) {} //returns if pLocktype belongs to a Token
	
	static isTileLocktype(pLocktype) {} //returns if pLocktype belongs to a Tile
	
	static isWall(pObject) {} //returns if pObject is a Wall
	
	static DoorisLocked(pDoor) {} //returns of pDoor is locked
	
	static isToken(pObject) {} //returns if pObject is a Token
	
	static isTile(pObject) {} //returns if pObject is a Tile
	
	static LockuseDistance() {} //returns the distance over which a lock can be used
	
	static WithinLockingDistance(pCharacter, pLock) {} //returns if pLock is within the use Distanc of pUser
	
	static generateRollInfos(pToken) {} //returns roll infos based on pToken, used by successDegree()
	
	static LPformulaWorld() {} //returns the worlds formula used for Lock picking rolls
	
	static LBformulaWorld() {} //returns the worlds formula used for Lock breaking rolls
	
	static CCformulaWorld() {} //returns the worlds formula used for Custom check rolls
	
	static formulaWorld(pType) {} //returns the worlds formula used for pType [cLUpickLock, cLUbreakLock]
	
	static useMultiSuccess(pObject) {} //returns of MultiSuccess is active for pObject
	
	//pick pocket
	static PickPocketformulaWorld() {} //returns the worlds formula used Pick Pocket check rolls
	
	static async CalculatePPDefaultDC(pToken) {} //returns the calculated PickPocket DC (if formula available), else returns default dc value
	
	static isDead(pActor) {} //returns wether pActor is dead
	
	//arrays
	static Intersection(pArray1, pArray2) {} //returns the intersection of pArray1 and pArray2
	
	static includesone(pString, pIncludes) {} //returns if string contains a string included in pIncludes array
	
	//rolls
	static beatsDC(pRollresult, pDC) {} //returns if pRollresult beats pDC
	
	static infinitythreshold() {} //returns the threshhold below which a number is interpreted as Infinity
	
	static async successDegree(pRollresult, pDiceDetails, pDC, pCharacter, pInfos = {}) {} //returns the degree of success of pRollresult and pRolldetails based on the pDC and the world crit settings
	
	static createroll(pFormula, pActor, pDC) {} //returns a roll with actor and skills as possible @ values in the formual
	
	static StitchFormula(pFormulaA, pFormulaB) {} //stitches two roll formulsa together and returns the stitchedresult
	
	static StitchFormulas(pFormulas) {} //stitches an array of roll formulas together and returns the stitchedresult
	
	static async AverageResult(pFormula, pActor) {} //returns the average result of Roll formula pFormula
	
	static async HighestExpectedRollID(pRolls, pActor) {} //takes an array of rolls and returs the id of the highest expected roll result
	
	static validChars(pstring) {} //returns the part of pstring containing valid (ASCII) chars
	
	static diceResults(pRoll) {} //returns array of Dice results of pRoll
	
	//keyboard
	static KeyisDown(pKeyName, pnoKeyvalid = false) {} //returns if a key belonging to keybinding pKeyName is down (pnoKeyvalid if no key pressed is valid "input")
	
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
	
	static TilefromID (pID, pScene = null) {
		if (pScene) {
			let vDocument = pScene.tiles.find(vDocument => vDocument.id === pID);
			
			if (vDocument) {
				return vDocument;
			}
			else {
				return null;
			}
		}
		else {
			//default scene
			let vToken = canvas.tiles.placeables.find(vToken => vToken.id === pID);
			
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
			case cLockTypeTile:
				return LnKutils.TilefromID(pID, pScene);
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
	static async createKeyItem(pName = Translate("Words.Key"), pFolder = "", pImage = "") {
		let vImage = "icons/sundries/misc/key-steel.webp";
		
		if (pImage) {
			vImage = pImage;
		}
		
		let vDocument = Item.create({name : pName, type : LnKutils.Keyitemtype(), img: vImage, folder : pFolder});//game.items.createDocument({name : pName, type : LnKutils.Systemitemtype(), img:"icons/sundries/misc/key-steel.webp"});	
		
		return vDocument;//await vDocument.constructor.create(vDocument);
	}
	
	static Keyitemtype() {
		if (game.items.documentClass.TYPES.includes(game.settings.get(cModuleName, "KeyItemtype"))) {
			return game.settings.get(cModuleName, "KeyItemtype")
		}
		else {
			return LnKSystemutils.SystemdefaultKeyitemtype();
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
		
		return (LnKutils.includesone(pItem.name, vLockpickItems) 
			|| (pItem.flags.core?.sourceId && LnKutils.includesone(pItem.flags.core.sourceId, vLockpickItems)) 
			|| (pItem._stats?.compendiumSource && LnKutils.includesone(pItem._stats.compendiumSource, vLockpickItems)) //for v12
			|| LnKutils.includesone(pItem.id, vLockpickItems) 
			|| (pItem.ciKey && LnKutils.includesone(pItem.ciKey, vLockpickItems))
			|| (pItem.flags.ddbimporter?.definitionId && LnKutils.includesone(pItem.flags.ddbimporter?.definitionId?.toString(), vLockpickItems)));
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
	
	static async ItemQuantityPath(pItem, pItemtype = "", pSearchDepth = 10) {
		//pSearchDepth 10 is only an estimation
		let vPath = [];
		
		if (pItem && pSearchDepth > 0) {
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
							vsubPath = LnKutils.ItemQuantityPath(pItem[vPrimeKeys[i]], pSearchDepth-1);
							
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
		if (Array.isArray(pItem)) {
			for (vItem of pItem) {
				await LnKutils.removeoneItem(vItem, pCharacter);
			}
		}
		else {
			if (!(await LnKutils.changeItemquantity(pItem, -1, pCharacter))) {
				await pCharacter.actor.deleteEmbeddedDocuments("Item", [pItem.id]);
			}
		}
	}
	
	static getItemFolders(pFilterDirectory = "") {
		let vFolders = game.items.directory.folders;
		 
		if (pFilterDirectory.length > 0) {
			vFolders = vFolders.filter(vFolder => (vFolder.name == pFilterDirectory) || vFolder.ancestors.find(vAncestor => vAncestor.name == pFilterDirectory));
		}
		
		return [["",""]].concat(vFolders.map(vFolder => [vFolder.name, vFolder.id]));
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
					if (pDocument.actor?.type == cPf2eLoottype) {
						return cLockTypeLootPf2e;
					}
				}
			}
			
			if (LnKutils.isTile(pDocument)) {
				return cLockTypeTile;
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
	
	static isTileLocktype(pLocktype) {
		return pLocktype == cLockTypeTile;
	}
	
	static isWall(pObject) {
		return pObject.documentName == "Wall";
	}
	
	static DoorisLocked(pDoor) {
		return (pDoor.ds == 2);
	}
	
	static isToken(pObject) {
		return pObject.documentName == "Token";
	}
	
	static isTile(pObject) {
		return pObject.documentName == "Tile";
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
	
	static generateRollInfos(pToken) {
		let vInfos = {};
		
		return vInfos;
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
	
	static CCformulaWorld() {
		if (game.settings.get(cModuleName, "CustomCircumventFormula").length) {
			return game.settings.get(cModuleName, "CustomCircumventFormula");
		}
		else {
			return "0";
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
			case cLUCustomCheck:
				return LnKutils.CCformulaWorld();
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
	
	//pick pocket
	static PickPocketformulaWorld() {
		if (game.settings.get(cModuleName, "PickPocketFormula").length) {
			return game.settings.get(cModuleName, "PickPocketFormula");
		}
		else {
			return "0";
		}			
	}
	
	static async CalculatePPDefaultDC(pToken) {
		let vFormula = game.settings.get(cModuleName, "PickPocketDefaultDCFormula");
		
		if (vFormula && pToken.actor) {
			let vRoll = new Roll(vFormula, {actor : pToken.actor});
			
			await vRoll.evaluate();
			
			return vRoll.total;
		}
		
		return game.settings.get(cModuleName, "PickPocketDefaultDC");
	}
	
	static isDead(pActor) {
		if (LnKCompUtils.isItemPile(pActor) || pActor.type == cPf2eLoottype) {
			return false;
		}
		
		let vActor = pActor;
		
		if (vActor?.actor) {
			vActor = vActor.actor;
		}
		
		return vActor?.system?.attributes?.hp?.value <= 0;
	}
	
	//arrays
	static Intersection(pArray1, pArray2) {
		return pArray1.filter(vElement => pArray2.includes(vElement)).filter(vElement => vElement.length);
	}
	
	static includesone(pString, pIncludes) {
		return pIncludes.find(vInclude => pString.includes(vInclude));
	}
	
	//rolls
	static beatsDC(pRollresult, pDC) {
		return pRollresult >= pDC;
	}
	
	static infinitythreshold() {
		switch (game.settings.get(cModuleName, "CritMethod")) {
			default:
				return -1;
				break;
		}
	} 
	
	static async successDegree(pRollresult, pDiceDetails, pDC, pCharacter, pInfos = {}) {
		
		let vsuccessDegree;
		
		pInfos.baseDC = pDC;
		pInfos.rollResult = pRollresult;
		
		if (pDC == Infinity) {
			pInfos.outcome = 0; 
			return 0; //auto fail on infinity DC
		}
		
		//normal success/failure
		switch (game.settings.get(cModuleName, "CritMethod")) {
			case "CritMethod-d100WFRP4":
			case "CritMethod-d100WFRP4Doubles":
				vsuccessDegree = Number(pRollresult <= pDC); //F || S			
				break;
			case "CritMethod-d100CoC7e":
			case "CritMethod-d10poolCoD2e":
				break;
			case "CritMethod-3d20DSA":
				vsuccessDegree = Number(pRollresult <= 0);
				break;
			default:
				vsuccessDegree = Number(pRollresult >= pDC); //F || S
				break;
		}
		
		//crit
		if (pDiceDetails) {
			switch (game.settings.get(cModuleName, "CritMethod")) {
				case "CritMethod-natCrit":
					//normal crit
					if (pDiceDetails[0] == 20) {
						vsuccessDegree = 2; //crit S
					}
					
					if (pDiceDetails[0] == 1) {
						vsuccessDegree = -1;//crit F
					}
					break;
				case "CritMethod-natCritpm10":
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
					break;
				case "CritMethod-d100WFRP4":
					if (pDiceDetails[0] == 1) {
						vsuccessDegree = 2; //crit S
					}
					
					if (pDiceDetails[0] == 100) {
						vsuccessDegree = -1; //crit F
					}
					break;
				case "CritMethod-d100WFRP4Doubles":
					if (pDiceDetails[0] == 1 || (vsuccessDegree > 0 && pDiceDetails[0]%11 == 0)) {
						vsuccessDegree = 2; //crit S
					}
					
					if (pDiceDetails[0] == 100 || (vsuccessDegree <= 0 && pDiceDetails[0]%11 == 0)) {
						vsuccessDegree = -1; //crit F
					}
					break;
				case "CritMethod-d100CoC7e":
					let vCritFailureValue = 100;
					
					if ((pDiceDetails[0] / pRollresult) < 50) {
						vCritFailureValue = 96; //increase crit fail because of low skill value
					}
				
					//normal results
					switch (pDC) {
						case 0: //failure required
							vsuccessDegree = Number(pDiceDetails[0] < vCritFailureValue);
						break;
						default:
						case 1: //success required
							vsuccessDegree = Number(pRollresult <= 1);
						break;
						case 2: //difficult success required
							vsuccessDegree = Number(pRollresult <= 0.5);
						break;
						case 3: //extreme success required
							vsuccessDegree = Number(pRollresult <= 0.2);
						break;
						case 4: //critical success required
							vsuccessDegree = Number(pDiceDetails[0] == 1);
						break;
					}
					
					if (pDiceDetails[0] == 1) {
						vsuccessDegree = 2; //crit S
					}
					
					if (pDiceDetails[0] >= vCritFailureValue) {
						vsuccessDegree = -1; //crit F
					}
					
					break;
				case "CritMethod-d10poolCoD2e":
					let vPoolSuccesses = pRollresult;
					
					let vRerollLimit = 10; //find way to alter
					
					if (pInfos.hasOwnProperty("RollType")) {
						vRerollLimit = LnKFlags.RollOptions(pCharacter, pInfos.RollType, "d10CritLimit", vRerollLimit);
					}
					
					let vRerollsCount = pDiceDetails.filter(vRollResult => vRollResult >= vRerollLimit).length;	

					let vReroll;
					
					let vDieRolls;
					
					do {
						vReroll = new Roll(vRerollsCount+"d10cs>=8");
						
						await vReroll.evaluate();
						
						vPoolSuccesses = vPoolSuccesses + vReroll.total;
						
						vDieRolls = vReroll.dice[0]?.results?.map(vDie => vDie.result);
						
						vRerollsCount = vDieRolls.filter(vRollResult => vRollResult >= vRerollLimit);
					} while (vRerollsCount > 0);
					
					vsuccessDegree = Number(vPoolSuccesses >= pDC);
					break;
				case "CritMethod-3d20DSA":
					if (pDiceDetails.filter(vdice => vdice == 1).length >= 2) {
						vsuccessDegree = 2; //crit S
					}
					
					if (pDiceDetails.filter(vdice => vdice == 20).length >= 2) {
						vsuccessDegree = -1;//crit F
					}
					break;
			}
		}
		
		vsuccessDegree = Math.min(2, Math.max(-1, vsuccessDegree)); //make sure vsuccessDegree is in [-1, 2]
		pInfos.outcome = vsuccessDegree;
		
		return vsuccessDegree;
	}
	
	static createroll(pFormula, pActor, pDC) {
		let vSkills = LnKSystemutils.skillitems(pActor);
		
		let vRoll = new Roll(LnKutils.validChars(pFormula), {actor : pActor, skills : vSkills, DC : pDC});
		
		return vRoll;
	}
	
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
	
	static async AverageResult(pFormula, pActor) {
		if (pFormula == "") {
			//catch empty formulas
			return 0;
		}
		
		let vFormula = Roll.replaceFormulaData(pFormula, {actor : pActor, skills : LnKSystemutils.skillitems(pActor)});
		
		if (vFormula.includes("d") || vFormula.includes("D")) {
			//Dice are used, simulate multiple times
			return (await Roll.simulate(vFormula, cSimCount)).reduce((va, vb) => {return va + vb})/cSimCount;
		}
		else {
			//no Dice used => deterministic
			return (await Roll.simulate(vFormula, cSimCount))[0];
		}
	}
	
	static async HighestExpectedRollID(pRolls, pActor) {
		if (pRolls.length = 1) {
			//no comparison necessary
			return 0;
		}
		
		let vID = 0;
		let vHighest = 0;
		let vCurrent;
		
		for (let i = 0; i < pRolls.length; i++) {
			//simulate all rolls and save if highest yet
			vCurrent = await LnKutils.AverageResult(pRolls[i], pActor);
			
			if (vCurrent > vHighest) {
				vHighest = vCurrent;
				
				vID = i;
			}
		}
		
		return vID;
	}
	
	static validChars(pstring) {
		return pstring.replace(/[^\x00-\x7F]/g, "");
	}
	
	static diceResults(pRoll) {
		let vResults = [];
		
		for (let i = 0; i < pRoll.dice.length; i++) {
			vResults = vResults.concat(pRoll.dice[i]?.results.map(vDie => vDie?.result));	
		}
		
		return vResults.filter(vDie => vDie != undefined);
	}
	
	//keyboard
	static KeyisDown(pKeyName, pnoKeyvalid = false) {
		if (game.keybindings.bindings.get(cModuleName + "." + pKeyName).length > 0) {
			return Boolean(game.keybindings.get(cModuleName, pKeyName).find(vKey => keyboard.downKeys.has(vKey.key)));
		}
		
		return Boolean(pnoKeyvalid);
	}
}

export { Translate, TranslateClean, LnKutils }
