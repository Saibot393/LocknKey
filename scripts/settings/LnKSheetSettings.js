import * as FCore from "../CoreVersionComp.js";
import { LnKutils, cModuleName, cDelimiter, Translate } from "../utils/LnKutils.js";
import { LnKCompUtils, cLibWrapper, cTidy5eNew } from "../compatibility/LnKCompUtils.js";
import { LnKFlags, cRollTypes, cCritRollOptions, cIDKeysF, cUseKeyDialogF, cLockableF, cLockedF, cLockDCF, cLPFormulaF, cLPFormulaOverrideF, cLockBreakDCF, cLBFormulaF, cLBFormulaOverrideF, cLockCCDCF, cCCFormulaF, cCCFormulaOverrideF, crequiredLPsuccessF, ccurrentLPsuccessF, cRemoveKeyonUseF, cPasskeysF, cPasskeyChangeableF, cIdentityKeyF, cCustomPopupsF, cSoundVariantF, cLockjammedF, cSpecialLPF, cReplacementItemF, cLPAttemptsF, cLPAttemptsMaxF, ccanbeCircumventedFreeF, cRollOptionsF, cLockonCloseF, cOpenImageF, cClosedImageF, cisOpenF, cPickPocketDCF, cPickPocketFormulaF, cPickPocketFormulaOverrideF, cLootFormulaF } from "../helpers/LnKFlags.js";
import { cCustomPopup } from "../helpers/LnKFlags.js";
import { cSoundVariants } from "../helpers/LnKSound.js";
import {WallTabInserter} from "../helpers/WallTabInserter.js";
import {LnKSystemutils} from "../utils/LnKSystemutils.js";

const cLnKLockIcon = "fa-lock";
const cLnKKeyIcon = "fa-key";
const cLnKpickpocketIcon = "fa-user-ninja";

class LnKSheetSettings {
	//DECLARATIONS	
	static async ItemSheetSettings(pApp, pHTML, pData) {} //add settings to key item sheet
	
	static WallSheetSettings(pApp, pHTML, pData) {} //add settinsg to wall sheet
	
	static async TokenSheetSettings(pApp, pHTML, pData, pisTile = false) {} //add settinsg to token sheet
	
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
	
	static async ItemSheetSettings(pApp, pHTML, pData) {
		let vLockSettings = game.settings.get(cModuleName, "LnKSettingTypes") == "all" || game.settings.get(cModuleName, "LnKSettingTypes").split(cDelimiter).includes(pApp.document.type)
			&& (!LnKSystemutils.candetectSystemSubtype() || game.settings.get(cModuleName, "LnKSettingsubTypes") == "all" || game.settings.get(cModuleName, "LnKSettingsubTypes").split(cDelimiter).includes(LnKSystemutils.SystemSubtype(pApp.document)));
			
		let vLootSettings = game.settings.get(cModuleName, "PickPocketItemTypes").split(cDelimiter).map(vEntry => vEntry.toLowerCase()).find(vEntry => vEntry == pApp.document.type);
		
		if (vLockSettings || vLootSettings) {
			//setup
			let vTabbar = pHTML.querySelector(`div.tabs[data-tab-container="primary"]`)
			if (!vTabbar) {
				vTabbar = pHTML.querySelector(`nav.sheet-tabs`);
				if (!vTabbar) {
					//if tab bar was not found, try other search
					vTabbar = pHTML.querySelector(`.sheet-tabs`);
					if (!vTabbar) {
						vTabbar = pHTML.querySelector(`[data-group="primary"].sheet-navigation`);
						if (!vTabbar) {
							vTabbar = pHTML.querySelector(`[data-group="main"].tabs`);
						}
					}
				}
			}
			
			let vprevTab = pHTML.querySelector(`div[data-tab="details"]`); //places LnK tab after last core tab "details"
			if (!vprevTab) {
				//if tab bar was not found, try other search
				vprevTab = pHTML.querySelector(`div[tab="details"]`);
				if (!vprevTab) {
					//if tab bar was not found, try other search
					vprevTab = pHTML.querySelector(`div[data-tab="description"]`);
					if (!vprevTab) {
						//if tab bar was not found, try other search
						vprevTab = pHTML.querySelector(`div[tab="description"]`);
						if (!vprevTab) {
							//if tab bar was not found, try other search
							vprevTab = pHTML.querySelector(`section[data-tab="description"]`);
							if (!vprevTab) {
								//if tab bar was not found, try other search
								vprevTab = pHTML.querySelector(`section[tab="description"]`);
								if (!vprevTab) {
									//for tidy 5e sheets
									vprevTab = pHTML.querySelector(`div.tidy-tab[data-tab-contents-for="description"]`);
									if (!vprevTab) {
										//and another one
										vprevTab = pHTML.querySelector(`div[data-tab="modifiers"]`);
									}
								}
							}
						}
					}
				}
			}

		
			let vTabButtonHTML = 	fromHTML(`
							<a class="${LnKSystemutils.isPf2e() ? "" : "item"} list-row" data-tab="${cModuleName}">
								${Translate("Titles."+cModuleName)}
							</a>
							`); //tab button HTML
				
			if (vTabbar) {
				vTabbar.append(vTabButtonHTML);	
				if (!LnKCompUtils.isactiveModule(cTidy5eNew)) {
					Array.from(vTabbar.querySelector(`a`)).forEach(vElement => vElement.onclick = () => {pApp.LnKTabactive = false});
					vTabbar.querySelector(`[data-tab="${cModuleName}"]`).onclick = () => {pApp.LnKTabactive = true};
				}
			}
			
			if (!pHTML.querySelector(`div.${cModuleName}`)) {
				let vTabContentHTML = fromHTML(`<div class="tab ${cModuleName}" data-tab="${cModuleName}"></div>`); //tab content sheet HTML
				vprevTab.after(vTabContentHTML);
			}
			
			if (vLootSettings) {
				//loot settings
				LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cPickPocketDCF + ".item" +".name"), 
														vhint : Translate("SheetSettings."+ cPickPocketDCF + ".item" +".descrp"), 
														vtype : "text", 
														vwide : true,
														vvalue : await LnKFlags.PickPocketItemDC(pApp.document),
														vflagname : cPickPocketDCF
														}, `div.${cModuleName}`);	
			}

			if (vLockSettings) {
				//lock settings	
				
				//create title for key items
				let vTitle = fromHTML(`<h3 class="border">${Translate("Titles.KeyItems")}</h3>`);
				
				pHTML.querySelector(`div.${cModuleName}`).append(vTitle);
				
				//setting item ids	
				LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cIDKeysF +".name"), 
														vhint : Translate("SheetSettings."+ cIDKeysF +".descrp.key"), 
														vtype : "text", 
														vwide : true,
														vvalue : LnKFlags.KeyIDs(pApp.document),
														vflagname : cIDKeysF
														}, `div.${cModuleName}`);	
										
				//setting remove key on use
				LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cRemoveKeyonUseF +".name"), 
														vhint : Translate("SheetSettings."+ cRemoveKeyonUseF +".descrp"), 
														vtype : "checkbox", 
														vvalue : LnKFlags.RemoveKeyonUse(pApp.document),
														vflagname : cRemoveKeyonUseF
														}, `div.${cModuleName}`);
					
				//create title for Lockpick/Break items
				vTitle = fromHTML(`<h3 class="border">${Translate("Titles.LPItems")}</h3>`);
				
				pHTML.querySelector(`div.${cModuleName}`).append(vTitle);
					
				if (!game.settings.get(cModuleName, "usePf2eSystem")) { //replaced by Pf2e
					//formulas
					LnKSheetSettings.AddCharacterstandardsettings(pApp, pHTML, pData, "item", `div.${cModuleName}`);	
				}
				
				//setting replacement item
				LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cReplacementItemF +".name"), 
														vhint : Translate("SheetSettings."+ cReplacementItemF +".descrp"), 
														vtype : "text",
														vwide : true,												
														vvalue : LnKFlags.ReplacementItems(pApp.document, true),
														vflagname : cReplacementItemF
														}, `div.${cModuleName}`);
			}
			
			if (!LnKCompUtils.isactiveModule(cTidy5eNew)) { 			
				if (pApp.LnKTabactive) {
					pApp.activateTab(cModuleName);
				}
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
		
		let vTabbar = pHTML.querySelector(`nav.sheet-tabs`);
		let vprevTab = pHTML.querySelector(`div[data-tab="basic"]`); //places rideable tab after last core tab "basic"
		
		let vTabButtonHTML = 	fromHTML(`
						<a class="item" data-tab="${cModuleName}" ${game.release.generation <= 12 ? '' : 'data-group="sheet"'}>
							<i class="fas ${cLnKLockIcon}"></i>
							${Translate("Titles."+cModuleName+"abbr")}
						</a>
						`); //tab button HTML
		let vTabContentHTML = fromHTML(`<div class="tab scrollable" ${game.release.generation <= 12 ? '' : 'data-group="sheet"'} data-tab="${cModuleName}"></div>`); //tab content sheet HTML
		
		vTabbar.append(vTabButtonHTML);
		vprevTab.after(vTabContentHTML);	
		
		//setting wall is lockable
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLockableF +".name"), 
												vhint : Translate("SheetSettings."+ cLockableF +".descrp"), 
												vtype : "checkbox", 
												vvalue : LnKFlags.isLockable(pApp.document),
												vflagname : cLockableF
												}, `div[data-tab="${cModuleName}"]`);
												
		//setting wall is locked on close
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLockonCloseF +".name"), 
												vhint : Translate("SheetSettings."+ cLockonCloseF +".descrp"), 
												vtype : "checkbox", 
												vvalue : LnKFlags.isLockonClose(pApp.document),
												vflagname : cLockonCloseF
												}, `div[data-tab="${cModuleName}"]`);
												
		//Lock standard settings
		LnKSheetSettings.AddLockstandardsettings(pApp, pHTML, pData, `div[data-tab="${cModuleName}"]`);
		
		Hooks.call(cModuleName + ".WallLockSettings", pApp, pHTML, pData);
	}
	
	static async TokenSheetSettings(pApp, pHTML, pData, pisTile = false) {
		let vLockSettings = await LnKutils.isLockCompatible(pApp.document);
		let vLockFormulaSettings = !game.settings.get(cModuleName, "usePf2eSystem"); //replaced by Pf2e
		let vOptionalLockable = await LnKutils.isOptionalLockable(pApp.document);
		
		let vUseTab = (vLockSettings || vLockFormulaSettings);
		
		let vTitle;
		
		if (vUseTab) {
			//let vTabbar = pisTile ? pHTML.querySelector(`nav.sheet-tabs`) : pHTML.querySelector(`[data-group="main"].sheet-tabs`);
			let vTabbar = pHTML.querySelector(`nav.sheet-tabs`);
			let vprevTab = pisTile ? pHTML.querySelector(`div[data-tab="overhead"]`) : pHTML.querySelector(`div[data-tab="resources"]`); //places LnK tab after last core tab "details"
			
			let vTabIcon;
			
			if (await LnKutils.isLockCompatible(pApp.document)) {
				vTabIcon = cLnKLockIcon;
			}
			else {
				vTabIcon = cLnKKeyIcon;
			}
			
			let vTabButtonHTML = fromHTML(`
							<a class="item ${pApp.tabGroups?.sheet == cModuleName ? 'active' : ''}" data-action="tab" ${game.release.generation <= 12 ? 'data-group="main"' : 'data-group="sheet"'} data-tab="${cModuleName}">
								<i class="fas ${vTabIcon}"></i>
								${Translate("Titles."+cModuleName+"abbr")}
							</a>
							`); //tab button HTML
			let vTabContentHTML = fromHTML(`<div class="tab ${pApp.tabGroups?.sheet == cModuleName ? 'active' : ''} scrollable" ${game.release.generation <= 12 ? (pisTile ? '' : 'data-group="main"') : 'data-group="sheet"'} data-application-part="${cModuleName}" data-tab="${cModuleName}"></div>`); //tab content sheet HTML

			vTabbar.append(vTabButtonHTML);
			vprevTab.after(vTabContentHTML);	
		}
		
		//setup
		if (vLockSettings || vLockFormulaSettings) {
			//only if any settings at all
			
			if (vLockSettings && vLockFormulaSettings) {
				//create title for lock compatible tokens
				vTitle = fromHTML(`<h4 class="border">${Translate("Titles.LockTokens")}</h4>`);
				
				pHTML.querySelector(`div[data-tab="${cModuleName}"]`).append(vTitle);
			}
			
			if (pisTile && vOptionalLockable) { //only for normal tiles
				//choose image for open state
				LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cOpenImageF +".name"), 
										vhint : Translate("SheetSettings."+ cOpenImageF +".descrp"), 
										vtype : "filePicker", 
										vvalue : LnKFlags.OpenImage(pApp.document),
										vflagname : cOpenImageF,
										vwide : true
										}, `div[data-tab="${cModuleName}"]`);
							
				//choose image for closed state
				LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cClosedImageF +".name"), 
										vhint : Translate("SheetSettings."+ cClosedImageF +".descrp"), 
										vtype : "filePicker", 
										vvalue : LnKFlags.ClosedImage(pApp.document),
										vflagname : cClosedImageF,
										vwide : true
										}, `div[data-tab="${cModuleName}"]`);
			}
				
			if (vLockSettings) {
				//settings
				
				if (vOptionalLockable) {
					//setting token is lockable
					LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLockableF +".name"), 
															vhint : Translate("SheetSettings."+ cLockableF +".descrp"), 
															vtype : "checkbox", 
															vvalue : LnKFlags.isLockable(pApp.document),
															vflagname : cLockableF
															}, `div[data-tab="${cModuleName}"]`);
				}
														
				//setting token is locked								
				LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLockedF +".name"), 
														vhint : Translate("SheetSettings."+ cLockedF +".descrp"), 
														vtype : "checkbox", 
														vvalue : LnKFlags.isLocked(pApp.document),
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
															vvalue : LnKFlags.SoundVariant(pApp.document), 
															vflagname : cSoundVariantF
															}, `div[data-tab="${cModuleName}"]`);
				}
			}
			
			if (!pisTile) {
				if (vLockSettings && vLockFormulaSettings) {
					//createtitle for Character tokens
					vTitle = fromHTML(`<h4 class="border">${Translate("Titles.CharacterTokens")}</h4>`);
					
					pHTML.querySelector(`div[data-tab="${cModuleName}"]`).append(vTitle);
				}
				
				//formulas
				if (vLockFormulaSettings) { //replaced by Pf2e
					LnKSheetSettings.AddCharacterstandardsettings(pApp, pHTML, pData, "token", `div[data-tab="${cModuleName}"]`);	
					
					LnKSheetSettings.AddRollOptions(pApp, pHTML, pData,`div[data-tab="${cModuleName}"]` );
				}
			}
		}
		
		if (!pisTile) {
			let vTargetHTML = `div[data-tab="${cModuleName}"]`;
			
			if (!vUseTab) {
				let vTitleHTML = fromHTML(`<fieldset data-group="${cModuleName}" name="PickPocket"><legend><p><i class="fas ${cLnKLockIcon}"></i>  ${Translate("Titles.LocknKey")}</p> </legend></fieldset>`);
				
				pHTML.querySelector('div.tab[data-group="main"][data-tab="character"]').append(vTitleHTML);
				
				vTargetHTML = `fieldset[data-group="${cModuleName}"]`;
			}
			
			//setting PickPocket dc			
			LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cPickPocketDCF +".name"), 
													vhint : Translate("SheetSettings."+ cPickPocketDCF +".descrp"), 
													vtype : "number", 
													vvalue : await LnKFlags.PickPocketDC(pApp.document, true),
													vflagname : cPickPocketDCF
													}, vTargetHTML);
													
			Hooks.call(cModuleName + ".TokenLockSettings", pApp, pHTML, pData);
		}
		
		LnKSheetSettings.FixSheetWindow(pApp.element, `nav.sheet-tabs`);
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
																		vvalue : LnKFlags.getCustomPopups(pApp.document, vKey),
																		vflagname : vsubFlagname,
																		vID : vKey
																		}, true, false);
		}
														
		new Dialog({
			title: Translate("SheetSettings."+ cCustomPopupsF + ".Title"),
			content: vContent,
			buttons: {
				button1: {
					label: Translate("SheetSettings."+ cCustomPopupsF + ".confirmButtonname"),
					callback: (html) => {let vInputs = {}; for(let vKey of LnKFlags.CustomPopupsKeys()){vInputs[vKey] = html.find(`input#${vKey}`).val()}; LnKFlags.setCustomPopups(pApp.document, vInputs)},
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
												vvalue : LnKFlags.KeyIDs(pApp.document),
												vflagname : cIDKeysF
												}, pto);
												
		//setting to use key use menu									
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cUseKeyDialogF +".name"), 
												vhint : Translate("SheetSettings."+ cUseKeyDialogF +".descrp"), 
												vtype : "checkbox", 
												vwide : true,
												vvalue : LnKFlags.useKeyDialog(pApp.document),
												vflagname : cUseKeyDialogF
												}, pto);
												
		//setting passkeys									
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cPasskeysF +".name"), 
												vhint : Translate("SheetSettings."+ cPasskeysF +".descrp"), 
												vtype : "text", 
												vwide : true,
												vvalue : LnKFlags.PassKeys(pApp.document),
												vflagname : cPasskeysF
												}, pto);
												
		//setting passkey changeable									
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cPasskeyChangeableF +".name"), 
												vhint : Translate("SheetSettings."+ cPasskeyChangeableF +".descrp"), 
												vtype : "checkbox", 
												vwide : true,
												vvalue : LnKFlags.PasskeyChangeable(pApp.document),
												vflagname : cPasskeyChangeableF
												}, pto);
												
		//setting identity key									
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cIdentityKeyF +".name"), 
												vhint : Translate("SheetSettings."+ cIdentityKeyF +".descrp"), 
												vtype : "text", 
												vwide : true,
												vvalue : LnKFlags.IdentityKeys(pApp.document),
												vflagname : cIdentityKeyF
												}, pto);
												
												
												
		//setting Lock jammed									
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLockjammedF +".name"), 
												vhint : Translate("SheetSettings."+ cLockjammedF +".descrp"), 
												vtype : "checkbox", 
												vvalue : LnKFlags.Lockisjammed(pApp.document),
												vflagname : cLockjammedF
												}, pto);
												
		//setting lock dc									
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLockDCF +".name"), 
												vhint : Translate("SheetSettings."+ cLockDCF +".descrp"), 
												vtype : "number", 
												vvalue : LnKFlags.LockDC(pApp.document, true),
												vflagname : cLockDCF
												}, pto);
												
		//setting Special Lockpicks									
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cSpecialLPF +".name"), 
												vhint : Translate("SheetSettings."+ cSpecialLPF +".descrp"), 
												vtype : "text", 
												vwide : true,
												vvalue : LnKFlags.GetSpecialLockpicks(pApp.document, true),
												vflagname : cSpecialLPF
												}, pto);
												
		//setting lock break dc									
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLockBreakDCF +".name"), 
												vhint : Translate("SheetSettings."+ cLockBreakDCF +".descrp"), 
												vtype : "number", 
												vvalue : LnKFlags.LockBreakDC(pApp.document, true),
												vflagname : cLockBreakDCF
												}, pto);
												
		if (game.settings.get(cModuleName, "CustomCircumventActive")) {
			//setting lock CC dc									
			LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLockCCDCF +".name", {pCheckName : game.settings.get(cModuleName, "CustomCircumventName")}), 
													vhint : Translate("SheetSettings."+ cLockCCDCF +".descrp", {pCheckName : game.settings.get(cModuleName, "CustomCircumventName")}), 
													vtype : "number", 
													vvalue : LnKFlags.LockCCDC(pApp.document, true),
													vflagname : cLockCCDCF
													}, pto);			
		}										
		
		//setting for current of required successes
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ crequiredLPsuccessF +".name"), 
												vhint : Translate("SheetSettings."+ crequiredLPsuccessF +".descrp"), 
												vtype : "numberpart", 
												vvalue : [LnKFlags.currentLPsuccess(pApp.document), LnKFlags.requiredLPsuccess(pApp.document)],
												vflagname : [ccurrentLPsuccessF, crequiredLPsuccessF]
												}, pto);
		
		/*		
		//setting for LP attempts left in this lock
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLPAttemptsF +".name"), 
												vhint : Translate("SheetSettings."+ cLPAttemptsF +".descrp"), 
												vtype : "number", 
												vvalue : LnKFlags.LPAttemptsLeft(pApp.document, true),
												vflagname : cLPAttemptsF,
												}, pto);
		*/
						
		//setting for LP attempts left/max in this lock
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLPAttemptsF +".name"), 
												vhint : Translate("SheetSettings."+ cLPAttemptsF +".descrp"), 
												vtype : "numberpart", 
												vvalue : [LnKFlags.LPAttemptsLeft(pApp.document, true), LnKFlags.LPAttemptsMax(pApp.document, true)],
												vflagname : [cLPAttemptsF, cLPAttemptsMaxF]
												}, pto);
												
		//can be circumvented free setting
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ ccanbeCircumventedFreeF +".name"), 
												vhint : Translate("SheetSettings."+ ccanbeCircumventedFreeF +".descrp"), 
												vtype : "checkbox", 
												vvalue : LnKFlags.canbeCircumventedFree(pApp.document),
												vflagname : ccanbeCircumventedFreeF
												}, pto);		

		//custom popups menu button
		let vButton = fromHTML(`<button id = "${cModuleName}.CustomPopupsButton"> ${Translate("SheetSettings." + cCustomPopupsF + ".openButtonname")} </button>`);
		pHTML.querySelector(pto).append(vButton);
		pHTML.querySelector(`button[id="${cModuleName}.CustomPopupsButton"]`).onclick = () => {LnKSheetSettings.OpenCustomPopups(pApp)};
	} 
	
	static AddCharacterstandardsettings(pApp, pHTML, pData, pType, pto) {
		//Additional LP roll formula
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLPFormulaF +".name"), 
												vhint : Translate("SheetSettings."+ cLPFormulaF +".descrp."+pType), 
												vtype : "text", 
												vwide : true,
												vvalue : LnKFlags.LPFormula(pApp.document),
												vflagname : cLPFormulaF
												}, pto);	
												
		//If this items LP roll formula overrides other formulas
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLPFormulaOverrideF +".name"), 
												vhint : Translate("SheetSettings."+ cLPFormulaOverrideF +".descrp."+pType), 
												vtype : "checkbox", 
												vvalue : LnKFlags.LPFormulaOverride(pApp.document),
												vflagname : cLPFormulaOverrideF
												}, pto);	
												
		//Additional LB roll formula
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLBFormulaF +".name"), 
												vhint : Translate("SheetSettings."+ cLBFormulaF +".descrp."+pType), 
												vtype : "text", 
												vwide : true,
												vvalue : LnKFlags.LBFormula(pApp.document),
												vflagname : cLBFormulaF
												}, pto);	
												
		//If this items LB roll formula overrides other formulas
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLBFormulaOverrideF +".name"), 
												vhint : Translate("SheetSettings."+ cLBFormulaOverrideF +".descrp."+pType), 
												vtype : "checkbox", 
												vvalue : LnKFlags.LBFormulaOverride(pApp.document),
												vflagname : cLBFormulaOverrideF
												}, pto);
												
		if (game.settings.get(cModuleName, "CustomCircumventActive")) {
			//Additional CC roll formula
			LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cCCFormulaF +".name", {pCheckName : game.settings.get(cModuleName, "CustomCircumventName")}), 
													vhint : Translate("SheetSettings."+ cCCFormulaF +".descrp."+pType, {pCheckName : game.settings.get(cModuleName, "CustomCircumventName")}), 
													vtype : "text", 
													vwide : true,
													vvalue : LnKFlags.CCFormula(pApp.document),
													vflagname : cCCFormulaF
													}, pto);	
													
			//If this items CC roll formula overrides other formulas
			LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cCCFormulaOverrideF +".name", {pCheckName : game.settings.get(cModuleName, "CustomCircumventName")}), 
													vhint : Translate("SheetSettings."+ cCCFormulaOverrideF +".descrp."+pType, {pCheckName : game.settings.get(cModuleName, "CustomCircumventName")}), 
													vtype : "checkbox", 
													vvalue : LnKFlags.CCFormulaOverride(pApp.document),
													vflagname : cCCFormulaOverrideF
													}, pto);			
		}
		
		if (pType == "token") {
			//Additional PickPocket roll formula
			LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cPickPocketFormulaF +".name"), 
													vhint : Translate("SheetSettings."+ cPickPocketFormulaF +".descrp.token"), 
													vtype : "text", 
													vwide : true,
													vvalue : LnKFlags.PickPocketFormula(pApp.document),
													vflagname : cPickPocketFormulaF
													}, pto);	
												
			//If this tokens PickPocket roll formula overrides other formulas
			LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cPickPocketFormulaOverrideF +".name"), 
													vhint : Translate("SheetSettings."+ cPickPocketFormulaOverrideF +".descrp.token"), 
													vtype : "checkbox", 
													vvalue : LnKFlags.PickPocketFormulaOverrides(pApp.document),
													vflagname : cPickPocketFormulaOverrideF
													}, pto);
													
			//Loot formula for this token
			LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLootFormulaF +".name"), 
													vhint : Translate("SheetSettings."+ cLootFormulaF +".descrp"), 
													vtype : "text", 
													vwide : true,
													vvalue : LnKFlags.LootFormula(pApp.document),
													vflagname : cLootFormulaF
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
															vvalue : LnKFlags.RollOptions(pApp.document, vRType, vROption),
															vflagname : vFlagName
															}, pto);				
				}
			}
		}
	}
	
	//support
	
	static AddHTMLOption(pHTML, pInfos, pto) {
		let vParent = pHTML.querySelector(pto);
		
		vParent.append(LnKSheetSettings.createHTMLOption(pInfos));
		
		if (pInfos.vtype == "filePicker") {
			let vPickerButton = vParent.querySelector(`button[data-target="flags.${cModuleName}.${pInfos.vflagname}"]`);
			let vDataField = vParent.querySelector(`input[name="flags.${cModuleName}.${pInfos.vflagname}"]`);
			
			let filePicker = new FilePicker({
				field: vDataField,
				type: vPickerButton.dataset.type,
				current: vDataField?.value ?? "",
				button: vPickerButton,
				callback: (pFile, pFilePicker) => {pFilePicker.field.value = pFile}
			});
			
			vPickerButton.onclick = () => {filePicker.render()};
		}
	}
	
	static createHTMLOption(pInfos, pwithformgroup = false, pAsDOM = true) {
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
		
		//let vCapitalisedType = vtype.charAt(0).toUpperCase() + vtype.slice(1);
		
		switch (vtype){
			case "number":
			case "text":
				vnewHTML = vnewHTML + `<input type=${vtype} name="flags.${cModuleName}.${vflagname}" id=${vID} value="${vvalue}" style="color:inherit"></input>`;
				break;
				
			case "checkbox":
				if (vvalue) {
					vnewHTML = vnewHTML + `<input type=${vtype} name="flags.${cModuleName}.${vflagname}" id=${vID} checked></input>`;
				}
				else {
					vnewHTML = vnewHTML + `<input type=${vtype} name="flags.${cModuleName}.${vflagname}" id=${vID}></input>`;
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
			case "filePicker":
				vnewHTML = vnewHTML + `
					<input class="image" type="text" name="flags.${cModuleName}.${vflagname}" placeholder="path/image.png" value="${vvalue}"></input>
					<button type="button" class="file-picker" data-type="imagevideo" data-target="flags.${cModuleName}.${vflagname}"><i class="fas fa-file-import fa-fw"></i></button>
				`;
				break;
		}
			
		vnewHTML = vnewHTML + `</div>`;
		
		if (vhint != "") {
			vnewHTML = vnewHTML + `<p class="hint">${vhint}</p>`;
		}
		
		vnewHTML = vnewHTML + `</div>`;
		
		//pHTML.find('[name="RideableTitle"]').after(vnewHTML);
		//pHTML.find(pto/*`div[data-tab="${cModuleName}"]`*/).append(vnewHTML);
		return pAsDOM ? fromHTML(vnewHTML) : vnewHTML;
	}
	
	static RegisterItemSheetTabChange() {
		//register onChangeTab (if possible with lib-wrapper)
		if(!LnKCompUtils.isactiveModule(cTidy5eNew)) {
			if (LnKCompUtils.isactiveModule(cLibWrapper)) {
				libWrapper.register(cModuleName, "ItemSheet.prototype._onChangeTab", function(vWrapped, ...args) {this.LnKTabactive = (args[2] == cModuleName); return vWrapped(...args)}, "WRAPPER");
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
	}
	
	static FixSheetWindow(pHTML, pIndentifier) {
		if (!pHTML.nodeType) pHTML = pHTML[0];
		
		let vNeededWidth = 0;

		Array.from(pHTML.querySelector(pIndentifier).children).forEach(vElement => vNeededWidth = vNeededWidth + vElement.offsetWidth);
		
		if (vNeededWidth > pHTML.offsetWidth) {
			pHTML.style.width = vNeededWidth + "px";
		}		
	}
}

function fromHTML(pHTML) {
	let vDIV = document.createElement('div');
	
	vDIV.innerHTML = pHTML;
	
	return vDIV.querySelector("*");
}

export {LnKSheetSettings};


Hooks.once("ready", () => {
	if (game.user.isGM) {
		//register settings only for GM
		if (game.release.generation <= 12) {
			Hooks.on("renderItemSheet", (vApp, vHTML, vData) => LnKSheetSettings.ItemSheetSettings(vApp, vHTML[0], vData)); //for items

			Hooks.on("renderWallConfig", (vApp, vHTML, vData) => LnKSheetSettings.WallSheetSettings(vApp, vHTML[0], vData)); //for walls

			Hooks.on("renderTokenConfig", (vApp, vHTML, vData) => LnKSheetSettings.TokenSheetSettings(vApp, vHTML[0], vData)); //for tokens
			
			Hooks.on("renderTileConfig", (vApp, vHTML, vData) => LnKSheetSettings.TokenSheetSettings(vApp, vHTML[0], vData, true)); //for tokens
		}
		else {
			Hooks.on("renderItemSheet", (vApp, vHTML, vData) => LnKSheetSettings.ItemSheetSettings(vApp, vHTML[0], vData)); //for items

			Hooks.on("renderWallConfig", (vApp, vHTML, vData) => LnKSheetSettings.WallSheetSettings(vApp, vHTML, vData)); //for walls

			Hooks.on("renderTokenConfig", (vApp, vHTML, vData) => LnKSheetSettings.TokenSheetSettings(vApp, vHTML, vData)); //for tokens
			
			Hooks.on("renderTileConfig", (vApp, vHTML, vData) => LnKSheetSettings.TokenSheetSettings(vApp, vHTML, vData, true)); //for tokens
		}
	}
});

/* replaced in v3.1.0
Hooks.once("init", function() {
	LnKSheetSettings.RegisterItemSheetTabChange();
});
*/