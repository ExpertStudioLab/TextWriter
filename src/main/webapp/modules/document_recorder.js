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
        
        this.#textArea = document.getElementById( this.#textAreaName );

		this.#eventParams.recorder = this;
        this.#eventParams.documentStructures = this.#documentStructures;
        this.#eventParams.textArea = this.#textArea;
        this.#eventParams.currentTextNumber = -1;
        this.#eventParams.text = [];
        this.#eventParams.inputStatus = "Normal";

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
            { name: "SelectTextArea", params: this.#eventParams, handleEvent: function( event ) { action.changeText( event, this.params ); } }
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
        this.insertParagraph();
    }

    getDocuments() {
        return this.#documentStructures;
    }

    registerKeywordButton( btnId ) {
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
}

function insertParagraph( event, recorder ) {
    recorder.insertParagraph();
}

export { DocumentRecorder };