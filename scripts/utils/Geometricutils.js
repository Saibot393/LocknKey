import * as FCore from "../CoreVersionComp.js";

import { LnKutils } from "./LnKutils.js";

class Geometricutils {
	//DECLARATIONS
	static ObjectDistance(pObjectA, pObjectB) {} //distance between pObjectA and pObjectB in scene units
	
	static ObjectPosition(pObject) {} //returns position of pObject
	
	static insceneWidth(pToken) {} //returns the tokens width in its scene
	
	static insceneHeight(pToken) {} //returns the tokens width in its scene
	
	static insceneSize(pToken) {} // returns the scene size of pTokens scene
	
	//IMPLEMENTATIONS
	static ObjectDistance(pObjectA, pObjectB) {
		let vPositionA = Geometricutils.ObjectPosition(pObjectA);
		let vPositionB = Geometricutils.ObjectPosition(pObjectB);
		
		if ((pObjectA) && (pObjectB)) {
			return Math.sqrt( (vPositionA[0] - vPositionB[0])**2 + (vPositionA[1] - vPositionB[1])**2)/(canvas.scene.dimensions.size)*(canvas.scene.dimensions.distance);
		}
		
		return 0;
	}
	
	static ObjectPosition(pObject) {
		if (LnKutils.isWall(pObject)) {
			return [(pObject.c[0] + pObject.c[2])/2, (pObject.c[1] + pObject.c[3])/2];
		}
		
		console.log(pObject);
		console.log(LnKutils.isToken(pObject));
		console.log(pObject.collectionName);
		if (LnKutils.isToken(pObject)) {
			return [pObject.x + Geometricutils.insceneWidth(pObject)/2, pObject.y + Geometricutils.insceneHeight(pObject)/2];
		}		
	}
	
	static insceneWidth(pToken) {
		if (pToken.object) {
			return pToken.object.w;
		}
		else {
			return pToken.width * FCore.sceneof(pToken).dimensions.size;
		}
	}
	
	static insceneHeight(pToken) {
		if (pToken.object) {
			return pToken.object.h;
		}
		else {
			return pToken.height * FCore.sceneof(pToken).dimensions.size;
		}
	}
	
	static insceneSize(pToken) {
		return FCore.sceneof(pToken).dimensions.size;
	}
}

export { Geometricutils }