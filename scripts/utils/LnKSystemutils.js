import {cModuleName, LnKutils, Translate, cDelimiter, cLUpickLock, cLUbreakLock, cUPickPocket} from "./LnKutils.js";

//system names
const cPf2eName = "pf2e"; //name of Pathfinder 2. edition system
const cPf1eName = "pf1"; //name of Pathfinder 1. edition system
const cDnD5e = "dnd5e"; //name of D&D 5e system
const cDnD35e = "D35E"; //name of the D&D 3.5e system
const cAdvanced5e = "a5e"; //name of the advanced D&D 5e system
const cStarFinderName = "sfrpg"; //name of Starfinder system
const c13thage = "archmage"; //name of the 13th age system
const cCoC7 = "CoC7"; //name of call of cthulhu 7 system
const cWarhammer4e = "wfrp4e"; //name of the warhammer 4e system
const cDarkEye5e = "dsa5"; //name of the black eye 5e system
const cBitD = "blades-in-the-dark"; //name of the blades in the dark system
const cCyberpunkRED = "cyberpunk-red-core"; //name of the cyberpunk red core system
const cSandbox = "sandbox"; //name of the sandbox system
const cWarhammerFRP4e = "wfrp4e"; //name of the warhammer fantasy roleplaying 4e system
const cCoC7e = "CoC7"; //name of the Call of Cthulhu system 7th edition
const cDSA5 = "dsa5"; //name of the Das schwarze Auge system (5e)
const cSWADE = "swade"; //name of the SWADE system

//Tokentype
const cPf2eLoottype = "loot"; //type of loot tokens in Pf2e

const Pf2eSkillDictionary = {
    acr: "acrobatics",
    arc: "arcana",
    ath: "athletics",
    cra: "crafting",
    dec: "deception",
    dip: "diplomacy",
    itm: "intimidation",
    med: "medicine",
    nat: "nature",
    occ: "occultism",
    prf: "performance",
    rel: "religion",
    soc: "society",
    ste: "stealth",
    sur: "survival",
    thi: "thievery"
}

const DSAskills = {
    de: {
        LockusePick : "Schlösserknacken",
        LockuseBreak : "Kraftakt",
		UsePickPocket : "Taschendiebstahl"
    },
    en: {
        LockusePick : "Pick Locks",
        LockuseBreak : "Feat of Strength",
		UsePickPocket : "Pickpocket"
    }
}

//Lock Types
const cLockTypeLootPf2e = "LTLootPf2e"; //type for Token

export { cPf2eLoottype, cLockTypeLootPf2e }

//takes care of system specific stuff
class LnKSystemutils {
	//DELCARATIONS	
	//Identification
	static isPf2e() {} //used for special Pf2e functions
	
	//system defaults
	static SystemdefaultKeyitemtype() {} //returns the default type of item for keys in the current system
	
	static SystemPickPocketdefaultTypes() {} //returns the list auf default pick pocketable items types
	
	static SystemdefaultLockPickItem() {} //returns the default Lock Pick item in the current system
	
	static SystemdefaultLPformula() {} //returns the default formula for Lock Picking in the current system	
	
	static SystemdefaultLBformula() {} //returns the default formula for Lock breaking in the current system	
	
	static SystemdefaultPickPocketformula() {} //returns the default formula for pick pocketing in the current system
	
	static SystemInventory(pToken) {} //returns the inventory of pToken in the current system
	
	static SystemFreeCircumventdefaultKeyword() {} //returns the default key word for Free Circumvents
	
	static isFreeCircumvent(pMessage) {} //returns if pMessage causes a free circumvent
	
	static ResettoStandardFormulas(pResets = {pLP : true, pLB : true}) {} //resets the formulas to the standard formulas
	
	//rolls
	static isSystemPerceptionRoll(pMessage, pInfos) {} //returns if the message belongs to a perception roll
	
	static skillitems(pActor) {} //returns an object containing all items of type skill
	
	//subtypes
	static candetectSystemSubtype() {} //returns if an item can be detected in this system
	
	static SystemSubtype(pItem) {} //returns system specific subtype of pItem
	
	//system rolls
	static hasSystemrolls() {} //returns if system rolls are available for this system
	
	static systemRoll(ptype, pactor, pcallback, pinfos = {baseDC : 0}) {} //called for system rolls
	
	static systemSuccesdegree(pData) {} //returns the succes degree based on system
	
	//items
	static isInContainer(pContainer, pItem) {} //returns if pItem is in Container
	
	static isContainer(pContainer) {} //returns if pContainer is container
	
	static containerContent(pContainer) {} //retruns content ids of pContainer
	
	static weightof(pItem) {} //tries to workout the in game weight of pItem in respective units
	
	//IMPLEMENTATIONS
	//Identification	
	static isPf2e() {
		return game.system.id === cPf2eName;
	}
	
	//system defaults
	static SystemdefaultKeyitemtype() {
		switch (game.system.id) {
			case cPf2eName:
				return "equipment";
				break;
			case cDnD5e:
				return "tool";
				break;
			case cDnD35e:
				return "equipment";
				break;
			case cStarFinderName:
				return "technological";
				break;
			case cAdvanced5e:
				return "object";
				break;
			case c13thage:
				return "tool";
				break;
			case cCoC7:
				return "item";
				break;
			case cWarhammer4e:
				return "cargo";
				break;
			case cDarkEye5e:
				return "equipment";
				break;
			case cPf1eName:
				return "equipment";
				break;
			case cBitD:
				return "item";
				break;
			case cCyberpunkRED:
				return "gear";
				break;
			case cSandbox:
				return "cItem";
				break;
			default:
				//default fall backs
				if (game.items) {
					if (game.items.documentClass.TYPES.includes("object")) {
						return "object"
					}
					if (game.items.documentClass.TYPES.includes("item")) {
						return "item"
					}
					if (game.items.documentClass.TYPES.includes("tool")) {
						return "tool"
					}
					if (game.items.documentClass.TYPES.includes("equipment")) {
						return "equipment"
					}
					if (game.items.documentClass.TYPES.includes("gear")) {
						return "gear"
					}
					return game.items.documentClass.TYPES[0];
				}
				break;
		}
		
		return "";
	}
	
	static SystemPickPocketdefaultTypes() {
		switch (game.system.id) {
			case cPf2eName:
				return "#currency;armor;backpack;consumable;equipment;kit;shield;treasure;weapon";
				break;
			case cDnD5e:
				return "#currency;weapon;equipment;consumable;tool;loot;container";
				break;
			case cStarFinderName:
				return "#currency;ammunition;consumable;container;equipment;goods;hybrid;magic;shield;technological;upgrade;weapon;weaponAccessory";
				break;
			case cCoC7:
				return "#currency;item;weapon;book";
				break;
			case cWarhammer4e:
				return "#currency;ammunition;armour;container;money;weapon;cargo";
				break;
			case cDarkEye5e:
				return "#currency;equipment;armor;ammunition;rangeweapon;meleeweapon;money;consumable;plant;magicalsign;book";
				break;
			/*
			case cPf1eName:
				return "equipment";
				break;
			case cCyberpunkRED:
				return "gear";
				break;
			*/
			default:
				return "all";
				break;
		}
		
		return "";
	}
	
	static SystemdefaultLockPickItem() {
		switch (game.system.id) {
			case cPf2eName:
				return "zvLyCVD8g2PdHJAc;6nrCxNQFycUVFOV2;Ejmv9IHGp9Ad9dgu;QnuL1UEot8ptWNb1;spqcRLBsMOC9WTcd;fprUZviW8khm2BLo;AFE073UYI0mkWuUs";
				break;
			case cDnD5e:
				return "woWZ1sO5IUVGzo58";
				break;
			case cDnD35e:
				return "JPR4dAKnUbJFsvMi;JPR4dAdnUbJFsvMi";
				break;
			case cPf1eName:
				return "Tools, Thieves'";
				break;
			default:
				return "";
		}		
	}
	
	static SystemdefaultLPformula() {
		switch (game.system.id) {
			case cPf2eName:
				return "1d20 + @actor.skills.thievery.mod";
			case cDnD5e:
				return "1d20 + @actor.system.abilities.dex.mod + @actor.system.tools.thief.prof.flat + @actor.system.tools.thief.bonus";
			case cDnD35e:
				return "1d20 + @actor.system.skills.opl.mod";
			case cStarFinderName:
				return "1d20 + @actor.system.skills.eng.mod";
			case cPf1eName:
				return "1d20 + @actor.system.skills.dev.mod";
			case cWarhammer4e:
				return "1d100 - @actor.characteristics.dex.value";
			case cCoC7e:
				return "1d100/@actor.system.skills.Locksmith.value";
			case cDSA5:
				return `(max(1d20 - (@actor.system.characteristics.in.value + min(@DC, 0)), 0) + max(1d20 - (@actor.system.characteristics.ff.value + min(@DC, 0)),0) + max(1d20 - (@actor.system.characteristics.ff.value + min(@DC, 0)),0)) - (@skills.Pick_Locks.system.talentValue.value + max(@DC, 0))`;
				break;
			case cSWADE:
				return "{1d@(skills.Thievery.system.die.sides)x,1d6x}kh + @skills.Thievery.system.die.modifier";
				break;
			default:
				return "";
		}
	}
	
	static SystemdefaultLBformula() {
		switch (game.system.id) {
			case cPf2eName:
				return "1d20 + @actor.skills.athletics.mod - 2";
				break;
			case cDnD5e:
				return "1d20 + @actor.system.abilities.str.mod + @actor.system.skills.ath.prof.flat";
				break;
			case cDnD35e:
				return "1d20 + @actor.system.abilities.str.mod";
				break;
			case cStarFinderName:
				return "1d20 + @actor.system.skills.ath.mod";
				break;
			case cPf1eName:
				return "1d20 + @actor.system.abilities.str.mod";
				break;
			case cCoC7e:
				return "1d100/@actor.system.characteristics.str.value";
				break;
			case cDSA5:
				return `(max(1d20 - (@actor.system.characteristics.ko.value + min(@DC, 0)), 0) + max(1d20 - (@actor.system.characteristics.kk.value + min(@DC, 0)),0) + max(1d20 - (@actor.system.characteristics.kk.value + min(@DC, 0)),0)) - (@skills.${game.i18n.localize("LocalizedIDs.featOfStrength")}.system.talentValue.value + max(@DC, 0))`;
				break;
			case cSWADE:
				return "{1d@(skills.Athletics.system.die.sides)x,1d6x}kh + @skills.Athletics.system.die.modifier";
				break;
			default:
				return "";
		}		
	}
	
	static SystemdefaultPickPocketformula() {
		switch (game.system.id) {
			case cPf2eName:
				return "1d20 + @actor.skills.thievery.mod";
				break;
			case cDnD5e:
				return "1d20 + @actor.system.abilities.dex.mod + @actor.system.skills.slt.prof.flat";
				break;
			case cDnD35e:
				return "1d20 + @actor.system.skills.slt.mod";
				break;
			case cStarFinderName:
				return "1d20 + @actor.system.skills.sle.mod";
				break;
			case cPf1eName:
				return "1d20 + @actor.system.skills.slt.mod";
				break;
			default:
				return "";
		}		
	}
	
	static SystemInventory(pToken) {
		switch (game.system.id) {
			case cSandbox:
				return pToken.actor.system.citems.map(vItem => game.items.get(vItem.id) || game.items.get(vItem.ciKey)).filter(vItem => vItem);
			default:
				return pToken.actor.items;
		}
	}
	
	static SystemFreeCircumventdefaultKeyword() {
		switch (game.system.id) {
			case cDnD5e:
				return "Knock";
			default:
				return "";
		}		
	}
	
	static isFreeCircumvent(pMessage) {
		if (game.settings.get(cModuleName, "LockCircumventName").length > 0) {
			let vWords = game.settings.get(cModuleName, "LockCircumventName").split(cDelimiter);
			
			return vWords.includes(pMessage.flavor) || vWords.find(vWord => pMessage.content.includes(vWord));
		}
		else {
			return false;
		}
	}
	
	static async ResettoStandardFormulas(pResets = {pLP : true, pLB : true, pPP : true}) {
		if (pResets.pLP) {
			await game.settings.set(cModuleName, "LockPickFormula", LnKSystemutils.SystemdefaultLPformula());
		}
		
		if (pResets.pLB) {
			await game.settings.set(cModuleName, "LockBreakFormula", LnKSystemutils.SystemdefaultLBformula());
		}
		
		if (pResets.pPP) {
			await game.settings.set(cModuleName, "PickPocketFormula", LnKSystemutils.SystemdefaultPickPocketformula());
		}
	}
	
	//rolls
	static isSystemPerceptionRoll(pMessage, pInfos) {
		if (pMessage.isRoll) {
			let vSystemInfo = pMessage.flags?.[game.system.id];
			
			let vSkill = "";
			
			if (vSystemInfo) {
				switch (game.system.id) {
					case cPf2eName:
						vSkill = Object.keys(Pf2eSkillDictionary).find(vKey => Pf2eSkillDictionary[vKey] == vSystemInfo?.modifierName);
						
						pInfos["skill"] = vSkill;
						
						return vSystemInfo.context?.type == "perception-check";
						break;
					case cDnD5e:
						pInfos["skill"] = vSystemInfo.roll?.skillId;
					
						return vSystemInfo.roll?.skillId == "prc";
						break;
					case cPf1eName:
						pInfos["skill"] = vSystemInfo.subject?.skill;
					
						return vSystemInfo.subject?.skill == "per";
						break;
					default : 
						return pMessage.flavor.includes(game.settings.get(cModuleName, "PerceptionKeyWord"));
						break;
				}
			}
		}
		else {
			//key word recognition
		}
		
		return false;
	}
	
	static skillitems(pActor) {
		let vItems = pActor.items.filter(item => ["skill"].includes(item.type));
		
		let vItemset = {};
		
		for (let i = 0; i < vItems.length; i++) {
			let vSkillName = LnKutils.validChars(vItems[i]?.name.replace(" ", "_").replace("/", "_"));
			
			if (!vSkillName) {
				vItems[i]?.id;
			}
			
			if (vSkillName) {
				vItemset[vSkillName] = vItems[i];
			}
		}
		
		return vItemset;
	}
	
	static canAutodetectSystemPerceptionRoll() {
		return [cPf2eName, cDnD5e, cPf1eName].includes(game.system.id);
	}
	
	//subtypes
	static candetectSystemSubtype() {
		return [cDSA5].includes(game.system.id);
	} 
	
	static SystemSubtype(pItem) {
		switch (game.system.id) {
			case cDSA5:
				return pItem?.system.equipmentType?.value;
				break;
		}
		
		return false;
	}
	
	//system rolls
	static hasSystemrolls() {
		return [cPf2eName, cDSA5].includes(game.system.id);
	}
	
	static systemRoll(ptype, pactor, pcallback, pinfos = {baseDC : 0}) {
		switch (game.system.id) {
			case cPf2eName:
				switch(ptype) {
					case cLUpickLock:
						game.pf2e.actions.pickALock({
							actors: pactor,
							callback: (proll) => {pcallback(LnKSystemutils.systemSuccesdegree({roll : proll}), proll.total)},
							difficultyClass: {value : pinfos.baseDC}
						});
						break;
					case cLUbreakLock:
						game.pf2e.actions.forceOpen({
							actors: pactor,
							callback: (proll) => {pcallback(LnKSystemutils.systemSuccesdegree({roll : proll}), proll.total)},
							difficultyClass: {value : pinfos.baseDC}
						});
						break;
					case cUPickPocket:
						game.pf2e.actions.steal({
							actors: pactor,
							callback: (proll) => {pcallback(LnKSystemutils.systemSuccesdegree({roll : proll}), proll.total)},
							difficultyClass: {value : pinfos.baseDC}
						});
						break;
				}
				break;
			case cDSA5:
				let vSkill = pactor.items.find(x => x.type == "skill" && x.name == DSAskills[game.i18n.lang][ptype]);
				
				if (vSkill) {
					pactor.setupSkill(vSkill, { modifier: pinfos.baseDC/*, subtitle: ` (${Translate("Titles." + ptype)})`*/}, pactor.sheet.getTokenId()).then(async(psetupData) => {
							psetupData.testData.opposable = false
							const cresultdata = await pactor.basicTest(psetupData);
				
							pcallback(LnKSystemutils.systemSuccesdegree(cresultdata), 0);
					});
				}
				break;
		}
	}
	
	static systemSuccesdegree(pData) {
		switch (game.system.id) {
			case cPf2eName:
				switch (pData.roll.outcome) {
					case 'criticalFailure':
						return -1;
						break;
					case 'failure':
						return 0;
						break;
					case 'success':
						return 1;
						break;
					case 'criticalSuccess':
						return 2;
						break;
					default:
						return 0;
						break;
				}
				break;
			case cDSA5:
				let vDSAresult = pData.result.successLevel;
				
				if (vDSAresult > 0) {
					return vDSAresult;
				}
				
				if (vDSAresult < 0) {
					return vDSAresult + 1;
				}
				break;
		}
	}
	
	//items
	static isInContainer(pContainer, pItem) {
		console.log(pItem);
		if (pContainer?.system) {
			if (pContainer.system?.contents) {
				return pContainer.system.contents?.has(pItem.id);
			}
			
			if (pContainer.system?.container?.contents) {
				return pContainer.system.container.contents.find(vEntry => vEntry.id == pItem.id);
			}
			
			if (pContainer.contents) {
				return pContainer.contents?.has(pItem.id);
			}
		}
		
		return false;
	}
	
	static isContainer(pContainer) {
		if (pContainer) {
			if (pContainer.system?.contents) {
				return true;
			}
			
			if (pContainer.system?.container?.contents) {
				return true;
			}
			
			if (pContainer.contents) {
				return true;
			}
		}
		
		return false;
	}
	
	static weightof(pItem) {
		if (pItem?.system?.weight) {
			let vWeight = pItem.system.weight;
			
			if (!isNaN(vWeight.value)) {
				return Number(vWeight.value);
			}
		}
		
		if (pItem?.system?.bulk) {
			let vBulk = pItem.system.bulk;
			
			if (!isNaN(vBulk)) {
				return Number(pItem.system.bulk);
			}
			
			if (vBulk == "L") {
				return 0.1;
			}
			
			if (!isNaN(vBulk.value)) {
				return Number(vBulk.value);
			}
		}
	}
}

export function ResettoStandardFormulas(pResets = {pLP : true, pLB : true, pPP : true}) {LnKSystemutils.ResettoStandardFormulas(pResets)};

export { LnKSystemutils }