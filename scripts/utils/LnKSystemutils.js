//system names
const cPf2eName = "pf2e"; //name of Pathfinder 2. edition system
const cPf1eName = "pf1"; //name of Pathfinder 1. edition system
const cDnD5e = "dnd5e"; //name of D&D 5e system
const cAdvanced5e = "a5e"; //name of the advanced D&D 5e system
const cStarFinderName = "sfrpg"; //name of Starfinder system
const c13thage = "archmage"; //name of the 13th age system
const cCoC7 = "CoC7"; //name of call of cthulhu 7 system
const cWarhammer4e = "wfrp4e"; //name of the warhammer 4e system
const cDarkEye5e = "dsa5"; //name of the black eye 5e system
const cBitD = "blades-in-the-dark"; //name of the blades in the dark system
const cCyberpunkRED = "cyberpunk-red-core"; //name of the cyberpunk red core system
const cSandbox = "sandbox"; //name of the sandbox system

//Tokentype
const cPf2eLoottype = "loot"; //type of loot tokens in Pf2e

//Lock Types
const cLockTypeLootPf2e = "LTLootPf2e"; //type for Token

export { cPf2eLoottype, cLockTypeLootPf2e }

//takes care of system specific stuff
class LnKSystemutils {
	//DELCARATIONS	
	//Identification
	static isPf2e() {} //used for special Pf2e functions
	
	//system defaults
	static Systemdefaultitemtype() {} //returns the default type of item for keys in the current system
	
	static SystemdefaultLockPickItem() {} //returns the default Lock Pick item in the current system
	
	static SystemdefaultLPformula() {} //returns the default formula for Lock Picking in the current system	
	
	static SystemdefaultLBformula() {} //returns the default formula for Lock breaking in the current system	
	
	static SystemInventory(pToken) {} //returns the inventory of pToken in the current system
	
	//IMPLEMENTATIONS
	//Identification	
	static isPf2e() {
		return game.system.id === cPf2eName;
	}
	
	//system defaults
	static Systemdefaultitemtype() {
		switch (game.system.id) {
			case cPf2eName:
				return "equipment";
				break;
			case cDnD5e:
				return "tool";
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
					return game.items.documentClass.TYPES[0];
				}
				break;
		}
		
		return "";
	}
	
	static SystemdefaultLockPickItem() {
		switch (game.system.id) {
			case cPf2eName:
				return "zvLyCVD8g2PdHJAc";
				break;
			case cDnD5e:
				return "woWZ1sO5IUVGzo58";
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
				break;
			case cDnD5e:
				return "1d20 + @actor.system.abilities.dex.mod + @actor.system.tools.thief.total";
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
				return "1d20 + @actor.system.abilities.str.mod + @actor.system.skills.ath.value";
				break;
			default:
				return "";
		}		
	}
	
	static SystemInventory(pToken) {
		switch (game.system.id) {
			case cSandbox:
				return pToken.actor.system.citems.map(vItem => game.items.get(vItem.id)).filter(vItem => vItem);
			default:
				return pToken.actor.items;
		}
	}
}

export { LnKSystemutils }