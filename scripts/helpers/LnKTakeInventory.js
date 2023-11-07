import { LnKutils, cModuleName, cDelimiter, Translate } from "../utils/LnKutils.js";

const cWindowID = "take-inventory-window";

class LnKTakeInventory {
	//DECLARATIONS
	static openTIWindow(pUser, pInventoryOwner, pOptions = {}) {} //opens a take inventory for puser to take items from pInventoryOwner
	
	//support
	static ActorInventory(pActor) {} //returns Inventory of pActor
	
	//IMPLEMENTATIONS
	static openTIWindow(pUser, pInventoryOwner, pOptions = {}) {
		let vTI = new TakeInventoryWindow(null, pInventoryOwner, pOptions).render(true);
	}
	
	//support
	static ActorInventory(pActor) {
		const cITypeWhiteList = ["armor", "backpack", "book", "consumable", "equipment", "item", "loot", "tootl", "treasure", "weapon"];
		
		if (pActor?.items) {
			return pActor.items.filter(vItem => cITypeWhiteList.includes(vItem.type));
		}
		
		return []
	} 
}

//https://foundryvtt.wiki/en/development/guides/understanding-form-applications

class TakeInventoryWindow extends Application {
	constructor(pTaker, pInventoryOwner, pOptions = {GMConfirm : "off"}) {
		super(pOptions);
		
		if (pTaker instanceof Actor) {
			this.vTaker = pTaker;
		}
		
		if (pTaker instanceof Token) {
			this.vTaker = pTaker.actor;
		}
		
		if (pInventoryOwner instanceof Actor) {
			this.vInventoryOwner = pInventoryOwner;
		}
		
		if (pInventoryOwner instanceof Token) {
			this.vInventoryOwner = vInventoryOwner.actor;
		}
		
		this.vOptions = pOptions;
		
		console.log(this.InventoryActorID);
		this.InventoryActorID = this.vInventoryOwner?.id;
		console.log(this.InventoryActorID);
	}
	
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: [cWindowID],
			popOut: true,
			width: 400,
			height: 300,
			template: `modules/${cModuleName}/templates/take-inventory-window.html`,
			jQuery: true,
			title: "Inventory",
			resizable: true
		});
	}
	
	getHTML(pOptions={}) {
		console.log(this);
		
		let vActorID = this.ActorID;
		
		let vInventory = LnKTakeInventory.ActorInventory(this.vInventoryOwner);
		
		let vWindow = this;
		
		//header
		let vHeaderHTML = `<h> ${Translate(cWindowID + ".header.", {pOwnerName : this.vInventoryOwner?.name})} </h>`;		
		
		//inventory
		let vInventoryHTML = `<div style="border: 1px solid">`;
		
		for (let i = 0; i < vInventory.length; i++) {
			vInventoryHTML = vInventoryHTML + 	`
												<div class="form-group item-entry" itemid="${vInventory[i].id}" style="display:flex;flex-direction:row;align-items:center;gap:1em;border: 1px solid">
													<img src="${vInventory[i].img}" style = "height: 2em;">
													<p style="width:fit-content">${vInventory[i].name}</p>
													<div style="flex-grow:1"></div>
													<div style="display:flex;flex-direction:row;align-items:center;gap:0.2em;width:fit-content">
														<input class="take-value" type="number" name="${cWindowID}.take-value.${vActorID}.${vInventory[i].id}" style="width:2em">
														<p class="take-maximum" style="">/${vInventory[i].system.quantity}</p>
													</div>
													<button type="button" style="width:fit-content" name="${cWindowID}.take-all.${vActorID}.${vInventory[i].id}" onclick=
														"$(this).parent().find('input.take-value').val(${vInventory[i].system.quantity})"
														> <i class="fa-solid fa-hand"></i> </button>
												</div>`;
		}
		
		vInventoryHTML = vInventoryHTML + `</div>`;
		
		//buttons
		let vButtonsHTML = `<button type="button" style="width:fit-content" name="${cWindowID}.take-all.everything"> <i class="fa-solid fa-hand"></i> </button>`;
		
		return vHeaderHTML + vInventoryHTML + vButtonsHTML;
	}
	
	getData(pOptions={}) {
		return {
			content: this.getHTML(pOptions)
		};
	}
	
	activateListeners(pHTML) {
		let vTakeAllButton = pHTML.find(`button[name="${cWindowID}.take-all.everything"]`);
		
		let vInventory = LnKTakeInventory.ActorInventory(this.vInventoryOwner);
		
		vTakeAllButton.on("click", function() {
			pHTML.find(`div.item-entry`).each(function() {
				$(this).find('input.take-value').val(vInventory.find(vItem => vItem.id == $(this).attr("itemid")).system.quantity);
			});
		});
	}
	
	async _updateObject(pEvent, pData) {
		console.log(pEvent, pData);
	}
	
	//DECLARATIONs
	
	//IMPLEMENTATIONS
}

Hooks.once("init", () => {
	game.modules.get(cModuleName).test = {
		LnKTakeInventory
	}
});