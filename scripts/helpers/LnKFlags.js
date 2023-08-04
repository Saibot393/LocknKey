import { cModuleName } from "../utils/LnKutils.js";
import { LnKutils, cLUpickLock, cLUbreakLock } from "../utils/LnKutils.js";

const cDelimiter = ";";

//Flag names
const cIDKeysF = "IDKeysFlag"; //saves the connection IDs for Locks and Key
const cLockableF = "LockableFlag"; //if this token is LockableFlag
const cLockedF = "LockedFlag"; //if this Lock is currently Locked
const cLockDCF = "LockDCFlag"; //the dc of the lock (for lock picking)
const cLPFormulaF = "LPFormulaFlag"; //the Formula the token/item adds to LockPick rolls
const cLPFormulaOverrideF = "LPFormulaOverrideFlag"; //if this objects LPFormulaFlag overrides the global formula (instead of being added)
const crequiredLPsuccessF = "requiredLPsuccessFlag"; //successes required to pick this lock
const ccurrentLPsuccessF = "currentLPsuccessFlag"; //successes alraedy put into picking this lock
const cLockBreakDCF = "LockBreakDCFlag"; //the dc of the lock (for lock picking)
const cLBFormulaF = "LBFormulaFlag"; //the Formula the token/item adds to LockBreak rolls
const cLBFormulaOverrideF = "LBFormulaOverrideFlag"; //if this objects LBFormulaFlag overrides the global formula (instead of being added)
const cRemoveKeyonUseF = "RemoveKeyonUseFlag"; //if this key is removed on use
const cPasskeysF = "PasskeysFlag"; //the passkeys compatible with this lock
const cCustomPopupsF = "CustomPopupsFlag"; //Flag to store the custom popups
const cSoundVariantF = "SoundVariantFlag"; //FLag for tokens which sound should play for locking
const cLockjammedF = "LockjammedFlag"; //FLag wether lock is jammed

export { cIDKeysF, cLockableF, cLockedF, cLockDCF, cLPFormulaF, cLPFormulaOverrideF, cLockBreakDCF, cLBFormulaF, cLBFormulaOverrideF, crequiredLPsuccessF, ccurrentLPsuccessF, cRemoveKeyonUseF, cPasskeysF, cCustomPopupsF, cSoundVariantF, cLockjammedF }

const cCustomPopup = { //all Custompopups and their IDs
	LockLocked : 0,
	LocknotPickable : 1,
	LocknotBreakable : 2,
	LockPasskeyTitle : 3
};

export { cCustomPopup };

//buffers
var cIDKeyBuffer; //saves the coppied IDkeys

class LnKFlags {
	//DECLARATIONS
	//basic
	static async makeLockable(pObject) {} //makes pObject Lockable (starts in unlocked state except for doors)
	
	static async disableLock(pObject) {} //makes pObject not Lockable
	
	static async setLockedstate(pObject, pState) {} //sets pObject Locked state to pState (if pObject is Lockable)
	
	static async invertLockedstate(pObject) {} //inverts pObject Locked state (if pObject is Lockable)
	
	static isLockable(pObject) {} //returns if the object is already made Lockable
		
	static isLocked(pObject) {} //returns if pObject is locked (false if not Lockable)
	
	static linkKeyLock(pKey, pLock) {} //gives pKey(item) and pLock(wall or token) both the same new Key ID
	
	static matchingIDKeys(pObject1, pObject2) {} //returns of pObject1 and pObject2 have at least one matching key (excluding "")
	
	static KeyIDs(pObject) {} //returns string of key IDs of pObject
	
	static RemoveKeyonUse(pKey) {} //returns of this key is removed on use
	
	//Passkeys
	static PassKeys(pObject) {} //returns string of Passkeys of pObject
	
	static HasPasskey(pObject) {} //if pObject has a Passkey
	
	static MatchingPasskey(pObject, Passkey) {} //if Passkey matches pObject
	
	//copy paste
	static copyIDKeys(pObject) {} //copies the ID keys of pObject and saves them
	
	static pasteIDKeys(pObject) {} //pastes the saved ID keys (if any) into the pObject
	
	//Lock dc
	static LockDC(pLock, praw = false) {} //returns the LockDC of pLock (return Infinity should DC<0 if not praw)
	
	static LockBreakDC(pLock, praw = false) {} //returns the LockBreakDC of pLock (return Infinity should DC<0 if not praw)
	
	static LockDCtype(pLock, pType, praw = false) {} //returns the DC of pLock of pType [cLUpickLock, cLUbreakLock] (return Infinity should DC<0 if not praw)
	
	static JamLock(pLock) {} //sets pLock Lockpick DC to unpickable value (-1)
	
	static Lockisjammed(pLock) {} //if this Lock is jammed
	
	//Lock progress
	static requiredLPsuccess(pLock) {} //returns the required LP successes of this lock
	
	static currentLPsuccess(pLock) {} //returns the current LP successes of this lock
	
	static async changeLockPicksuccesses(pObject, pdelta) {} //changes the locks current successes by pdelta and returns true if this was enough to change locked state
	
	//Formulas
	static LPFormula(pObject) {} //returns the Tokens/Items Lock Pick Formula
	
	static HasLPFormula(pObject) {} //returns if the Token/Item has a Lock Pick Formula
	
	static LPFormulaOverride(pObject) {} //if this objects LP formula overrides the global formula
	
	static LBFormula(pObject) {} //returns the Tokens/Items Lock Break Formula
	
	static HasLBFormula(pObject) {} //returns if the Token/Item has a Lock Break Formula
	
	static LBFormulaOverride(pObject) {} //if this objects LB formula overrides the global formula
	
	static Formula(pObject, pType) {} //returns the Tokens/Items Formula for pTpye [cLUpickLock, cLUbreakLock]
	
	static HasFormula(pObject, pType) {} //returns if the Token/Item has a Formula for pTpye [cLUpickLock, cLUbreakLock]
	
	static FormulaOverride(pObject, pType) {} //if this objects Formula for pTpye [cLUpickLock, cLUbreakLock] overrides the global formula
	
	//popups
	static setCustomPopups(pObject, pPopups) {} //set the custom popups of pObject to pPopups
	
	static getCustomPopups(pObject, pID = "") {} //get the custom Popups of pObject (or a specific element where pID can be the numerical value (see cCustomPopup) or the Key)
	
	static CustomPopupsKeys() {} //returns all Custompopups Keys sorted by their IDs
	
	//sounds
	static SoundVariant(pObject) {} //returns sound variant for this token
	
	//IMPLEMENTATIONS
	
	//flags handling support	
	static #LnKFlags (pObject) {	
	//returns all Module Flags of pObject (if any)
		if (pObject) {
			if (pObject.flags.hasOwnProperty(cModuleName)) {
				return pObject.flags.LocknKey;
			}
		}
		
		return; //if anything fails
	} 
	
	static #IDKeysFlag (pObject) { 
	//returns content of ID keys flag of pObject (if any) (array of IDs)
		let vFlag = this.#LnKFlags(pObject);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cIDKeysF)) {
				return vFlag.IDKeysFlag;
			}
		}
		
		return ""; //default if anything fails
	} 
	
	static #LockableFlag (pObject) { 
	//returns content of LockableFlag of pObject (if any) (Boolean)
		let vFlag = this.#LnKFlags(pObject);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cLockableF)) {
				return vFlag.LockableFlag;
			}
		}
		
		return (false || LnKutils.isWall(pObject)); //default if anything fails (walls are Lockable by default)
	} 
	
	static #LockedFlag (pObject) { 
	//returns content of Locked of pObject (if any) (Boolean)
		let vFlag = this.#LnKFlags(pObject);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cLockedF)) {
				return vFlag.LockedFlag;
			}
		}
		
		return false; //default if anything fails
	} 
	
	static #LockDCFlag (pObject) { 
	//returns content of LockDC of pObject (if any) (Number)
		let vFlag = this.#LnKFlags(pObject);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cLockDCF)) {
				return vFlag.LockDCFlag;
			}
		}
		
		return -1; //default if anything fails
	} 
	
	static #LPFormulaFlag (pObject) { 
	//returns content of LPFormula of pObject (if any) (string)
		let vFlag = this.#LnKFlags(pObject);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cLPFormulaF)) {
				return vFlag.LPFormulaFlag;
			}
		}
		
		return ""; //default if anything fails
	} 
	
	static #LPFormulaOverrideFlag (pObject) { 
	//returns content of LPFormulaOverrideFlag of pObject (if any) (Boolean)
		let vFlag = this.#LnKFlags(pObject);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cLPFormulaOverrideF)) {
				return vFlag.LPFormulaOverrideFlag;
			}
		}
		
		return false; //default if anything fails
	} 
	
	static #requiredLPsuccessFlag (pObject) { 
	//returns content of requiredLPsuccessFlag of pObject (if any) (number)
		let vFlag = this.#LnKFlags(pObject);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(crequiredLPsuccessF)) {
				return vFlag.requiredLPsuccessFlag;
			}
		}
		
		return 1; //default if anything fails
	} 
	
	static #currentLPsuccessFlag (pObject) { 
	//returns content of currentLPsuccessFlag of pObject (if any) (number)
		let vFlag = this.#LnKFlags(pObject);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(ccurrentLPsuccessF)) {
				return vFlag.currentLPsuccessFlag;
			}
		}
		
		return 0; //default if anything fails
	} 
	
	static #LockBreakDCFlag (pObject) { 
	//returns content of LockBreakDC of pObject (if any) (Number)
		let vFlag = this.#LnKFlags(pObject);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cLockBreakDCF)) {
				return vFlag.LockBreakDCFlag;
			}
		}
		
		return -1; //default if anything fails
	}
	
	static #LBFormulaFlag (pObject) { 
	//returns content of LBFormula of pObject (if any) (string)
		let vFlag = this.#LnKFlags(pObject);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cLBFormulaF)) {
				return vFlag.LBFormulaFlag;
			}
		}
		
		return ""; //default if anything fails
	} 
	
	static #LBFormulaOverrideFlag (pObject) { 
	//returns content of LBFormulaOverrideFlag of pObject (if any) (Boolean)
		let vFlag = this.#LnKFlags(pObject);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cLBFormulaOverrideF)) {
				return vFlag.LBFormulaOverrideFlag;
			}
		}
		
		return false; //default if anything fails
	} 
	
	static #RemoveKeyonUseFlag (pObject) { 
	//returns content of RemoveKeyonUseFlag (Boolean)
		let vFlag = this.#LnKFlags(pObject);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cRemoveKeyonUseF)) {
				return vFlag.RemoveKeyonUseFlag;
			}
		}
		
		return false; //default if anything fails
	} 
	
	static #PasskeysFlag (pObject) { 
	//returns content of Passkeys flag of pObject (if any) (collection of IDs)
		let vFlag = this.#LnKFlags(pObject);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cPasskeysF)) {
				return vFlag.PasskeysFlag;
			}
		}
		
		return ""; //default if anything fails
	} 
	
	static #CustomPopupsFlag (pObject) { 
	//returns content of CustomPopups Flag of pObject (if any) (array of srtings)
		let vFlag = this.#LnKFlags(pObject);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cCustomPopupsF)) {
				return vFlag.CustomPopupsFlag;
			}
		}
		
		let vZeroResult = {};
		
		for (let vKey of LnKFlags.CustomPopupsKeys()) {
			vZeroResult[vKey] == "";
		}
		
		return vZeroResult; //default if anything fails
	} 
	
	static #SoundVariantFlag (pObject) { 
	//returns content of SoundVariantFlag of pObject (if any) (string)
		let vFlag = this.#LnKFlags(pObject);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cSoundVariantF)) {
				return vFlag.SoundVariantFlag;
			}
		}
		
		return "wood"; //default if anything fails
	} 
	
	static #LockjammedFlag (pObject) { 
	//returns content of LockjammedFlag of pObject (if any) (Boolean)
		let vFlag = this.#LnKFlags(pObject);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cLockjammedF)) {
				return vFlag.LockjammedFlag;
			}
		}
		
		return false; //default if anything fails
	} 
	
	static async #setIDKeysFlag (pObject, pContent) {
	//sets content of IDKeysFlag (must be array of IDs)
		if (pObject) {
			if (typeof pContent == "string") {
				let vBuffer = pContent.split(cDelimiter).filter(vElement => vElement.length); //remove empty elements
				
				await pObject.setFlag(cModuleName, cIDKeysF, vBuffer.join(cDelimiter)); 
				
				return true;
			}
		}
		return false;
	} 
	
	static async #addIDKeysFlag (pObject, pContent) {
	//sets content of IDKeysFlag (must be a IDs)
		if (pObject) {
			if (typeof pContent == "string") {
				let vBuffer = this.#IDKeysFlag(pObject).split(cDelimiter);
				
				//concat new and old key, prevent clones
				vBuffer = vBuffer.concat(pContent.split(cDelimiter).filter(vElement => !vBuffer.includes(vElement)));
				
				await this.#setIDKeysFlag(pObject, vBuffer.join(cDelimiter));
				
				return true;
			}
		}
		return false;
	}  
	
	static async #setLockableFlag(pObject, pContent) {
	//sets content of LockableFlag (must be boolean)
		if (pObject) {
			await pObject.setFlag(cModuleName, cLockableF, Boolean(pContent));
			
			return true;
		}
		return false;		
	}
	
	static async #setLockedFlag(pObject, pContent) {
	//sets content of LockedFlag (must be boolean)
		if (pObject) {
			await pObject.setFlag(cModuleName, cLockedF, Boolean(pContent));
			
			return true;
		}
		return false;		
	}
	
	static async #setLockDCFlag(pObject, pContent) {
	//sets content of LockDCFlag (must be number)
		if (pObject) {
			await pObject.setFlag(cModuleName, cLockDCF, Number(pContent));
			
			return true;
		}
		return false;		
	}
	
	static async #setcurrentLPsuccessFlag(pObject, pContent) {
	//sets content of currentLPsuccessFlag (must be number)
		if (pObject) {
			await pObject.setFlag(cModuleName, ccurrentLPsuccessF, Number(pContent));
			
			return true;
		}
		return false;		
	}
	
	static async #setCustomPopupsFlag(pObject, pContent) {
	//sets content of CustomPopupsFlag (must be number)
		if (pObject && typeof pContent == "object") {
			await pObject.setFlag(cModuleName, cCustomPopupsF, pContent);
			
			return true;
		}
		return false;			
	}
	
	static async #setLockjammedFlag(pObject, pContent) {
	//sets content of Lockjammed flag (must be boolean)
		if (pObject) {
			await pObject.setFlag(cModuleName, cLockjammedF, Boolean(pContent));
			
			return true;
		}
		return false;		
	}
	
	//basic
	static async makeLockable(pObject) {
		if (!this.#LockableFlag(pObject)) {
			//only change anything if not already lockable
			await this.#setLockableFlag(pObject, true);
			
			await this.#setLockedFlag(pObject, game.settings.get(cModuleName, "startasLocked"));
		}
	}
	
	static async disableLock(pObject) {
		if (this.#LockableFlag(pObject)) {
			//only change anything if not already lockable
			await this.#setLockableFlag(pObject, false);
			
			await this.#setLockedFlag(pObject, false);
		}		
	}
		
	static async setLockedstate(pObject, pState) {
		if (this.#LockableFlag(pObject)) {
			await this.#setLockedFlag(pObject, pState);
		}
	}
	
	static async invertLockedstate(pObject) {
		if (this.#LockableFlag(pObject)) {
			await this.#setLockedFlag(pObject, !this.#LockedFlag(pObject));
		}
	}
	
	static isLockable(pObject) {	
		return this.#LockableFlag(pObject) && LnKutils.isLockCompatible(pObject);
	}
	
	static isLocked(pObject) {		
		return (this.#LockableFlag(pObject) && this.#LockedFlag(pObject))
	}
	
	static linkKeyLock(pKey, pLock) {
		let vnewID = randomID();
		
		this.#addIDKeysFlag(pKey, vnewID);
		
		this.#addIDKeysFlag(pLock, vnewID);
	}
	
	static matchingIDKeys(pObject1, pObject2) {		
		return Boolean(LnKutils.Intersection(this.#IDKeysFlag(pObject1).split(cDelimiter), this.#IDKeysFlag(pObject2).split(cDelimiter)).length);
	}
	
	static KeyIDs(pObject) {
		return this.#IDKeysFlag(pObject);
	}
	
	static RemoveKeyonUse(pKey) {
		return this.#RemoveKeyonUseFlag(pKey);
	} 
	
	//Passkeys
	static PassKeys(pObject) {
		return this.#PasskeysFlag(pObject);
	}
	
	static HasPasskey(pObject) {
		return (this.#PasskeysFlag(pObject).length > 0);
	}
	
	static MatchingPasskey(pObject, Passkey) {
		if (Passkey.length > 0) {
			//empty Passkey not allowed
			return this.#PasskeysFlag(pObject).split(cDelimiter).includes(Passkey);
		}
		
		return false;
	}
	
	//copy paste
	static copyIDKeys(pObject) {
		cIDKeyBuffer = this.#IDKeysFlag(pObject);
	}
	
	static pasteIDKeys(pObject) {
		if (cIDKeyBuffer.length) {
			this.#addIDKeysFlag(pObject, cIDKeyBuffer);
			
			LnKFlags.makeLockable(pObject);
		}
	}
	
	//Lock dc
	static LockDC(pLock, praw = false) {
		let vDC = this.#LockDCFlag(pLock);
		
		if ((vDC < 0 || LnKFlags.Lockisjammed(pLock)) && !praw) {
			vDC = Infinity;
		}
		
		return vDC;
	}
	
	static LockBreakDC(pLock, praw = false) {
		let vDC = this.#LockBreakDCFlag(pLock);
		
		if (vDC < 0 && !praw) {
			vDC = Infinity;
		}
		
		return vDC;
	}
	
	static LockDCtype(pLock, pType, praw = false) {
		switch (pType) {
			case cLUpickLock:		
				return LnKFlags.LockDC(pLock, praw);
				break;
			case cLUbreakLock:
				return LnKFlags.LockBreakDC(pLock, praw);
				break;
			default:
				return false;
				break;
		}
	}
	
	static JamLock(pLock) {
		this.#setLockjammedFlag(pLock, true);
	}
	
	static Lockisjammed(pLock) {
		return this.#LockjammedFlag(pLock);
	}
	
	//Lock progress
	static requiredLPsuccess(pLock) {
		return this.#requiredLPsuccessFlag(pLock);
	}
	
	static currentLPsuccess(pLock) {
		return this.#currentLPsuccessFlag(pLock);
	}
	
	static async changeLockPicksuccesses(pObject, pdelta) {
		let vToggle = false;
		
		await this.#setcurrentLPsuccessFlag(pObject, await this.#currentLPsuccessFlag(pObject) + pdelta);
		
		if (!LnKutils.useMultiSuccess(pObject) || (await this.#currentLPsuccessFlag(pObject) >= await this.#requiredLPsuccessFlag(pObject))) {
			//success limit reached, reset successes and toggle lock
			await this.#setcurrentLPsuccessFlag(pObject, 0);
			
			if (pdelta > 0) {
				//requires change of at least 1 to toggle (even if required <= 0)
				vToggle = true;
			}
		}
		
		if (await this.#currentLPsuccessFlag(pObject) < 0) {
			//under zero, reset to zero
			await this.#setcurrentLPsuccessFlag(pObject, 0);
		}
			
		return vToggle;
	}
	
	//Formulas
	static LPFormula(pObject) {
		return this.#LPFormulaFlag(pObject);
	}
	
	static HasLPFormula(pObject) {
		return Boolean(this.#LPFormulaFlag(pObject).length)
	}
	
	static LPFormulaOverride(pObject) {
		return this.#LPFormulaOverrideFlag(pObject);
	}
	
	static LBFormula(pObject) {
		return this.#LBFormulaFlag(pObject);
	}
	
	static HasLBFormula(pObject) {
		return Boolean(this.#LBFormulaFlag(pObject).length)
	}
	
	static LBFormulaOverride(pObject) {
		return this.#LBFormulaOverrideFlag(pObject);
	}
	
	static Formula(pObject, pType) {
		switch (pType) {
			case cLUpickLock:		
				return LnKFlags.LPFormula(pObject);
				break;
			case cLUbreakLock:
				return LnKFlags.LBFormula(pObject);
				break;
			default:
				return "";
				break;
		}
	}
	
	static HasFormula(pObject, pType) {
		switch (pType) {
			case cLUpickLock:		
				return LnKFlags.HasLPFormula(pObject);
				break;
			case cLUbreakLock:
				return LnKFlags.HasLBFormula(pObject);
				break;
			default:
				return false;
				break;
		}		
	}
	
	static FormulaOverride(pObject, pType) {
		switch (pType) {
			case cLUpickLock:		
				return LnKFlags.LPFormulaOverride(pObject);
				break;
			case cLUbreakLock:
				return LnKFlags.LBFormulaOverride(pObject);
				break;
			default:
				return false;
				break;
		}			
	}
	
	//popups
	static setCustomPopups(pObject, pPopups) {
		this.#setCustomPopupsFlag(pObject, pPopups)
	}
	
	static getCustomPopups(pObject, pID = "") {
		let vID;
		if ((typeof pID) == "number") {
			vID = LnKFlags.CustomPopupsKeys().find(vKey => cCustomPopup[vKey] == pID);
		}
		else {
			vID = pID;
		}
		
		if ((typeof vID) == "string") {		
			if (vID == "") {
				return this.#CustomPopupsFlag(pObject);
			}
			else {
				if (LnKFlags.CustomPopupsKeys().includes(vID) && this.#CustomPopupsFlag(pObject)[vID] != undefined) {
					return this.#CustomPopupsFlag(pObject)[vID];
				}
				else {
					return "";
				}
			}
		}
		
		return "";
	}
	
	static CustomPopupsKeys() {
		return Object.keys(cCustomPopup).sort(function(va,vb){return cCustomPopup[va] - cCustomPopup[vb]});
	}
	
	//sounds
	static SoundVariant(pObject) {
		return this.#SoundVariantFlag(pObject);
	}
}

//export LnKFlags
export { LnKFlags }