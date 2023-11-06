import { LnKutils, cModuleName, cDelimiter, Translate } from "../utils/LnKutils.js";

const cWindowID = "take-inventory-window";

class LnKTakeInventory = {
	//DECLARATIONS
	
	//IMPLEMENTATIONS
}

//https://foundryvtt.wiki/en/development/guides/understanding-form-applications

class TakeInventoryWindow extends Application {
	constructor(pTaker, pInventoryOwner, pOptions = {GMConfirm : "off"}) {
		super(pOptions);

		if (pTaker instanceof Actor) {
			this.vTaker = vTaker;
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
	}
	
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["form"],
			popOut: true,
			width: 200,
			height: 300,
			template: `modules/${cModuleName}/templates/take-inventory-window.html`,
			id: cWindowID,
			title: "Inventory",
		});
	}
	
	getHTML(pOptions={}) {
		let vHeaderHTML = `<h> ${Translate(cWindowID + "header", {pOwnerName : this.vInventoryOwner?.name}} </h>`;
		
		//let vHTML = `<p> test </p>`;
		
		return vHeaderHTML;
	}
	
	getData(pOptions={}) {
		return {
			content: this.getHTML(pOptions)
		};
	}
	
	async _updateObject(pEvent, pData) {
		console.log(pEvent, pData);
	}
	
	//DECLARATIONs
	
	//IMPLEMENTATIONS
}