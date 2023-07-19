import { LockuseRequest } from "../LockManager.js";

//execute functions with pData depending on pFunction
function organiseSocketEvents({pFunction, pData} = {}) {
	switch(pFunction) {
		case "LockuseRequest":
			LockuseRequest(pData);
			break;
	}
}

Hooks.once("ready", () => { game.socket.on("module.LocknKey", organiseSocketEvents); });