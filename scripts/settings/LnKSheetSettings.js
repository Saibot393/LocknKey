import { LnKutils, cModuleName, Translate } from "../utils/LnKutils.js";
import { LnKFlags, cIDKeysF, cLockableF, cLockedF, cLockDCF } from "../helpers/LnKFlags.js";

const cLnKLockIcon = "fa-lock";
const cLnKKeyIcon = "fa-key";

class LnKSheetSettings {
	//DECLARATIONS
	static TestSetting(vApp, vHTML, vData) {} //just for test purposes
	
	static ItemSheetSettings(pApp, pHTML, pData) {} //add settings to key item sheet
	
	static WallSheetSettings(pApp, pHTML, pData) {} //add settinsg to wall sheet
	
	static TokenSheetSettings(pApp, pHTML, pData) {} //add settinsg to token sheet
	
	//support
	static AddHTMLOption(pHTML, pInfos, pto) {} //adds a new HTML option to pto in pHTML
	
	//IMPLEMENTATIONS
	
	static ItemSheetSettings(pApp, pHTML, pData) {
		//setup
		console.log(pApp);
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
		//setting item ids	
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cIDKeysF +".name"), 
												vhint : Translate("SheetSettings."+ cIDKeysF +".descrp.key"), 
												vtype : "text", 
												vwide : true,
												vvalue : LnKFlags.KeyIDs(pApp.object),
												vflagname : cIDKeysF
												}, `div[data-tab="${cModuleName}"]`);		
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
		//settings
												
		//setting wall ids									
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cIDKeysF +".name"), 
												vhint : Translate("SheetSettings."+ cIDKeysF +".descrp.lock"), 
												vtype : "text", 
												vwide : true,
												vvalue : LnKFlags.KeyIDs(pApp.object),
												vflagname : cIDKeysF
												}, `fieldset.${cModuleName}-options`);
												
		//setting lock dc									
		LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLockDCF +".name"), 
												vhint : Translate("SheetSettings."+ cLockDCF +".descrp"), 
												vtype : "number", 
												vvalue : LnKFlags.LockDC(pApp.object, true),
												vflagname : cLockDCF
												}, `fieldset.${cModuleName}-options`);
	}
	
	static TokenSheetSettings(pApp, pHTML, pData) {
		//setup
		if (LnKutils.isLockCompatible(pApp.token)) {
			//only certain tokens are lock compatible
			let vTabbar = pHTML.find(`.sheet-tabs`);
			let vprevTab = pHTML.find(`div[data-tab="resources"]`); //places rideable tab after last core tab "details"
			
			let vTabButtonHTML = 	`
							<a class="item" data-tab="${cModuleName}">
								<i class="fas ${cLnKLockIcon}"></i>
								${Translate("Titles."+cModuleName)}
							</a>
							`; //tab button HTML
			let vTabContentHTML = `<div class="tab" data-group="main" data-tab="${cModuleName}"></div>`; //tab content sheet HTML
			
			vTabbar.append(vTabButtonHTML);
			vprevTab.after(vTabContentHTML);	
				
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
													
			//setting token ids								
			LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cIDKeysF +".name"), 
													vhint : Translate("SheetSettings."+ cIDKeysF +".descrp.lock"), 
													vtype : "text", 
													vwide : true,
													vvalue : LnKFlags.KeyIDs(pApp.token),
													vflagname : cIDKeysF
													}, `div[data-tab="${cModuleName}"]`);

			//setting lock dc		
			LnKSheetSettings.AddHTMLOption(pHTML, {vlabel : Translate("SheetSettings."+ cLockDCF +".name"), 
													vhint : Translate("SheetSettings."+ cLockDCF +".descrp"), 
													vtype : "number", 
													vvalue : LnKFlags.LockDC(pApp.object, true),
													vflagname : cLockDCF
													}, `div[data-tab="${cModuleName}"]`);													
		}
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
}


Hooks.once("ready", () => {
	if (game.user.isGM) {
		//register settings only for GM
		
		Hooks.on("renderItemSheet", (vApp, vHTML, vData) => LnKSheetSettings.ItemSheetSettings(vApp, vHTML, vData)); //for items

		Hooks.on("renderWallConfig", (vApp, vHTML, vData) => LnKSheetSettings.WallSheetSettings(vApp, vHTML, vData)); //for walls

		Hooks.on("renderTokenConfig", (vApp, vHTML, vData) => LnKSheetSettings.TokenSheetSettings(vApp, vHTML, vData)); //for tokens
	}
});