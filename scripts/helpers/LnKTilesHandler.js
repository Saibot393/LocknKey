import { cModuleName } from "../utils/LnKutils.js";
import { Geometricutils } from "../utils/Geometricutils.js";
import { LnKFlags } from "./LnKFlags.js";

class LnKTilesHandler {
	//DECLARATIONS
	
	//on
	static onCanvasLeftClick(pCanvas, pMousePosition, pEvent) {} //called when canvas is left clicked
	
	static onCanvasRightClick(pCanvas, pMousePosition, pEvent) {} //called when canvas is left clicked
	
	static onTileLeftClick(pTile, pEvent) {} //called when a tile is left clicked
	
	static onTileRightClick(pTile, pEvent) {} //called when a tile is left clicked
	
	//support
	static interactiveTileatPosition(pPosition) {} //returns the highes interactive tile at position pPosition
	
	//IMPLEMENTATIONS
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
		LnKFlags.toggleOpenState(pTile);
		
		//add sound
		
		Hooks.call(cModuleName + ".TileLClick", pTile, pEvent);
	}
	
	static onTileRightClick(pTile, pEvent) {
		Hooks.call(cModuleName + ".TileRClick", pTile, pEvent);
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
}

Hooks.on(cModuleName + "." + "CanvasLClick", (pCanvas, pPosition, pEvent) => {LnKTilesHandler.onCanvasLeftClick(pCanvas, pPosition, pEvent)});

Hooks.on(cModuleName + "." + "CanvasRClick", (pCanvas, pPosition, pEvent) => {LnKTilesHandler.onCanvasRightClick(pCanvas, pPosition, pEvent)});