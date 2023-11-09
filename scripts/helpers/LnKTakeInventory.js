import { LnKutils, cModuleName, cDelimiter, Translate } from "../utils/LnKutils.js";

const cWindowID = "take-inventory-window";

const cTakeIcon = "fa-solid fa-hand";

class LnKTakeInventory {
	//DECLARATIONS
	static openTIWindowfor(pUserID, pInventoryOwner, pOptions = {}) {} //opens a take inventory for puser to take items from pInventoryOwner
	
	static RequestTIWindow(pUserID, pInventoryOwner, pOptions = {}) {} //starts a sockets request for user pUserID to open a TI window
	
	static TIWindowRequest(pUserID, pSceneID, pInventoryOwnerID, pInventoryInfo, pOptions = {}) {} //answers a socket request for pUserID to open a TI window
	
	static openTIWindowself(pInventoryOwner, pInventoryInfo, pOptions = {}) {} //opens a take inventory for puser to take items from pInventoryOwner
	
	static ItemTransferRequest(pTaker, pInventoryOwner, pTransferInfo, poptions) {} //answers a item transfer request
	
	//support
	static TokenInventory(pToken) {} //returns Inventory of pToken
	
	static InventoryInfo(pToken) {} //returns the Inventory infos of pToken
	
	static TransferItems(pSource, pTarget, pItemInfos) {} //transfers items defined by pItemInfos(array of id, quantity) from pSource to pTarget
	
	static CurrentToken() {} //returns the token of first controlled token or the default token or the first owned token
	
	//IMPLEMENTATIONS
	static openTIWindowfor(pUserID, pInventoryOwner, pOptions = {}) {
		if (pUserID.includes(game.user.id)) {
			LnKTakeInventory.openTIWindowself(pInventoryOwner, LnKTakeInventory.InventoryInfo(pInventoryOwner), pOptions);
		}
		else {
			LnKTakeInventory.RequestTIWindow(pUserID, pInventoryOwner, pOptions);
		}
	}
	
	static RequestTIWindow(pUserID, pInventoryOwner, pOptions = {}) {
		if (game.user.isGM) {
			game.socket.emit("module."+cModuleName, {pFunction : "TIWindowRequest", pData : {pUserID : pUserID, pSceneID : pInventoryOwner.parent?.id, pInventoryOwnerID : pInventoryOwner?.id, pInventoryInfo : LnKTakeInventory.InventoryInfo(pInventoryOwner), pOptions : pOptions}});
		}
	}
	
	static TIWindowRequest(pUserID, pSceneID, pInventoryOwnerID, pInventoryInfo, pOptions = {}) {
		if (pUserID.includes(game.user.id)) {
			LnKTakeInventory.openTIWindowself(game.scenes.get(pSceneID)?.tokens.get(pInventoryOwnerID), pInventoryInfo, pOptions);
		}
	}
	
	static openTIWindowself(pInventoryOwner, pInventoryInfo, pOptions = {}) {
		let vTaker;
		
		if (pOptions.TakerID?.length) {
			vTaker = pInventoryOwner.parent?.tokens?.get(pOptions.TakerID);
		}
		if (!vTaker) {
			vTaker = LnKTakeInventory.CurrentToken();
		}
		
		new TakeInventoryWindow(vTaker, pInventoryOwner, pInventoryInfo, pOptions).render(true);
	}
	
	static ItemTransferRequest(pTaker, pInventoryOwner, pTransferInfo, pOptions) {
		let vSource = game.scenes.get(pInventoryOwner.SceneID)?.tokens.get(pInventoryOwner.TokenID);
		
		let vTarget = game.scenes.get(pTaker.SceneID)?.tokens.get(pTaker.TokenID);
		
		LnKTakeInventory.TransferItems(vSource, vTarget, pTransferInfo);
	}
	
	//support
	static TokenInventory(pToken) {
		const cITypeWhiteList = ["armor", "backpack", "book", "consumable", "equipment", "item", "loot", "tool", "treasure", "weapon"];
		
		if (pToken.actor?.items) {
			return pToken.actor.items.filter(vItem => cITypeWhiteList.includes(vItem.type));
		}
		
		return []
	}
	
	static InventoryInfo(pToken) {
		let vInventory = LnKTakeInventory.TokenInventory(pToken);
		
		let vInventoryInfos = [];
		
		if (pToken?.actor?.system?.currency) {
			//currencies
			let vCurrency = pToken.actor.system.currency;
			
			let vCurrencyTranslator = CONFIG[game.system.id.toUpperCase()];
			if (vCurrencyTranslator) {
				vCurrencyTranslator = vCurrencyTranslator.currencies;
			}
			
			let vCurrencyKeys = Object.keys(vCurrency);
			
			for (let i = 0; i < vCurrencyKeys.length; i++) {
				let vName = vCurrencyKeys[i];
				if (vCurrencyTranslator && vCurrencyTranslator[vCurrencyKeys[i]] && vCurrencyTranslator[vCurrencyKeys[i]].label) {
					vName = vCurrencyTranslator[vCurrencyKeys[i]].label;
				}
				
				let vIMG;
				switch(vCurrencyKeys[i]) {
					case "cp":
						vIMG = "icons/commodities/currency/coins-wheat-stack-copper.webp";
						break;
					case "ep":
						vIMG = "icons/commodities/currency/coin-engraved-oval-steel.webp";
						break;
					case "gp":
						vIMG = "icons/commodities/currency/coins-crown-stack-gold.webp";
						break;
					case "pp":
						vIMG = "icons/commodities/currency/coins-assorted-mix-platinum.webp";
						break;
					case "sp":
						vIMG = "icons/commodities/currency/coins-assorted-mix-silver.webp";
						break;
					case "credit":
						vIMG = "icons/svg/target.svg"; //find better?
						break;
					case "upb":
						vIMG = "icons/commodities/metal/ingot-engraved-silver.webp";
						break;
					default:
						vIMG = "icons/svg/coins.svg";
						break;
				}
				
				if (vCurrency[vCurrencyKeys[i]] > 0) {
					vInventoryInfos.push({
						name : vName,
						img : vIMG,
						id : vCurrencyKeys[i],
						quantity : vCurrency[vCurrencyKeys[i]],
						currency : true
					});
				}
			}
		}
		
		for (let i = 0; i < vInventory.length; i++) {
			vInventoryInfos.push({
									name : vInventory[i].name,
									img : vInventory[i].img,
									id : vInventory[i].id,
									quantity : vInventory[i].system?.quantity
								});
		}
		
		return vInventoryInfos;
	}

	static TransferItems(pSource, pTarget, pItemInfos) {
		if (game.user.isGM) {
			if ((pSource instanceof TokenDocument) && (pTarget instanceof TokenDocument)) {
				if (pSource.actor && pTarget.actor) {
					let vItem;
					
					let vTransferQuantity;
					
					let visCurrency;
					
					for (let i = 0; i < pItemInfos.length; i++) {
						vTransferQuantity = 0;
						visCurrency = pItemInfos[i].currency;
						
						if (visCurrency) {
							vTransferQuantity = 0;
							
							if (pSource.actor.system?.currency && pSource.actor.system.currency[pItemInfos[i].itemid]) {
								vTransferQuantity = Math.min(pSource.actor.system?.currency[pItemInfos[i].itemid], pItemInfos[i].quantity);
							}
						}
						else {
							vItem = pSource.actor.items.get(pItemInfos[i].itemid);
							
							vTransferQuantity = Math.min(vItem?.system?.quantity, pItemInfos[i].quantity); //make sure not to transfer too many items
						}
						
						if (!isNaN(vTransferQuantity) && vTransferQuantity > 0) {
							if (visCurrency) {
								if (pTarget.actor.system?.currency && !isNaN(pTarget.actor.system.currency[pItemInfos[i].itemid])) {
									pSource.actor.update({system : {currency : {[pItemInfos[i].itemid] : pSource.actor.system?.currency[pItemInfos[i].itemid] - vTransferQuantity}}});
									
									pTarget.actor.update({system : {currency : {[pItemInfos[i].itemid] : pTarget.actor.system.currency[pItemInfos[i].itemid] + vTransferQuantity}}});
								}
							}
							else {
								vItem.update({system : {quantity : vItem.system.quantity - vTransferQuantity}}); //update source item
								
								vItem = duplicate(vItem); //copy item
								
								vItem.system.quantity = vTransferQuantity; //set new quantity
								
								pTarget.actor.createEmbeddedDocuments("Item", [vItem]); //create new item
							}
						}
					}
				}
			}
		}
	}
	
	static CurrentToken() {
		let vControlled = canvas.tokens.controlled.map(vToken => vToken.document);
		
		if (vControlled?.length > 0) {
			if (vControlled.find(vToken => vToken.actor == game.user.character)) {
				return vControlled.find(vToken => vToken.actor == game.user.character); //default actor has selected token
			}
			
			return vControlled[0]; //returns first selected token
		}
		
		let vPlaced = canvas.tokens.placeables.map(vToken => vToken.document);
		
		if (vPlaces.find(vToken => vToken.actor = game.user.character)) { //return a present token that matches default actor
			return vPlaced.find(vToken => vToken.actor = game.user.character);
		}
		
		return vPlaced.find(vToken => vToken.isOwner); //return any owned token (desperation)
	}
}

//https://foundryvtt.wiki/en/development/guides/understanding-form-applications

class TakeInventoryWindow extends Application {
	constructor(pTaker, pInventoryOwner, pInventoryInfo, pOptions = {GMConfirm : "off"}) {
		super(pOptions);
		
		//pTaker
		if (pTaker instanceof TokenDocument) {
			this.vTaker = pTaker;
		}
		
		//pInventoryOwner
		if (pInventoryOwner instanceof TokenDocument) {
			this.vInventoryOwner = pInventoryOwner;
		}
		
		this.vInventoryInfo = pInventoryInfo;
		
		this.vOptions = pOptions;
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
			title: Translate(cWindowID + ".titles." + "inventory"),
			resizable: true
		});
	}
	
	getHTML(pOptions={}) {
		let vTokenID = this.vInventoryOwner?.id;
		
		let vInventory = this.vInventoryInfo;
		
		let vWindow = this;
		
		//header
		let vHeaderHTML;
		
		if (this.vOptions?.customHeader?.length) {
			vHeaderHTML = this.vOptions.customHeader;		
		}
		else {
			vHeaderHTML = `<h> ${Translate(cWindowID + ".header.title", {pOwnerName : this.vInventoryOwner?.name, pTakerName : this.vTaker?.name})} </h>`;		
		}
		
		//inventory
		let vInventoryHTML = `<div style="border:1px solid;margin-top:1em">`;
		
		for (let i = 0; i < vInventory.length; i++) {
			vInventoryHTML = vInventoryHTML + 	`
												<div class="form-group item-entry" itemid="${vInventory[i].id}" style="display:flex;flex-direction:row;align-items:center;gap:1em;border: 1px solid">
													<img src="${vInventory[i].img}" style = "height: 2em;">
													<p style="width:fit-content">${vInventory[i].name}</p>
													<div style="flex-grow:1"></div>
													<div style="display:flex;flex-direction:row;align-items:center;gap:0.2em;width:fit-content">
														<input class="take-value" value="0" type="number" name="${cWindowID}.take-value.${vTokenID}.${vInventory[i].id}" style="width:2em">
														<p class="take-maximum" style="">/${vInventory[i].quantity}</p>
													</div>
													<button type="button" style="width:fit-content" name="${cWindowID}.take-all.${vTokenID}.${vInventory[i].id}" 
														onclick= "$(this).parent().find('input.take-value').val(${vInventory[i].quantity})"
														> <i class="${cTakeIcon}"></i> </button>
												</div>`;
		}
		
		vInventoryHTML = vInventoryHTML + `</div>`;
		
		//buttons	
		let vButtonsHTML = 				`<div class="form-group" style="display:flex;flex-direction:row;align-items:center;gap:1em;margin-top:1em">
											<button type="button" name="${cWindowID}.take-confirm"> ${Translate(cWindowID + ".buttons.take.name")} </button>
											<button type="button" style="width:fit-content" name="${cWindowID}.take-all.everything"> <i class="${cTakeIcon}"></i> </button>
										</div>`;
		
		return vHeaderHTML + vInventoryHTML + vButtonsHTML;
	}
	
	getData(pOptions={}) {
		return {
			content: this.getHTML(pOptions)
		};
	}
	
	activateListeners(pHTML) {
		let vTakeAllButton = pHTML.find(`button[name="${cWindowID}.take-all.everything"]`);
		
		let vInventory = this.vInventoryInfo;
		
		vTakeAllButton.on("click", function() {
			pHTML.find(`div.item-entry`).each(function() {
				$(this).find('input.take-value').val(vInventory.find(vItem => vItem.id == $(this).attr("itemid")).quantity);
			});
		});
		
		let vConfirmButton = pHTML.find(`button[name="${cWindowID}.take-confirm"]`);
		
		vConfirmButton.on("click", () => {this.RequestItemTransfer(); this.close()});
	}
	
	async _updateObject(pEvent, pData) {
	}	
	
	//DECLARATIONs
	RequestItemTransfer() {} //requests the item transfer as defined
	
	//support
	getTransferInfo() {} //returns the transfer info set in this window
	
	//IMPLEMENTATIONS
	
	RequestItemTransfer() {
		if (game.user.isGM) {
			LnKTakeInventory.ItemTransferRequest({SceneID : this.vTaker.parent.id, TokenID : this.vTaker.id}, {SceneID : this.vInventoryOwner.parent.id, TokenID : this.vInventoryOwner?.id}, this.getTransferInfo(), this.vOptions);
		}
		else {
			game.socket.emit("module."+cModuleName, {pFunction : "ItemTransferRequest", pData : {pTaker : {SceneID : this.vTaker.parent.id, TokenID : this.vTaker.id}, pInventoryOwner : {SceneID : this.vInventoryOwner.parent.id, TokenID : this.vInventoryOwner?.id}, pTransferInfo : this.getTransferInfo(), pOptions : this.vOptions}});
		}
	}
	
	//support
	getTransferInfo() {
		let vInfo = [];
		
		let vEntries = this.element.find('div.item-entry');
		
		vEntries.each(function() {
			vInfo.push({itemid : $(this).attr("itemid"), quantity : $(this).find(`input.take-value`).val()});
		});
		
		for (let i = 0; i < vInfo.length; i++) {
			vInfo[i].currency = this.vInventoryInfo.find(vItem => vItem.id == vInfo[i].itemid)?.currency;
		}
		
		return vInfo;
	}
}

//exports to sockets
export function ItemTransferRequest({pTaker, pInventoryOwner, pTransferInfo, pOptions} = pData) {LnKTakeInventory.ItemTransferRequest(pTaker, pInventoryOwner, pTransferInfo, pOptions)}

export function TIWindowRequest({pUserID, pSceneID, pInventoryOwnerID, pInventoryInfo, pOptions} = {}) {LnKTakeInventory.TIWindowRequest(pUserID, pSceneID, pInventoryOwnerID, pInventoryInfo, pOptions)}

export function openTIWindowfor(pUserID, pInventoryOwner, pOptions = {customHeader : "", TakerID : ""}) {LnKTakeInventory.openTIWindowfor(pUserID, pInventoryOwner, pOptions)};

export { LnKTakeInventory }