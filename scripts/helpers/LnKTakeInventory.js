import { LnKutils, cModuleName, cDelimiter, Translate } from "../utils/LnKutils.js";

const cWindowID = "take-inventory-window";

class LnKTakeInventory {
	//DECLARATIONS
	static openTIWindow(pUser, pInventoryOwner, pOptions = {}) {} //opens a take inventory for puser to take items from pInventoryOwner
	
	static ItemTransferRequest(pTakerID, pInventoryOwnerID, pTransferInfo, poptions) {} //answers a item transfer request
	
	//support
	static ActorInventory(pActor) {} //returns Inventory of pActor
	
	static TransferItems(pSource, pTarget, pItemInfos) {} //transfers items defined by pItemInfos(array of id, quantity) from pSource to pTarget
	
	//IMPLEMENTATIONS
	static openTIWindow(pUser, pInventoryOwner, pOptions = {}) {
		let vTI = new TakeInventoryWindow(null, pInventoryOwner, pOptions).render(true);
	}
	
	static ItemTransferRequest(pTakerID, pInventoryOwnerID, pTransferInfo, poptions) {
		let vSource = game.actors.get(pInventoryOwnerID);
		
		let vTarget = game.actors.get(pTakerID);
		
		LnKTakeInventory.TransferItems(vSource, vTarget, pTransferInfo);
	}
	
	//support
	static ActorInventory(pActor) {
		const cITypeWhiteList = ["armor", "backpack", "book", "consumable", "equipment", "item", "loot", "tootl", "treasure", "weapon"];
		
		if (pActor?.items) {
			return pActor.items.filter(vItem => cITypeWhiteList.includes(vItem.type));
		}
		
		return []
	}

	static TransferItems(pSource, pTarget, pItemInfos) {
		if (game.user.isGM) {
			if ((pSource instanceof Actor) && (pTarget instanceof Actor)) {
				let vItem;
				
				let vTransferQuantity;
				
				for (let i = 0; i < pItemInfos.length; i++) {
					vItem = pSource.items.get(pItemInfos[i].itemid);
					
					console.log(vItem);
					
					vTransferQuantity = Math.min(vItem?.system?.quantity, pItemInfos[i].quantity);
					
					console.log(vTransferQuantity);
					
					if (!isNaN(vTransferQuantity) && vTransferQuantity > 0) {
						vItem.update({system : {quantity : vItem.system.quantity - vTransferQuantity}}); //update source item
						
						console.log(vItem);
						
						vItem = duplicate(vItem); //copy item
						
						vItem.system.quantity = vTransferQuantity; //set new quantity
						
						pTarget.createEmbeddedDocuments("Item", [vItem]); //create new item
					}
				}
			}
		}
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
	
	//app stuff
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
		let vInventoryHTML = `<div style="border:1px solid;margin-top:1em">`;
		
		for (let i = 0; i < vInventory.length; i++) {
			vInventoryHTML = vInventoryHTML + 	`
												<div class="form-group item-entry" itemid="${vInventory[i].id}" style="display:flex;flex-direction:row;align-items:center;gap:1em;border: 1px solid">
													<img src="${vInventory[i].img}" style = "height: 2em;">
													<p style="width:fit-content">${vInventory[i].name}</p>
													<div style="flex-grow:1"></div>
													<div style="display:flex;flex-direction:row;align-items:center;gap:0.2em;width:fit-content">
														<input class="take-value" value="0" type="number" name="${cWindowID}.take-value.${vActorID}.${vInventory[i].id}" style="width:2em">
														<p class="take-maximum" style="">/${vInventory[i].system.quantity}</p>
													</div>
													<button type="button" style="width:fit-content" name="${cWindowID}.take-all.${vActorID}.${vInventory[i].id}" onclick=
														"$(this).parent().find('input.take-value').val(${vInventory[i].system.quantity})"
														> <i class="fa-solid fa-hand"></i> </button>
												</div>`;
		}
		
		vInventoryHTML = vInventoryHTML + `</div>`;
		
		//buttons	
		let vButtonsHTML = 				`<div class="form-group" style="display:flex;flex-direction:row;align-items:center;gap:1em;margin-top:1em">
											<button type="button" name="${cWindowID}.take-confirm"> take </button>
											<button type="button" style="width:fit-content" name="${cWindowID}.take-all.everything"> <i class="fa-solid fa-hand"></i> </button>
										</div>`;
		
		return vHeaderHTML + vInventoryHTML + vButtonsHTML;
	}
	
	getData(pOptions={}) {
		return {
			content: this.getHTML(pOptions)
		};
	}
	
	activateListeners(pHTML) {
		console.log(this);
		
		let vTakeAllButton = pHTML.find(`button[name="${cWindowID}.take-all.everything"]`);
		
		let vInventory = LnKTakeInventory.ActorInventory(this.vInventoryOwner);
		
		vTakeAllButton.on("click", function() {
			pHTML.find(`div.item-entry`).each(function() {
				$(this).find('input.take-value').val(vInventory.find(vItem => vItem.id == $(this).attr("itemid")).system.quantity);
			});
		});
		
		let vConfirmButton = pHTML.find(`button[name="${cWindowID}.take-confirm"]`);
		
		vConfirmButton.on("click", () => {console.log(this.RequestItemTransfer())});
	}
	
	async _updateObject(pEvent, pData) {
		console.log(pEvent, pData);
	}	
	
	//DECLARATIONs
	
	RequestItemTransfer() {} //requests the item transfer as defined
	
	//support
	getTransferInfo() {} //returns the transfer info set in this window
	
	//IMPLEMENTATIONS
	
	RequestItemTransfer() {
		game.socket.emit("module."+cModuleName, {pFunction : "ItemTransferRequest", pData : {pTakerID : this.vTaker?.id, pInventoryOwnerID : this.vInventoryOwner?.id, pTransferInfo : this.getTransferInfo(), poptions : this.vOptions}});
	}
	
	//support
	getTransferInfo() {
		let vInfo = [];
		
		let vEntries = this.element.find('div.item-entry');
		
		vEntries.each(function() {
			
			vInfo.push({itemid : $(this).attr("itemid"), quantity : $(this).find(`input.take-value`).val()});
		});
		
		return vInfo;
	}
}

export function ItemTransferRequest({pTakerID, pInventoryOwnerID, pTransferInfo, poptions} = pData) {LnKTakeInventory.ItemTransferRequest(pTakerID, pInventoryOwnerID, pTransferInfo, poptions)}

Hooks.once("init", () => {
	game.modules.get(cModuleName).test = {
		LnKTakeInventory
	}
});