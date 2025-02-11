/**
 * 
 */
export function createKeywordButton( keywordType, placeHolder ) {    
    const block = document.createElement( "div" );
    const textbox = document.createElement( "input" );
    textbox.type = "text";
    textbox.className = "Reserved-Words";
    textbox.id = keywordType;
    textbox.placeholder = placeHolder;
    textbox.style.width = "140px";
    const pulldownBtn = document.createElement( "input" );
    pulldownBtn.type = "button";
    pulldownBtn.id = keywordType + "-PulldownBtn";
    pulldownBtn.style.cssText = "width: fit-content; margin-left: -1px; background-color: lightgray;";
    pulldownBtn.value = "▼";
    const button = document.createElement( "input" );
    button.type = "button";
    button.className = "Reserved-Words-Button";
    button.id = "Insert-" + keywordType;
    button.value = "追加";
    block.appendChild( textbox );
    block.appendChild( pulldownBtn );
    block.appendChild( button );
	
	return block.outerHTML;
}