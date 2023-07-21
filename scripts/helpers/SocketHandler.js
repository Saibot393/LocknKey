import { cModuleName } from "../utils/LnKutils.js";
import { LockuseRequest } from "../LockManager.js";
import { PopUpRequest } from "./LnKPopups.js";
import { PlaySoundRequest } from "./LnKSound.js";

//execute functions with pData depending on pFunction
function organiseSocketEvents({pFunction, pData} = {}) {
	switch(pFunction) {
		case "LockuseRequest":
			LockuseRequest(pData);
			break;
		case "PopUpRequest":
			PopUpRequest(pData);
			break;
		case "PlaySoundRequest":
			PlaySoundRequest(pData);
	}
}

Hooks.once("ready", () => { game.socket.on("module."+cModuleName, organiseSocketEvents); });