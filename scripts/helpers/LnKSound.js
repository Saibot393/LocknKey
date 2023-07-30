import * as FCore from "../CoreVersionComp.js";
import { LnKutils, cModuleName } from "../utils/LnKutils.js";

const cLockSound = "sounds/doors/wood/lock.ogg";
const cunLockSound = "sounds/doors/wood/unlock.ogg";
const cFallbackSound = "sounds/lock.wav";

const cDiceSound = "sounds/dice.wav";

class LnKSound {
	//DECLARATIONS
	//basics
	static PlaySound(pSound, pSceneID) {} //starts PlaySound requests for all user
	
	static PlaySoundRequest(pSound, pSceneID) {} //plays sound pSound if enabled
	
	//specifics
	static async PlayLockSound(pLock) {} //start PlaySound requests for Lock sound
	
	static async PlayunLockSound(pLock) {} //start PlaySound requests for unLock sound
	
	static PlayDiceSound(pCharacter) {} //start PlaySound requests for Dice sound
	
	//IMPLEMENTATIONS
	static PlaySound(pSound, pSceneID) {
		
		//other clients pop up
		game.socket.emit("module."+cModuleName, {pFunction : "PlaySoundRequest", pData : {pSound : pSound, pSceneID : pSceneID}});
		
		//own pop up
		LnKSound.PlaySoundRequest(pSound, pSceneID);
	}
	
	static PlaySoundRequest(pSound, pSceneID) {
		if (game.settings.get(cModuleName, "PlayLockSounds")) {
			if (canvas.scene.id == pSceneID) {
				//only play sound if in same scene
				if (FCore.Fversion() > 10) {
					AudioHelper.play({src: pSound, volume: 1});
				} else {
					AudioHelper.play({src: cFallbackSound, volume: 1}); //play fallback sound
				}
			}
		}
	}
	
	//specifics
	static async PlayLockSound(pLock) {
		if (await LnKutils.isTokenLocktype(await LnKutils.Locktype(pLock))) {
			LnKSound.PlaySound(cLockSound, FCore.sceneof(pLock).id);
		}
	}
	
	static async PlayunLockSound(pLock) {
		if (await LnKutils.isTokenLocktype(await LnKutils.Locktype(pLock))) {
			LnKSound.PlaySound(cunLockSound, FCore.sceneof(pLock).id);
		}
	}
	
	static PlayDiceSound(pCharacter) {
		LnKSound.PlaySound(cDiceSound, FCore.sceneof(pCharacter).id);
	}
}
/*
Hooks.on(cModuleName+".onLock", (pLockType, pLock) => LnKSound.PlayLockSound(pLockType, pLock));
		
Hooks.on(cModuleName+".onunLock", (pLockType, pLock) => LnKSound.PlayunLockSound(pLockType, pLock));

Hooks.on(cModuleName+".DiceRoll", (pRollType, pCharacter) => LnKSound.PlayDiceSound(pCharacter));
*/

export function PlaySoundRequest(pData) {
	LnKSound.PlaySoundRequest(pData.pSound, pData.pSceneID);
}

export { LnKSound }