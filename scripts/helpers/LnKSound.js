import * as FCore from "../CoreVersionComp.js";
import { LnKutils, cModuleName } from "../utils/LnKutils.js";
import { LnKFlags } from "./LnKFlags.js";

const cDoorSoundPath = "sounds/doors/";
const cLockSound = "/lock.ogg";
const cunLockSound = "/unlock.ogg";
const cLockedSound = "/test.ogg";
const cCloseSound = "/close.ogg";
const cOpenSound = "/open.ogg";

const cFallbackSound = "sounds/lock.wav";

const cSoundVariants = ["off", "futuristic", "industrial", "jail", "metal", "shutter", "sliding", "stone", "wood"];

const cDiceSound = "sounds/dice.wav";

export { cSoundVariants };

class LnKSound {
	//DECLARATIONS
	//basics
	static PlaySound(pSound, pSceneID) {} //starts PlaySound requests for all user
	
	static PlaySoundRequest(pSound, pSceneID) {} //plays sound pSound if enabled
	
	//specifics
	static async PlayLockSound(pLock) {} //start PlaySound requests for Lock sound
	
	static async PlayunLockSound(pLock) {} //start PlaySound requests for unLock sound
	
	static async PlayLockedSound(pLock) {} //start PlaySound requests for Locked sound
	
	static async PlayCloseSound(pLock) {} //start PlaySound requests for Close sound
	
	static async PlayOpenSound(pLock) {} //start PlaySound requests for Open sound
	
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
		let vLockType = await LnKutils.Locktype(pLock);
		if (await LnKutils.isTokenLocktype(vLockType) || LnKutils.isTileLocktype(vLockType)) {
			if (LnKFlags.SoundVariant(pLock) != "off") {
				LnKSound.PlaySound(cDoorSoundPath + LnKFlags.SoundVariant(pLock) + cLockSound, FCore.sceneof(pLock).id);
			}
		}
	}
	
	static async PlayunLockSound(pLock) {
		let vLockType = await LnKutils.Locktype(pLock);
		if (await LnKutils.isTokenLocktype(vLockType) || LnKutils.isTileLocktype(vLockType)) {
			if (LnKFlags.SoundVariant(pLock) != "off") {
				LnKSound.PlaySound(cDoorSoundPath + LnKFlags.SoundVariant(pLock) + cunLockSound, FCore.sceneof(pLock).id);
			}
		}
	}
	
	static async PlayLockedSound(pLock) {
		let vLockType = await LnKutils.Locktype(pLock);
		if (await LnKutils.isTokenLocktype(vLockType) || LnKutils.isTileLocktype(vLockType)) {
			if (LnKFlags.SoundVariant(pLock) != "off") {
				LnKSound.PlaySound(cDoorSoundPath + LnKFlags.SoundVariant(pLock) + cLockedSound, FCore.sceneof(pLock).id);
			}
		}		
	}

	static async PlayCloseSound(pLock) {
		let vLockType = await LnKutils.Locktype(pLock);
		if (await LnKutils.isTokenLocktype(vLockType) || LnKutils.isTileLocktype(vLockType)) {
			if (LnKFlags.SoundVariant(pLock) != "off") {
				LnKSound.PlaySound(cDoorSoundPath + LnKFlags.SoundVariant(pLock) + cCloseSound, FCore.sceneof(pLock).id);
			}
		}	
	}
	
	static async PlayOpenSound(pLock) {
		let vLockType = await LnKutils.Locktype(pLock);
		if (await LnKutils.isTokenLocktype(vLockType) || LnKutils.isTileLocktype(vLockType)) {
			if (LnKFlags.SoundVariant(pLock) != "off") {
				LnKSound.PlaySound(cDoorSoundPath + LnKFlags.SoundVariant(pLock) + cOpenSound, FCore.sceneof(pLock).id);
			}
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