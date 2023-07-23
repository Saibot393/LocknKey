import * as FCore from "../CoreVersionComp.js";
import { cModuleName } from "../utils/LnKutils.js";
import { LnKCompUtils, cLibWrapper } from "../compatibility/LnKCompUtils.js";

//takes care of additional mouse handling
class LnKMouseHandler {
	//DECLARATIONS
	//registers
	static RegisterRightClicks() {} //call all register functions
	
		//doors
	static RegisterDoorLeftClick() {} //register Door leftclick
	
	static RegisterDoorRightClick() {} //register Door rleftclick
	
		//tokens
	static RegisterTokenLeftClick() {} //register Door rightclick
	
	static RegisterTokenRightClick() {} //register Token rightclick
	
	static RegisterTokenDblClick() {} //register Token doubleClick
	
	//ons
	static onDoorLeftClick(pDoorEvent, pWall) {} //called if Door is left clicked
	
	static onDoorRightClick(pDoorEvent, pWall) {} //called if Door is right clicked
	
	static onTokenLeftClick(pTokenEvent, pToken) {} //called if Token is left clicked
	
	static onTokenRightClick(pTokenEvent, pToken) {} //called if Token is right clicked
	
	static async onTokenDblClick(pTokenEvent, pToken) {} //called if Token is double clicked, returns pOldTokenCall if necessary
	
	//additional
	static canHUD(pEvent, pToken) {} //to replace the rightclick canHud which was disabled
	
	//IMPLEMENTATIONS
	//registers
	static RegisterRightClicks() {
		LnKMouseHandler.RegisterDoorLeftClick();
		LnKMouseHandler.RegisterDoorRightClick();
		
		LnKMouseHandler.RegisterTokenLeftClick();
		LnKMouseHandler.RegisterTokenRightClick();
		LnKMouseHandler.RegisterTokenDblClick();
	}

		//doors	
	static RegisterDoorLeftClick() {
		//register onDoorLeftClick (if possible with lib-wrapper)
		if (LnKCompUtils.isactiveModule(cLibWrapper)) {
			libWrapper.register(cModuleName, "DoorControl.prototype._onMouseDown", function(vWrapped, ...args) {LnKMouseHandler.onDoorLeftClick(...args, this.wall); return vWrapped(...args)}, "WRAPPER");
		}
		else {
			const vOldDoorCall = DoorControl.prototype._onMouseDown;
			
			DoorControl.prototype._onMouseDown = function (pEvent) {
				LnKMouseHandler.onDoorLeftClick(pEvent, this.wall);
				
				let vDoorCallBuffer = vOldDoorCall.bind(this);
				vDoorCallBuffer(pEvent);
			}
		}		
	}
	
	static RegisterDoorRightClick() {
		//register onDoorRightClick (if possible with lib-wrapper)
		if (LnKCompUtils.isactiveModule(cLibWrapper)) {
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

		//tokens	
	static RegisterTokenLeftClick() {
		//register onTokenLeftClick (if possible with lib-wrapper)
		if (LnKCompUtils.isactiveModule(cLibWrapper)) {
			libWrapper.register(cModuleName, "Token.prototype._onClickLeft", function(vWrapped, ...args) {LnKMouseHandler.onTokenLeftClick(...args, this.document); return vWrapped(...args)}, "MIXED");
		}
		else {
			Token.prototype._canHUD = function (user, event) {return true}; //make sure everybody can rightclick, limit hud later
			
			const vOldTokenCall = Token.prototype._onClickLeft;
			
			Token.prototype._onClickLeft = function (pEvent) {
				LnKMouseHandler.onTokenLeftClick(pEvent, this.document);
				
				let vTokenCallBuffer = vOldTokenCall.bind(pEvent.currentTarget);
				vTokenCallBuffer(pEvent);
			}
		}
	}
	
	static RegisterTokenRightClick() {
		//register onTokenRightClick (if possible with lib-wrapper)
		if (LnKCompUtils.isactiveModule(cLibWrapper)) {
			libWrapper.register(cModuleName, "Token.prototype._canHUD", function(vWrapped, ...args) {return true}, "MIXED"); //make sure everybody can rightclick, limit hud later
			libWrapper.register(cModuleName, "Token.prototype._onClickRight", function(vWrapped, ...args) {LnKMouseHandler.onTokenRightClick(...args, this.document); if (LnKMouseHandler.canHUD(...args, this.document)) {return vWrapped(...args)} else {return}}, "MIXED");
		}
		else {
			Token.prototype._canHUD = function (user, event) {return true}; //make sure everybody can rightclick, limit hud later
			
			const vOldTokenCall = Token.prototype._onClickRight;
			
			Token.prototype._onClickRight = function (pEvent) {
				LnKMouseHandler.onTokenRightClick(pEvent, this.document);
				
				if (LnKMouseHandler.canHUD(pEvent, this.document)) {
					let vTokenCallBuffer = vOldTokenCall.bind(pEvent.currentTarget);
					vTokenCallBuffer(pEvent);
				}
			}
		}	
	}
	
	static RegisterTokenDblClick() {
		//register onTokenDoubleClick (if possible with lib-wrapper)
		if (LnKCompUtils.isactiveModule(cLibWrapper)) {
			libWrapper.register(cModuleName, "Token.prototype._onClickLeft2", async function(vWrapped, ...args) {if (await LnKMouseHandler.onTokenDblClick(...args, this.document)) {return vWrapped(...args)}}, "MIXED");
		}
		else {
			const vOldTokenCall = Token.prototype._onClickLeft2;
			
			Token.prototype._onClickLeft2 = async function (pEvent) {
				let vOldCall = await LnKMouseHandler.onTokenDblClick(pEvent, this.document);
				
				if (vOldCall) {
					let vTokenCallBuffer = vOldTokenCall.bind(this);
					console.log(pEvent.currentTarget);
					
					//console.log("test");
					vTokenCallBuffer(pEvent);
				}
			}
		}			
	}
	
	//ons
	static onDoorLeftClick(pDoorEvent, pWall) {
		Hooks.callAll(cModuleName + "." + "DoorLClick", pWall.document, FCore.keysofevent(pDoorEvent));
	} 
	
	static onDoorRightClick(pDoorEvent, pWall) {
		Hooks.callAll(cModuleName + "." + "DoorRClick", pWall.document, FCore.keysofevent(pDoorEvent));
	}
	
	static onTokenLeftClick(pTokenEvent, pToken) {
		Hooks.callAll(cModuleName + "." + "TokenLClick", pToken, FCore.keysofevent(pTokenEvent));
	} 
	
	static onTokenRightClick(pTokenEvent, pToken) {
		Hooks.callAll(cModuleName + "." + "TokenRClick", pToken, FCore.keysofevent(pTokenEvent));
	}
	
	static async onTokenDblClick(pTokenEvent, pToken) {
		let vOldCall = await Hooks.call(cModuleName + "." + "TokendblClick", pToken, FCore.keysofevent(pTokenEvent)); //return false on token call to prevent sheet opening
		
		return vOldCall || game.user.isGM;
	}
	
	//additional
	static canHUD(pEvent, pToken) { //adapted from core
		if ( canvas.controls.ruler.active ) return false;
		return game.user.isGM || (pToken.actor?.testUserPermission(game.user, "OWNER") ?? false);
	}
	
}

//Hooks
Hooks.on("init", function() {
	LnKMouseHandler.RegisterRightClicks();
});