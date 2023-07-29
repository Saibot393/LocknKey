import { LnKutils, cModuleName, Translate } from "../utils/LnKutils.js";
import { LnKCompUtils, cLibWrapper } from "../compatibility/LnKCompUtils.js";
import { LnKFlags, cIDKeysF, cLockableF, cLockedF, cLockDCF, cLPFormulaF, cLPFormulaOverrideF, cLockBreakDCF, cLBFormulaF, cLBFormulaOverrideF, crequiredLPsuccessF, ccurrentLPsuccessF, cRemoveKeyonUseF } from "../helpers/LnKFlags.js";

const cLnKLockIcon = "fa-lock";
const cLnKKeyIcon = "fa-key";

class LnKSheetSettings {
	//DECLARATIONS
	static TestSetting(vApp, vHTML, vData) {} //just for test purposes
	
	static RegisterItemSheetTabChange() {} //support for Item sheets to make sure LnK tab stays active during updates
	
	static WallSheetSettings(pApp, pHTML, pData) {} //add settinsg to wall sheet
	
	static async TokenSheetSettings(pApp, pHTML, pData) {} //add settinsg to token sheet
	
	//standard setting groups
	static AddLockstandardsettings(pApp, pHTML, pData, pto) {} //adds the Lock standard settings (IDs, LPDC, LBDC)
	
	static AddFormulastandardsettings(pApp, pHTML, pData, pType, pto) {} //adds the character and item standard settings (LP formula, LP override, LB formula, LB override) (pType is either token or item)
	
	//support
	static AddHTMLOption(pHTML, pInfos, pto) {} //adds a new HTML option to pto in pHTML
	
	static ItemSheetSettings(pApp, pHTML, pData) {} //add settings to key item sheet
	
	//IMPLEMENTATIONS
	
	static ItemSheetSettings(pApp, pHTML, pData) {
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
						<a class="list-row" data-tab="${cModuleName}">
							<i class="fas ${cLnKKeyIcon}"></i>
							${Translate("Titles."+cModuleName)}
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
												vhint : Translate("SheetSettings."+ cRemoveKeyonUseF +".descrp.key"), 
												vtype : "checkbox", 
												vvalue : LnKFlags.RemoveKeyonUse(pApp.object),
												vflagname : cRemoveKeyonUseF
												}, `div[data-tab="${cModuleName}"]`);
												
		//create title for Lockpick/Break items
		vTitle = `<h3 class="border">${Translate("Titles.LPItems")}</h3>`;
		
		pHTML.find(`div[data-tab="${cModuleName}"]`).append(vTitle);

		//formulas
		LnKSheetSettings.AddFormulastandardsettings(pApp, pHTML, pData, "item", `div[data-tab="${cModuleName}"]`);	
												
		if (pApp.LnKTabactive) {
			pApp.activateTab(cModuleName);
		}
	}
	
	static WallSheetSettings(pApp, pHTML, pData) {
		//setup
		let vprevElement = pHTML.find(`fieldset.door-options`);
		if (!vprevElement.length) {
			//if door options was not found, try other search
			vprevElement = pHTML.find(`select[name="ds"]`).closest(".form-group");
		}
		
		
		let vNewSection = `	<fieldset class="${cModuleName}-options">
								<legend><i class="fas ${cLnKLockIcon}"></i> ${Translate("Titles."+cModuleName)}</legend>
							</fieldset>`;
							
		vprevElement.after(vNewSection);
		
		//setting wall is lockable
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLockableF +".name"), 
												vhint : Translate("SheetSettings."+ cLockableF +".descrp.wall"), 
												vtype : "checkbox", 
												vvalue : LnKFlags.isLockable(pApp.object),
												vflagname : cLockableF
												}, `fieldset.${cModuleName}-options`);
						
		//Lock standard settings
		LnKSheetSettings.AddLockstandardsettings(pApp, pHTML, pData, `fieldset.${cModuleName}-options`);
	}
	
	static async TokenSheetSettings(pApp, pHTML, pData) {
		//setup
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
							${Translate("Titles."+cModuleName)}
						</a>
						`; //tab button HTML
		let vTabContentHTML = `<div class="tab" data-group="main" data-tab="${cModuleName}"></div>`; //tab content sheet HTML
		
		vTabbar.append(vTabButtonHTML);
		vprevTab.after(vTabContentHTML);	
				
		if (await LnKutils.isLockCompatible(pApp.token)) {
			//settings	
			
			//create title for lock compatible tokens
			let vTitle = `<h3 class="border">${Translate("Titles.LockTokens")}</h3>`;
			
			pHTML.find(`div[data-tab="${cModuleName}"]`).append(vTitle);
			
			//setting token is lockable
			LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLockableF +".name"), 
													vhint : Translate("SheetSettings."+ cLockableF +".descrp.token"), 
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

			//create title for Character tokens
			vTitle = `<h3 class="border">${Translate("Titles.CharacterTokens")}</h3>`;
			
			pHTML.find(`div[data-tab="${cModuleName}"]`).append(vTitle);	
		}
		
		//formulas
		LnKSheetSettings.AddFormulastandardsettings(pApp, pHTML, pData, "token", `div[data-tab="${cModuleName}"]`);	
	} 
	
	//standard setting groups
	static AddLockstandardsettings(pApp, pHTML, pData, pto) {
		//setting wall ids									
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cIDKeysF +".name"), 
												vhint : Translate("SheetSettings."+ cIDKeysF +".descrp.lock"), 
												vtype : "text", 
												vwide : true,
												vvalue : LnKFlags.KeyIDs(pApp.object),
												vflagname : cIDKeysF
												}, pto);
												
		//setting lock dc									
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLockDCF +".name"), 
												vhint : Translate("SheetSettings."+ cLockDCF +".descrp"), 
												vtype : "number", 
												vvalue : LnKFlags.LockDC(pApp.object, true),
												vflagname : cLockDCF
												}, pto);
												
		//setting lock break dc									
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLockBreakDCF +".name"), 
												vhint : Translate("SheetSettings."+ cLockBreakDCF +".descrp"), 
												vtype : "number", 
												vvalue : LnKFlags.LockBreakDC(pApp.object, true),
												vflagname : cLockBreakDCF
												}, pto);
										
		//setting for current of required successes
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ crequiredLPsuccessF +".name"), 
												vhint : Translate("SheetSettings."+ crequiredLPsuccessF +".descrp"), 
												vtype : "numberpart", 
												vvalue : [LnKFlags.currentLPsuccess(pApp.object), LnKFlags.requiredLPsuccess(pApp.object)],
												vflagname : [ccurrentLPsuccessF, crequiredLPsuccessF]
												}, pto);	
	} 
	
	static AddFormulastandardsettings(pApp, pHTML, pData, pType, pto) {
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
	}
	
	//support
	static AddHTMLOption(pHTML, pInfos, pto) {
		let vlabel = "Name";	
		if (pInfos.hasOwnProperty("vlabel")) {
			vlabel = pInfos.vlabel;
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
		
		let vnewHTML = ``;
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
				vnewHTML = vnewHTML + `<input type=${vtype} name="flags.${cModuleName}.${vflagname}" value="${vvalue}">`;
				break;
				
			case "checkbox":
				if (vvalue) {
					vnewHTML = vnewHTML + `<input type=${vtype} name="flags.${cModuleName}.${vflagname}" checked>`;
				}
				else {
					vnewHTML = vnewHTML + `<input type=${vtype} name="flags.${cModuleName}.${vflagname}">`;
				}
				break;
				
			case "select":
				vnewHTML = vnewHTML + `<select name="flags.${cModuleName}.${vflagname}">`;
				
				for (let i = 0; i < voptions.length; i++) {
					if (voptions[i] == vvalue) {
						vnewHTML = vnewHTML + `<option value="${voptions[i]}" selected>${Translate("TokenSettings." + vflagname+ ".options." + voptions[i])}</option>`;
					}
					else {
						vnewHTML = vnewHTML + `<option value="${voptions[i]}">${Translate("TokenSettings." + vflagname+ ".options." + voptions[i])}</option>`;
					}
				}
				
				vnewHTML = vnewHTML + `</select>`;
				break;
			case "numberpart":
				vnewHTML = vnewHTML + `<input type=number name="flags.${cModuleName}.${vflagname[0]}" value="${vvalue[0]}"><label>/</label><input type=number name="flags.${cModuleName}.${vflagname[1]}" value="${vvalue[1]}">`;
				break;
		}
			
		if (vhint != "") {
			vnewHTML = vnewHTML + `
				</div>
					<p class="hint">${vhint}</p>         
				</div>
			`;
		}
		
		//pHTML.find('[name="RideableTitle"]').after(vnewHTML);
		pHTML.find(pto/*`div[data-tab="${cModuleName}"]`*/).append(vnewHTML);
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
}


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