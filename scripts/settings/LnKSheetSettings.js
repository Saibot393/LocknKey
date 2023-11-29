import * as FCore from "../CoreVersionComp.js";
import { LnKutils, cModuleName, cDelimiter, Translate } from "../utils/LnKutils.js";
import { LnKCompUtils, cLibWrapper } from "../compatibility/LnKCompUtils.js";
import { LnKFlags, cRollTypes, cCritRollOptions, cIDKeysF, cLockableF, cLockedF, cLockDCF, cLPFormulaF, cLPFormulaOverrideF, cLockBreakDCF, cLBFormulaF, cLBFormulaOverrideF, cLockCCDCF, cCCFormulaF, cCCFormulaOverrideF, crequiredLPsuccessF, ccurrentLPsuccessF, cRemoveKeyonUseF, cPasskeysF, cCustomPopupsF, cSoundVariantF, cLockjammedF, cSpecialLPF, cReplacementItemF, cLPAttemptsF, ccanbeCircumventedFreeF, cRollOptionsF, cPickPocketDCF, cPickPocketFormulaF, cPickPocketFormulaOverrideF } from "../helpers/LnKFlags.js";
import { cCustomPopup } from "../helpers/LnKFlags.js";
import { cSoundVariants } from "../helpers/LnKSound.js";
import {WallTabInserter} from "../helpers/WallTabInserter.js";

const cLnKLockIcon = "fa-lock";
const cLnKKeyIcon = "fa-key";

class LnKSheetSettings {
	//DECLARATIONS	
	static ItemSheetSettings(pApp, pHTML, pData) {} //add settings to key item sheet
	
	static WallSheetSettings(pApp, pHTML, pData) {} //add settinsg to wall sheet
	
	static async TokenSheetSettings(pApp, pHTML, pData) {} //add settinsg to token sheet
	
	//dialogs
	static OpenCustomPopups(pApp) {} //opens a popup to enter custom popups messages for object of pApp
	
	//standard setting groups
	static AddLockstandardsettings(pApp, pHTML, pData, pto) {} //adds the Lock standard settings (IDs, LPDC, LBDC)
	
	static AddCharacterstandardsettings(pApp, pHTML, pData, pType, pto) {} //adds the character and item standard settings (LP formula, LP override, LB formula, LB override) (pType is either token or item)
	
	static AddRollOptions(pApp, pHTML, pData, pto) {} //adds the crit settings roll options to pHTML
	
	//support
	static AddHTMLOption(pHTML, pInfos, pto) {} //adds a new HTML option to pto in pHTML
	
	static createHTMLOption(pInfos, pto, pwithformgroup = false) {} //creates new html "code"
	
	static RegisterItemSheetTabChange() {} //support for Item sheets to make sure LnK tab stays active during updates
	
	static FixSheetWindow(pHTML) {} //fixes the formating of pHTML sheet window
	
	//IMPLEMENTATIONS
	
	static ItemSheetSettings(pApp, pHTML, pData) {
		if (game.settings.get(cModuleName, "LnKSettingTypes") == "all" || game.settings.get(cModuleName, "LnKSettingTypes").split(cDelimiter).includes(pApp.object.type)) {
			//setup
			let vTabbar = pHTML.find(`.sheet-tabs`);
			if (!vTabbar.length) {
				//if tab bar was not found, try other search
				vTabbar = pHTML.find(`[data-group="primary"].sheet-navigation`);
			}	
			
			let vprevTab = pHTML.find(`div[data-tab="details"]`); //places rideable tab after last core tab "details"
			if (!vprevTab.length) {
				//if tab bar was not found, try other search
				vprevTab = pHTML.find(`div[tab="details"]`);
				if (!vprevTab.length) {
					//if tab bar was not found, try other search
					vprevTab = pHTML.find(`div[data-tab="description"]`);
					if (!vprevTab.length) {
						//if tab bar was not found, try other search
						vprevTab = pHTML.find(`div[tab="description"]`);
						if (!vprevTab.length) {
							//if tab bar was not found, try other search
							vprevTab = pHTML.find(`section[data-tab="description"]`);
							if (!vprevTab.length) {
								//if tab bar was not found, try other search
								vprevTab = pHTML.find(`section[tab="description"]`);
							}
						}
					}
				}
			}

		
			let vTabButtonHTML = 	`
							<a class="item list-row" data-tab="${cModuleName}">
								<i class="fas ${cLnKKeyIcon}"></i>
								${Translate("Titles."+cModuleName+"abbr")}
							</a>
							`; //tab button HTML
			let vTabContentHTML = `<div class="tab ${cModuleName}" data-tab="${cModuleName}"></div>`; //tab content sheet HTML
			
			vTabbar.append(vTabButtonHTML);
			vprevTab.after(vTabContentHTML);	

			//settings	
			
			//create title for key items
			let vTitle = `<h3 class="border">${Translate("Titles.KeyItems")}</h3>`;
			
			pHTML.find(`div[data-tab="${cModuleName}"]`).append(vTitle);
			
			//setting item ids	
			LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cIDKeysF +".name"), 
													vhint : Translate("SheetSettings."+ cIDKeysF +".descrp.key"), 
													vtype : "text", 
													vwide : true,
													vvalue : LnKFlags.KeyIDs(pApp.object),
													vflagname : cIDKeysF
													}, `div[data-tab="${cModuleName}"]`);	
									
			//setting remove key on use
			LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cRemoveKeyonUseF +".name"), 
													vhint : Translate("SheetSettings."+ cRemoveKeyonUseF +".descrp"), 
													vtype : "checkbox", 
													vvalue : LnKFlags.RemoveKeyonUse(pApp.object),
													vflagname : cRemoveKeyonUseF
													}, `div[data-tab="${cModuleName}"]`);
				
			//create title for Lockpick/Break items
			vTitle = `<h3 class="border">${Translate("Titles.LPItems")}</h3>`;
			
			pHTML.find(`div[data-tab="${cModuleName}"]`).append(vTitle);
				
			if (!game.settings.get(cModuleName, "usePf2eSystem")) { //replaced by Pf2e
				//formulas
				LnKSheetSettings.AddCharacterstandardsettings(pApp, pHTML, pData, "item", `div[data-tab="${cModuleName}"]`);	
			}
			
			//setting replacement item
			LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cReplacementItemF +".name"), 
													vhint : Translate("SheetSettings."+ cReplacementItemF +".descrp"), 
													vtype : "text",
													vwide : true,												
													vvalue : LnKFlags.ReplacementItems(pApp.object, true),
													vflagname : cReplacementItemF
													}, `div[data-tab="${cModuleName}"]`);
													
			if (pApp.LnKTabactive) {
				pApp.activateTab(cModuleName);
			}
		}
	}
	
	static WallSheetSettings(pApp, pHTML, pData) {
		//setup
		//create Tabs if necessary
		WallTabInserter.InsertWallTabs(pApp, pHTML, pData);
			
		/*
		let vprevElement = pHTML.find(`fieldset.door-options`);
		if (!vprevElement.length) {
			//if door options was not found, try other search
			vprevElement = pHTML.find(`select[name="ds"]`).closest(".form-group");
		}
		
		
		let vNewSection = `	<fieldset class="${cModuleName}-options">
								<legend><i class="fas ${cLnKLockIcon}"></i> ${Translate("Titles."+cModuleName)}</legend>
							</fieldset>`;
							
		vprevElement.after(vNewSection);
		*/
		
		let vTabbar = pHTML.find(`nav.sheet-tabs`);
		let vprevTab = pHTML.find(`div[data-tab="basic"]`); //places rideable tab after last core tab "basic"
		
		let vTabButtonHTML = 	`
						<a class="item" data-tab="${cModuleName}">
							<i class="fas ${cLnKLockIcon}"></i>
							${Translate("Titles."+cModuleName+"abbr")}
						</a>
						`; //tab button HTML
		let vTabContentHTML = `<div class="tab" data-tab="${cModuleName}"></div>`; //tab content sheet HTML
		
		vTabbar.append(vTabButtonHTML);
		vprevTab.after(vTabContentHTML);	
		
		//setting wall is lockable
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLockableF +".name"), 
												vhint : Translate("SheetSettings."+ cLockableF +".descrp"), 
												vtype : "checkbox", 
												vvalue : LnKFlags.isLockable(pApp.object),
												vflagname : cLockableF
												}, `div[data-tab="${cModuleName}"]`);
						
		//Lock standard settings
		LnKSheetSettings.AddLockstandardsettings(pApp, pHTML, pData, `div[data-tab="${cModuleName}"]`);
		
		Hooks.call(cModuleName + ".WallLockSettings", pApp, pHTML, pData);
	}
	
	static async TokenSheetSettings(pApp, pHTML, pData) {
		let vLockSettings = await LnKutils.isLockCompatible(pApp.token);
		let vLockFormulaSettings = !game.settings.get(cModuleName, "usePf2eSystem"); //replaced by Pf2e
		
		let vTitle;
		
		let vTabbar = pHTML.find(`[data-group="main"].sheet-tabs`);
		let vprevTab = pHTML.find(`div[data-tab="resources"]`); //places rideable tab after last core tab "details"
		
		let vTabIcon;
		
		if (await LnKutils.isLockCompatible(pApp.token)) {
			vTabIcon = cLnKLockIcon;
		}
		else {
			vTabIcon = cLnKKeyIcon;
		}
		
		let vTabButtonHTML = 	`
						<a class="item" data-tab="${cModuleName}">
							<i class="fas ${vTabIcon}"></i>
							${Translate("Titles."+cModuleName+"abbr")}
						</a>
						`; //tab button HTML
		let vTabContentHTML = `<div class="tab" data-group="main" data-tab="${cModuleName}"></div>`; //tab content sheet HTML
		
		vTabbar.append(vTabButtonHTML);
		vprevTab.after(vTabContentHTML);	
		
		//setup
		if (vLockSettings || vLockFormulaSettings) {
			//only if any settings at all

			
			if (vLockSettings && vLockFormulaSettings) {
				//create title for lock compatible tokens
				vTitle = `<h3 class="border">${Translate("Titles.LockTokens")}</h3>`;
				
				pHTML.find(`div[data-tab="${cModuleName}"]`).append(vTitle);
			}
				
			if (vLockSettings) {
				//settings
				
				//setting token is lockable
				LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLockableF +".name"), 
														vhint : Translate("SheetSettings."+ cLockableF +".descrp"), 
														vtype : "checkbox", 
														vvalue : LnKFlags.isLockable(pApp.token),
														vflagname : cLockableF
														}, `div[data-tab="${cModuleName}"]`);
														
				//setting token is locked								
				LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLockedF +".name"), 
														vhint : Translate("SheetSettings."+ cLockedF +".descrp"), 
														vtype : "checkbox", 
														vvalue : LnKFlags.isLocked(pApp.token),
														vflagname : cLockedF
														}, `div[data-tab="${cModuleName}"]`);	

				//Lock standard settings
				LnKSheetSettings.AddLockstandardsettings(pApp, pHTML, pData, `div[data-tab="${cModuleName}"]`);	
				
				if (FCore.Fversion() > 10) {
					//Sound setting
					LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cSoundVariantF +".name"), 
															vhint : Translate("SheetSettings."+ cSoundVariantF +".descrp"), 
															vtype : "select", 
															voptions : cSoundVariants,
															vvalue : LnKFlags.SoundVariant(pApp.token), 
															vflagname : cSoundVariantF
															}, `div[data-tab="${cModuleName}"]`);
				}
			}
			
			if (vLockSettings && vLockFormulaSettings) {
				//createtitle for Character tokens
				vTitle = `<h3 class="border">${Translate("Titles.CharacterTokens")}</h3>`;
				
				pHTML.find(`div[data-tab="${cModuleName}"]`).append(vTitle);
			}
			
			//formulas
			if (vLockFormulaSettings) { //replaced by Pf2e
				LnKSheetSettings.AddCharacterstandardsettings(pApp, pHTML, pData, "token", `div[data-tab="${cModuleName}"]`);	
				
				LnKSheetSettings.AddRollOptions(pApp, pHTML, pData,`div[data-tab="${cModuleName}"]` );
			}
		}
		
		//setting PickPocket dc									
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cPickPocketDCF +".name"), 
												vhint : Translate("SheetSettings."+ cPickPocketDCF +".descrp"), 
												vtype : "number", 
												vvalue : LnKFlags.PickPocketDC(pApp.object, true),
												vflagname : cPickPocketDCF
												}, `div[data-tab="${cModuleName}"]`);
												
		Hooks.call(cModuleName + ".TokenLockSettings", pApp, pHTML, pData);
		
		LnKSheetSettings.FixSheetWindow(pHTML);
	} 
	
	//dialogs
	static OpenCustomPopups(pApp) {
		let vContent = `<p> ${Translate("SheetSettings."+ cCustomPopupsF +".name")}`;
		let vsubFlagname;
		
		for (let vKey of LnKFlags.CustomPopupsKeys()) {
			vsubFlagname = cCustomPopupsF + "." + vKey;
			
			vContent = vContent + LnKSheetSettings.createHTMLOption({	vlabel : Translate("SheetSettings."+ vsubFlagname +".name"), 
																		//vhint : Translate("SheetSettings."+ vsubFlagname +".descrp"), 
																		vtype : "text", 
																		vvalue : LnKFlags.getCustomPopups(pApp.object, vKey),
																		vflagname : vsubFlagname,
																		vID : vKey
																		}, true);
		}
														
		new Dialog({
			title: Translate("SheetSettings."+ cCustomPopupsF + ".Title"),
			content: vContent,
			buttons: {
				button1: {
					label: Translate("SheetSettings."+ cCustomPopupsF + ".confirmButtonname"),
					callback: (html) => {let vInputs = {}; for(let vKey of LnKFlags.CustomPopupsKeys()){vInputs[vKey] = html.find(`input#${vKey}`).val()}; LnKFlags.setCustomPopups(pApp.object, vInputs)},
					icon: `<i class="fas ${cLnKLockIcon}"></i>`
				}
			},
			default: Translate("SheetSettings."+ cCustomPopupsF + ".confirmButtonname")
		}).render(true);	
	}
	
	//standard setting groups
	static AddLockstandardsettings(pApp, pHTML, pData, pto) {
												
		//setting lock ids									
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cIDKeysF +".name"), 
												vhint : Translate("SheetSettings."+ cIDKeysF +".descrp.lock"), 
												vtype : "text", 
												vwide : true,
												vvalue : LnKFlags.KeyIDs(pApp.object),
												vflagname : cIDKeysF
												}, pto);
												
		//setting passkeys									
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cPasskeysF +".name"), 
												vhint : Translate("SheetSettings."+ cPasskeysF +".descrp"), 
												vtype : "text", 
												vwide : true,
												vvalue : LnKFlags.PassKeys(pApp.object),
												vflagname : cPasskeysF
												}, pto);
												
		//setting Lock jammed									
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLockjammedF +".name"), 
												vhint : Translate("SheetSettings."+ cLockjammedF +".descrp"), 
												vtype : "checkbox", 
												vvalue : LnKFlags.Lockisjammed(pApp.object),
												vflagname : cLockjammedF
												}, pto);
												
		//setting lock dc									
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLockDCF +".name"), 
												vhint : Translate("SheetSettings."+ cLockDCF +".descrp"), 
												vtype : "number", 
												vvalue : LnKFlags.LockDC(pApp.object, true),
												vflagname : cLockDCF
												}, pto);
												
		//setting Special Lockpicks									
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cSpecialLPF +".name"), 
												vhint : Translate("SheetSettings."+ cSpecialLPF +".descrp"), 
												vtype : "text", 
												vwide : true,
												vvalue : LnKFlags.GetSpecialLockpicks(pApp.object, true),
												vflagname : cSpecialLPF
												}, pto);
												
		//setting lock break dc									
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLockBreakDCF +".name"), 
												vhint : Translate("SheetSettings."+ cLockBreakDCF +".descrp"), 
												vtype : "number", 
												vvalue : LnKFlags.LockBreakDC(pApp.object, true),
												vflagname : cLockBreakDCF
												}, pto);
												
		if (game.settings.get(cModuleName, "CustomCircumventActive")) {
			//setting lock CC dc									
			LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLockCCDCF +".name", {pCheckName : game.settings.get(cModuleName, "CustomCircumventName")}), 
													vhint : Translate("SheetSettings."+ cLockCCDCF +".descrp", {pCheckName : game.settings.get(cModuleName, "CustomCircumventName")}), 
													vtype : "number", 
													vvalue : LnKFlags.LockCCDC(pApp.object, true),
													vflagname : cLockCCDCF
													}, pto);			
		}										
		
		//setting for current of required successes
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ crequiredLPsuccessF +".name"), 
												vhint : Translate("SheetSettings."+ crequiredLPsuccessF +".descrp"), 
												vtype : "numberpart", 
												vvalue : [LnKFlags.currentLPsuccess(pApp.object), LnKFlags.requiredLPsuccess(pApp.object)],
												vflagname : [ccurrentLPsuccessF, crequiredLPsuccessF]
												}, pto);
									
		//setting for LP attempts left in this lock
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLPAttemptsF +".name"), 
												vhint : Translate("SheetSettings."+ cLPAttemptsF +".descrp"), 
												vtype : "number", 
												vvalue : LnKFlags.LPAttemptsLeft(pApp.object, true),
												vflagname : cLPAttemptsF,
												}, pto);
												
		//can be circumvented free setting
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ ccanbeCircumventedFreeF +".name"), 
												vhint : Translate("SheetSettings."+ ccanbeCircumventedFreeF +".descrp"), 
												vtype : "checkbox", 
												vvalue : LnKFlags.canbeCircumventedFree(pApp.object),
												vflagname : ccanbeCircumventedFreeF
												}, pto);		

		//custom popups menu button
		let vButton = `<button id = "${cModuleName}.CustomPopupsButton"> ${Translate("SheetSettings." + cCustomPopupsF + ".openButtonname")} </button>`;
		pHTML.find(pto).append(vButton);
		pHTML.find(`button[id="${cModuleName}.CustomPopupsButton"]`).click(function() {LnKSheetSettings.OpenCustomPopups(pApp)});
	} 
	
	static AddCharacterstandardsettings(pApp, pHTML, pData, pType, pto) {
		//Additional LP roll formula
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLPFormulaF +".name"), 
												vhint : Translate("SheetSettings."+ cLPFormulaF +".descrp."+pType), 
												vtype : "text", 
												vwide : true,
												vvalue : LnKFlags.LPFormula(pApp.object),
												vflagname : cLPFormulaF
												}, pto);	
												
		//If this items LP roll formula overrides other formulas
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLPFormulaOverrideF +".name"), 
												vhint : Translate("SheetSettings."+ cLPFormulaOverrideF +".descrp."+pType), 
												vtype : "checkbox", 
												vvalue : LnKFlags.LPFormulaOverride(pApp.object),
												vflagname : cLPFormulaOverrideF
												}, pto);	
												
		//Additional LB roll formula
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLBFormulaF +".name"), 
												vhint : Translate("SheetSettings."+ cLBFormulaF +".descrp."+pType), 
												vtype : "text", 
												vwide : true,
												vvalue : LnKFlags.LBFormula(pApp.object),
												vflagname : cLBFormulaF
												}, pto);	
												
		//If this items LB roll formula overrides other formulas
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLBFormulaOverrideF +".name"), 
												vhint : Translate("SheetSettings."+ cLBFormulaOverrideF +".descrp."+pType), 
												vtype : "checkbox", 
												vvalue : LnKFlags.LBFormulaOverride(pApp.object),
												vflagname : cLBFormulaOverrideF
												}, pto);
												
		if (game.settings.get(cModuleName, "CustomCircumventActive")) {
			//Additional CC roll formula
			LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cCCFormulaF +".name", {pCheckName : game.settings.get(cModuleName, "CustomCircumventName")}), 
													vhint : Translate("SheetSettings."+ cCCFormulaF +".descrp."+pType, {pCheckName : game.settings.get(cModuleName, "CustomCircumventName")}), 
													vtype : "text", 
													vwide : true,
													vvalue : LnKFlags.CCFormula(pApp.object),
													vflagname : cCCFormulaF
													}, pto);	
													
			//If this items CC roll formula overrides other formulas
			LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cCCFormulaOverrideF +".name", {pCheckName : game.settings.get(cModuleName, "CustomCircumventName")}), 
													vhint : Translate("SheetSettings."+ cCCFormulaOverrideF +".descrp."+pType, {pCheckName : game.settings.get(cModuleName, "CustomCircumventName")}), 
													vtype : "checkbox", 
													vvalue : LnKFlags.CCFormulaOverride(pApp.object),
													vflagname : cCCFormulaOverrideF
													}, pto);			
		}
		
		if (pType == "token") {
			//Additional PickPocket roll formula
			LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cPickPocketFormulaF +".name"), 
													vhint : Translate("SheetSettings."+ cPickPocketFormulaF +".descrp"), 
													vtype : "text", 
													vwide : true,
													vvalue : LnKFlags.PickPocketFormula(pApp.object),
													vflagname : cPickPocketFormulaF
													}, pto);	
												
			//If this tokens PickPocket roll formula overrides other formulas
			LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cPickPocketFormulaOverrideF +".name"), 
													vhint : Translate("SheetSettings."+ cPickPocketFormulaOverrideF +".descrp"), 
													vtype : "checkbox", 
													vvalue : LnKFlags.PickPocketFormulaOverrides(pApp.object),
													vflagname : cPickPocketFormulaOverrideF
													}, pto);
												
		}												
		
	}
	
	static AddRollOptions(pApp, pHTML, pData, pto) {
		let vFlagName;
		
		if (cCritRollOptions[game.settings.get(cModuleName, "CritMethod")]) {
			for (let vRType of cRollTypes) {
				for (let vROption of cCritRollOptions[game.settings.get(cModuleName, "CritMethod")]) {
					//Adds crit setting dependent roll options
					vFlagName = cRollOptionsF + "." + vRType + "." + vROption;
					
					LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ vFlagName +".name"), 
															vhint : Translate("SheetSettings."+ vFlagName +".descrp."), 
															vtype : "number", 
															vvalue : LnKFlags.RollOptions(pApp.object, vRType, vROption),
															vflagname : vFlagName
															}, pto);				
				}
			}
		}
	}
	
	//support
	
	static AddHTMLOption(pHTML, pInfos, pto) {
		pHTML.find(pto/*`div[data-tab="${cModuleName}"]`*/).append(LnKSheetSettings.createHTMLOption(pInfos))
	}
	
	static createHTMLOption(pInfos, pwithformgroup = false) {
		let vlabel = "Name";	
		if (pInfos.hasOwnProperty("vlabel")) {
			vlabel = pInfos.vlabel;
		}
		
		let vID = "Name";	
		if (pInfos.hasOwnProperty("vID")) {
			vID = pInfos.vID;
		}
		
		let vtype = "text";	
		if (pInfos.hasOwnProperty("vtype")) {
			vtype = pInfos.vtype;
		}
		
		let vvalue = "";	
		if (pInfos.hasOwnProperty("vvalue")) {
			vvalue = pInfos.vvalue;
		}
		
		let vflagname = "";	
		if (pInfos.hasOwnProperty("vflagname")) {
			vflagname = pInfos.vflagname;
		}
		
		let vhint = "";	
		if (pInfos.hasOwnProperty("vhint")) {
			vhint = pInfos.vhint;
		}
		
		let vunits = "";	
		if (pInfos.hasOwnProperty("vunits")) {
			vunits = pInfos.vunits;
		} 
		
		let voptions = [];
		if (pInfos.hasOwnProperty("voptions")) {
			voptions = pInfos.voptions;
		} 
		
		let voptionsName = vflagname;
		if (pInfos.hasOwnProperty("voptionsName")) {
			voptionsName = pInfos.voptionsName;
		} 
		
		let vnewHTML = ``;
		
		if (pwithformgroup) {
			vnewHTML = vnewHTML + `<div class="form-group">`;
		}
		
		if (!(pInfos.hasOwnProperty("vwide") && pInfos.vwide)) {
			vnewHTML = `
				<div class="form-group slim">
					<label>${vlabel}</label>
				<div class="form-fields">
			`;
		}
		else {//for wide imputs
			vnewHTML = `
				<div class="form-group">
					<label>${vlabel}</label>
				<div class="form-fields">
			`;
		}
		
		switch (vtype){
			case "number":
			case "text":
				vnewHTML = vnewHTML + `<input type=${vtype} name="flags.${cModuleName}.${vflagname}" id=${vID} value="${vvalue}">`;
				break;
				
			case "checkbox":
				if (vvalue) {
					vnewHTML = vnewHTML + `<input type=${vtype} name="flags.${cModuleName}.${vflagname}" id=${vID} checked>`;
				}
				else {
					vnewHTML = vnewHTML + `<input type=${vtype} name="flags.${cModuleName}.${vflagname}" id=${vID}>`;
				}
				break;
				
			case "select":
				vnewHTML = vnewHTML + `<select name="flags.${cModuleName}.${vflagname}">`;
				
				for (let i = 0; i < voptions.length; i++) {
					if (voptions[i] == vvalue) {
						vnewHTML = vnewHTML + `<option value="${voptions[i]}" selected>${Translate("SheetSettings." + voptionsName + ".options." + voptions[i])}</option>`;
					}
					else {
						vnewHTML = vnewHTML + `<option value="${voptions[i]}">${Translate("SheetSettings." + voptionsName + ".options." + voptions[i])}</option>`;
					}
				}
				
				vnewHTML = vnewHTML + `</select>`;
				break;
			case "numberpart":
				vnewHTML = vnewHTML + `<input type=number name="flags.${cModuleName}.${vflagname[0]}" id=${vID} value="${vvalue[0]}"><label>/</label><input type=number name="flags.${cModuleName}.${vflagname[1]}" id=${vID} value="${vvalue[1]}">`;
				break;
		}
			
		vnewHTML = vnewHTML + `</div>`;
		
		if (vhint != "") {
			vnewHTML = vnewHTML + `<p class="hint">${vhint}</p>`;
		}
		
		vnewHTML = vnewHTML + `</div>`;
		
		//pHTML.find('[name="RideableTitle"]').after(vnewHTML);
		//pHTML.find(pto/*`div[data-tab="${cModuleName}"]`*/).append(vnewHTML);
		return vnewHTML;
	}
	
	static RegisterItemSheetTabChange() {
		//register onChangeTab (if possible with lib-wrapper)
		if (LnKCompUtils.isactiveModule(cLibWrapper)) {
			libWrapper.register(cModuleName, "ItemSheet.prototype._onChangeTab", function(vWrapped, ...args) { this.LnKTabactive = (args[2] == cModuleName); return vWrapped(...args)}, "WRAPPER");
		}
		else {
			const vOldSheetCall = ItemSheet.prototype._onChangeTab;
			
			ItemSheet.prototype._onChangeTab = async function (...args) {
				this.LnKTabactive = (args[2] == cModuleName); //args[2] is tab name
				
				let vSheetCallBuffer = vOldSheetCall.bind(this);
				
				vSheetCallBuffer(args);
			}
		}		
	}
	
	static FixSheetWindow(pHTML) {
		let vNeededWidth = 0;

		pHTML.find(`nav.sheet-tabs[data-group="main"]`).children().each(function() {
			vNeededWidth = vNeededWidth + $(this).outerWidth() ;
		});
		
		if (vNeededWidth > pHTML.width()) {
			pHTML.width(vNeededWidth);
		}		
	}
}

export {LnKSheetSettings};


Hooks.once("ready", () => {
	if (game.user.isGM) {
		//register settings only for GM
		
		Hooks.on("renderItemSheet", (vApp, vHTML, vData) => LnKSheetSettings.ItemSheetSettings(vApp, vHTML, vData)); //for items

		Hooks.on("renderWallConfig", (vApp, vHTML, vData) => LnKSheetSettings.WallSheetSettings(vApp, vHTML, vData)); //for walls

		Hooks.on("renderTokenConfig", (vApp, vHTML, vData) => LnKSheetSettings.TokenSheetSettings(vApp, vHTML, vData)); //for tokens
	}
});

Hooks.on("init", function() {
	LnKSheetSettings.RegisterItemSheetTabChange();
});