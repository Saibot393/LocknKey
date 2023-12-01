import { cModuleName} from "../utils/LnKutils.js";
import {LnKSystemutils} from "../utils/LnKSystemutils.js";

class LnKRollHandler {
	//DECLARATIONS
	static async onChatMessage(pMessage, pInfos, pSenderID) {} //called when a chatmessage is created
	
	//IMPLEMENTATIONS
	static async onChatMessage(pMessage, pInfos, pSenderID) {
		if (game.userId == pSenderID) {
			let vActorID = "";
			
			let pRollInfos = {};

			if (pMessage.actor) {
				vActorID = pMessage.actor.id;
			}
			else {
				if (pMessage.speaker) {
					vActorID = pMessage.speaker.actor;
				}
			}

			if (LnKSystemutils.isSystemPerceptionRoll(pMessage, pRollInfos)) {
				Hooks.call(cModuleName + ".PerceptionRoll", vActorID, pMessage.rolls[0], pSenderID);
			}
		}
	}
}

Hooks.once("ready", function() {
	Hooks.on("createChatMessage", (pMessage, pInfos, pSenderID) => {LnKRollHandler.onChatMessage(pMessage, pInfos, pSenderID)});
});

