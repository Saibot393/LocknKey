import { LnKCompUtils, cItemPiles, cMonksEJ, cMATT, cTidy5eNew, cMATTTriggerConditionsF, cMATTTriggerTileF, cTConditions, cSimpleTConditions, cPuzzleLock, cReadysetRoll, cCanvas3D} from "./LnKCompUtils.js";
import { cLockTypeLootIP, cLockType3D } from "./LnKCompUtils.js";
import { LnKutils, cModuleName, cDelimiter, Translate, TranslateClean, cLUisGM, cLUuseKey, cLUusePasskey, cLUpickLock, cLUbreakLock, cLUFreeCircumvent, cUPickPocket } from "../utils/LnKutils.js";
import { isUnlocked, UserCanopenToken, LockManager } from "../LockManager.js";
import { LnKFlags, cLockableF, cLockedF } from "../helpers/LnKFlags.js";
import {WallTabInserter} from "../helpers/WallTabInserter.js";
import {LnKSheetSettings} from "../settings/LnKSheetSettings.js";
import {LnKSystemutils} from "../utils/LnKSystemutils.js";

//LnKCompatibility will take care of compatibility with other modules in regards to calls, currently supported:

const cTriggersIcon = "fa-running";

class LnKCompatibility {
	//DECLARATIONS
	
	//specific: ItemPiles
	static onLock(pLockType, pLock) {} //called if a object is locked
	
	static onunLock(pLockType, pLock) {} //called if a object is locked
	
	static async synchLock(pLock, vUpdate) {} //called if an item pile is updated manually
	
	static synchonPreupdate(pDocument, pUpdate) {} //synchs lock state
	
	static onIPinteraction(pLock, pInfos) {} //called when someone interacts with a itempile token
	
	//specific: MATT
	static addTriggerSettings(pApp, pHTML, pData, pAddBasics = false) {} //adds the Lock & Key Trigger settings to pApp
	
	static async onLnKLockUse(pLock, pCharacter, pInfos) {} //called when someone uses a lock (only GM side)
	
	static TriggerTilerequest(pData) {} //called when a tile is requested to be triggered
	
	//IMPLEMENTATIONS
	static onLock(pLockType, pLock) {
		LnKCompUtils.LockPuzzle(pLock);

		switch (pLockType) {
			case cLockTypeLootIP:
				LnKCompUtils.setIPLock(pLock, true);
				break;
		}
	}
	
	static onunLock(pLockType, pLock) {
		console.log(pLockType, pLock);
		switch (pLockType) {
			case cLockTypeLootIP:
				LnKCompUtils.setIPLock(pLock, false);
				break;
		}	
	}
	
	static async synchLock(pLock) {
		if (game.user.isGM) {
			let vType = await LnKutils.Locktype(pLock);
			switch (vType) {
				case cLockTypeLootIP:
					await LnKCompUtils.setIPLock(pLock, LnKFlags.isLocked(pLock));
					break;
			}
		}
	}
	
	static synchonPreupdate(pDocument, pUpdate) {
		if (pUpdate.flags?.LocknKey?.hasOwnProperty("LockedFlag")) {
			if (pDocument.flags[cItemPiles]) {
				
			}
			
			if (pDocument.flags[cCanvas3D]) {
				if (!pUpdate.flags[cCanvas3D]) {
					pUpdate.flags[cCanvas3D] = {};
				}
				
				pUpdate.flags[cCanvas3D].doorState = pUpdate.flags.LocknKey.LockedFlag ? "2" : "0";
			}
		}
	}
	
	static onIPinteraction(pLock, pInfos) {
		if (!game.user.isGM) {
			isUnlocked(pLock, true);
		}
	} //called when someone interacts with a token
	
	//specific: MATT
	static addTriggerSettings(pApp, pHTML, pData, pAddBasics = false) {
		let vAddBasics = pAddBasics && !pHTML.querySelector(`a[data-tab="triggers"]`);
		
		if (vAddBasics) {
			let vTabbar = pHTML.querySelector(`nav.sheet-tabs[data-group="main"]`);
			
			let vTabButtonHTML = 	fromHTML(`
							<a class="item" data-tab="triggers" data-group="sheet" data-action="tab">
								<i class="fas ${cTriggersIcon}"></i>
								${Translate("Titles.Triggers")}
							</a>
							`); //tab button HTML
			
			vTabbar.append(vTabButtonHTML);		
		}
		
		let vObject = pApp.object || pData.document;
		
		if (!pHTML.querySelector(`div[data-tab="triggers"]`)) {
			//create new tab field
			let vprevTab = pHTML.querySelector(`div[data-tab=${cModuleName}]`); //places Lock & Key tab after last core tab "basic"
			let vTabContentHTML = fromHTML(`<div class="tab" data-tab="triggers" data-group="sheet" data-action="tab"></div>`); //tab content sheet HTML
			vprevTab.after(vTabContentHTML);
		}
		
		if (vAddBasics) {
			LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cMATTTriggerTileF +".name"), 
													vhint : Translate("SheetSettings."+ cMATTTriggerTileF +".descrp"), 
													vtype : "text",
													vwide : true,
													vvalue : LnKCompUtils.MATTTriggerTileID(vObject),
													vflagname : cMATTTriggerTileF
													}, `div[data-tab="triggers"]`);		
		}
			
		let vTypeOptions;
		
		for (let vUseType of [cLUuseKey, cLUusePasskey, cLUpickLock, cLUbreakLock, cLUFreeCircumvent, cUPickPocket]) {
			switch (vUseType) {
				case cLUuseKey:
				case cLUusePasskey:
				case cLUFreeCircumvent:
					vTypeOptions = cSimpleTConditions;
					break;
				case cLUpickLock:
				case cLUbreakLock:
				case cUPickPocket:
					vTypeOptions = cTConditions;
					break;
			}
			
			LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cMATTTriggerConditionsF + "." + vUseType +".name"), 
													//vhint : Translate("SheetSettings."+ cMATTTriggerConditionsF + "." + vUseType +".descrp"), 
													vtype : "select",
													voptions : 	vTypeOptions,		
													voptionsName : cMATTTriggerConditionsF,
													vvalue : LnKCompUtils.MattTriggerCondition(vObject, vUseType),
													vflagname : cMATTTriggerConditionsF + "." + vUseType
													}, `div[data-tab="triggers"]`);	
		}
	}
	
	static async onLnKLockUse(pLock, pCharacter, pInfos) {
		if (LnKCompUtils.MATTTriggered(pLock, pInfos)) {
			let vTile = await LnKCompUtils.MATTTriggerTile(pLock);
			
			if (vTile) {
				if (!pInfos.useData.userID || pInfos.useData.userID == game.user.id) {
					vTile.trigger({ tokens: [pCharacter], method: 'trigger', options: {landing : pInfos.UseType}});
				}
				else {
					game.socket.emit("module."+cModuleName, {pFunction : "TriggerTilerequest", pData : {UserID : pInfos.useData.userID, TileID : vTile.id, CharacterID : pCharacter.id, Infos : pInfos}});
				}
			}
		}
	}
	
	static TriggerTilerequest(pData) {
		if (pData.UserID == game.user.id) {
			let vTile = canvas.tiles.get(pData.TileID)?.document;
			
			let vCharacter = canvas.tokens.get(pData.CharacterID)?.document;
			
			if (vTile && vCharacter) {
				vTile.trigger({ tokens: [vCharacter], method: 'trigger', options: {landing : pData.Infos.UseType}});
			}
		}
	}
}

//Hook into other modules
Hooks.once("init", () => {
	if (LnKCompUtils.isactiveModule(cItemPiles)) {
		//Hooks.on("closeTokenConfig", (vTokenConfig) => {LnKCompatibility.synchIPLock(vTokenConfig.document)}); //DEPRECATED, here to solve potential bugs with old data
		
		//Hooks.on(cModuleName+".onLock", (...args) => {LnKCompatibility.onLock(...args)}); //DEPRECATED, here to solve potential bugs with old data
		
		//Hooks.on(cModuleName+".onunLock", (...args) => {LnKCompatibility.onunLock(...args)}); //DEPRECATED, here to solve potential bugs with old data
		
		Hooks.on("updateToken", (pToken, pChanges) => { if (pChanges.flags?.LocknKey?.hasOwnProperty("LockedFlag")) {LnKCompatibility.synchLock(pToken)}});
		
		Hooks.on("item-piles-rattleItemPile", () => Hooks.call(cModuleName + "." + "TokendblClick", LnKutils.hoveredToken(), {}));

		Hooks.on("item-piles-preOpenInterface", (pItemPile, pCharacter) => {if (!UserCanopenToken(pItemPile.token, true)) {game.itempiles?.API?.closeItemPile(pItemPile.token); return false}})
	}
	
	if (LnKCompUtils.isactiveModule(cMonksEJ)) {
		libWrapper.ignore_conflicts(cModuleName, cMonksEJ, "Token.prototype._onClickRight");
	}

	if (LnKCompUtils.isactiveModule(cMATT)) {
		Hooks.on(cModuleName + ".WallLockSettings", (pApp, pHTML, pData) => LnKCompatibility.addTriggerSettings(pApp, pHTML, pData));
		
		Hooks.on(cModuleName + ".TokenLockSettings", (pApp, pHTML, pData) => LnKCompatibility.addTriggerSettings(pApp, pHTML, pData, true));
		
		Hooks.on(cModuleName + ".LockUse", (pLock, pCharacter, pInfos) => LnKCompatibility.onLnKLockUse(pLock, pCharacter, pInfos));
		Hooks.on(cModuleName + ".PickPocket", (pLock, pCharacter, pInfos) => LnKCompatibility.onLnKLockUse(pLock, pCharacter, pInfos));
	}
	
	if (LnKCompUtils.isactiveModule(cTidy5eNew)) {
		Hooks.once('tidy5e-sheet.ready', (api) => {
			api.registerItemTab(
				new api.models.HandlebarsTab({
				title: Translate("Titles."+cModuleName),
				tabId: cModuleName,
				path: `/modules/${cModuleName}/templates/default.html`,
				enabled: (data) => {
					let vitem = data.document;
					
					return (game.settings.get(cModuleName, "LnKSettingTypes") == "all" || game.settings.get(cModuleName, "LnKSettingTypes").split(cDelimiter).includes(vitem.type)
					&& (!LnKSystemutils.candetectSystemSubtype() || game.settings.get(cModuleName, "LnKSettingsubTypes") == "all" || game.settings.get(cModuleName, "LnKSettingsubTypes").split(cDelimiter).includes(LnKSystemutils.SystemSubtype(vitem))))
				},
				onRender(params) {
					LnKSheetSettings.ItemSheetSettings(params.app, params.element, params.data);
				},
			}));
		});
	}
	
	if (LnKCompUtils.isactiveModule(cReadysetRoll)) {
		libWrapper.ignore_conflicts(cModuleName, cReadysetRoll, "ItemSheet.prototype._onChangeTab' ");
	}
	
	
	if (LnKCompUtils.isactiveModule(cCanvas3D)) {
		//Hooks.on("updateTile", (pTile, pChanges) => { if (pChanges.flags?.LocknKey?.hasOwnProperty("LockedFlag")) {LnKCompatibility.synchLock(pTile)}});
		Hooks.on("preUpdateTile", (pTile, pUpdate) => {LnKCompatibility.synchonPreupdate(pTile, pUpdate)});
		
		Hooks.once("3DCanvasInit", () => {
			//Hack a monkey patch for the right click of tiles
			let vOldTileCall = game.Levels3DPreview.CONFIG.entityClass.Tile3D.prototype._onClickRight;
			
			function vNewTileCall(pEvent) {
				Hooks.call(cModuleName + ".TileRClick", this.tile?.document, pEvent);
				
				vOldTileCall.bind(this)(pEvent);
			}
			
			game.Levels3DPreview.CONFIG.entityClass.Tile3D.prototype._onClickRight = vNewTileCall;
			
			//enable right click for tiles even for non GMs
			let vOldIMCall = game.Levels3DPreview.interactionManager._onClickRight;
			
			function vNewIMCall(pEvent) {
				vOldIMCall.bind(this)(pEvent);
				
				let vEntity = pEvent.entity;
				if (vEntity?.document?.documentName == "Tile" && !(vEntity.isOwner || game.user.isGM)) {
					vEntity._onClickRight(pEvent);
				}
			}
			
			game.Levels3DPreview.interactionManager._onClickRight = vNewIMCall;
		});
	}
});

Hooks.once("setupTileActions", (pMATT) => {
	if (LnKCompUtils.isactiveModule(cMATT)) {
		if (pMATT) {
			pMATT.registerTileGroup(cModuleName, Translate("Titles." + cModuleName));
			
			//toggle lock
			pMATT.registerTileAction(cModuleName, 'toggle-lock', {
				name: Translate(cMATT + ".actions." + "toggle-lock" + ".name"),
				requiresGM: true,
				ctrls: [
					{
						id: "entity",
						name: "MonksActiveTiles.ctrl.select-entity",
						type: "select",
						subtype: "entity",
						options: { show: ['tile', 'token', 'within', 'previous', 'tagger'] },
						required: true,
						restrict: (entity) => { return ((entity instanceof Token) || (entity instanceof Wall) || (entity instanceof Tile)); }
					}
				],
				group: cModuleName,
				fn: async (args = {}) => {
					let vLocks = await pMATT.getEntities(args);
					
					for (let i = 0; i < vLocks.length; i++) {
						if (vLocks[i]) {
							LockManager.ToggleLock(vLocks[i], cLUisGM);
						}
					}
				},
				content: async (trigger, action) => {
					let entityName = await pMATT.entityName(action.data?.entity);
					return `<span class="logic-style">${TranslateClean(trigger.name)}</span> <span class="entity-style">${entityName}</span>`;
				}
			});
			
			//lock
			pMATT.registerTileAction(cModuleName, 'lock', {
				name: Translate(cMATT + ".actions." + "lock" + ".name"),
				requiresGM: true,
				ctrls: [
					{
						id: "entity",
						name: "MonksActiveTiles.ctrl.select-entity",
						type: "select",
						subtype: "entity",
						options: { show: ['tile', 'token', 'within', 'previous', 'tagger'] },
						required: true,
						restrict: (entity) => { return ((entity instanceof Token) || (entity instanceof Wall) || (entity instanceof Tile)); }
					}
				],
				group: cModuleName,
				fn: async (args = {}) => {
					let vLocks = await pMATT.getEntities(args);
					
					for (let i = 0; i < vLocks.length; i++) {
						if (vLocks[i] && await LockManager.isUnlocked(vLocks[i])) {
							LockManager.ToggleLock(vLocks[i], cLUisGM);
						}
					}
				},
				content: async (trigger, action) => {
					let entityName = await pMATT.entityName(action.data?.entity);
					return `<span class="logic-style">${TranslateClean(trigger.name)}</span> <span class="entity-style">${entityName}</span>`;
				}
			});
			
			//unlock
			pMATT.registerTileAction(cModuleName, 'unlock', {
				name: Translate(cMATT + ".actions." + "unlock" + ".name"),
				requiresGM: true,
				ctrls: [
					{
						id: "entity",
						name: "MonksActiveTiles.ctrl.select-entity",
						type: "select",
						subtype: "entity",
						options: { show: ['tile', 'token', 'within', 'previous', 'tagger'] },
						required: true,
						restrict: (entity) => { return ((entity instanceof Token) || (entity instanceof Wall) || (entity instanceof Tile)); }
					}
				],
				group: cModuleName,
				fn: async (args = {}) => {
					let vLocks = await pMATT.getEntities(args);
					
					for (let i = 0; i < vLocks.length; i++) {
						if (vLocks[i] && !(await LockManager.isUnlocked(vLocks[i]))) {
							LockManager.ToggleLock(vLocks[i], cLUisGM);
						}
					}
				},
				content: async (trigger, action) => {
					let entityName = await pMATT.entityName(action.data?.entity);
					return `<span class="logic-style">${TranslateClean(trigger.name)}</span> <span class="entity-style">${entityName}</span>`;
				}
			});
			
			//loot inventory
			pMATT.registerTileAction(cModuleName, 'loot-inventory', {
				name: Translate(cMATT + ".actions." + "loot-inventory" + ".name"),
				requiresGM: true,
				ctrls: [
					{
						id: "entity",
						name: "MonksActiveTiles.ctrl.select-entity",
						type: "select",
						subtype: "entity",
						options: { show: ['token', 'within', 'players', 'previous', 'tagger'] },
						required: true,
						restrict: (entity) => { return (entity instanceof Token); }
					},
					{
                        id: "offerto",
                        name: Translate(cMATT + ".actions." + "loot-inventory" + ".settings." + "offerto" + ".name"),
                        list: "offerto",
                        type: "list",
                        subtype: "for",
                        defvalue: "trigger"
                    }
				],
				values: {
				    "offerto" : {
                        "everyone": "MonksActiveTiles.for.all",
                        "players": "MonksActiveTiles.for.players",
                        "gm": "MonksActiveTiles.for.gm",
                        "trigger": "MonksActiveTiles.for.triggering",
                        "token": "MonksActiveTiles.for.token",
                        "owner": "MonksActiveTiles.for.owner",
                        "previous": "MonksActiveTiles.for.current"
                    }
				},
				group: cModuleName,
				fn: async (args = {}) => {
					let { action } = args;
					
					let vOfferto = action.data.showto ?? "trigger";
                    let vOffertoUser = pMATT.getForPlayers(vOfferto, args);
					
					let vInventoryToken = await pMATT.getEntities(args);
					
					console.log(vInventoryToken);
					
					if (vInventoryToken.length) {
						vInventoryToken = vInventoryToken[0];
					}
					
					if (vOffertoUser?.length && vInventoryToken) {
						game.modules.get("LocknKey").api.openTIWindowfor(vOffertoUser, vInventoryToken);
					}
				},
				content: async (trigger, action) => {
					let entityName = await pMATT.entityName(action.data?.entity);
					return Translate(cMATT + ".actions." + "loot-inventory" + ".descrp", {pname : Translate(cMATT + ".actions." + "loot-inventory" + ".name"), pEntities : entityName, pOfferto : pMATT.forPlayersName(action.data?.offerto || "trigger")});
				}
			});
			
			//filter lock state
			pMATT.registerTileAction(cModuleName, 'filter-by-lock-state', {
				name: Translate(cMATT + ".filters." + "filter-by-lock-state" + ".name"),
				ctrls: [
					{
						id: "entity",
						name: "MonksActiveTiles.ctrl.select-entity",
						type: "select",
						subtype: "entity",
						options: { show: ['tile', 'token', 'within', 'players', 'previous', 'tagger'] },
						required: true,
						restrict: (entity) => {
							return ((entity instanceof Token) || (entity instanceof Wall) || (entity instanceof Tile));
						}
					},
					{
						id: "filterCondition",
						name: Translate(cMATT + ".filters." + "filter-by-lock-state" + ".settings." + "filterCondition" + ".name"),
						list: "filterCondition",
						type: "list",
						defvalue: 'yes'
					},
					{
						id: "continue",
						name: "Continue if",
						list: "continue",
						type: "list",
						defvalue: 'always'
					}
				],
				values: {
					"filterCondition": {
						"locked": Translate(cMATT + ".filters." + "filter-by-lock-state" + ".settings." + "filterCondition" + ".options." + "locked"),
						"unlocked": Translate(cMATT + ".filters." + "filter-by-lock-state" + ".settings." + "filterCondition" + ".options." + "unlocked"),
					},
					'continue': {
						"always": "Always",
						"any": "Any Matches",
						"all": "All Matches",
					}
				},
				fn: async (args = {}) => {

					const { action } = args;

					const entities = await pMATT.getEntities(args);
					
					let vEntityCount = entities.length;

					let vfilterUnlocked = action.data?.filterCondition == "unlocked";
					
					let vUnlockedMap = await Promise.all(entities.map(vObject => isUnlocked(vObject))); //where async filter, js?
					
					let vFiltered = entities.filter((vObject, vIndex) => {
						return ((vObject instanceof TokenDocument) || (vObject instanceof WallDocument) || (vObject instanceof TileDocument))
							&& vUnlockedMap[vIndex] == vfilterUnlocked;
					});

					const vContinue = (action.data?.continue === 'always'
						|| (action.data?.continue === 'any' && vFiltered.length > 0)
						|| (action.data?.continue === 'all' && vFiltered.length == vEntityCount && vFiltered.length > 0));

					return { continue: vContinue, tokens: vFiltered };

				},
				content: async (trigger, action) => {
					const entityName = await pMATT.entityName(action.data?.entity);
					let html = `<span class="filter-style">${Translate(cMATT + ".filters.name", false)}</span> <span class="entity-style">${entityName}</span>`;
					
					switch(action.data.filterCondition) {
						case "locked" :
							html = html + " " + Translate(cMATT + ".filters." + "filter-by-lock-state" + ".settings." + "filterCondition" + ".options." + "locked");
							break;
						case "unlocked" : 
							html = html + " " + Translate(cMATT + ".filters." + "filter-by-lock-state" + ".settings." + "filterCondition" + ".options." + "unlocked");
							break;
					}
					
					return html;
				}
			});
		}
	}
});

function fromHTML(pHTML) {
	let vDIV = document.createElement('div');
	
	vDIV.innerHTML = pHTML;
	
	return vDIV.querySelector("*");
}

function TriggerTilerequest(pData) {return LnKCompatibility.TriggerTilerequest(pData)};

export {TriggerTilerequest}