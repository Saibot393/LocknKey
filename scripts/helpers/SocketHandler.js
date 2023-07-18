//execute functions with pData depending on pFunction
function organiseSocketEvents({pFunction, pData} = {}) {
	switch(pFunction) {
	}
}

Hooks.once("ready", () => { game.socket.on("module.LocknKey", organiseSocketEvents); });