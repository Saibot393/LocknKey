import { cModuleName, Translate, LnKutils} from "../utils/LnKutils.js";
import { LnKSystemutils} from "../utils/LnKSystemutils.js";
import { LnKCompUtils, cArmReach, cArmReachold } from "../compatibility/LnKCompUtils.js";
import { UseKeyonHoveredLock, ChangePasswordHoveredLock, PickHoveredLock, BreakHoveredLock, CustomCheckHoveredLock } from "../KeyManager.js";
import { TogglehoveredLockGM, CopyhoveredLockGM, PastehoveredLockGM, CreateNewKeyhoveredGM } from "../LockManager.js";
import { PickPocketHovered } from "../PickPocketManager.js";
import { cSoundVariants } from "../helpers/LnKSound.js";


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
  
  game.settings.register(cModuleName, "DefaultLockSound", {
	name: Translate("Settings.DefaultLockSound.name"),
	hint: Translate("Settings.DefaultLockSound.descrp"),
	scope: "world",
	config: true,
	type: String,
	choices : cSoundVariants.reduce((vprev, vSound) => ({...vprev, [vSound] : Translate("SheetSettings.SoundVariantFlag.options." + vSound)}),{}),
	default: "off"
  }); 
  
  game.settings.register(cModuleName, "alwaysopenOwned", {
	name: Translate("Settings.alwaysopenOwned.name"),
	hint: Translate("Settings.alwaysopenOwned.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: true
  }); 
  
  game.settings.register(cModuleName, "allowallInteractions", {
	name: Translate("Settings.allowallInteractions.name"),
	hint: Translate("Settings.allowallInteractions.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: false
  }); 
  
  game.settings.register(cModuleName, "showinteractionDCs", {
	name: Translate("Settings.showinteractionDCs.name"),
	hint: Translate("Settings.showinteractionDCs.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: false
  }); 
  
  game.settings.register(cModuleName, "showallLockInteractions", {
	name: Translate("Settings.showallLockInteractions.name"),
	hint: Translate("Settings.showallLockInteractions.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: false
  }); 
  
  game.settings.register(cModuleName, "preventUseinPause", {
	name: Translate("Settings.preventUseinPause.name"),
	hint: Translate("Settings.preventUseinPause.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: true
  }); 
  
  game.settings.register(cModuleName, "useKeyDialogbydefault", {
	name: Translate("Settings.useKeyDialogbydefault.name"),
	hint: Translate("Settings.useKeyDialogbydefault.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: false
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
	default: LnKSystemutils.SystemdefaultKeyitemtype()
  }); 
  
  game.settings.register(cModuleName, "KeyitemCreationPopup", {
	name: Translate("Settings.KeyitemCreationPopup.name"),
	hint: Translate("Settings.KeyitemCreationPopup.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: true
  });
  
  game.settings.register(cModuleName, "KeyitemCreationIDOption", {
	name: Translate("Settings.KeyitemCreationIDOption.name"),
	hint: Translate("Settings.KeyitemCreationIDOption.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: false
  });
  
  game.settings.register(cModuleName, "DefaultKeyFolder", {
	name: Translate("Settings.DefaultKeyFolder.name"),
	hint: Translate("Settings.DefaultKeyFolder.descrp"),
	scope: "world",
	config: true,
	type: String,
	//choices:
	default: ""
  }); 
  
   game.settings.register(cModuleName, "LimitKeyFolders", {
	name: Translate("Settings.LimitKeyFolders.name"),
	hint: Translate("Settings.LimitKeyFolders.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	//choices:
	default: false
  }); 
  
  game.settings.register(cModuleName, "defaultKeyImage", {
	scope: "world",
	config: false,
	type: String,
	//choices:
	default: "icons/sundries/misc/key-steel.webp"
  });  
  
  game.settings.register(cModuleName, "UseKeynameasID", {
	name: Translate("Settings.UseKeynameasID.name"),
	hint: Translate("Settings.UseKeynameasID.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: false
  }); 
  
  game.settings.register(cModuleName, "LnKSettingTypes", {
	name: Translate("Settings.LnKSettingTypes.name"),
	hint: Translate("Settings.LnKSettingTypes.descrp"),
	scope: "world",
	config: true,
	type: String,
	default: "all"
  }); 
  
  game.settings.register(cModuleName, "LnKSettingsubTypes", {
	name: Translate("Settings.LnKSettingsubTypes.name"),
	hint: Translate("Settings.LnKSettingsubTypes.descrp"),
	scope: "world",
	config: LnKSystemutils.candetectSystemSubtype(),
	type: String,
	default: "all"
  }); 
  
  game.settings.register(cModuleName, "usePf2eSystem", {
	name: Translate("Settings.usePf2eSystem.name"),
	hint: Translate("Settings.usePf2eSystem.descrp"),
	scope: "world",
	config: LnKSystemutils.hasSystemrolls(),
	type: Boolean,
	default: false,
	requiresReload: true
  }); 
  
  game.settings.register(cModuleName, "CritMethod", {
	name: Translate("Settings.CritMethod.name"),
	hint: Translate("Settings.CritMethod.descrp"),
	scope: "world",
	config: !game.settings.get(cModuleName, "usePf2eSystem"), //replaced by Pf2e
	type: String,
	choices: {
		"CritMethod-noCrit": Translate("Settings.CritMethod.options.noCrit"),
		"CritMethod-natCrit": Translate("Settings.CritMethod.options.natCrit"),
		"CritMethod-natCritpm10": Translate("Settings.CritMethod.options.natCritpm10"),
		"CritMethod-d100WFRP4": Translate("Settings.CritMethod.options.d100WFRP4"),
		"CritMethod-d100WFRP4Doubles": Translate("Settings.CritMethod.options.d100WFRP4Doubles"),
		"CritMethod-d100CoC7e" : Translate("Settings.CritMethod.options.d100CoC7e"),
		"CritMethod-d10poolCoD2e" : Translate("Settings.CritMethod.options.d10poolCoD2e"),
		"CritMethod-3d20DSA" : Translate("Settings.CritMethod.options.3d20DSA")
	},
	default: "CritMethod-natCrit",
	onChange: pvalue => {
		const cdefaultDCsettings = ["PickPocketDefaultDC", "CustomCircumventDefaultDC", "DefaultBreakDC", "DefaultPickDC"];
		
		for (let i = 0; i < cdefaultDCsettings.length; i++) {
			if (game.settings.get(cModuleName, cdefaultDCsettings[i]) < 0) {
				game.settings.set(cModuleName, cdefaultDCsettings[i], LnKutils.infinitythreshold());
			}
		}
	},
  });
  
  game.settings.register(cModuleName, "LockPickItem", {
	name: Translate("Settings.LockPickItem.name"),
	hint: Translate("Settings.LockPickItem.descrp"),
	scope: "world",
	config: true,
	type: String,
	default: LnKSystemutils.SystemdefaultLockPickItem()
  });  
  
  game.settings.register(cModuleName, "MentionLockPickItem", {
	name: Translate("Settings.MentionLockPickItem.name"),
	hint: Translate("Settings.MentionLockPickItem.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: false
  });  
  
  game.settings.register(cModuleName, "RemoveLPoncritFail", {
	name: Translate("Settings.RemoveLPoncritFail.name"),
	hint: Translate("Settings.RemoveLPoncritFail.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: false
  }); 
  
  game.settings.register(cModuleName, "JamLockonLPcritFail", {
	name: Translate("Settings.JamLockonLPcritFail.name"),
	hint: Translate("Settings.JamLockonLPcritFail.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: false
  });
  
  game.settings.register(cModuleName, "JamedLockKeyunusable", {
	name: Translate("Settings.JamedLockKeyunusable.name"),
	hint: Translate("Settings.JamedLockKeyunusable.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: false
  });
  
  game.settings.register(cModuleName, "defaultLPAttempts", {
	name: Translate("Settings.defaultLPAttempts.name"),
	hint: Translate("Settings.defaultLPAttempts.descrp"),
	scope: "world",
	config: true,
	type: Number,
	default: -1
  }); 
  
  game.settings.register(cModuleName, "autoResetAttempts", {
	name: Translate("Settings.autoResetAttempts.name"),
	hint: Translate("Settings.autoResetAttempts.descrp"),
	scope: "world",
	config: true,
	type: String,
	choices: {
		"off" : Translate("Settings.autoResetAttempts.options.off"),
		"lockchange" : Translate("Settings.autoResetAttempts.options.lockchange"),
		"lpsuccess"	: Translate("Settings.autoResetAttempts.options.lpsuccess")
	},
	default: "off"
  }); 
  
  game.settings.register(cModuleName, "LockPickFormula", {
	name: Translate("Settings.LockPickFormula.name"),
	hint: Translate("Settings.LockPickFormula.descrp"),
	scope: "world",
	config: !game.settings.get(cModuleName, "usePf2eSystem"), //replaced by Pf2e
	type: String,
	default: LnKSystemutils.SystemdefaultLPformula()
  }); 
  
  game.settings.register(cModuleName, "DefaultPickDC", {
	name: Translate("Settings.DefaultPickDC.name"),
	hint: Translate("Settings.DefaultPickDC.descrp"),
	scope: "world",
	config: true,
	type: Number,
	default: -1
  }); 
  
  game.settings.register(cModuleName, "LockBreakFormula", {
	name: Translate("Settings.LockBreakFormula.name"),
	hint: Translate("Settings.LockBreakFormula.descrp"),
	scope: "world",
	config: !game.settings.get(cModuleName, "usePf2eSystem"), //replaced by Pf2e
	type: String,
	default: LnKSystemutils.SystemdefaultLBformula()
  }); 
  
  game.settings.register(cModuleName, "DefaultBreakDC", {
	name: Translate("Settings.DefaultBreakDC.name"),
	hint: Translate("Settings.DefaultBreakDC.descrp"),
	scope: "world",
	config: true,
	type: Number,
	default: -1
  }); 
  
  game.settings.register(cModuleName, "CustomCircumventName", {
	name: Translate("Settings.CustomCircumventName.name"),
	hint: Translate("Settings.CustomCircumventName.descrp"),
	scope: "world",
	config: true,
	type: String,
	onChange: pvalue => game.settings.set(cModuleName, "CustomCircumventActive", pvalue.length > 0),
	default: ""
  }); 
  
  game.settings.register(cModuleName, "CustomCircumventFormula", {
	name: Translate("Settings.CustomCircumventFormula.name"),
	hint: Translate("Settings.CustomCircumventFormula.descrp"),
	scope: "world",
	config: true,
	type: String,
	default: ""
  }); 
  
  game.settings.register(cModuleName, "CustomCircumventDefaultDC", {
	name: Translate("Settings.CustomCircumventDefaultDC.name"),
	hint: Translate("Settings.CustomCircumventDefaultDC.descrp"),
	scope: "world",
	config: true,
	type: Number,
	default: -1
  }); 
  
  game.settings.register(cModuleName, "CustomCircumventActive", {
	name: Translate("Settings.CustomCircumventActive.name"),
	hint: Translate("Settings.CustomCircumventActive.descrp"),
	scope: "world",
	config: false,
	type: Number,
	default: false
  }); 
  
  game.settings.register(cModuleName, "LockBreakunlockable", {
	name: Translate("Settings.LockBreakunlockable.name"),
	hint: Translate("Settings.LockBreakunlockable.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: true
  }); 
  
  game.settings.register(cModuleName, "onlyCombatMultiSuccess", {
	name: Translate("Settings.onlyCombatMultiSuccess.name"),
	hint: Translate("Settings.onlyCombatMultiSuccess.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: false
  }); 

  game.settings.register(cModuleName, "LockCircumventName", {
	name: Translate("Settings.LockCircumventName.name"),
	hint: Translate("Settings.LockCircumventName.descrp"),
	scope: "world",
	config: true,
	type: String,
	default: LnKSystemutils.SystemFreeCircumventdefaultKeyword()
  });   

  game.settings.register(cModuleName, "AutoAcceptIdentityAddition", {
	name: Translate("Settings.AutoAcceptIdentityAddition.name"),
	hint: Translate("Settings.AutoAcceptIdentityAddition.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: false
  }); 

  //Pickpocketing
  game.settings.register(cModuleName, "EnablePickpocketing", {
	name: Translate("Settings.EnablePickpocketing.name"),
	hint: Translate("Settings.EnablePickpocketing.descrp"),
	scope: "world",
	config: true,
	type: Boolean,
	default: true,
	requiresReload: true
  });   
  
  game.settings.register(cModuleName, "PickPocketFormula", {
	name: Translate("Settings.PickPocketFormula.name"),
	hint: Translate("Settings.PickPocketFormula.descrp"),
	scope: "world",
	config: game.settings.get(cModuleName, "EnablePickpocketing"),
	type: String,
	default: LnKSystemutils.SystemdefaultPickPocketformula()
  }); 
  
  game.settings.register(cModuleName, "PickPocketDefaultDC", {
	name: Translate("Settings.PickPocketDefaultDC.name"),
	hint: Translate("Settings.PickPocketDefaultDC.descrp"),
	scope: "world",
	config: game.settings.get(cModuleName, "EnablePickpocketing"),
	type: Number,
	default: -1
  });    

  game.settings.register(cModuleName, "PickPocketDefaultItemDC", {
	name: Translate("Settings.PickPocketDefaultItemDC.name"),
	hint: Translate("Settings.PickPocketDefaultItemDC.descrp"),
	scope: "world",
	config: game.settings.get(cModuleName, "EnablePickpocketing"),
	type: Number,
	default: 0
  });       
  
  game.settings.register(cModuleName, "PickPocketDefaultDCFormula", {
	name: Translate("Settings.PickPocketDefaultDCFormula.name"),
	hint: Translate("Settings.PickPocketDefaultDCFormula.descrp"),
	scope: "world",
	config: game.settings.get(cModuleName, "EnablePickpocketing"),
	type: String,
	default: ""
  });  
  
  game.settings.register(cModuleName, "PickPocketDCCritThreshold", {
	name: Translate("Settings.PickPocketDCCritThreshold.name"),
	hint: Translate("Settings.PickPocketDCCritThreshold.descrp"),
	scope: "world",
	config: game.settings.get(cModuleName, "EnablePickpocketing"),
	type: Number,
	default: 99
  }); 
  
  game.settings.register(cModuleName, "AutoUpdatePickPocketDC", {
	name: Translate("Settings.AutoUpdatePickPocketDC.name"),
	hint: Translate("Settings.AutoUpdatePickPocketDC.descrp"),
	scope: "world",
	config: game.settings.get(cModuleName, "EnablePickpocketing"),
	type: Boolean,
	default: false
  });  
  
  game.settings.register(cModuleName, "PickPocketItemTypes", {
	name: Translate("Settings.PickPocketItemTypes.name"),
	hint: Translate("Settings.PickPocketItemTypes.descrp"),
	scope: "world",
	config: game.settings.get(cModuleName, "EnablePickpocketing"),
	type: String,
	default: LnKSystemutils.SystemPickPocketdefaultTypes()
  });  
  
  game.settings.register(cModuleName, "MaximumPPNumber", {
	name: Translate("Settings.MaximumPPNumber.name"),
	hint: Translate("Settings.MaximumPPNumber.descrp"),
	scope: "world",
	config: game.settings.get(cModuleName, "EnablePickpocketing"),
	type: Number,
	default: -1
  }); 
  
  game.settings.register(cModuleName, "MaximumPPNumberCrit", {
	name: Translate("Settings.MaximumPPNumberCrit.name"),
	hint: Translate("Settings.MaximumPPNumberCrit.descrp"),
	scope: "world",
	config: game.settings.get(cModuleName, "EnablePickpocketing"),
	type: Number,
	default: -1
  }); 
  
  game.settings.register(cModuleName, "MaximumPPNumberFail", {
	name: Translate("Settings.MaximumPPNumberFail.name"),
	hint: Translate("Settings.MaximumPPNumberFail.descrp"),
	scope: "world",
	config: game.settings.get(cModuleName, "EnablePickpocketing"),
	type: Number,
	default: -1
  }); 
  
  game.settings.register(cModuleName, "MaximumPPWeight", {
	name: Translate("Settings.MaximumPPWeight.name"),
	hint: Translate("Settings.MaximumPPWeight.descrp"),
	scope: "world",
	config: game.settings.get(cModuleName, "EnablePickpocketing"),
	type: Number,
	default: -1
  }); 
  
  game.settings.register(cModuleName, "MaximumPPWeightCrit", {
	name: Translate("Settings.MaximumPPWeightCrit.name"),
	hint: Translate("Settings.MaximumPPWeightCrit.descrp"),
	scope: "world",
	config: game.settings.get(cModuleName, "EnablePickpocketing"),
	type: Number,
	default: -1
  }); 
  
  game.settings.register(cModuleName, "MaximumPPWeightFail", {
	name: Translate("Settings.MaximumPPWeightFail.name"),
	hint: Translate("Settings.MaximumPPWeightFail.descrp"),
	scope: "world",
	config: game.settings.get(cModuleName, "EnablePickpocketing"),
	type: Number,
	default: -1
  }); 
  
  game.settings.register(cModuleName, "PickPocketCooldown", {
	name: Translate("Settings.PickPocketCooldown.name"),
	hint: Translate("Settings.PickPocketCooldown.descrp"),
	scope: "client",
	config: true,
	type: Number,
	range: {
		min: 0,
		max: 10,
		step: 0.1
	},
	default: 0
  });  
  
  game.settings.register(cModuleName, "deadActorsLootable", {
	name: Translate("Settings.deadActorsLootable.name"),
	hint: Translate("Settings.deadActorsLootable.descrp"),
	scope: "world",
	config: game.settings.get(cModuleName, "EnablePickpocketing"),
	type: Boolean,
	default: false
  });  
  
  game.settings.register(cModuleName, "lootFilter", {
	name: Translate("Settings.lootFilter.name"),
	hint: Translate("Settings.lootFilter.descrp"),
	scope: "world",
	config: game.settings.get(cModuleName, "EnablePickpocketing"),
	type: String,
	choices: {
		"off"   : Translate("Settings.lootFilter.options.off"),
		"ifavailable" : Translate("Settings.lootFilter.options.ifavailable"),
		"always" : Translate("Settings.lootFilter.options.always")
	},
	default: "off"
  });  
  
  game.settings.register(cModuleName, "PerceptionKeyWord", {
	name: Translate("Settings.PerceptionKeyWord.name"),
	hint: Translate("Settings.PerceptionKeyWord.descrp"),
	scope: "world",
	config: game.settings.get(cModuleName, "EnablePickpocketing") && !LnKSystemutils.canAutodetectSystemPerceptionRoll(),
	type: String,
	default: "Perception"
  }); 
  
  game.settings.register(cModuleName, "MentionPickpocketDetails", {
	name: Translate("Settings.MentionPickpocketDetails.name"),
	hint: Translate("Settings.MentionPickpocketDetails.descrp"),
	scope: "world",
	config: game.settings.get(cModuleName, "EnablePickpocketing"),
	type: Boolean,
	default: false
  });  
  
  //client
  game.settings.register(cModuleName, "ControlSceme", {
	name: Translate("Settings.ControlSceme.name"),
	hint: Translate("Settings.ControlSceme.descrp"),
	scope: "client",
	config: true,
	type: String,
	choices: {
		"ControlSceme-rightKeys"   : Translate("Settings.ControlSceme.options.rightKeys"),
		"ControlSceme-rightPopups" : Translate("Settings.ControlSceme.options.rightPopups")
	},
	default: "ControlSceme-rightKeys"
  });
  
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
  
  game.settings.register(cModuleName, "FreeCircumventButtonPosition", {
	name: Translate("Settings.FreeCircumventButtonPosition.name"),
	hint: Translate("Settings.FreeCircumventButtonPosition.descrp"),
	scope: "client",
	config: true,
	type: String,
	choices: {
		"none": Translate("Settings.FreeCircumventButtonPosition.options.none"),
		"left": Translate("Settings.FreeCircumventButtonPosition.options.left"),
		"right": Translate("Settings.FreeCircumventButtonPosition.options.right")
	},
	default: "none"
  });
  
  game.settings.register(cModuleName, "dblClicktoLoot", {
	name: Translate("Settings.dblClicktoLoot.name"),
	hint: Translate("Settings.dblClicktoLoot.descrp"),
	scope: "client",
	config: true,
	type: Boolean,
	default: true
  });  
  
  //Keys (GM)
  game.keybindings.register(cModuleName, "ToggleLock", {
	name: Translate("Keys.ToggleLock.name"),
	onDown: () => { TogglehoveredLockGM(); },
	restricted: true,
	precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
  
  game.keybindings.register(cModuleName, "CopyLock", {
	name: Translate("Keys.CopyLock.name"),
	onDown: () => { CopyhoveredLockGM(); },
	restricted: true,
	precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
  
  game.keybindings.register(cModuleName, "PasteLock", {
	name: Translate("Keys.PasteLock.name"),
	onDown: () => { PastehoveredLockGM(); },
	restricted: true,
	precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
  
  game.keybindings.register(cModuleName, "CreatenewKey", {
	name: Translate("Keys.CreatenewKey.name"),
	onDown: () => { CreateNewKeyhoveredGM(); },
	restricted: true,
	precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
  
  //Key
  game.keybindings.register(cModuleName, "UseKey", {
    name: Translate("Keys.UseKey.name"),
    editable: [
      {
        key: "KeyK"
      }
    ],
    onDown: () => { UseKeyonHoveredLock(); },
    restricted: false,
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
  
  game.keybindings.register(cModuleName, "PickLock", {
    name: Translate("Keys.PickLock.name"),
    editable: [
      {
        key: "Semicolon"
      }
    ],
    onDown: () => { PickHoveredLock(); },
    restricted: false,
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
  
  game.keybindings.register(cModuleName, "BreakLock", {
    name: Translate("Keys.BreakLock.name"),
    editable: [
      {
        key: "KeyL"
      }
    ],
    onDown: () => { BreakHoveredLock(); },
    restricted: false,
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
  
  game.keybindings.register(cModuleName, "CustomCheck", {
    name: Translate("Keys.CustomCheck.name"),
    onDown: () => { CustomCheckHoveredLock(); },
    restricted: false,
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
  
  game.keybindings.register(cModuleName, "ChangePassword", {
    name: Translate("Keys.ChangePassword.name"),
    editable: [
      {
        key: "KeyU"
      }
    ],
    onDown: () => { ChangePasswordHoveredLock(); },
    restricted: false,
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
  });
  
  game.keybindings.register(cModuleName, "PickPocket", {
    name: Translate("Keys.PickPocket.name"),
    editable: [
      {
        key: "KeyI"
      }
    ],
    onDown: () => { PickPocketHovered(); },
    restricted: false,
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
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
		
		//locks Settings
		vnewHTML = `<h4 class="border">${Translate("Titles.LockSettings")}</h4>`;
		 
		pHTML.find('input[name="' + cModuleName + '.useGMquickKeys"]').closest(".form-group").before(vnewHTML);		
		
		//pick pocket settings
		vnewHTML = `<h4 class="border">${Translate("Titles.PickpocketSettings")}</h3>`;
		 
		pHTML.find('input[name="' + cModuleName + '.EnablePickpocketing"]').closest(".form-group").before(vnewHTML);		
		
		//gm controlls
		vnewHTML = ``;
		for (let i = 0; i <= 4; i++) {
			vnewHTML = vnewHTML + `<p>${Translate("Text.GMControls.line"+i)}</p>`
		}
		
		pHTML.find('input[name="' + cModuleName + '.PerceptionKeyWord"]').closest(".form-group").after(vnewHTML);
		
		//first client setting
		vnewHTML = `
					<hr>
					<h3 class="border">${Translate("Titles.ClientSettings")}</h3>
					`;
		 
		pHTML.find('select[name="' + cModuleName + '.ControlSceme"]').closest(".form-group").before(vnewHTML);
	}
	
	//player controlls
	vnewHTML = ``;
	for (let i = 0; i <= 3; i++) {
		vnewHTML = vnewHTML + `<p>${Translate("Text.PlayerControls.line"+i)}</p>`
	}
	
	pHTML.find('select[name="' + cModuleName + '.dblClicktoLoot"]').closest(".form-group").after(vnewHTML);
});