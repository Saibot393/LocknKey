const cModuleName = "Lock-and-Key";

//takes care of additional mouse handling
class lkMouseHandler {
	//DECLARATION	
	//right clicks
	static RegisterDoorRightClick() {} //register new door rightclick
	
	static onDoorRightClick(pDoorEvent) {} //called if Door is right clicked
	
	//IMPLEMENTATION
	//right clicks
	static RegisterDoorRightClick() {
		//register onDoorRightClick (if possible with lib-wrapper)
		if (game.modules.get("lib-wrapper")?.active) {
				libWrapper.register(cModuleName, "DoorControl.prototype._onMouseDown", function(vWrapped, ...args) {lkMouseHandler.onDoorRightClick(...args); return vWrapped(...args)}, "WRAPPER");
		}
		else {
			const vOldDoorCall = DoorControl.prototype._onRightDown;
			
			DoorControl.prototype._onRightDown = function (event) {
				lkMouseHandler.onDoorRightClick(event);
				
				let vDoorCallBuffer = vOldDoorCall.bind(event.currentTarget);
				vDoorCallBuffer(event);
			}
		}		
	} 
	
	static onDoorRightClick(pDoorEvent) {
		console.log(pDoorEvent.currentTarget);
		console.log("test");
	}
	
}

//Hooks
Hooks.on("init", function() {
	lkMouseHandler.RegisterDoorRightClick();
});