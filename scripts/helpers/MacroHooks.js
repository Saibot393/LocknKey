import { UseKeyonHoveredLock, PickHoveredLock, BreakHoveredLock } from "../KeyManager.js";

//functions for macros
Hooks.on("init",() => {
	game.LocknKey = {
		UseKeyonHoveredLock,
		PickHoveredLock,
		BreakHoveredLock
	};
});