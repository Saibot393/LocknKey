import { LnKCompUtils, cItemPiles, cMonksEJ, cMATT, cMATTTriggerConditionsF, cMATTTriggerTileF, cTConditions, cSimpleTConditions } from "./LnKCompUtils.js";
import { cLockTypeLootIP } from "./LnKCompUtils.js";
import { LnKutils, cModuleName, Translate, TranslateClean, cLUisGM, cLUuseKey, cLUusePasskey, cLUpickLock, cLUbreakLock, cLUFreeCircumvent } from "../utils/LnKutils.js";
import { isUnlocked, UserCanopenToken, LockManager } from "../LockManager.js";
import { LnKFlags, cLockableF, cLockedF } from "../helpers/LnKFlags.js";
import {WallTabInserter} from "../helpers/WallTabInserter.js";
import {LnKSheetSettings} from "../settings/LnKSheetSettings.js";

//LnKCompatibility will take care of compatibility with other modules in regards to calls, currently supported:

const cTriggersIcon = "fa-running";

class LnKCompatibility {
	//DECLARATIONS
	
	//specific: ItemPiles
	static onLock(pLockType, pLock) {} //called if a object is locked
	
	static onunLock(pLockType, pLock) {} //called if a object is locked
	
	static async synchIPLock(pLock, vUpdate) {} //called if an item pile is updated manually
	
	static onIPinteraction(pLock, pInfos) {} //called when someone interacts with a itempile token
	
	//specific: MATT
	static addTriggerSettings(pApp, pHTML, pData, pAddBasics = false) {} //adds the Lock & Key Trigger settings to pApp
	
	static async onLnKLockUse(pLock, pCharacter, pInfos) {} //called when someone uses a lock (only GM side)
	
	static TriggerTilerequest(pData) {} //called when a tile is requested to be triggered
	
	//IMPLEMENTATIONS
	static onLock(pLockType, pLock) {
		switch (pLockType) {
			case cLockTypeLootIP:
				LnKCompUtils.setIPLock(pLock, true);
				break;
		}
	}
	
	static onunLock(pLockType, pLock) {
		switch (pLockType) {
			case cLockTypeLootIP:
				LnKCompUtils.setIPLock(pLock, false);
				break;
		}	
	}
	
	static async synchIPLock(pLock) {
		if (await LnKutils.Locktype(pLock) == cLockTypeLootIP) {
			LnKCompUtils.setIPLock(pLock, LnKFlags.isLocked(pLock));
		}
	}
	
	static onIPinteraction(pLock, pInfos) {
		if (!game.user.isGM) {
			isUnlocked(pLock, true);
		}
	} //called when someone interacts with a token
	
	//specific: MATT
	static addTriggerSettings(pApp, pHTML, pData, pAddBasics = false) {
		let vAddBasics = pAddBasics && !pHTML.find(`a[data-tab="triggers"]`).length;
		
		if (vAddBasics) {
			let vTabbar = pHTML.find(`nav.sheet-tabs`);
			
			let vTabButtonHTML = 	`
							<a class="item" data-tab="triggers">
								<i class="fas ${cTriggersIcon}"></i>
								${Translate("Titles.Triggers")}
							</a>
							`; //tab button HTML
			
			vTabbar.append(vTabButtonHTML);		
		}
		
		if (!pHTML.find(`div[data-tab="triggers"]`).length) {
			//create new tab field
			let vprevTab = pHTML.find(`div[data-tab=${cModuleName}]`); //places rideable tab after last core tab "basic"
			let vTabContentHTML = `<div class="tab" data-tab="triggers"></div>`; //tab content sheet HTML
			vprevTab.after(vTabContentHTML);
		}
		
		if (vAddBasics) {
			LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cMATTTriggerTileF +".name"), 
													vhint : Translate("SheetSettings."+ cMATTTriggerTileF +".descrp"), 
													vtype : "text",
													vwide : true,
													vvalue : LnKCompUtils.MATTTriggerTileID(pApp.object),
													vflagname : cMATTTriggerTileF
													}, `div[data-tab="triggers"]`);		
		}
			
		let vTypeOptions;
		
		for (let vUseType of [cLUuseKey, cLUusePasskey, cLUpickLock, cLUbreakLock, cLUFreeCircumvent]) {
			switch (vUseType) {
				case cLUuseKey:
				case cLUusePasskey:
				case cLUFreeCircumvent:
					vTypeOptions = cSimpleTConditions;
					break;
				case cLUpickLock:
				case cLUbreakLock:
					vTypeOptions = cTConditions;
					break;
			}
			
			LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cMATTTriggerConditionsF + "." + vUseType +".name"), 
													//vhint : Translate("SheetSettings."+ cMATTTriggerConditionsF + "." + vUseType +".descrp"), 
													vtype : "select",
													voptions : 	vTypeOptions,		
													voptionsName : cMATTTriggerConditionsF,
													vvalue : LnKCompUtils.MattTriggerCondition(pApp.object, vUseType),
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
		Hooks.on(cModuleName+".onLock", (...args) => {LnKCompatibility.onLock(...args)}); //DEPRICATED, here to solve potential bugs with old data
		
		Hooks.on(cModuleName+".onunLock", (...args) => {LnKCompatibility.onunLock(...args)}); //DEPRICATED, here to solve potential bugs with old data
		
		//Hooks.on("closeTokenConfig", (vTokenConfig) => {LnKCompatibility.synchIPLock(vTokenConfig.document)}); //DEPRICATED, here to solve potential bugs with old data
		
		Hooks.on("updateToken", (pToken, pChanges) => { if (pChanges.flags?.LocknKey?.hasOwnProperty("LockedFlag")) {LnKCompatibility.synchIPLock(pToken)}});
		
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
	}
});

Hooks.once("setupTileActions", (pMATT) => {
	if (LnKCompUtils.isactiveModule(cMATT)) {
		if (pMATT) {
			pMATT.registerTileGroup(cModuleName, Translate("Titles." + cModuleName));
			
			//toggle lock
			pMATT.registerTileAction(cModuleName, 'toggle-lock', {
				name: Translate(cMATT + ".actions." + "toggle-lock" + ".name"),
				ctrls: [
					{
						id: "entity",
						name: "MonksActiveTiles.ctrl.select-entity",
						type: "select",
						subtype: "entity",
						options: { show: ['within', 'previous', 'tagger'] },
						restrict: (entity) => { return ((entity instanceof Token) || (entity instanceof Wall)); }
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
				ctrls: [
					{
						id: "entity",
						name: "MonksActiveTiles.ctrl.select-entity",
						type: "select",
						subtype: "entity",
						options: { show: ['within', 'previous', 'tagger'] },
						restrict: (entity) => { return ((entity instanceof Token) || (entity instanceof Wall)); }
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
				ctrls: [
					{
						id: "entity",
						name: "MonksActiveTiles.ctrl.select-entity",
						type: "select",
						subtype: "entity",
						options: { show: ['within', 'previous', 'tagger'] },
						restrict: (entity) => { return ((entity instanceof Token) || (entity instanceof Wall)); }
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
			
			//filter lock state
			pMATT.registerTileAction(cModuleName, 'filter-by-lock-state', {
            name: Translate(cMATT + ".filters." + "filter-by-lock-state" + ".name"),
            ctrls: [
                {
                    id: "entity",
                    name: "MonksActiveTiles.ctrl.select-entity",
                    type: "select",
                    subtype: "entity",
                    options: { show: ['token', 'within', 'players', 'previous', 'tagger'] },
                    restrict: (entity) => {
                        return ((entity instanceof Token) || (entity instanceof Wall));
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
                    return ((vObject instanceof TokenDocument) || (vObject instanceof WallDocument))
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

function TriggerTilerequest(pData) {return LnKCompatibility.TriggerTilerequest(pData)};

export {TriggerTilerequest}