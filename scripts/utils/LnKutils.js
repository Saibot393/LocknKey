//CONSTANTS
const cModuleName = "LocknKey"; //name of Module

function Translate(pName){
  return game.i18n.localize(cModuleName+"."+pName);
}

class GeometricUtils {
	//DELCARATIONS
	static async createKeyItem(pName = Translate("Word.Key")) {} // creates new key item and returns the document
	
	//IMPLEMENTATIONS
	static async createKeyItem(pName = Translate("Word.Key")) {
		let vDocument =  game.items.createDocument({name : pName, type : "equipment", img:"icons/sundries/misc/key-steel.webp"});	
		
		return await vDocument.constructor.create(vDocument);
	}
}

Hooks.on("ready", function() {
	GeometricUtils.createKeyItem();
});

export { cModuleName, Translate, GeometricUtils }