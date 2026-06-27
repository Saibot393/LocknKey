//temp1.querySelector("li.container")[0].querySelectorAll("a")[0].onclick = (event) => {event.stopPropagation() } //D&D
//temp1.querySelector('ul.items[data-item-types="backpack"]').querySelectorAll("li")[0].querySelector("div.item-name").onclick = (event) => {event.stopPropagation() } //PF2E
//temp2.querySelector('ul.items[data-item-types="backpack"]').querySelectorAll("li")[0].querySelector("div.item-name").children[1].children[0].classList.add("fa-lock")
//temp2.querySelector('ul.items[data-item-types="backpack"]').querySelectorAll("li")[0].querySelector("div.item-name").children[1].children[0].classList.remove("fa-box")

import { cModuleName } from "../utils/LnKutils.js"
import { LnKSystemutils, cDnD5e, cPf2eName } from "../utils/LnKSystemutils.js";

import { LnKFlags } from "../helpers/LnKFlags.js";

import { KeyManager } from "../KeyManager.js";

import { LockManager } from "../LockManager.js";

const cBoxIcon = "fa-box";
const cLockIcon = "fa-lock";
const cLockOpenIcon = "fa-lock-open";

const cNewLClick = (pEvent, pItem, pOldClick) => {
	Hooks.call(cModuleName + ".LockLClick", pItem, pEvent);
	pOldClick?.();
}

const cNewRClick = (pEvent, pItem, pOldClick) => {
	Hooks.call(cModuleName + ".LockRClick", pItem, pEvent);
	pOldClick?.();
}

class ContainerHandler {
	//DECLARATIONS
	static onItemPreUpdate(pItem, pChanges) {} //called to make sure settings a synched correctly
	
	static registerHooks() {} //register hooks regarding containers locks
	
	static registerLnKClicks(pActorSheet, pActor) {} //registers click events for pActorSheet
	
	static onRenderItemSheet(pItemSheet, pItem) {} //register changes for pItemSheet
	
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
		
		if (game.system.id == cPf2eName) {
			Hooks.on("renderActorSheet",  (pSheet, pHTML, pInfo) => ContainerHandler.registerLnKClicks(pHTML[0], pInfo.actor));
			Hooks.on("preUpdateItem", (pItem, pChanges) => ContainerHandler.onItemPreUpdate(pItem, pChanges));
		}
		
		if (game.system.id == cDnD5e) {
			Hooks.on("renderItemSheet5e", (pSheet, pHTML, pInfo) => ContainerHandler.onRenderItemSheet(pHTML, pInfo.item));
		}
	}
	
	static registerLnKClicks(pActorSheet, pActor) {
		switch (game.system.id) {
			case cPf2eName:
				let vContainers = pActorSheet.querySelector('ul.items[data-item-types="backpack"]').querySelectorAll("li");
				
				for (let vContainer of Array.from(vContainers)) {
					if (vContainer) {
						let vItem = fromUuidSync(vContainer.getAttribute("data-uuid"));
						
						let vNameDiv = vContainer.querySelector("div.item-name");
						
						for (let i = 1; i <= 1; i++) {
							let vOldLClick = vNameDiv.children[i].onclick;
							let vOldRClick = vNameDiv.children[i].oncontextmenu;
							vNameDiv.children[i].onclick = (pEvent) => {cNewLClick(pEvent, vItem, vOldLClick)};
							vNameDiv.children[i].oncontextmenu = (pEvent) => {cNewRClick(pEvent, vItem, vOldRClick)};
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
	
	static onRenderItemSheet(pItemSheet, pItem) {
		switch (game.system.id) {
			case cDnD5e:
				if (LnKSystemutils.isContainer(pItem)) {
					const cContentsButton = pItemSheet.querySelector('a[data-tab="contents"]');
					const cContentsTab = pItemSheet.querySelector('section[data-tab="contents"]');
					
					let vIcon = document.createElement("i");
					if (LnKFlags.isLocked(pItem)) {
						vIcon.classList.add("fa-solid", cLockIcon);
						
						if (cContentsButton.classList.contains("active")) {
							cContentsButton.classList.remove("active");
							cContentsTab.classList.remove("active");
							
							const cAfterButton = cContentsButton.nextElementSibling;

							const cAfterTab = pItemSheet.querySelector(`section[data-tab="${cAfterButton.getAttribute("data-tab")}"]`);
							
							cAfterButton.classList.add("active");
							cAfterTab.classList.add("active");
						}
					}
					else {
						vIcon.classList.add("fa-solid", cLockOpenIcon);
					}
					
					let vOldLClick = cContentsButton.onclick;
					let vOldRClick = cContentsButton.oncontextmenu;
					cContentsButton.onclick = (pEvent) => {
						cNewLClick(pEvent, pItem, vOldLClick);
						
						if (LnKFlags.isLocked(pItem) && !game.user.isGM) {
							pEvent.stopPropagation();
						}
					};
					cContentsButton.oncontextmenu = (pEvent) => {cNewRClick(pEvent, pItem, vOldRClick)};
					
					if (LnKFlags.isLockable(pItem)) {
						cContentsButton.appendChild(vIcon);
					}
				}
				break;
		}
	}
}

Hooks.once("ready", () => {
	ContainerHandler.registerHooks();
});