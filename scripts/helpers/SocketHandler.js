import { cModuleName } from "../utils/LnKutils.js";
import { LockuseRequest, LockonCloseRequest } from "../LockManager.js";
import { PopUpRequest } from "./LnKPopups.js";
import { PlaySoundRequest } from "./LnKSound.js";
import { TriggerTilerequest } from "../compatibility/LnKCompatibility.js";
import { ItemTransferRequest, TIWindowRequest } from "./LnKTakeInventory.js";
import { PickPocketRequest } from "../PickPocketManager.js";

//execute functions with pData depending on pFunction
function organiseSocketEvents({pFunction, pData} = {}) {
	switch(pFunction) {
		case "LockuseRequest":
			LockuseRequest(pData);
			break;
		case "LockonCloseRequest":
			LockonCloseRequest(pData);
		case "PopUpRequest":
			PopUpRequest(pData);
			break;
		case "PlaySoundRequest":
			PlaySoundRequest(pData);
			break;
		case "TriggerTilerequest":
			TriggerTilerequest(pData);
			break;
		case "TIWindowRequest":
			TIWindowRequest(pData);
			break;
		case "ItemTransferRequest":
			ItemTransferRequest(pData);
			break;
		case "PickPocketRequest":
			PickPocketRequest(pData);
			break;
	}
}

Hooks.once("ready", () => { game.socket.on("module."+cModuleName, organiseSocketEvents); });