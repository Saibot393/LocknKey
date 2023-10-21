import { LnKCompUtils, cItemPiles, cMonksEJ, cMATT, cMATTTriggerConditionsF, cTConditions, cSimpleTConditions } from "./LnKCompUtils.js";
import { cLockTypeLootIP } from "./LnKCompUtils.js";
import { LnKutils, cModuleName, Translate, cLUuseKey, cLUusePasskey, cLUpickLock, cLUbreakLock, cLUFreeCircumvent } from "../utils/LnKutils.js";
import { isUnlocked, UserCanopenToken } from "../LockManager.js";
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
	static addTriggerSettings(pApp, pHTML, pData, pAddTriggersTab = false) {} //adds the Lock & Key Trigger settings to pApp
	
	static onLnKLockUse(pLock, pCharacter, pInfos) {} //called when someone uses a lock (only GM side)
	
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
		console.log(pLock);
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
	static addTriggerSettings(pApp, pHTML, pData, pAddTriggersTab = false) {
		if (pAddTriggersTab) {
			let vTabbar = pHTML.find(`nav.sheet-tabs`);
			let vprevTab = pHTML.find(`div[data-tab=${cModuleName}]`); //places rideable tab after last core tab "basic"
			
			let vTabButtonHTML = 	`
							<a class="item" data-tab="triggers">
								<i class="fas ${cTriggersIcon}"></i>
								${Translate("Titles.triggers")}
							</a>
							`; //tab button HTML
			let vTabContentHTML = `<div class="tab" data-tab="triggers"></div>`; //tab content sheet HTML
			
			vTabbar.append(vTabButtonHTML);
			vprevTab.after(vTabContentHTML);
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
													vhint : Translate("SheetSettings."+ cMATTTriggerConditionsF + "." + vUseType +".descrp"), 
													vtype : "select",
													voptions : 	vTypeOptions,											
													vvalue : LnKCompUtils.MattTriggerCondition(pApp.object, vUseType),
													vflagname : cMATTTriggerConditionsF + "." + vUseType
													}, `div[data-tab="triggers"]`);	
		}
	}
	
	static onLnKLockUse(pLock, pCharacter, pInfos) {
		if (LnKCompatibility.MATTTriggered(pLock, pInfos.UseType, pInfos.Outcome)) {
			let vTile = LnKCompUtils.MATTTriggerTile(pLock);
			
			vTile.trigger({ tokens: [pCharacter.object], method: 'lock'});
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