import { LnKutils, cModuleName, cPopUpID, Translate } from "../utils/LnKutils.js";

class LnKPopups {
	//DECLARATIONS
	static TextPopUp(pObject, pText, pWords = {}) {} //show pText over pObject and replaces {pWord} with matching vWord in pWords
	
	static TextPopUpID(pObject, pID, pWords = {}) {} //show pText over pObject and replaces {pWord} with matching vWord in pWords
	
	static PopUpRequest(pObjectID, pText) {} //handels socket calls for pop up texts
	
	//IMPLEMENTATIONS
	static TextPopUp(pObject, pText, pWords = {}) {
		let vText = pText;
		
		for (let vWord of Object.keys(pWords)) {
			vText = vText.replace("{" + vWord + "}", pWords[vWord]);
		}
		
		//other clients pop up
		game.socket.emit("module."+cModuleName, {pFunction : "PopUpRequest", pData : {pObjectID: pObject.id, pText : vText}});
		
		//own pop up
		LnKPopups.PopUpRequest(pObject.id, vText);
	}
	
	static TextPopUpID(pObject, pID, pWords = {}) {
		LnKPopups.TextPopUp(pObject, Translate(cPopUpID+"."+pID), pWords)
	} 
	
	static PopUpRequest(pObjectID, pText) {
		if (game.settings.get(cModuleName, "MessagePopUps")) {
			//only relevant if token is on current canves, no scene necessary
			let vObject = LnKutils.LockfromID(pObjectID); 
			
			if (vObject) {
				canvas.interface.createScrollingText(vObject.object, pText, {x: vObject.x, y: vObject.y, text: pText, anchor: CONST.TEXT_ANCHOR_POINTS.TOP, fill: "#FFFFFF", stroke: "#000000"});
			}
		}
	}
}

//export Popups
function PopUpRequest({ pObjectID, pText } = {}) { return LnKPopups.PopUpRequest(pObjectID, pText); }

export { LnKPopups, PopUpRequest }