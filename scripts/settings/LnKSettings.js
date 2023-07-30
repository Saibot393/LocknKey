import { cModuleName, Translate, LnKutils} from "../utils/LnKutils.js";
import { LnKSystemutils} from "../utils/LnKSystemutils.js";
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
	default: LnKSystemutils.Systemdefaultitemtype()
  }); 
  
  game.settings.register(cModuleName, "CritMethod", {
	name: Translate("Settings.CritMethod.name"),
	hint: Translate("Settings.CritMethod.descrp"),
	scope: "world",
	config: true,
	type: String,
	choices: {
		"CritMethod-noCrit": Translate("Settings.CritMethod.options.noCrit"),
		"CritMethod-natCrit": Translate("Settings.CritMethod.options.natCrit"),
		"CritMethod-natCritpm10": Translate("Settings.CritMethod.options.natCritpm10")
	},
	default: "CritMethod-natCrit"
  });
  
  game.settings.register(cModuleName, "LockPickItem", {
	name: Translate("Settings.LockPickItem.name"),
	hint: Translate("Settings.LockPickItem.descrp"),
	scope: "world",
	config: true,
	type: String,
	default: LnKSystemutils.SystemdefaultLockPickItem()
  });  
  
  game.settings.register(cModuleName, "RemoveLPoncritFail", {
	name: Translate("Settings.RemoveLPoncritFail.name"),
	hint: Translate("Settings.RemoveLPoncritFail.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: false
  }); 
  
  game.settings.register(cModuleName, "LockPickFormula", {
	name: Translate("Settings.LockPickFormula.name"),
	hint: Translate("Settings.LockPickFormula.descrp"),
	scope: "world",
	config: true,
	type: String,
	default: LnKSystemutils.SystemdefaultLPformula()
  }); 
  
  game.settings.register(cModuleName, "LockBreakFormula", {
	name: Translate("Settings.LockBreakFormula.name"),
	hint: Translate("Settings.LockBreakFormula.descrp"),
	scope: "world",
	config: true,
	type: String,
	default: LnKSystemutils.SystemdefaultLBformula()
  }); 
  
  game.settings.register(cModuleName, "LockBreakunlockable", {
	name: Translate("Settings.LockBreakunlockable.name"),
	hint: Translate("Settings.LockBreakunlockable.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: true
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
		
		pHTML.find('input[name="' + cModuleName + '.LockBreakunlockable"]').closest(".form-group").after(vnewHTML);
		
		//first client setting
		vnewHTML = `
					<hr>
					<h3 class="border">${Translate("Titles.ClientSettings")}</h3>
					`;
		 
		pHTML.find('input[name="' + cModuleName + '.MessagePopUps"]').closest(".form-group").before(vnewHTML);
		
		//player controlls
		vnewHTML = ``;
		for (let i = 0; i <= 3; i++) {
			vnewHTML = vnewHTML + `<p>${Translate("Text.PlayerControls.line"+i)}</p>`
		}
		
		pHTML.find('input[name="' + cModuleName + '.PlayLockSounds"]').closest(".form-group").after(vnewHTML);
	}
});