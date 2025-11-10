import * as FCore from "../CoreVersionComp.js";
import { cModuleName } from "../utils/LnKutils.js";
import { LnKCompUtils, cLibWrapper } from "../compatibility/LnKCompUtils.js";

//takes care of additional mouse handling
class LnKMouseHandler {
	//DECLARATIONS
	//registers
	static RegisterClicks() {} //call all register functions
	
	static RegisterClicksv12() {} //call all register functions
	
	//doors
	static RegisterDoorLeftClick() {} //register Door leftclick
	
	static RegisterDoorRightClick() {} //register Door rleftclick
	
	//tokens
	static RegisterTokenLeftClick() {} //register Door rightclick
	
	static RegisterTokenRightClick() {} //register Token rightclick
	
	static RegisterTokenDblClick() {} //register Token doubleClick
	
	//canvas
	static RegisterCanvasLeftClick() {} //register Canvas Left click
	
	static RegisterCanvasRightClick() {} //register Canvas Right click
	
	static RegisterCanvasLeftClickv12() {} //register Canvas Left click
	
	static RegisterCanvasRightClickv12() {} //register Canvas Right click
	
	static RegisterCanvasDBLClick() {} //register Canvas dbl click
	
	//ons
	static onDoorLeftClick(pDoorEvent, pWall) {} //called if Door is left clicked
	
	static onDoorRightClick(pDoorEvent, pWall) {} //called if Door is right clicked
	
	static onTokenLeftClick(pTokenEvent, pToken) {} //called if Token is left clicked
	
	static onTokenRightClick(pTokenEvent, pToken) {} //called if Token is right clicked
	
	static async onTokenDblClick(pTokenEvent, pToken) {} //called if Token is double clicked, returns pOldTokenCall if necessary
	
	static onCanvasLClick(pEvent) {} //called when canvas is left clicked
	
	static onCanvasRClick(pEvent) {} //called when canvas is left clicked
	
	//additional
	static canHUD(pEvent, pToken) {} //to replace the rightclick canHud which was disabled
	
	//IMPLEMENTATIONS
	//registers
	static RegisterClicks() {
		LnKMouseHandler.RegisterDoorLeftClick();
		LnKMouseHandler.RegisterDoorRightClick();
		
		LnKMouseHandler.RegisterTokenLeftClick();
		LnKMouseHandler.RegisterTokenRightClick();
		LnKMouseHandler.RegisterTokenDblClick();
		
		LnKMouseHandler.RegisterCanvasLeftClick();
		LnKMouseHandler.RegisterCanvasRightClick();
		
		
	}
	
	static RegisterClicksv12() {
		LnKMouseHandler.RegisterCanvasLeftClickv12();
		LnKMouseHandler.RegisterCanvasRightClickv12();
	}

		//doors	
	static RegisterDoorLeftClick() {
		//register onDoorLeftClick (if possible with lib-wrapper)
		/*
		if (LnKCompUtils.isactiveModule(cLibWrapper)) {
			libWrapper.register(cModuleName, "DoorControl.prototype.onclick", function(vWrapped, ...args) {LnKMouseHandler.onDoorLeftClick(...args, this.wall); return vWrapped(...args)}, "WRAPPER");
		}
		else {
		*/
		if (game.release.generation > 10) {
			const vOldDoorCall = DoorControl.prototype.onclick;
			
			DoorControl.prototype.onclick = function (pEvent) {
				LnKMouseHandler.onDoorLeftClick(pEvent, this.wall);
				
				if (vOldDoorCall) {
					let vDoorCallBuffer = vOldDoorCall.bind(this);
					vDoorCallBuffer(pEvent);
				}
			}			
		}
		else {
			if (LnKCompUtils.isactiveModule(cLibWrapper)) {
				libWrapper.register(cModuleName, "DoorControl.prototype._onMouseDown", function(vWrapped, ...args) {LnKMouseHandler.onDoorLeftClick(...args, this.wall); return vWrapped(...args)}, "WRAPPER");
			}
			else {
				const vOldDoorCall = DoorControl.prototype._onMouseDown;
				
				DoorControl.prototype._onMouseDown = function (pEvent) {
					LnKMouseHandler.onDoorLeftClick(pEvent, this.wall);
					
					if (vOldDoorCall) {
						let vDoorCallBuffer = vOldDoorCall.bind(this);
						vDoorCallBuffer(pEvent);
					}
				}
			}
		}
		//}		
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
			libWrapper.register(cModuleName, "Token.prototype._onClickRight", function(vWrapped, ...args) {args[0].stopPropagation(); LnKMouseHandler.onTokenRightClick(...args, this.document); if (LnKMouseHandler.canHUD(...args, this.document)) {return vWrapped(...args)} else {return}}, "MIXED");
		}
		else {
			Token.prototype._canHUD = function (user, event) {return true}; //make sure everybody can rightclick, limit hud later
			
			const vOldTokenCall = Token.prototype._onClickRight;
			
			Token.prototype._onClickRight = function (pEvent) {
				pEvent.stopPropagation();
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
					
					vTokenCallBuffer(pEvent);
				}
			}
		}			
	}
	
	//canvas
	static RegisterCanvasLeftClick() {
		if (game.release.generation < 12) {
			if (LnKCompUtils.isactiveModule(cLibWrapper)) {
				libWrapper.register(cModuleName, "canvas._onClickLeft", function(vWrapped, ...args) {if (LnKMouseHandler.onCanvasLClick(...args)) {return vWrapped(...args)}}, "MIXED");
			}
			else {
				const vOldCanvasCall = canvas._onClickLeft;
				
				canvas._onClickLeft = function (pEvent) {
					if (LnKMouseHandler.onCanvasLClick(pEvent)) {		
						if (vOldCanvasCall) {
							let vCanvasCallBuffer = vOldCanvasCall.bind(this);
							vCanvasCallBuffer(pEvent);
						}
					}
				}
			}	
		}
	}
	
	static RegisterCanvasRightClick() {
		if (game.release.generation < 12) {
			if (LnKCompUtils.isactiveModule(cLibWrapper)) {
				libWrapper.register(cModuleName, "canvas._onClickRight", function(vWrapped, ...args) {if (LnKMouseHandler.onCanvasRClick(...args)) {return vWrapped(...args)}}, "MIXED");
			}
			else {
				const vOldCanvasCall = canvas._onClickRight;
				
				canvas._onClickRight = function (pEvent) {
					if (LnKMouseHandler.onCanvasRClick(pEvent)) {		
						if (vOldCanvasCall) {
							let vCanvasCallBuffer = vOldCanvasCall.bind(this);
							vCanvasCallBuffer(pEvent);
						}
					}
				}
			}	
		}
	}
	
	static RegisterCanvasLeftClickv12() {
		if (game.release.generation >= 12) {
			let vOldClick = document.querySelector("canvas#board").onclick;
			
			document.querySelector("canvas#board").onclick = (pEvent) => {
				if (LnKMouseHandler.onCanvasLClick(pEvent)) {
					if (vOldClick) {
						vOldClick(pEvent);
					}
				}
			}
		}
	}
	
	static RegisterCanvasRightClickv12() {
		if (game.release.generation >= 12) {
			let vOldClick = document.querySelector("canvas#board").oncontextmenu;
			
			document.querySelector("canvas#board").oncontextmenu = (pEvent) => {
				if (LnKMouseHandler.onCanvasRClick(pEvent)) {
					if (vOldClick) {
						vOldClick(pEvent);
					}
				}
			}
		}
	}
	
	static RegisterCanvasDBLClick() {
		let vOldClick = document.querySelector("canvas#board").ondblclick;
		
		document.querySelector("canvas#board").ondblclick = (pEvent) => {
			if (LnKMouseHandler.onCanvasDBLClick(pEvent)) {
				if (vOldClick) {
					vOldClick(pEvent);
				}
			}
		}
	}
	
	//ons
	static onDoorLeftClick(pDoorEvent, pWall) {
		let vOldCall = Hooks.callAll(cModuleName + "." + "DoorLClick", pWall.document, FCore.keysofevent(pDoorEvent));
		
		return vOldCall;
	} 
	
	static onDoorRightClick(pDoorEvent, pWall) {
		let vOldCall = Hooks.callAll(cModuleName + "." + "DoorRClick", pWall.document, FCore.keysofevent(pDoorEvent));
		
		return vOldCall;
	}
	
	static onTokenLeftClick(pTokenEvent, pToken) {
		let vOldCall = Hooks.callAll(cModuleName + "." + "TokenLClick", pToken, FCore.keysofevent(pTokenEvent));
		
		return vOldCall;
	} 
	
	static onTokenRightClick(pTokenEvent, pToken) {
		let vOldCall = Hooks.callAll(cModuleName + "." + "TokenRClick", pToken, FCore.keysofevent(pTokenEvent));
		
		return vOldCall;
	}
	
	static async onTokenDblClick(pTokenEvent, pToken) {
		let vOldCall = await Hooks.call(cModuleName + "." + "TokendblClick", pToken, FCore.keysofevent(pTokenEvent)); //return false on token call to prevent sheet opening
		
		return vOldCall || game.user.isGM;
	}
	
	static onCanvasLClick(pEvent) {
		Hooks.callAll(cModuleName + "." + "CanvasLClick", canvas, canvas.mousePosition, pEvent);
		
		return true;
	}
	
	static onCanvasRClick(pEvent) {
		Hooks.callAll(cModuleName + "." + "CanvasRClick", canvas, canvas.mousePosition, pEvent);
		
		return true;
	}
	
	static onCanvasDBLClick(pEvent) {
		Hooks.callAll(cModuleName + "." + "CanvasdblClick", canvas, canvas.mousePosition, pEvent);
		
		let vTokenHover = canvas.tokens.hover;
		if (vTokenHover && !vTokenHover._canView(game.user)) {
			Hooks.callAll(cModuleName + "." + "TokendblClick", vTokenHover.document, FCore.keysofevent(pEvent));
		}
		
		return true;
	}
	
	//additional
	static canHUD(pEvent, pToken) { //adapted from core
		if ( pToken.layer._draggedToken ) return false;
		if ( !pToken.layer.active || pToken.isPreview ) return false;
		if ( canvas.controls.ruler.active || (CONFIG.Canvas.rulerClass.canMeasure && (event?.type === "pointerdown")) ) return false;
		return user.isGM || (pToken.actor?.testUserPermission(user, "OWNER") ?? false);
	}
	
}

//Hooks
Hooks.once("init", function() {
	LnKMouseHandler.RegisterClicks();
});

Hooks.once("ready", function() {
	if (game.release.generation >= 12) {
		LnKMouseHandler.RegisterClicksv12();
	}
	
	LnKMouseHandler.RegisterCanvasDBLClick();
});

Hooks.on(cModuleName + "." + "CanvasClick", (pCanvas, pPosition) => {LnKMouseHandler.onCanvasClick(pCanvas, pPosition)});