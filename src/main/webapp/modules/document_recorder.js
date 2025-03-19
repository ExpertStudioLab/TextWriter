/**
 * 
 */
import { Document } from "./document_manager.js";
import * as action from "./document_actions.js";
import { displayText } from "./display_text.js";

class DocumentRecorder {
	static INSERT_PARAGRAPH = "InsertParagraph";
    static INSERT_RESERVED_WORD = "InsertKeyword";
	
    #documentStructures = [];
    #basicDiv;
    #previewDiv;
    #previousTextButtonsDiv;
    #paragraphButtonDiv;
    #paragraphName = "Doc";
    #textAreaName = "Contents";
    #textArea;
	#textAreasNumber = 0;
    #buttonTypes = [];
    #eventObject;
    #eventParams = new Object();
    #toolPanel;
    #keywordBlock;
    #registeredDatalist = new Object();
    #reservedKeywords = new Object();
    #usage = { "VerbValue" : "VerbValue" };
    #verb;
    #menulist = new Object();


    constructor( basicDivId, previewDivId, previousTextId ) {
		this.#verb = new Verb();
		this.#basicDiv = document.getElementById( basicDivId );
        this.#previewDiv = document.getElementById( previewDivId );
        this.#previousTextButtonsDiv = document.getElementById( previousTextId );

        this.#basicDiv.insertAdjacentHTML( "afterend",
            "<div id=\"Paragraph-Button\"></div>"
        );

        this.#paragraphButtonDiv = document.getElementById( "Paragraph-Button" );

        const paragraphButton = document.createElement( "input" );
        paragraphButton.type = "button";
        paragraphButton.id = "Paragraph";
        paragraphButton.value = "段落の追加";

        this.#paragraphButtonDiv.appendChild( paragraphButton );

		const closeButtonDiv = document.createElement( "div" );
		closeButtonDiv.style.cssText = "text-align: right; height: 20px; padding-top: 2px; padding-bottom: 2px;";
		const buttonImage = document.createElement( "img" );
		buttonImage.src = "./picture/close.png";
		buttonImage.style.position = "relative";
		const buttonImageHover = document.createElement( "img" );
		buttonImageHover.src = "./picture/close_hover.png";
		buttonImageHover.style.marginTop = "-20px";
		buttonImageHover.style.position = "relative";
		const buttonImageActive = document.createElement( "img" );
		buttonImageActive.src = "./picture/close_action.png";
		buttonImageActive.style.position = "relative";
		buttonImageActive.style.marginTop = "-20px";

		const closeButton = document.createElement( "div" );
		closeButton.id = "Panel-Close";
		closeButton.style.cssText = "width: 25px; height: 20px; display: inline-block; margin-right: 5px;";
		closeButton.appendChild( buttonImage );
		closeButton.appendChild( buttonImageHover );
		closeButton.appendChild( buttonImageActive );

		closeButtonDiv.appendChild( closeButton );
        this.#toolPanel = document.createElement( "div" );
        this.#toolPanel.id = "Tool-Panel";
        this.#toolPanel.style.cssText = "display: none; background-color: white; overflow-y: scroll; height: 400px; width: 98%; min-width: 670px;";
        const toolPanelDiv = document.createElement( "div" );
        toolPanelDiv.style.cssText = "display: grid; grid-template-columns: auto 200px 200px; grid-template-rows: auto; width: 100%;";
        this.#keywordBlock = document.createElement( "div" );
        this.#keywordBlock.style.cssText = "min-width: 180px; display: inline-block; vertical-align: top; padding-right: 5px; margin-right: 5px; border-right: 2px solid black;";
        const reservedBlock1 = document.createElement( "div" );
        reservedBlock1.style.cssText = "display: inline-block; vertical-align: top; padding-right: 5px; border-right: 2px solid black;";
        const reservedBlock2 = document.createElement( "div" );
        reservedBlock2.style.display = "inline-block";
        reservedBlock2.style.verticalAlign = "top";

        this.#toolPanel.appendChild( closeButtonDiv );
        this.#toolPanel.appendChild( toolPanelDiv );
        toolPanelDiv.appendChild( this.#keywordBlock );
        toolPanelDiv.appendChild( reservedBlock1 );
        toolPanelDiv.appendChild( reservedBlock2 );

        document.body.appendChild( this.#toolPanel );

		const verbDiv = document.createElement( "div" );
		verbDiv.style.cssText = "border: 2px solid black; margin-top: 5px;";
		
		const verbTitleDiv = document.createElement( "div" );
		verbTitleDiv.style.cssText = "background-color: white; margin-top: -12px; margin-left: 3px; width: fit-content;";
		const verbTitleSpan = document.createElement( "span" );
		verbTitleSpan.style.cssText = "margin: 1px 3px 1px 3px; font-size: 16px;";
		verbTitleSpan.innerText = "動詞";
		verbTitleDiv.appendChild( verbTitleSpan );
		verbDiv.appendChild( verbTitleDiv );
		
		const operationDiv = document.createElement( "div" );
        operationDiv.style.cssText = "display: inline-block; margin-right: 3px;";
        const operationSpan = document.createElement( "span" );
        operationSpan.innerText = "操作";
        operationSpan.style.cssText = "display: block; font-size: 14px; width: fit-content;";
        const operationTextbox = document.createElement( "input" );
        operationTextbox.type = "text";
        operationTextbox.id = "Label";
        operationTextbox.style.width = "80px";
        const operationPulldownBtn = document.createElement( "input" );
        operationPulldownBtn.type = "button";
        operationPulldownBtn.id = "Label-PulldownBtn";
        operationPulldownBtn.style.cssText = "width: fit-content; margin-left: -1px; background-color: lightgray;";
        operationPulldownBtn.value = "▼";
        operationDiv.appendChild( operationSpan );
		operationDiv.appendChild( operationTextbox );
		operationDiv.appendChild( operationPulldownBtn );
        verbDiv.appendChild( operationDiv );
        operationTextbox.addEventListener( "input", setVerbButtonStatus );
        
        const typeDiv = document.createElement( "div" );
        typeDiv.style.cssText = "display: inline-block; margin-right:3px;";
        const typeSpan = document.createElement( "span" );
        typeSpan.innerText = "タイプ";
        typeSpan.style.cssText = "display: block; font: 14px; width: fit-content;";
        const typeSelect = document.createElement( "select" );
        typeSelect.id = "Type";
        const values = [ "自動詞", "他動詞", "動名詞", "受動詞", "使役詞" ];
        for( let i = 0; i < 5; i++ ) {
			const option = document.createElement( "option" );
			option.value = String( i );
			option.innerText = values[ i ];
			typeSelect.appendChild( option );
		}

		typeDiv.appendChild( typeSpan );
		typeDiv.appendChild( typeSelect );
		verbDiv.appendChild( typeDiv );

		const valueDiv = document.createElement( "div" );
        valueDiv.style.cssText = "display: inline-block; margin-right:3px;";
		const valueSpan = document.createElement( "span" );
		valueSpan.style.cssText = "display: block; font-size: 14px; width: fit-content";
		const valueTextbox = document.createElement( "input" );
		valueTextbox.type = "text";
		valueTextbox.id = "VerbValue";
		valueTextbox.style.width = "110px";
		const valuePulldownBtn = document.createElement( "input" );
		valuePulldownBtn.type = "button";
		valuePulldownBtn.id = "VerbValue-PulldownBtn";
		valuePulldownBtn.style.cssText = "width: fit-content; margin-left: -1px; background-color: lightgray;";
		valuePulldownBtn.value = "▼";
		this.#menulist[ "ValueMenulist" ] = new Object();
		const valueButton = document.createElement( "input" );
		valueButton.type = "button";
		valueButton.id = "Insert-VerbValue";
		valueButton.value = "追加";
		valueButton.disabled = "true";
		valueDiv.appendChild( valueSpan );
		valueDiv.appendChild( valueTextbox );
		valueDiv.appendChild( valuePulldownBtn );
		valueDiv.appendChild( valueButton );
		verbDiv.appendChild( valueDiv );
        
        reservedBlock1.appendChild( verbDiv );
        valueTextbox.addEventListener( "input", setVerbButtonStatus );

		const endDiv = document.createElement( "div" );
		endDiv.style.cssText = "border: 2px solid black; margin-top: 5px; margin-left: 5px;";
		const endTitleDiv = document.createElement( "div" );
		endTitleDiv.style.cssText = "background-color: white; margin-top: -12px; margin-left: 3px; width: fit-content;";
		const endTitleSpan = document.createElement( "span" );
		endTitleSpan.style.cssText = "margin: 1px 3px 1px 3px; font-size: 16px;";
		endTitleSpan.innerText = "終端文字";
		endTitleDiv.appendChild( endTitleSpan );
		endDiv.appendChild( endTitleDiv );
		reservedBlock2.appendChild( endDiv );
		
		const targetDiv = document.createElement( "div" );
		targetDiv.style.cssText = "border: 2px solid black; margin-top: 15px;";
		const targetTitleDiv = document.createElement( "div" );
		targetTitleDiv.style.cssText = "background-color: white; margin-top: -12px; margin-left: 3px; width: fit-content;";
		const targetTitleSpan = document.createElement( "span" );
		targetTitleSpan.style.cssText = "margin: 1px 3px 1px 3px; font-size: 16px;";
		targetTitleSpan.innerText = "対象キーワード";
		targetTitleDiv.appendChild( targetTitleSpan );
		targetDiv.appendChild( targetTitleDiv );
		reservedBlock1.appendChild( targetDiv );
        
        const styleSheet = document.createElement( "style" );
        let selector = "@keyframes SlideIn";
        let property = "0% { opacity: 0; transform: translateY( 800px ); }"
        							+ "100% { opacity: 1; transform: translateY( 0px ); }";
        let cssRuleString = selector + "{" + property + "}";
        document.head.appendChild( styleSheet );
        styleSheet.sheet.insertRule( cssRuleString, styleSheet.sheet.cssRules.length );
        
        selector = "#Panel-Close:hover img:nth-of-type(1), img:nth-of-type(3)";
        property = "opacity: 0;";
        cssRuleString = selector + "{" + property + "}";
		styleSheet.sheet.insertRule( cssRuleString, styleSheet.sheet.cssRules.length );
		selector = "#Panel-Close:hover img:nth-of-type(2)";
		property = "opacity: 1;";
		cssRuleString = selector + "{" + property + "}";
		styleSheet.sheet.insertRule( cssRuleString, styleSheet.sheet.cssRules.length );
		
		selector = "#Panel-Close:active img:nth-of-type(1), img:nth-of-type(2)";
		property = "opacity: 0;";
		cssRuleString = selector + "{" + property + "}";
		styleSheet.sheet.insertRule( cssRuleString, styleSheet.sheet.cssRules.length );
		selector = "#Panel-Close:active img:nth-of-type(3)";
		property = "opacity: 1;";
		cssRuleString = selector + "{" + property + "}";
		styleSheet.sheet.insertRule( cssRuleString, styleSheet.sheet.cssRules.length );

        this.#textArea = document.getElementById( this.#textAreaName );

		this.#eventParams.recorder = this;
        this.#eventParams.documentStructures = this.#documentStructures;
        this.#eventParams.textArea = this.#textArea;
        this.#eventParams.currentTextNumber = -1;
        this.#eventParams.text = [];
        this.#eventParams.inputStatus = "Normal";
        this.#eventParams.toolPanel = this.#toolPanel;
        this.#eventParams.endDiv = endDiv;
        this.#eventParams.registeredDatalist = this.#registeredDatalist;
        this.#eventParams.reservedKeywords = this.#reservedKeywords;
        this.#eventParams.usage = this.#usage;
        this.#eventParams.verb = this.#verb;
        this.#eventParams.listIsActive = false;
        this.#eventParams.menulist = this.#menulist;
        this.#eventParams.labelTextbox = operationTextbox;
        this.#eventParams.valueTextbox = valueTextbox;
        this.#eventParams.typeSelector = typeSelect;
        this.#eventParams.selectItemFunc = { params: this.#eventParams, handleEvent: function( event ) { action.selectItem( event, this.params ); } };
        this.#eventParams.insertEndKeywordFunc = { params: this.#eventParams, handleEvent: function( event ) { action.insertEndKeyword( event, this.params ); } };

        this.#eventObject = [
            { name: DocumentRecorder.INSERT_PARAGRAPH, recorder: this, handleEvent: function( event ) { insertParagraph( event, this.recorder ) } },
            { name: DocumentRecorder.INSERT_RESERVED_WORD, params: this.#eventParams, handleEvent: function( event ) { action.insertReservedWords( event, this.params ) } },
            { name: "Selection" , params: this.#eventParams, handleEvent: function( event ) { action.textSelection( event, this.params ); } },
            { name: "MouseSelection", params: this.#eventParams, handleEvent: function( event ) { action.getSelectedText( event, this.params ); } },
            { name: "KeyType", params: this.#eventParams, handleEvent: function( event ) { action.specialKeysSettings( event, this.params ); } },
            { name: "ComposeBegin", params: this.#eventParams, handleEvent: function( event ) { action.composeOn( event, this.params ); } },
            { name: "ComposeEnd", params: this.#eventParams, handleEvent: function( event ) { action.composeOff( event, this.params ); } },
            { name: "DataTransfer", params: this.#eventParams, handleEvent: function( event ) { action.sendDocumentData( event, this.params ); } },
            { name: "TextArea", params: this.#eventParams, handleEvent: function( event ) { displayText( event, this.params ); } },
            { name: "Edit", params: this.#eventParams, handleEvent: function( event ) { action.editText( event, this.params ) } },
            { name: "SelectTextArea", params: this.#eventParams, handleEvent: function( event ) { action.changeText( event, this.params ); } },
			{ name: "Focus", params: this.#eventParams, handleEvent: function( event ) { action.scrollScreen( event, this.params ); } },
			{ name: "MovePanel", params: this.#eventParams, handleEvent: function( event ) { action.moveToolPanel( event, this.params ) } },
			{ name: "Pulldown", params: this.#eventParams, handleEvent: function( event ) { action.pulldown( event, this.params ) } },
			{ name: "CloseDatalist", params: this.#eventParams, handleEvent: function( event ) { action.closeList( event, this.params ) } }
        ];
        
        closeButton.addEventListener( "mouseup", ( event ) => {
			this.#toolPanel.style.cssText = "";
			this.#toolPanel.style.display = "none";
        	this.#toolPanel.style.backgroundColor = "white";
        	this.#toolPanel.style.overflowY = "scroll";
        	this.#toolPanel.style.width = "98%";
			const endKeywordDivs = document.querySelectorAll( ".EndKeywordDiv" );
			endKeywordDivs.forEach( endKeywordDiv => {
				this.#eventParams.endDiv.removeChild( endKeywordDiv );
			} );
		} );

        valueButton.addEventListener( "click", this.eventFunction( DocumentRecorder.INSERT_RESERVED_WORD ) );

		document.body.addEventListener( "click", this.eventFunction( "CloseDatalist" ) );

		operationTextbox.addEventListener( "click", this.eventFunction( "Pulldown" ) );
		operationPulldownBtn.addEventListener( "click", this.eventFunction( "Pulldown" ) );
		valueTextbox.addEventListener( "click", this.eventFunction( "Pulldown" ) );
		valuePulldownBtn.addEventListener( "click", this.eventFunction( "Pulldown" ) );

        paragraphButton.addEventListener( "click", this.eventFunction( DocumentRecorder.INSERT_PARAGRAPH ) );

        this.#textArea.addEventListener( "input", this.eventFunction( "DataTransfer" ) );
        this.#textArea.addEventListener( "input", this.eventFunction( "TextArea" ) );
        this.#textArea.addEventListener( "keydown", this.eventFunction( "KeyType" ) );
        this.#textArea.addEventListener( "keyup", this.eventFunction( "Selection" ) );
        this.#textArea.addEventListener( "compositionstart", this.eventFunction( "ComposeBegin" ) );
        this.#textArea.addEventListener( "compositionend", this.eventFunction( "ComposeEnd" ) );
        this.#textArea.addEventListener( "mouseup", this.eventFunction( "MouseSelection" ) );
        this.#textArea.addEventListener( "paste", this.eventFunction( "Edit" ) );
        this.#textArea.addEventListener( "cut", this.eventFunction( "Edit" ) );
        this.#textArea.addEventListener( "click", this.eventFunction( "Focus" ) );
        this.#textArea.addEventListener( "changeposition", this.eventFunction( "MovePanel" ) );
        this.insertParagraph();
    }

    getDocuments() {
        return this.#documentStructures;
    }

	getRegisteredDatalist() {
		return this.#registeredDatalist;
	}
	
	getVerb() {
		return JSON.stringify( this.#verb );
	}
	
	getReservedKeywords() {
		return this.#reservedKeywords;
	}

    registerKeywordButton( btnId, statement ) {
		this.#keywordBlock.insertAdjacentHTML( "beforeend", statement );
        this.#buttonTypes.push( { id: btnId, type: DocumentRecorder.INSERT_RESERVED_WORD } );
        const button = document.getElementById( btnId );
        button.addEventListener( "click", this.eventFunction( DocumentRecorder.INSERT_RESERVED_WORD ) );
        const name = btnId.substring( 7, btnId.length );
        const textbox = document.getElementById( name );
        textbox.addEventListener( "click", this.eventFunction( "Pulldown" ) );
        textbox.addEventListener( "input", enableButtons );
        const pulldownBtn = document.getElementById( name + "-Pulldown" );
        pulldownBtn.addEventListener( "click", this.eventFunction( "Pulldown" ) );
    }
    registerOptions( textboxId, options, usage ) {
		return new Promise( resolve => {
			this.#registeredDatalist[ textboxId ] = [];
			this.#usage[ textboxId ] = usage;
			options.forEach( async( value ) => {
				this.#registeredDatalist[ textboxId ].push( value );
			} );
			resolve();
		} );
	}
	
	registerReservedKeywords( keywords) {
		const keys = Object.keys( keywords );
		keys.forEach( key => {
			this.#reservedKeywords[ key ] = keywords[ key ];
		} );
	}

    getParagraphNumber() {
        return this.#textAreasNumber;
    }

	eventFunction( name ) {
        const index = this.#eventObject.findIndex( obj => obj.name == name );
        return this.#eventObject[ index ];
    }

    #addTextArea( ) {
        this.#textAreasNumber += 1;
        this.#documentStructures.push( new Document );
    }

    setImage( idNumber, illust ) {
        this.#documentStructures[ idNumber - 1 ].setImage( illust );
    }

    insertParagraph() {
		this.#addTextArea();
        const paraNumber = this.#textAreasNumber - 1;

        // Create Preview Display Area
        const previewDiv = document.createElement( "div" );
        previewDiv.id = "Preview" + String( paraNumber + 1 );
        previewDiv.style.width = "60%";
        previewDiv.style.height = "fit-content";

        const para = document.createElement( "p" );
        para.id = this.#paragraphName + String( paraNumber + 1 );
        para.style.fontSize = "20px";

        previewDiv.appendChild( para );
        this.#previewDiv.appendChild( previewDiv );

		const button = document.createElement( "input" );
		button.type = "button";
		if( paraNumber != 0 ) this.#eventParams.text[ this.#eventParams.currentIndex ] = this.#textArea.value;
		this.#eventParams.currentIndex = paraNumber;
		this.#eventParams.currentTextNumber = parseInt( paraNumber + 1 );
		this.#eventParams.text.push( "" );
		this.#textArea.value = "";
		button.id = "Text" + String( paraNumber + 1 );
		button.value = "Text" + String( paraNumber + 1 );
		const previousButton = document.querySelector( ".Text-Press-Button" );
		if( previousButton != null ) {
			previousButton.classList.remove( "Text-Press-Button" );
			previousButton.classList.add( "Text-Button-Preference" );
		}
		button.className = "Text-Press-Button";
		this.#previousTextButtonsDiv.appendChild( button );
		button.addEventListener( "click", this.eventFunction( "SelectTextArea" ) );
    }
    
    setButtonStatus( event ) {
		const button = document.querySelector( ".Text-Press-Button" );
		if( event.target != button ) {
			if( button != null ) {
				button.classList.remove( "Text-Press-Button" );
				button.classList.add( "Text-Button-Preference" );
			}
			event.target.classList.remove( "Text-Button-Preference" );
			event.target.classList.add( "Text-Press-Button" );
			if( this.#eventParams.currentTextNumber != -1 ) {
				this.#eventParams.text[ this.#eventParams.currentTextNumber - 1 ] = this.#textArea.value;
				this.#eventParams.currentIndex = parseInt( event.target.id.substring( 4, event.target.id.length ) ) - 1;
				this.#textArea.value = this.#eventParams.text[ this.#eventParams.currentIndex ];
			}
			this.#eventParams.currentTextNumber = parseInt( event.target.id.substring( 4, event.target.id.length ) );
		}
	}
	
	setCustomDatalist( key, options ) {
		for( const option of options ) {
			if( ! this.#registeredDatalist[ key ].includes( option ) ) {
				this.#registeredDatalist[ key ].push( option );
			}
		}
	}

	setVerb( label, action ) {
		this.#verb.label = label;
		this.#verb.action = action;
		this.#menulist[ "ValueMenulist" ] = this.#verb;
		this.#menulist[ "LabelMenulist" ] = Object.keys( label );
	}
}

function insertParagraph( event, recorder ) {
    recorder.insertParagraph();
}

function setVerbButtonStatus() {
	console.log( "ねこまるチェック" );
	const insertButton = document.getElementById( "Insert-VerbValue" );
	const label = ( document.getElementById( "Label" ).value == "" );
	const value = ( document.getElementById( "VerbValue" ).value == "" );
	console.log( "label: " + label );
	console.log( "value: " + value );
	insertButton.disabled = ( label || value );
}

class Verb {
	label = new Object();
	action = [];
	
	entry( operation, type, statement ) {
		if( operation == "" ) return false;
		const index = this.label[ operation ];
		
		if( index != null ) {
			console.log( "type: " + type );
			const verbs = this.action[ index ][ String( type ) ];
			if( ! verbs.includes( statement ) ) verbs.push( statement );
		} else {
			this.label[ operation ] = Object.keys( this.label ).length;
			this.action.push( { "0" : [], "1" : [], "2" : [], "3" : [], "4" : [] } );
			this.action[ this.label[ operation ] ][ String( type ) ].push( statement );
		}
		return true;
	}
	getHistory( operation, type ) {
		if( operation != "" && this.label[ operation ] != undefined ) {
			return this.action[ this.label[ operation ] ][ String( type ) ];
		} else {
			return null;
		}
	}
}

function enableButtons( event ) {
	const empty = ( event.target.value == "" );
	console.log( `target value: ${ event.target.value }` );
	const id = `Insert-${ event.target.id }`;
	const insertBtn = document.getElementById( id );
	insertBtn.disabled = empty;
}

export { DocumentRecorder, setVerbButtonStatus };