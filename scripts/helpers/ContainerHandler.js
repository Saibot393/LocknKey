//temp1.querySelector("li.container")[0].querySelectorAll("a")[0].onclick = (event) => {event.stopPropagation() } //D&D
//temp1.querySelector('ul.items[data-item-types="backpack"]').querySelectorAll("li")[0].querySelector("div.item-name").onclick = (event) => {event.stopPropagation() } //PF2E
//temp2.querySelector('ul.items[data-item-types="backpack"]').querySelectorAll("li")[0].querySelector("div.item-name").children[1].children[0].classList.add("fa-lock")
//temp2.querySelector('ul.items[data-item-types="backpack"]').querySelectorAll("li")[0].querySelector("div.item-name").children[1].children[0].classList.remove("fa-box")

import { cDnD5e, cPf2eName } from "../utils/LnKSystemutils.js"

import { LnKFlags } from "../helpers/LnKFlags.js";

class ContainerHandler {
	//DECLARATIONS
	static registerHooks() {} //register hooks regarding containers locks
	
	static registerLnKClicks(pActorSheet, pActor) {} //registers click events for pActorSheet
	
	//IMPLEMENTATIONS
	static registerHooks() {
		if ([cDnD5e, cPf2eName].includes(game.system.id)) {
			Hooks.on("renderActorSheet",  (pSheet, pHTML, pInfo) => ContainerHandler.registerLnKClicks(pHTML[0], pInfo.actor));
			//Hooks.on("ActorSheet",  (pSheet, pHTML, pInfo) => ContainerHandler.registerLnKClicks());
		}
	}
	
	static registerLnKClicks(pActorSheet, pActor) {
		let vNewClick = (pEvent, pOldClick, pActor, pItem) => {
			
		}
		
		switch (game.system.id) {
			case cDnD5e:
					
				break;
			case cPf2eName:
				let vContainers = pActorSheet.querySelector('ul.items[data-item-types="backpack"]').querySelectorAll("li");
				
				for (let vContainer of Array.from(vContainers)) {
					if (vContainer) {
						let vItem = fromUuidSync(vContainer.getAttribute("data-uuid"));
						
						let vNewClick = (pEvent) => {
							pEvent.stopPropagation();
						}
						
						let vNameDiv = vContainer.querySelector("div.item-name");
						
						for (let i = 1; i <= 2; i++) {
							let vOldClick = vNameDiv.children[i].onclick;
							vNameDiv.children[i].onclick = (pEvent) => {vNewClick(pEvent, vOldClick, pActor, vItem)};
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