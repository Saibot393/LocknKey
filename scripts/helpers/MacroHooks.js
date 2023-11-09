import { UseKeyonHoveredLock, PickHoveredLock, BreakHoveredLock, CustomCheckHoveredLock } from "../KeyManager.js";
import { TogglehoveredLockGM, CopyhoveredLockGM, PastehoveredLockGM, CreateNewKeyhoveredGM } from "../LockManager.js";
import { ResettoStandardFormulas } from "../utils/LnKSystemutils.js";
import { PickPocketHovered } from "../PickPocketManager.js";

//functions for macros
Hooks.on("init",() => {
	game.LocknKey = {
		UseKeyonHoveredLock,
		PickHoveredLock,
		BreakHoveredLock,
		CustomCheckHoveredLock,
		TogglehoveredLockGM,
		CopyhoveredLockGM,
		PastehoveredLockGM,
		CreateNewKeyhoveredGM,
		ResettoStandardFormulas,
		PickPocketHovered
	};
});