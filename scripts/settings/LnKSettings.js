import { cModuleName, Translate, LnKutils} from "../utils/LnKutils.js";
import { LnKCompUtils, cArmReach, cArmReachold } from "../compatibility/LnKCompUtils.js";

Hooks.once("init", () => {  // game.settings.get(cModuleName, "")
  //Settings
  game.settings.register(cModuleName, "useGMquickKeys", {
	name: Translate("Settings.useGMquickKeys.name"),
	hint: Translate("Settings.useGMquickKeys.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: true
  }); 
  
  game.settings.register(cModuleName, "allowLocking", {
	name: Translate("Settings.allowLocking.name"),
	hint: Translate("Settings.allowLocking.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: true
  }); 
  
  game.settings.register(cModuleName, "startasLocked", {
	name: Translate("Settings.startasLocked.name"),
	hint: Translate("Settings.startasLocked.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: false
  }); 
  
  game.settings.register(cModuleName, "LockDistance", {
	name: Translate("Settings.LockDistance.name"),
	hint: Translate("Settings.LockDistance.descrp"),
	scope: "world",
	config: true,
	type: Number,
	default: 15
  }); 
  
  game.settings.register(cModuleName, "UseArmReachDistance", {
	name: Translate("Settings.UseArmReachDistance.name"),
	hint: Translate("Settings.UseArmReachDistance.descrp"),
	scope: "world",
	config: (LnKCompUtils.isactiveModule(cArmReach) || LnKCompUtils.isactiveModule(cArmReachold)),
	type: Boolean,
	default: false
  }); 
  
  game.settings.register(cModuleName, "alwaysopenOwned", {
	name: Translate("Settings.alwaysopenOwned.name"),
	hint: Translate("Settings.alwaysopenOwned.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: true
  }); 
  
  game.settings.register(cModuleName, "preventUseinPause", {
	name: Translate("Settings.preventUseinPause.name"),
	hint: Translate("Settings.preventUseinPause.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: true
  }); 
  
  /*
  game.settings.register(cModuleName, "autoKeyuse", {
	name: Translate("Settings.autoKeyuse.name"),
	hint: Translate("Settings.autoKeyuse.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: true
  }); 
  */
  
  game.settings.register(cModuleName, "KeyItemtype", {
	name: Translate("Settings.KeyItemtype.name"),
	hint: Translate("Settings.KeyItemtype.descrp"),
	scope: "world",
	config: true,
	type: String,
	default: LnKutils.Systemdefaultitemtype()
  }); 
  
  game.settings.register(cModuleName, "LockPickItem", {
	name: Translate("Settings.LockPickItem.name"),
	hint: Translate("Settings.LockPickItem.descrp"),
	scope: "world",
	config: true,
	type: String,
	default: LnKutils.SystemdefaultLockPickItem()
  }); 
  
  game.settings.register(cModuleName, "LockPickFormula", {
	name: Translate("Settings.LockPickFormula.name"),
	hint: Translate("Settings.LockPickFormula.descrp"),
	scope: "world",
	config: true,
	type: String,
	default: LnKutils.SystemdefaultLPformula()
  }); 
  
  //client
  game.settings.register(cModuleName, "MessagePopUps", {
	name: Translate("Settings.MessagePopUps.name"),
	hint: Translate("Settings.MessagePopUps.descrp"),
	scope: "client",
	config: true,
	type: Boolean,
	default: true
  }); 
  
  game.settings.register(cModuleName, "PlayLockSounds", {
	name: Translate("Settings.PlayLockSounds.name"),
	hint: Translate("Settings.PlayLockSounds.descrp"),
	scope: "client",
	config: true,
	type: Boolean,
	default: true
  }); 
});

//Hooks
Hooks.on("renderSettingsConfig", (pApp, pHTML, pData) => {
	//add a few titles	
	
	let vnewHTML;
	
	if (game.user.isGM) {
		//first world setting
		vnewHTML = `<h3 class="border">${Translate("Titles.WorldSettings")}</h3>`;
		 
		pHTML.find('input[name="' + cModuleName + '.useGMquickKeys"]').closest(".form-group").before(vnewHTML);
		
		//gm controlls
		vnewHTML = ``;
		for (let i = 0; i <= 4; i++) {
			vnewHTML = vnewHTML + `<p>${Translate("Text.GMControls.line"+i)}</p>`
		}
		
		pHTML.find('input[name="' + cModuleName + '.LockPickFormula"]').closest(".form-group").after(vnewHTML);
		
		//first client setting
		vnewHTML = `
					<hr>
					<h3 class="border">${Translate("Titles.ClientSettings")}</h3>
					`;
		 
		pHTML.find('input[name="' + cModuleName + '.MessagePopUps"]').closest(".form-group").before(vnewHTML);
	}
});