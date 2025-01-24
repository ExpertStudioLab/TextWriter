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
    #customDatalist = [];


    constructor( basicDivId, previewDivId, previousTextId ) {
		this.#basicDiv = document.getElementById( basicDivId );
        this.#previewDiv = document.getElementById( previewDivId );
        this.#previousTextButtonsDiv = document.getElementById( previousTextId );

        this.#basicDiv.insertAdjacentHTML( "afterend",
            "<div id=\"Paragraph-Button\"></div>"
        )
        this.#paragraphButtonDiv = document.getElementById( "Paragraph-Button" );
        this.#paragraphButtonDiv.className = this.#basicDiv.className;

        const paragraphButton = document.createElement( "input" );
        paragraphButton.type = "button";
        paragraphButton.id = "Paragraph";
        paragraphButton.value = "段落の追加";

        this.#paragraphButtonDiv.appendChild( paragraphButton );

		const closeButtonDiv = document.createElement( "div" );
		closeButtonDiv.style.textAlign = "right";
		closeButtonDiv.style.height = "20px";
		closeButtonDiv.style.paddingTop = "2px";
		closeButtonDiv.style.paddingBottom = "2px";
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
		closeButton.style.width = "25px";
		closeButton.style.height = "20px";
		closeButton.style.display = "inline-block";
		closeButton.style.marginRight = "5px";
//		closeButton.style.backgroundImage = "url( ./picture/close.png )";
		closeButton.appendChild( buttonImage );
		closeButton.appendChild( buttonImageHover );
		closeButton.appendChild( buttonImageActive );

		closeButtonDiv.appendChild( closeButton );
        this.#toolPanel = document.createElement( "div" );
        this.#toolPanel.id = "Tool-Panel";
        this.#toolPanel.style.display = "none";
        this.#toolPanel.style.backgroundColor = "white";
        this.#toolPanel.style.overflowY = "scroll";
        this.#toolPanel.style.width = "98%";
        this.#toolPanel.appendChild( closeButtonDiv );
        document.body.appendChild( this.#toolPanel );
        
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
		closeButton.addEventListener( "mouseup", ( event ) => {
			this.#toolPanel.style.cssText = "";
			this.#toolPanel.style.display = "none";
        	this.#toolPanel.style.backgroundColor = "white";
        	this.#toolPanel.style.overflowY = "scroll";
        	this.#toolPanel.style.width = "98%";
		} );

        this.#textArea = document.getElementById( this.#textAreaName );

		this.#eventParams.recorder = this;
        this.#eventParams.documentStructures = this.#documentStructures;
        this.#eventParams.textArea = this.#textArea;
        this.#eventParams.currentTextNumber = -1;
        this.#eventParams.text = [];
        this.#eventParams.inputStatus = "Normal";
        this.#eventParams.toolPanel = this.#toolPanel;
        this.#eventParams.customDatalist = this.#customDatalist;

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
			{ name: "MovePanel", params: this.#eventParams, handleEvent: function( event ) { action.moveToolPanel( event, this.params ) } }
        ];

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
    
    getCustomDatalist() {
		return this.#customDatalist;
	}

    registerKeywordButton( btnId, statement ) {
		this.#toolPanel.insertAdjacentHTML( "beforeend", statement );
        this.#buttonTypes.push( { id: btnId, type: DocumentRecorder.INSERT_RESERVED_WORD } );
        const button = document.getElementById( btnId );
        button.addEventListener( "click", this.eventFunction( DocumentRecorder.INSERT_RESERVED_WORD ) );
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
	
	setCustomDatalist( datalist ) {
		this.#customDatalist.push( datalist );
		const reservedWordOp = document.getElementById( datalist.datalistId + "-List" );
		for( const option of datalist.options ) {
			const optionEl = document.createElement( "option" );
			optionEl.value = option;
			reservedWordOp.appendChild( optionEl );
		}
	}
}

function insertParagraph( event, recorder ) {
    recorder.insertParagraph();
}

export { DocumentRecorder };