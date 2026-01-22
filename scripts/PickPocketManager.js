import { cModuleName, Translate, LnKutils, cUPickPocket } from "./utils/LnKutils.js";
import { LnKFlags, cCustomPopup } from "./helpers/LnKFlags.js";
import { LnKPopups } from "./helpers/LnKPopups.js";
import { LnKSound } from "./helpers/LnKSound.js";
import { LnKTakeInventory } from "./helpers/LnKTakeInventory.js";
import { LnKSystemutils, cPf2eLoottype} from "./utils/LnKSystemutils.js";
import { LnKCompUtils } from "./compatibility/LnKCompUtils.js";

const cPickPocketIcon = "fa-solid fa-hand";

var vLastPickpocketTime = 0; //used to save last time a pickpocket was attempted, for cooldown purposes

class PickPocketManager {
	//DECLARATIONS
	static onAtemptedPickPocket(pTarget) {} //called when a user tries to pickpocket a token
	
	static async PickPocketToken(pTarget, pCharacter, pPopUps = true) {} //to try to pick pocket pToken
	
	static RequestPickPocket(pData) {} //to request a pick pocket action on pTarget
	
	static PickPocketRequest(pData) {} //to answer a pick pocket request on pTarget
	
	static async EvaluatePickPocket(pTarget, pCharacter, pData, pChatMessages = true) {} //evaluates if the pick pocket was succesfull and starts it if
	
	static PickPocketFilter(pToken, pResult) {}; //returns list off all lootable items of pToken withp pResult
	
	//ui
	static addPickPocketButton(pButtons, pLockObject, pLockType, pCharacter, pShowall) {} //adds a pick pocket button to interface popup
	
	//ons
	static onPerceptionRoll(pActorID, pRoll, pSenderID) {} //called when a perception roll is registered
	
	//IMPLEMENTATIONS
	static onAtemptedPickPocket(pTarget) {
		if (game.settings.get(cModuleName, "EnablePickpocketing")) {
			let vCharacter = LnKutils.PrimaryCharacter();
			
			if (pTarget && vCharacter && pTarget != vCharacter) {
				if(!game.paused || !game.settings.get(cModuleName, "preventUseinPause")) {
					if (Date.now() - vLastPickpocketTime > game.settings.get(cModuleName, "PickPocketCooldown") * 1000) {
						vLastPickpocketTime = Date.now();
						
						if (LnKutils.WithinLockingDistance(vCharacter, pTarget)) {
							let vAllowCheck = game.settings.get(cModuleName, "allowallInteractions");
							
							if (!vAllowCheck) {
								vAllowCheck = LnKFlags.Canbepickpocketed(pTarget);
								
								if (!vAllowCheck) {
									LnKPopups.TextPopUpID(pLockObject, "CantbePickpocketed"); //MESSAGE POPUP
								}
							}
							
							if (vAllowCheck) {
								PickPocketManager.PickPocketToken(pTarget, vCharacter, true);
							}
						}
						else {
							if ([30, 50].includes(pTarget.displayName)) {
								LnKPopups.TextPopUpID(pTarget, "Tokenoutofreach", {pTokenName : pTarget.name}); //MESSAGE POPUP
							}
							else {
								LnKPopups.TextPopUpID(pTarget, "TokenoutofreachAnonymous"); //MESSAGE POPUP
							}
						}	
					}
				}
				else {
					LnKPopups.TextPopUpID(pTarget, "GamePaused"); //MESSAGE POPUP
				}
			}
		}
	}
	
	static async PickPocketToken(pTarget, pCharacter, pPopUps = true) {
		if (LnKutils.isDead(pTarget) && game.settings.get(cModuleName, "deadActorsLootable")) {
			let vData = {SceneID : pTarget.object.scene.id, TargetID : pTarget.id, CharacterID : pCharacter.id, isDead : true};
						
			PickPocketManager.RequestPickPocket(vData);
		}
		else {
			if (await LnKFlags.Canbepickpocketed(pTarget)) {
				if (!game.settings.get(cModuleName, "usePf2eSystem")) {
					let vRollFormula;
					
					if (LnKFlags.hasLootFormula(pTarget)) {
						vRollFormula = LnKFlags.LootFormula(pTarget);
					}
					else {
						vRollFormula = LnKFlags.PickPocketFormula(pCharacter);
							
						if (!LnKFlags.PickPocketFormulaOverrides(pCharacter)) {
							vRollFormula = LnKutils.StitchFormula(LnKutils.PickPocketformulaWorld(), vRollFormula);
						}
					}
					
					if (!vRollFormula.length) {
						//if nothing has been set
						vRollFormula = "0";
					}
					let vDC = await LnKFlags.PickPocketDC(pTarget);
					console.log(pTarget.actor);
					let vRoll =  LnKutils.createroll(vRollFormula, pCharacter.actor, vDC, null, pTarget.actor);
						
					LnKSound.PlayDiceSound(pCharacter);
						
					await vRoll.evaluate();
					
					Hooks.callAll(cModuleName+".DiceRoll", cUPickPocket, pCharacter, vRoll);
						
					if (game.settings.get(cModuleName, "MentionPickpocketDetails")) {
						await ChatMessage.create({user: game.user.id, flavor : Translate("ChatMessage.PickPocketDetailed", {pName : pCharacter.name, pTargetName : pTarget.name, pDC : vDC}),rolls : [vRoll], type : 5}); //CHAT MESSAGE
					}
					else {
						await ChatMessage.create({user: game.user.id, flavor : Translate("ChatMessage.PickPocket", {pName : pCharacter.name}),rolls : [vRoll], type : 5}); //CHAT MESSAGE
					}
						
					let vData = {SceneID : pTarget.object.scene.id, TargetID : pTarget.id, CharacterID : pCharacter.id, Rollresult : vRoll.total, Diceresult : LnKutils.diceResults(vRoll)};
						
					PickPocketManager.RequestPickPocket(vData);
				}
				else {	
					let pInfos = {baseDC : await LnKFlags.PickPocketDC(pTarget)};
					let vCallback = async (psuccessdegree, pRollresult) => {
						pInfos.rollResult = pRollresult;
						pInfos.outcome = psuccessdegree;
						
						let vData = {SceneID : pTarget.parent.id, TargetID : pTarget.id, CharacterID : pCharacter.id, useSystemRoll : true, Systemresult : psuccessdegree, rollInfos : pInfos};
						
						PickPocketManager.RequestPickPocket(vData);
					};
					
					LnKSystemutils.systemRoll(cUPickPocket, pCharacter.actor, vCallback, pInfos);
					/*
					//no roll neccessary, handled by Pf2e system
					let vCallback = async (proll) => {
						let vResult;
						
						switch (proll.outcome) {
							case 'criticalFailure':
								vResult = -1;
								break;
							case 'failure':
								vResult = 0;
								break;
							case 'success':
								vResult = 1;
								break;
							case 'criticalSuccess':
								vResult = 2;
								break;
							default:
								vResult = 0;
								break;
						}
						
						let vData = {SceneID : pTarget.parent.id, TargetID : pTarget.id, CharacterID : pCharacter.id, usePf2eRoll : true, Pf2eresult : vResult};
					
						PickPocketManager.RequestPickPocket(vData);
					};
		
					game.pf2e.actions.steal({
						actors: pCharacter.actor,
						callback: vCallback,
						difficultyClass: {value : await LnKFlags.PickPocketDC(pTarget)}
					});
					*/
				}
			}
			else {
				if (pPopUps) {
					let vMessage = LnKFlags.getCustomPopups(pTarget, cCustomPopup.CharacternotPickpocketable);
			
					if (vMessage.length) {
						LnKPopups.TextPopUp(pTarget, vMessage); //MESSAGE POPUP
					}
					else {
						LnKPopups.TextPopUpID(pTarget, "CantbePickpocketed"); //MESSAGE POPUP
					}
				}
			}
		}
	}
	
	static RequestPickPocket(pData) {
		let vData = pData;
		
		vData.userID = game.user.id;
		
		if (game.user.isGM) {
			PickPocketManager.PickPocketRequest(vData);
		}
		else {
			game.socket.emit("module."+cModuleName, {pFunction : "PickPocketRequest", pData : vData});
		}	
	}
	
	static async PickPocketRequest(pData) {
		if (game.user.isGM) {
			//only relevant for GMs
			
			let vScene = game.scenes.get(pData.SceneID);
			let vTarget;
			let vCharacter;
			
			if (vScene) {
				vTarget = LnKutils.TokenfromID(pData.TargetID, vScene);
				
				vCharacter = LnKutils.TokenfromID(pData.CharacterID, vScene);
				
				
				if (await LnKFlags.Canbepickpocketed(vTarget) || pData.isDead) {
					
					PickPocketManager.EvaluatePickPocket(vTarget, vCharacter, pData);
				}
			}
		}
	}
	
	static async EvaluatePickPocket(pTarget, pCharacter, pData, pChatMessages = true) {
		if (pData.isDead) {
			if (LnKutils.isDead(pTarget) && game.settings.get(cModuleName, "deadActorsLootable")) {
				LnKTakeInventory.openTIWindowfor(pData.userID, pTarget, {lootFilter : game.settings.get(cModuleName, "lootFilter")});
				
				Hooks.call(cModuleName + ".PickPocket", pTarget, pCharacter, {Outcome : 2, Data : pData, useData: {userID : pData.userID}, UseType : cUPickPocket});
			}
		}
		else {
			let vSuccessDegree;
			
			if (!pData.useSystemRoll) {
				pData.rollInfos = {RollType : cUPickPocket};
				vSuccessDegree = await LnKutils.successDegree(pData.Rollresult, pData.Diceresult, await LnKFlags.PickPocketDC(pTarget), pCharacter, pData.rollInfos);
			}
			else {
				vSuccessDegree = pData.Systemresult;
			}
			
			let vCritMessagesuffix = ".default";	
			
			if (await LnKFlags.Canbepickpocketed(pTarget)) {
				if ((vSuccessDegree > 1) || (vSuccessDegree < 0)) {
					vCritMessagesuffix = ".crit";
				}
				
				if (vSuccessDegree >= 0) {
					let vMaxTakeNumber = -1;
					let vMaxTakeWeight = -1;
					switch (vSuccessDegree) {
						case 0:
							vMaxTakeNumber = game.settings.get(cModuleName, "MaximumPPNumberFail");
							vMaxTakeWeight = game.settings.get(cModuleName, "MaximumPPNumberFail");						
						case 1:
							vMaxTakeNumber = game.settings.get(cModuleName, "MaximumPPNumber");
							vMaxTakeWeight = game.settings.get(cModuleName, "MaximumPPWeight");
						case 2:
							vMaxTakeNumber = game.settings.get(cModuleName, "MaximumPPNumberCrit");
							vMaxTakeWeight = game.settings.get(cModuleName, "MaximumPPNumberCrit");			
					}
					
					LnKTakeInventory.openTIWindowfor(pData.userID, pTarget, {applyDCFilter : true, rollInfos : pData.rollInfos, lootFilter : game.settings.get(cModuleName, "lootFilter"), maxNumber : vMaxTakeNumber, maxWeight : vMaxTakeWeight});
				}
				
				if (vSuccessDegree > 0) {
					//success		
					if (pChatMessages) {
						await ChatMessage.create({user: game.user.id, content : Translate("ChatMessage.PickPocketSuccess"+vCritMessagesuffix, {pName : pCharacter.name})}); //CHAT MESSAGE
					}	
				}
				else {
					//failure
					LnKPopups.TextPopUpID(pTarget, "PickPocketfailed"); //MESSAGE POPUP
					
					if (pChatMessages) {
						await ChatMessage.create({user: game.user.id, content : Translate("ChatMessage.PickPocketFail"+vCritMessagesuffix, {pName : pCharacter.name})}); //CHAT MESSAGE
					}
				}
				
				Hooks.call(cModuleName + ".PickPocket", pTarget, pCharacter, {Outcome : vSuccessDegree, Data : pData, useData: {userID : pData.userID}, UseType : cUPickPocket});
			}
		}
	}
	
	static PickPocketFilter(pToken, pResult) {
		
	};
	
	//ui
	static async addPickPocketButton(pButtons, pObject, pLockType, pCharacter, pShowall) {
		if (game.settings.get(cModuleName, "EnablePickpocketing")) {
			if (await LnKFlags.Canbepickpocketed(pObject) && !pObject.isOwner) {
				pButtons["PickPocket"] = {
					label: Translate("Titles.PickPocket"),
					callback: () => {PickPocketManager.PickPocketToken(pObject, pCharacter)},
					icon: `<i class="fas ${cPickPocketIcon}"></i>`
				}	
			}
		}
	};
	
	//ons
	static onPerceptionRoll(pActorID, pRoll, pSenderID) {
		if (game.settings.get(cModuleName, "EnablePickpocketing") && game.settings.get(cModuleName, "AutoUpdatePickPocketDC")) {
			let vRelevantTokens = LnKutils.selectedTokens().filter(vToken => vToken.actorId == pActorID);
			
			
			for (let i = 0; i < vRelevantTokens.length; i++) {
				LnKFlags.SetPickPocketDC(vRelevantTokens[i], pRoll.total);
			}
		}
	}
}

Hooks.on(cModuleName +  ".ObjectInteractionMenu", (pButtons, pObject, pLockType, pCharacter, pShowall) => {PickPocketManager.addPickPocketButton(pButtons, pObject, pLockType, pCharacter, pShowall);});

Hooks.on(cModuleName + ".PerceptionRoll", (pActorID, pRoll, pUserID, pReplaceSkill = "") => {PickPocketManager.onPerceptionRoll(pActorID, pRoll, pUserID, pReplaceSkill)});

Hooks.on(cModuleName + ".TokendblClick", (pToken) => {
														if (!pToken.isOwner && game.settings.get(cModuleName, "dblClicktoLoot") && !LnKCompUtils.isItemPile(pToken) && pToken.actor.type != cPf2eLoottype) {
															PickPocketManager.onAtemptedPickPocket(pToken);
														}
		});

//sockets
export function PickPocketRequest(pData) {PickPocketManager.PickPocketRequest(pData)};

//macros
export function PickPocketHovered() {PickPocketManager.onAtemptedPickPocket(LnKutils.hoveredToken())}

