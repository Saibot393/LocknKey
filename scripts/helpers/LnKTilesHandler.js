import { cModuleName, cLUisGM } from "../utils/LnKutils.js";
import { Geometricutils } from "../utils/Geometricutils.js";
import { LnKFlags } from "./LnKFlags.js";
import { LnKSound } from "../helpers/LnKSound.js";
import { LockManager } from "../LockManager.js";
import { LnKPopups } from "./LnKPopups.js";

const cOpenIcon = "fa-regular fa-square";
const cClosedIcon = "fa-solid fa-square";

class LnKTilesHandler {
	//DECLARATIONS
	static requestToggleTile(pTile, pForceToggle) {} //starts a request to toggle pTile
	
	static toggleTileRequest(pData) {} //answers arequest to toggle a tile
	
	static async toggleTile(pTile, pForceToggle = false) {} //to toggle the open state of a Tile
	
	static async closeTile(pTile, pForce = false) {} //closes pTile
	
	static async openTile(pTile, pForce = false) {} //opens pTile
	
	//on
	static onCanvasLeftClick(pCanvas, pMousePosition, pEvent) {} //called when canvas is left clicked
	
	static onCanvasRightClick(pCanvas, pMousePosition, pEvent) {} //called when canvas is left clicked
	
	static onTileLeftClick(pTile, pEvent) {} //called when a tile is left clicked
	
	static onTileRightClick(pTile, pEvent) {} //called when a tile is left clicked
	
	static onTileUpdate(pTile, pChanges) {} //called when a tile is updated
	
	//support
	static interactiveTileatPosition(pPosition) {} //returns the highes interactive tile at position pPosition
	
	//ui
	static addLnKButtons(pHUD, pHTML, pTile) {} //checks if a button should be added and adds it
	
	//IMPLEMENTATIONS
	static requestToggleTile(pTile, pForceToggle) {
		if (game.user.isGM) {
			LnKTilesHandler.toggleTile(pTile, pForceToggle);
		}
		else {
			game.socket.emit("module."+cModuleName, {pFunction : "toggleTileRequest", pData : {tileID : pTile.id, sceneID : pTile.parent.id, forceToggle : pForceToggle}});
		}
	}
	
	static toggleTileRequest(pData) {
		if (game.user.isGM) {
			let vTile = game.scenes.get(pData.sceneID)?.tiles.get(pData.tileID);
			
			if (vTile) {
				LnKTilesHandler.toggleTile(vTile, pData.forceToggle);
			}
		}
	}
	
	static async toggleTile(pTile, pForceToggle = false) {
		if (LnKFlags.isLocked(pTile) && !pForceToggle) {
			LnKSound.PlayLockedSound(pTile); //PLAY SOUND
			
			LnKPopups.TextPopUpID(pTile, "DoorisLocked"); //MESSAGE POPUP
		}
		else {
			await LnKFlags.toggleOpenState(pTile);
			
			if (LnKFlags.OpenState(pTile)) {
				LnKSound.PlayOpenSound(pTile); //PLAY SOUND
			}
			else {
				LnKSound.PlayCloseSound(pTile); //PLAY SOUND
			}
		}
	}
	
	static async closeTile(pTile, pForce = false) {
		if (LnKFlags.OpenState(pTile)) await LnKTilesHandler.requestToggleTile(pTile, pForce);
	}
	
	static async openTile(pTile, pForce = false) {
		if (!LnKFlags.OpenState(pTile)) await LnKTilesHandler.requestToggleTile(pTile, pForce);
	}
	
	//on
	static onCanvasLeftClick(pCanvas, pMousePosition, pEvent) {
		let vTile = LnKTilesHandler.interactiveTileatPosition(pMousePosition);
		
		if (vTile) {
			LnKTilesHandler.onTileLeftClick(vTile, pEvent);
		}
	}
	
	static onCanvasRightClick(pCanvas, pMousePosition, pEvent) {
		let vTile = LnKTilesHandler.interactiveTileatPosition(pMousePosition);
		
		if (vTile) {
			LnKTilesHandler.onTileRightClick(vTile, pEvent);
		}
	}
	
	static onTileLeftClick(pTile, pEvent) {
		if (canvas.activeLayer.name == "TilesLayer") return;
		
		LnKTilesHandler.requestToggleTile(pTile);
		
		Hooks.call(cModuleName + ".TileLClick", pTile, pEvent);
	}
	
	static onTileRightClick(pTile, pEvent) {
		if (canvas.activeLayer.name == "TilesLayer") return;
		
		Hooks.call(cModuleName + ".TileRClick", pTile, pEvent);
	}
	
	static onTileUpdate(pTile, pChanges) {
		if (game.user.isGM) {
			let vLnKChanges = pChanges?.flags?.LocknKey;
			if (vLnKChanges?.OpenImageFlag || vLnKChanges?.ClosedImageFlag) {
				LnKFlags.applyStateImage(pTile);
			}
		}
	}

	//support
	static interactiveTileatPosition(pPosition) {
		let vvalidTiles = canvas.tiles.placeables.filter(vTile => LnKFlags.canbeInteracted(vTile.document) || true).map(vTile => vTile.document);
		
		vvalidTiles = vvalidTiles.filter(vTile => Geometricutils.withinBoundaries(vTile, "TokenFormRectangle", [pPosition.x, pPosition.y]));
		
		let vTile = vvalidTiles[0];
		let vTilesort = vvalidTiles[0]?.sort;
		
		for (let i = 0; i < vvalidTiles.length; i++) {
			if (vvalidTiles[i].sort > vTilesort) {
				let vTile = vvalidTiles[i];
				let vTilesort = vvalidTiles[i]?.sort;
			}
		}
		
		return vTile;
	}
	
	//ui
	static addLnKButtons(pHUD, pHTML, pTile) {
		let vTile = canvas.tiles.get(pTile._id)?.document;
		
		if (LnKFlags.canbeInteracted(vTile)) {
			const cButtonPosition = "right";
				
			let vButtonHTML = `	<div class="control-icon" data-action="toggleopen">
									<i class="${LnKFlags.OpenState(vTile) ? cOpenIcon : cClosedIcon}"></i>
								</div>`;
			
			pHTML.find("div.col."+cButtonPosition).append(vButtonHTML);
			
			let vButton = pHTML.find(`div[data-action="toggleopen"]`);
			
			vButton.click((pEvent) => {LnKTilesHandler.requestToggleTile(vTile, true)});
		}
	}
}

Hooks.on(cModuleName + "." + "CanvasLClick", (pCanvas, pPosition, pEvent) => {LnKTilesHandler.onCanvasLeftClick(pCanvas, pPosition, pEvent)});

Hooks.on(cModuleName + "." + "CanvasRClick", (pCanvas, pPosition, pEvent) => {LnKTilesHandler.onCanvasRightClick(pCanvas, pPosition, pEvent)});

Hooks.on("updateTile", (pTile, pChanges, pInfo, pUserID) => {LnKTilesHandler.onTileUpdate(pTile, pChanges)});

Hooks.on("renderTileHUD", (...args) => LnKTilesHandler.addLnKButtons(...args));

function toggleTileRequest(pData) {return LnKTilesHandler.toggleTileRequest(pData)};

export{toggleTileRequest}