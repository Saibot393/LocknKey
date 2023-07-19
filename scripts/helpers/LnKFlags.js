import { cModuleName } from "../utils/LnKutils.js";

const cDelimiter = ";";

//Flag names
const cIDKeysF = "IDKeysFlag"; //saves the connection IDs for Locks and Key

class LnKFlags {
	//DECLARATIONS
	//basic
	static linkKeyLock(pKey, pLock) {} //gives pKey(item) and pLock(wall or token) both the same new Key ID
	
	static IDKeys(pObject) {} //returns an array containing the ID keys of pObject
	
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
				let vBuffer = this.#IDKeysFlag(pObject);
				
				//add delimiter to end
				if (vBuffer.length && (vBuffer[vBuffer.length-1] != cDelimiter)) {
					vBuffer = vBuffer + cDelimiter;
				}	
				
				await this.#setIDKeysFlag(pObject, vBuffer + pContent);
				
				return true;
			}
		}
		return false;
	} 
	
	//basic
	static linkKeyLock(pKey, pLock) {
		let vnewID = randomID();
		
		this.#addIDKeysFlag(pKey, vnewID);
		
		this.#addIDKeysFlag(pLock, vnewID);
	}
	
	static IDKeys(pObject) {
		return this.#IDKeysFlag(pObject).split(cDelimiter);
	}
}

//export LnKFlags
export { LnKFlags }