import { LnKutils, cModuleName, cPopUpID, Translate } from "../utils/LnKutils.js";
import { Geometricutils } from "../utils/Geometricutils.js";

let vQueue = [];

class LnKPopups {
	//DECLARATIONS
	static async TextPopUp(pObject, pText, pWords = {}, pQueue = false) {} //show pText over pObject and replaces {pWord} with matching vWord in pWords
	
	static TextPopUpID(pObject, pID, pWords = {}, pQueue = false) {} //show pText over pObject and replaces {pWord} with matching vWord in pWords
	
	static clearTextPopUpQueue() {}//clears the popup queue
	
	static TextPopUpQueue(pObject) {} //resolves queue by letting displaying all queued popups
	
	static async ExecutePopUp(pObject, pText) {} //executes the popup
	
	static PopUpRequest(pObjectID, pText) {} //handels socket calls for pop up texts
	
	//IMPLEMENTATIONS
	static async TextPopUp(pObject, pText, pWords = {}, pQueue = false) {
		let vText = pText;
		
		if (pText.length) {
			for (let vWord of Object.keys(pWords)) {
				vText = vText.replace("{" + vWord + "}", pWords[vWord]);
			}
			
			if (pQueue) {
				vQueue[vQueue.length] = vText;
			}
			else {	
				LnKPopups.ExecutePopUp(pObject, vText);
				/*
				let vLockType = await LnKutils.Locktype(pObject);
			
				//other clients pop up
				game.socket.emit("module."+cModuleName, {pFunction : "PopUpRequest", pData : {pObjectID: pObject.id, pLockType : vLockType, pText : vText}});
				
				//own pop up
				LnKPopups.PopUpRequest(pObject.id, vLockType, vText);
				*/
			}
		}
	}
	
	static TextPopUpID(pObject, pID, pWords = {}, pQueue = false) {
		LnKPopups.TextPopUp(pObject, Translate(cPopUpID+"."+pID), pWords, pQueue)
	} 
	
	static clearTextPopUpQueue() {
		vQueue = [];
	}
	
	static TextPopUpQueue(pObject) {
		if (vQueue.length > 0) {
			let vCompleteText = "";
			
			for (let i = 0; i < vQueue.length; i++) {
				if (i > 0) {
					vCompleteText = vCompleteText + "\n";
				}
				
				vCompleteText = vCompleteText + vQueue[i];
			}
			
			LnKPopups.clearTextPopUpQueue();
			
			LnKPopups.ExecutePopUp(pObject, vCompleteText);
		}
	}
	
	static async ExecutePopUp(pObject, pText) {
		//let vLockType = await LnKutils.Locktype(pObject);
	
		//other clients pop up
		game.socket.emit("module."+cModuleName, {pFunction : "PopUpRequest", pData : {pObjectID: pObject.uuid, pText : pText, pRequester : game.user.id}});
		
		//own pop up
		LnKPopups.PopUpRequest(pObject.uuid, pText);		
	}
	
	static PopUpRequest(pObjectID, pText, pRequester = game.user.id) {
		if (game.settings.get(cModuleName, "MessagePopUps")) {
			//only relevant if token is on current canves, no scene necessary
			let vObject = fromUuidSync(pObjectID);//LnKutils.LockfromID(pObjectID, pLockType); 
			let vPosition;
			
			if (vObject) {
				vPosition = Geometricutils.ObjectPosition(vObject);

				if (vPosition.filter(vValue => isNaN(vValue)).length) {
					if (pRequester == game.user.id) {
						ui.notifications.info(pText, {console : false});
					}
				}
				else {
					canvas.interface.createScrollingText({x: vPosition[0], y: vPosition[1]}, pText, {anchor: CONST.TEXT_ANCHOR_POINTS.TOP, fill: "#FFFFFF", stroke: "#000000"});
				}
			}
		}
	}
}

//export Popups
function PopUpRequest({ pObjectID, pLockType, pText, pRequester } = {}) { return LnKPopups.PopUpRequest(pObjectID, pText, pRequester); }

export { LnKPopups, PopUpRequest }