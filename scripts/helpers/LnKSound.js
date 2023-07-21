import * as FCore from "../CoreVersionComp.js";
import { LnKutils, cModuleName } from "../utils/LnKutils.js";

const cLockSound = "sounds/doors/wood/lock.ogg";
const cunLockSound = "sounds/doors/wood/unlock.ogg";
const cFallbackSound = "sounds/lock.wav";

class LnKSound {
	//DECLARATIONS
	//basics
	static PlaySound(pSound, pSceneID) {} //starts PlaySound requests for all user
	
	static PlaySoundRequest(pSound, pSceneID) {} //plays sound pSound if enabled
	
	//specifics
	static PlayLockSound(pLockType, pLock) {} //start PlaySound requests for Lock sound
	
	static PlayunLockSound(pLockType, pLock) {} //start PlaySound requests for unLock sound
	
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
	static PlayLockSound(pLockType, pLock) {
		if (LnKutils.isTokenLocktype(pLockType)) {
			LnKSound.PlaySound(cLockSound, FCore.sceneof(pLock).id);
		}
	}
	
	static PlayunLockSound(pLockType, pLock) {
		if (LnKutils.isTokenLocktype(pLockType)) {
			LnKSound.PlaySound(cunLockSound, FCore.sceneof(pLock).id);
		}
	}
}

Hooks.on(cModuleName+".onLock", (pLockType, pLock) => LnKSound.PlayLockSound(pLockType, pLock));
		
Hooks.on(cModuleName+".onunLock", (pLockType, pLock) => LnKSound.PlayunLockSound(pLockType, pLock));

export function PlaySoundRequest(pData) {
	LnKSound.PlaySoundRequest(pData.pSound, pData.pSceneID);
}