import {cModuleName, Translate} from "../utils/LnKutils.js";

const cBasicIcon = "fa-building-columns";

class WallTabInserter {
	//DECLARATIONS
	static InsertWallTabs(pApp, pHTML, pData) {} //inerts tabs into wall config
	
	//IMPLEMENTATIONS
	static InsertWallTabs(pApp, pHTML, pData) {
		if (!pHTML.querySelector(`nav.sheet-tabs`)) {
			//no tabs yet, insert basic tab
			
			//save basic settings content
			let vOriginalContent = pHTML.querySelector(`form`);
			
			if (!vOriginalContent) {
				vOriginalContent = pHTML;
			}
			
			//create tab header with basic settings
			let vTabs = fromHTML(`<nav class="sheet-tabs tabs" aria-roledescription="Form Tab Navigation" data-application-part="tabs">
							<a class="item active" data-tab="basic" data-group="sheet">
								<i class="fas ${cBasicIcon}"></i>
								${Translate("Titles.Basic")}
							</a>
						</nav>`);
			
			//wrap basic settings in tab and place it instead of the settings
			let vBasicTab = fromHTML(`<div class="tab active" data-tab="basic" data-group="sheet" data-application-part="identity"></div>`);
			console.log(vOriginalContent);
			console.log(vOriginalContent.querySelector("div"));
			vBasicTab.append(vOriginalContent.querySelector("div"));
			
			vOriginalContent.querySelector("section").prepend(vBasicTab);
			
			//place tab header at top
			vOriginalContent.querySelector("section").prepend(vTabs);
			
			if (game.release.generation <= 12) {
				pApp.options.tabs = [{ navSelector: ".tabs", contentSelector: "form", initial: "basic" }];
				pApp._tabs = pApp._createTabHandlers();
				const vElement = pHTML[0];
				pApp._tabs.forEach(t => t.bind(vElement));
			}
			else {
				vTabs.onclick = (pEvent) => {
					let vTarget = pEvent.target;
					
					let vGroup = vTarget?.getAttribute("data-group");
					let vactiveTab = vTarget?.getAttribute("data-tab");
					
					let vSection = vOriginalContent.querySelector("section");
					
					console.log(vGroup);
					console.log(vactiveTab);
					if (vGroup && vactiveTab) {
						let vContents = vSection.querySelectorAll(`div[data-group="${vGroup}"]`);
						
						console.log(vContents);
						
						Array.from(vContents).forEach(vContent => {
							if (vContent.getAttribute("data-tab") == vactiveTab) {
								vContent.classList.add("active");
							}
							else {
								vContent.classList.remove("active");
							}
						})
					}
				}
			}
		}
	}
}

function fromHTML(pHTML) {
	let vDIV = document.createElement('div');
	
	vDIV.innerHTML = pHTML;
	
	return vDIV.querySelector("*");
}

export {WallTabInserter}