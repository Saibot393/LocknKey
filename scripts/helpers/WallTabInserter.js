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
			let vTabs = `<nav class="sheet-tabs tabs">
							<a class="item active" data-tab="basic">
								<i class="fas ${cBasicIcon}"></i>
								${Translate("Titles.Basic")}
							</a>
						</nav>`;
			
			//wrap basic settings in tab and place it instead of the settings
			let vBasicTab = `<div class="tab active" data-tab="basic"></div>`;
			vOriginalContent.append(vBasicTab);
			vBasicTab = vOriginalContent.querySelector(`div[data-tab="basic"]`);
			
			Array.from(vOriginalContent.children).forEach(function () {
				if (!["button", "footer"].includes(this.nodeName)) {
					vBasicTab.append(this);
				}
            });
			
			//place tab header at top
			vOriginalContent.prepend(vTabs);

			//place confirm button at bottom
			vOriginalContent.append(vOriginalContent.querySelector(`footer`));
			
			pApp.options.tabs = [{ navSelector: ".tabs", contentSelector: "form", initial: "basic" }];
			pApp._tabs = pApp._createTabHandlers();
			const vElement = pHTML[0];
			pApp._tabs.forEach(t => t.bind(vElement));
		}
	}
}

export {WallTabInserter}