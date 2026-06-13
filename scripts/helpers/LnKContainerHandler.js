//temp1.querySelector("li.container")[0].querySelectorAll("a")[0].onclick = (event) => {event.stopPropagation() } //D&D
//temp1.querySelector('ul.items[data-item-types="backpack"]').querySelectorAll("li")[0].querySelector("div.item-name").onclick = (event) => {event.stopPropagation() } //PF2E
//temp2.querySelector('ul.items[data-item-types="backpack"]').querySelectorAll("li")[0].querySelector("div.item-name").children[1].children[0].classList.add("fa-lock")
//temp2.querySelector('ul.items[data-item-types="backpack"]').querySelectorAll("li")[0].querySelector("div.item-name").children[1].children[0].classList.remove("fa-box")

import { cModuleName } from "../utils/LnKutils.js"
import { cDnD5e, cPf2eName } from "../utils/LnKSystemutils.js";

import { LnKFlags } from "../helpers/LnKFlags.js";

import { KeyManager } from "../KeyManager.js";

import { LockManager } from "../LockManager.js";

const cBoxIcon = "fa-box";
const cLockIcon = "fa-lock";

class ContainerHandler {
	//DECLARATIONS
	static onItemPreUpdate(pItem, pChanges) {} //called to make sure settings a synched correctly
	
	static registerHooks() {} //register hooks regarding containers locks
	
	static registerLnKClicks(pActorSheet, pActor) {} //registers click events for pActorSheet
	
	//IMPLEMENTATIONS
	static onItemPreUpdate(pItem, pChanges) {
		if (game.system.id == cPf2eName) {
			if (LnKFlags.isLocked(pItem)) {
				if (!pChanges.system) {
					pChanges.system = {};
				}
				
				pChanges.system.collapsed = true;
			}
		}
		
		//if (
	}
	
	static registerHooks() {
		if ([cDnD5e, cPf2eName].includes(game.system.id)) {
			Hooks.on("renderActorSheet",  (pSheet, pHTML, pInfo) => ContainerHandler.registerLnKClicks(pHTML[0], pInfo.actor));
			//Hooks.on("ActorSheet",  (pSheet, pHTML, pInfo) => ContainerHandler.registerLnKClicks());
		}
		
		if (game.system.id == cPf2eName) {
			Hooks.on("preUpdateItem", (pItem, pChanges) => ContainerHandler.onItemPreUpdate(pItem, pChanges));
		}
	}
	
	static registerLnKClicks(pActorSheet, pActor) {
		let vNewClick = (pEvent, pOldClick, pActor, pItem) => {
			
		}
		
		switch (game.system.id) {
			case cDnD5e:
					
				break;
			case cPf2eName:
				console.log(pActorSheet);
				let vContainers = pActorSheet.querySelector('ul.items[data-item-types="backpack"]').querySelectorAll("li");
				
				for (let vContainer of Array.from(vContainers)) {
					if (vContainer) {
						let vItem = fromUuidSync(vContainer.getAttribute("data-uuid"));
						
						let vNewLClick = (pEvent, pOldClick) => {
							Hooks.call(cModuleName + ".LockLClick", vItem, pEvent);
							pOldClick?.();
						}
						
						let vNewRClick = (pEvent, pOldClick) => {
							Hooks.call(cModuleName + ".LockRClick", vItem, pEvent);
							pOldClick?.();
						}
						
						let vNameDiv = vContainer.querySelector("div.item-name");
						console.log(vNameDiv);
						
						for (let i = 1; i <= 1; i++) {
							let vOldLClick = vNameDiv.children[i].onclick;
							let vOldRClick = vNameDiv.children[i].oncontextmenu;
							vNameDiv.children[i].onclick = (pEvent) => {vNewLClick(pEvent, vOldLClick)};
							vNameDiv.children[i].oncontextmenu = (pEvent) => {vNewRClick(pEvent, vOldRClick)};
						}
						
						if (LnKFlags.isLocked(vItem)) {
							vNameDiv.children[1].children[0].classList.remove(cBoxIcon);
							vNameDiv.children[1].children[0].classList.add(cLockIcon);
						}
					}
				}
				break;
		}
	}
}

Hooks.once("ready", () => {
	ContainerHandler.registerHooks();
});