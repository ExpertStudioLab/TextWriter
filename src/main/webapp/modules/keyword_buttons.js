/**
 * 
 */
export function createKeywordButton( keywordType, placeHolder ) {    
    const block = document.createElement( "div" );
    block.style.display = "inline-block";
    const textbox = document.createElement( "input" );
    textbox.type = "text";
    textbox.className = "Reserved-Words";
    textbox.id = keywordType;
    textbox.placeholder = placeHolder;
    textbox.style.width = "140px";
    const pulldownBtn = document.createElement( "input" );
    pulldownBtn.type = "button";
    pulldownBtn.id = keywordType + "-Pulldown";
    pulldownBtn.style.cssText = "width: fit-content; margin-left: -1px; background-color: lightgray;";
    pulldownBtn.value = "▼";
    const button = document.createElement( "input" );
    button.type = "button";
    button.className = "Reserved-Words-Button";
    button.id = "Insert-" + keywordType;
    button.value = "追加";
    button.disabled = true;
    block.appendChild( textbox );
    block.appendChild( pulldownBtn );
    block.appendChild( button );
 
	return block.outerHTML;
}
