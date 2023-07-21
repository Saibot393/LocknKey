import { cModuleName } from "../utils/LnKutils.js";
import { LnKutils } from "../utils/LnKutils.js";

const cDelimiter = ";";

//Flag names
const cIDKeysF = "IDKeysFlag"; //saves the connection IDs for Locks and Key
const cLockableF = "LockableFlag"; //if this token is LockableFlag
const cLockedF = "LockedFlag"; //if this Lock is currently Locked

export { cIDKeysF, cLockableF, cLockedF }

//buffers
var cIDKeyBuffer; //saves the coppied IDkeys

class LnKFlags {
	//DECLARATIONS
	//basic
	static async MackeLockable(pObject) {} //makes pObject Lockable (starts in unlocked state)
	
	static async setLockedstate(pObject, pState) {} //sets pObject Locked state to pState (if pObject is Lockable)
	
	static async invertLockedstate(pObject) {} //inverts pObject Locked state (if pObject is Lockable)
	
	static isLockable(pObject) {} //returns if the object is already made Lockable
	
	static isLocked(pObject) {} //returns if pObject is locked (false if not Lockable)
	
	static linkKeyLock(pKey, pLock) {} //gives pKey(item) and pLock(wall or token) both the same new Key ID
	
	static matchingIDKeys(pObject1, pObject2) {} //returns of pObject1 and pObject2 have at least one matching key (excluding "")
	
	static KeyIDs(pObject) {} //returns string of key IDs of pObject
	
	//copy paste
	static copyIDKeys(pObject) {} //copies the ID keys of pObject and saves them
	
	static pasteIDKeys(pObject) {} //pastes the saved ID keys (if any) into the pObject
	
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
	//returns content of LockableFlag of pObject (if any) (array of IDs)
		let vFlag = this.#LnKFlags(pObject);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cLockableF)) {
				return vFlag.LockableFlag;
			}
		}
		
		return false; //default if anything fails
	} 
	
	static #LockedFlag (pObject) { 
	//returns content of Locked of pObject (if any) (array of IDs)
		let vFlag = this.#LnKFlags(pObject);
		
		if (vFlag) {
			if (vFlag.hasOwnProperty(cLockedF)) {
				return vFlag.LockedFlag;
			}
		}
		
		return false; //default if anything fails
	} 
	
	static async #setIDKeysFlag (pObject, pContent) {
	//sets content of IDKeysFlag (must be array of IDs)
		if (pObject) {
			if (typeof pContent == "string") {
				let vBuffer = pContent;
				
				//add delimiter to end
				if (vBuffer.length && (vBuffer[vBuffer.length-1] != cDelimiter)) {
					vBuffer = vBuffer + cDelimiter;
				}
				
				await pObject.setFlag(cModuleName, cIDKeysF, vBuffer);
				
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
	
	//basic
	static async MackeLockable(pObject) {
		if (!this.#LockableFlag(pObject)) {
			//only change anything if not already lockable
			this.#setLockableFlag(pObject, true);
			
			this.#setLockedFlag(pObject, game.settings.get(cModuleName, "startasLocked"));
		}
	}
	
	static async setLockedstate(pObject, pState) {
		if (this.#LockableFlag(pObject)) {
			this.#setLockedFlag(pObject, pState);
		}
	}
	
	static async invertLockedstate(pObject) {
		if (this.#LockableFlag(pObject)) {
			await this.#setLockedFlag(pObject, !this.#LockedFlag(pObject));
		}
	}
	
	static isLockable(pObject) {
		return this.#LockableFlag(pObject);
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
	
	//copy paste
	static copyIDKeys(pObject) {
		cIDKeyBuffer = this.#IDKeysFlag(pObject);
	}
	
	static pasteIDKeys(pObject) {
		if (cIDKeyBuffer.length) {
			this.#addIDKeysFlag(pObject, cIDKeyBuffer);
		}
	}
}

//export LnKFlags
export { LnKFlags }