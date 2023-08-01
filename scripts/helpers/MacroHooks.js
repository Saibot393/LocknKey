import { UseKeyonHoveredLock, PickHoveredLock, BreakHoveredLock } from "../KeyManager.js";
import { TogglehoveredLockGM, CopyhoveredLockGM, PastehoveredLockGM, CreateNewKeyhoveredGM } from "../LockManager.js";

//functions for macros
Hooks.on("init",() => {
	game.LocknKey = {
		UseKeyonHoveredLock,
		PickHoveredLock,
		BreakHoveredLock,
		TogglehoveredLockGM,
		CopyhoveredLockGM,
		PastehoveredLockGM,
		CreateNewKeyhoveredGM
	};
});