import * as FCore from "../CoreVersionComp.js";
import { LnKCompUtils, cArmReach, cArmReachold } from "../compatibility/LnKCompUtils.js";
import { LnKSystemutils, cPf2eLoottype, cLockTypeLootPf2e } from "./LnKSystemutils.js";
import { LnKFLags } from "../helpers/LnKFLags.js";

//CONSTANTS
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
const cLUFreeCircumvent = "LockuseFree"; //if a lock gets circumvented via e.g. a knock spell

export {cModuleName, cDelimiter, cPopUpID, cLockTypeDoor, cLockTypeLootPf2e, cLUisGM, cLUuseKey, cLUusePasskey, cLUpickLock, cLUbreakLock, cLUFreeCircumvent}


var vlastSearchedItemtype; //Saves the last item type for which a path was searched
var vlastItempath; //Saves the last path that was found for lastSearchedItemtype

class LnKRollutils {
	//DELCARATIONS		
	
	//rolls
	static beatsDC(pRollresult, pDC) {} //returns if pRollresult beats pDC
	
	static async successDegree(pRollresult, pDiceDetails, pDC, pCharacter, pInfos = {}) {} //returns the degree of success of pRollresult and pRolldetails based on the pDC and the world crit settings
	
	static LPformulaWorld() {} //returns the worlds formula used for Lock picking rolls
	
	static LBformulaWorld() {} //returns the worlds formula used for Lock breaking rolls
	
	static formulaWorld(pType) {} //returns the worlds formula used for pType [cLUpickLock, cLUbreakLock]
	
	static StitchFormula(pFormulaA, pFormulaB) {} //stitches two roll formulsa together and returns the stitchedresult
	
	static StitchFormulas(pFormulas) {} //stitches an array of roll formulas together and returns the stitchedresult
	
	static async AverageResult(pFormula, pData = {}) {} //returns the average result of Roll formula pFormula
	
	static async HighestExpectedRollID(pRolls, pData = {}) {} //takes an array of rolls and returs the id of the highest expected roll result
	
	//IMPLEMENTATIONS
	
	//rolls
	static beatsDC(pRollresult, pDC) {
		return pRollresult >= pDC;
	}
	
	static async successDegree(pRollresult, pDiceDetails, pDC, pCharacter, pInfos = {}) {
		
		let vsuccessDegree;
		
		if (pDC == Infinity) {
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
			default:
				vsuccessDegree = Number(pRollresult >= pDC); //F || S
				break;
		}
		
		//crit
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
					vRerollLimit = LnKFlags.RollOptions(pCharacter, pInfos.RollType, d10CritLimit, vRerollLimit);
				}
				
				console.log(vRerollLimit);
				
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
				return LnKRollutils.LPformulaWorld();
				break;
			case cLUbreakLock:
				return LnKRollutils.LBformulaWorld();
				break;
			default:
				return "";
				break;
		}
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
			vFormula = LnKRollutils.StitchFormula(vFormula, pFormulas[i]);
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
			vCurrent = await LnKRollutils.AverageResult(pRolls[i], pData);
			
			if (vCurrent > vHighest) {
				vHighest = vCurrent;
				
				vID = i;
			}
		}
		
		return vID;
	}
}

export { LnKRollutils }