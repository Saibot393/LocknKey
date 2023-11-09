import {cModuleName} from "../utils/LnKutils.js";
import {LnKFlags} from "../helpers/LnKFlags.js";
import {openTIWindowfor as openTIWindowforRAW} from "../helpers/LnKTakeInventory.js";

function openTIWindowfor (pUserID, pInventoryOwner, pOptions = {customHeader : "", TakerID : ""}) {
	let vInventoryOwner = pInventoryOwner;
	
	if (vInventoryOwner?.document) {
		vInventoryOwner = vInventoryOwner.document;
	}
	
	openTIWindowforRAW(pUserID, pInventoryOwner, pOptions);
}

Hooks.once("init", () => {
	game.modules.get(cModuleName).api = {
		LnKFlags,
		openTIWindowfor
	}
});