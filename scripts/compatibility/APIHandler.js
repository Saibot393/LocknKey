import {cModuleName} from "../utils/LnKutils.js";
import {LnKFlags} from "../helpers/LnKFlags.js";
import {openTIWindowfor as openTIWindowforRAW} from "../helpers/LnKTakeInventory.js";
import {TransferItems} from "../helpers/LnKTakeInventory.js";
import { LnKutils } from "../utils/LnKutils.js";

function openTIWindowfor (pUserID, pInventoryOwner, pOptions = {customHeader : "", TakerID : ""}) {
	let vInventoryOwner = pInventoryOwner;
	
	if (vInventoryOwner?.document) {
		vInventoryOwner = vInventoryOwner.document;
	}
	
	openTIWindowforRAW(pUserID, pInventoryOwner, pOptions);
}

async function CheckActorPTokensCompatibility() { //checks the prototype tokens of all actors for LnK compatibility and sets the lockability of incomaptible ones to false
	let vActorPTokens = game.actors.map(vActor => vActor.prototypeToken);
	
	for (let i = 0; i < vActorPTokens.length; i++) {
		if (vActorPTokens[i] && !(await LnKutils.isLockCompatible(vActorPTokens[i]))) {
			if (vActorPTokens[i].flags[cModuleName]?.LockableFLag) {
				//make not lockable
				vActorPTokens[i].setFlag(cModuleName, "LockableFLag", false);
			}
			
			if (vActorPTokens[i].flags[cModuleName]?.LockedFlag) {
				//make not locked
				vActorPTokens[i].setFlag(cModuleName, "LockedFlag", false);
			}
			
		}
	}
}

Hooks.once("init", () => {
	game.modules.get(cModuleName).api = {
		LnKFlags,
		openTIWindowfor,
		TransferItems,
		CheckActorPTokensCompatibility
	}
});