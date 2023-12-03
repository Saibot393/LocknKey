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

export const API = {
    /**
	 * Method to retrieve the current LnKFlags class object
	 * @returns {LnKFlags} The class LnKFlags
	 */ 
	LnKFlags,
	/**
 	 * Method for open a window for transfer object between actors
	 * @example &lt;caption>Example usage simple.&lt;/caption>
	 * game.modules.get("LocknKey").api.openTIWindowfor(game.user.id, fromUuidSync("Scene.JMHvCf1X886hEmtu.Token.g3XNCCgjGs9H445R"),{});
	 * 
	 * @param {string} pUserID The game user id associated to the actor to whom transfer the item
	 * @param {TokenDocument} pInventoryOwner The token document reference to the actor target (the one ownings the items) 
     * @param {Object} options generic object contains all the options
     * @param {string} [options.customHeader=""]  The custom header to change header of loot inventory (can include HTML)
     * @param {string} [options.TakerID=""]  The taker id to transfer loot to specific token
     * @returns {void}
	 */
    openTIWindowfor(pUserID, pInventoryOwner, pOptions = {customHeader : "", TakerID : ""}) {
		return openTIWindowfor(pUserID, pInventoryOwner, pOptions = {customHeader : "", TakerID : ""});
	},
	/**
	 * Transfers items defined by pItemInfos(array of id, quantity) from pSource to pTarget
	 * @param {TokenDocument} pSource
	 * @param {TokenDocument} pTarget
	 * @param {Object[]} pItemInfos a object with itemid, quantity, isCurrency
	 * @param {string} [pItemInfos[].itemid=""] The id of the item to transfer
	 * @param {number} [pItemInfos[].quantity=null] The quantity of the item to transfer
	 * @param {boolean} [pItemInfos[].isCurrency=false] The flag for check the item has currency
	 * @returns {void}
	 */
    TransferItems(pSource, pTarget, pItemInfos){
		return TransferItems(pSource, pTarget, pItemInfos);
	},
	/**
	 * Method for checks the prototype tokens of all actors for LnK compatibility and sets the lockability of incomaptible ones to false
	 * @returns {Promise<void>}
	 */
    async CheckActorPTokensCompatibility() {
		return await CheckActorPTokensCompatibility();
	},

	/**
	 * Updates the Lock & Key formula world settings with the newest version
	*/
	ResettoStandardFormulas({pLP = true, pLB = true}) {
		return game.LocknKey.ResettoStandardFormulas({pLP, pLB});
	},

	/* ========================= */
	/* GM API */
	/* ========================= */

	/** 
	 * Copy hovered lock
     */
	CopyhoveredLockGM() {
		return game.LocknKey.CopyhoveredLockGM();
	},

	/**
	 * Create new key for hovered lock
	 */
	CreateNewKeyhoveredGM() {
		return game.LocknKey.CreateNewKeyhoveredGM();
	},

	/**
	 * Paste hovered lock
	 */
	PastehoveredLockGM() {
		return game.LocknKey.PastehoveredLockGM();
	},

	/** 
	 * Reset Pick Pocket DC (selected or scene wide) to the default value
	 * @param {TokenDocument} token
	 */
	ResetPickPocketDC(token) {
		return game.modules.get("LocknKey").api.LnKFlags.ResetPickPocketDC(token);
	},

	/**
	 * Toggle hovered lock
	 */
	TogglehoveredLockGM() {
		return game.LocknKey.TogglehoveredLockGM();
	},

	/* ========================= */
	/* PLAYER API */
	/* ========================= */

	/**
	 * Break lock
	 */
	BreakHoveredLock() {
		return game.LocknKey.BreakHoveredLock();
	},

	/** 
	 * Pick lock
	 */
	PickHoveredLock() {
		return game.LocknKey.PickHoveredLock();
	},

	/**
	 * Pick pocket
	 */
	PickPocketHovered() {
		return game.LocknKey.PickPocketHovered();
	},

	/**
	 * Use custom check
	 */
	CustomCheckHoveredLock() {
		return game.LocknKey.CustomCheckHoveredLock();
	},

	/**
	 * Use Key
	 */
	UseKeyonSelectedLock() {
		return game.LocknKey.UseKeyonSelectedLock();
	}
};

Hooks.once("init", () => {
	game.modules.get(cModuleName).api = API;
});
