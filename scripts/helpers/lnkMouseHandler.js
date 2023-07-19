import { cModuleName } from "../utils/LnKutils.js";

//takes care of additional mouse handling
class LnKMouseHandler {
	//DECLARATIONS
	//registers
	static RegisterRightClicks() {} //call all register functions
	
	static RegisterDoorRightClick() {} //register Door rightclick
	
	static RegisterTokenRightClick() {} //register Token rightclick
	
	//ons
	static onDoorRightClick(pDoorEvent, pWall) {} //called if Door is right clicked
	
	static onTokenRightClick(pTokenEvent) {} //called if Token is right clicked
	
	//IMPLEMENTATIONS
	//registers
	static RegisterRightClicks() {
		LnKMouseHandler.RegisterDoorRightClick();
		LnKMouseHandler.RegisterTokenRightClick();
	}
	
	static RegisterDoorRightClick() {
		//register onDoorRightClick (if possible with lib-wrapper)
		if (game.modules.get("lib-wrapper")?.active) {
			libWrapper.register(cModuleName, "DoorControl.prototype._onRightDown", function(vWrapped, ...args) {LnKMouseHandler.onDoorRightClick(...args, this.wall); return vWrapped(...args)}, "WRAPPER");
		}
		else {
			const vOldDoorCall = DoorControl.prototype._onRightDown;
			
			DoorControl.prototype._onRightDown = function (pEvent) {
				LnKMouseHandler.onDoorRightClick(pEvent, this.wall);
				
				let vDoorCallBuffer = vOldDoorCall.bind(this);
				vDoorCallBuffer(pEvent);
			}
		}		
	} 
	
	static RegisterTokenRightClick() {
		//register onTokenRightClick (if possible with lib-wrapper)
		if (game.modules.get("lib-wrapper")?.active) {
			libWrapper.register(cModuleName, "Token.prototype._onClickRight", function(vWrapped, ...args) {LnKMouseHandler.onTokenRightClick(...args); return vWrapped(...args)}, "WRAPPER");
		}
		else {
			const vOldTokenCall = Token.prototype._onClickRight;
			
			Token.prototype._onClickRight = function (pEvent) {
				LnKMouseHandler.onTokenRightClick(pEvent);
				
				let vTokenCallBuffer = vOldTokenCall.bind(pEvent.currentTarget);
				vTokenCallBuffer(pEvent);
			}
		}	
	}
	
	//ons
	static onDoorRightClick(pDoorEvent, pWall) {
		console.log(pWall.document);
		Hooks.callAll(cModuleName + "." + "DoorRClick", pWall.document, {altKey : pDoorEvent.altKey, ctrlKey : pDoorEvent.ctrlKey, shiftKey : pDoorEvent.shiftKey});
	}
	
	static onTokenRightClick(pTokenEvent) {
		console.log("Token check");
		Hooks.callAll(cModuleName + "." + "TokenRClick", pTokenEvent.interactionData.object.document, {altKey : pTokenEvent.altKey, ctrlKey : pTokenEvent.ctrlKey, shiftKey : pTokenEvent.shiftKey});
	}
	
}

//Hooks
Hooks.on("init", function() {
	LnKMouseHandler.RegisterRightClicks();
});