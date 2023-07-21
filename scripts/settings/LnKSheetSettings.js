import { LnKutils, cModuleName, Translate } from "../utils/LnKutils.js";
import { LnKFlags } from "../helpers/LnKFlags.js";

const cLnKLockIcon = "fa-lock";

class LnKSheetSettings {
	//DECLARATIONS
	static TestSetting(vApp, vHTML, vData) {} //just for test purposes
	
	static ItemSheetSettings(pApp, pHTML, pData) {} //add settings to key item sheet
	
	static WallSheetSettings(pApp, pHTML, pData) {} //add settinsg to wall sheet
	
	static AddHTMLOption(pHTML, pInfos, pto) {} //adds a new HTML option to pto in pHTML
	
	//IMPLEMENTATIONS
	
	static TestSetting(pApp, pHTML, pData) {
		//create title (under which all settings are placed)
		//let vTittleHTML = `<h3 class="border" name="RideableTitle">${Translate("Titles.Rideable")}</h3>`;
		//pHTML.find('input[name="lockRotation"]').closest(".form-group").after(vTittleHTML);
		
		//create new tab
		let vTabsheet = pHTML.find(`.sheet-tabs`);
		let vprevTab = pHTML.find(`div[data-tab="resources"]`); //places rideable tab after last core tab "resources"
		
		let vTabButtonHTML = 	`
						<a class="item" data-tab="${cModuleName}">
							<i class="fas ${cRideableIcon}"></i>
							${Translate("Titles."+cModuleName)}
						</a>
						`; //tab button HTML
		let vTabContentHTML = `<div class="tab" data-group="main" data-tab="${cModuleName}"></div>`; //tab content sheet HTML	
		
		vTabsheet.append(vTabButtonHTML);
		vprevTab.after(vTabContentHTML);
		
		//create settings in reversed order	
													
		//Token is Rideable Setting
		RideableTokenSettings.AddHTMLOption(pHTML, {vlabel : Translate("TokenSettings."+ cissetRideableF +".name"), 
													vhint : Translate("TokenSettings."+ cissetRideableF +".descrp"), 
													vtype : "checkbox", 
													vvalue : RideableFlags.TokenissetRideable(pApp.token),
													vflagname : cissetRideableF
													});
													
		if (game.user.isGM) {//GM settings
			let vGMTittleHTML = `
									<hr>
									<h3 class="border" name="RideableTitle">${Translate("Titles.GMonly")}</h3>
								`;
			pHTML.find(`div[data-tab="${cModuleName}"]`).append(vGMTittleHTML);
		
			//Tokens spawned on creation
			RideableTokenSettings.AddHTMLOption(pHTML, {vlabel : Translate("TokenSettings."+ cSpawnRidersF +".name"), 
														vhint : Translate("TokenSettings."+ cSpawnRidersF +".descrp"), 
														vtype : "text",
														vwide : true,
														vvalue : RideableFlags.SpawnRidersstring(pApp.token), 
														vflagname : cSpawnRidersF
														});
		}
													
		
		pApp.setPosition({ height: "auto" });
		
	} 
	
	static ItemSheetSettings(pApp, pHTML, pData) {
		let vTabsheet = pHTML.find(`.sheet-tabs`);
		let vprevTab = pHTML.find(`div[data-tab="details"]`); //places rideable tab after last core tab "details"
		
		let vTabButtonHTML = 	`
						<a class="list-row" data-tab="${cModuleName}">
							${Translate("Titles."+cModuleName)}
						</a>
						`; //tab button HTML
		let vTabContentHTML = `<div class="tab" data-group="main" data-tab="${cModuleName}"></div>`; //tab content sheet HTML
		
		vTabsheet.append(vTabButtonHTML);
		vprevTab.after(vTabContentHTML);		
	}
	
	static WallSheetSettings(pApp, pHTML, pData) {
		let vprevElement = pHTML.find(`fieldset.door-options`);
		
		let vNewSection = `	<fieldset class="${cModuleName}-options">
								<legend>${Translate("Titles."+cModuleName)}</legend>
							</fieldset>`;
							
		vprevElement.after(vNewSection);
	}
	
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

Hooks.on("renderItemSheet", (vApp, vHTML, vData) => LnKSheetSettings.ItemSheetSettings(vApp, vHTML, vData));

Hooks.on("renderWallConfig", (vApp, vHTML, vData) => {console.log("check"); LnKSheetSettings.WallSheetSettings(vApp, vHTML, vData)});