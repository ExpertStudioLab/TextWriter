/**
 * 
 */
import { Document } from "./document_manager.js";
import * as action from "./document_actions.js";
import { displayText } from "./display_text.js";
import { insertIllust } from "../data_transfer.js";
import { Illustration } from "./illustration.js";

class DocumentRecorder {
	static INSERT_PARAGRAPH = "InsertParagraph";
    static INSERT_RESERVED_WORD = "InsertKeyword";
	
    #documentStructures = [];
    #basicDiv;
    #previewDiv;
    #paragraphButtonDiv;
    #paragraphName = "Doc";
    #textAreaName = "Contents";
    #textAreasNumber = 1;
    #buttonTypes = [];
    #eventObject;
    #eventParams = new Object();


//    constructor( paragraphName, textAreaName ) {
//		this.#paragraphName = paragraphName;
//		this.#textAreaName = textAreaName;
    constructor( basicDivId, previewDivId ) {
		this.#basicDiv = document.getElementById( basicDivId );
        this.#previewDiv = document.getElementById( previewDivId );

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

		this.#eventParams.recorder = this;
        this.#eventParams.documentStructures = this.#documentStructures;
        this.#eventParams.paragraphName = this.#paragraphName;
        this.#eventParams.textAreaName = this.#textAreaName;
        this.#eventParams.textAreaNameLength = String( this.#textAreaName ).length;
        this.#eventParams.isComposing = [];
        this.#eventParams.inputStatus = [];
        this.#eventParams.dataSending = [];
        this.#eventParams.selectionStart = [];
        this.#eventParams.selectionEnd = [];
        this.#eventParams.timer = [];
        this.#eventParams.keyEvent = [];

        this.#eventObject = [
            { name: DocumentRecorder.INSERT_PARAGRAPH, recorder: this, handleEvent: function( event ) { insertParagraph( event, this.recorder ) } },
            { name: DocumentRecorder.INSERT_RESERVED_WORD, params: this.#eventParams, handleEvent: function( event ) { action.insertReservedWords( event, this.params ) } },
            { name: "Selection" , params: this.#eventParams, handleEvent: function( event ) { action.textSelection( event, this.params ); } },
            { name: "MouseSelection", params: this.#eventParams, handleEvent: function( event ) { action.getSelectedText( event, this.params ); } },
            { name: "KeyType", params: this.#eventParams, handleEvent: function( event ) { action.specialKeysSettings( event, this.params ); } },
            { name: "Focus", params: this.#eventParams, handleEvent: function( event ) { action.getCurrentTextArea( event, this.params ); } },
            { name: "ComposeBegin", params: this.#eventParams, handleEvent: function( event ) { action.composeOn( event, this.params ); } },
            { name: "ComposeEnd", params: this.#eventParams, handleEvent: function( event ) { action.composeOff( event, this.params ); } },
            { name: "DataTransfer", params: this.#eventParams, handleEvent: function( event ) { action.sendDocumentData( event, this.params ); } },
            { name: "TextArea", params: this.#eventParams, handleEvent: function( event ) { displayText( event, this.params ); } },
            { name: "Edit", params: this.#eventParams, handleEvent: function( event ) { action.editText( event, this.params ) } },
        ];

        paragraphButton.addEventListener( "click", this.eventFunction( DocumentRecorder.INSERT_PARAGRAPH ) );

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
		const i = this.#textAreasNumber;
        const textArea = document.getElementById( this.#textAreaName + String( i ) );
        textArea.addEventListener( "input", this.eventFunction( "DataTransfer" ) );
        textArea.addEventListener( "input", this.eventFunction( "TextArea" ) );
        textArea.addEventListener( "click", this.eventFunction( "Focus" ) );
        textArea.addEventListener( "keydown", this.eventFunction( "KeyType" ) );
        textArea.addEventListener( "keyup", this.eventFunction( "Selection" ) );
        textArea.addEventListener( "compositionstart", this.eventFunction( "ComposeBegin" ) );
        textArea.addEventListener( "compositionend", this.eventFunction( "ComposeEnd" ) );
        textArea.addEventListener( "mouseup", this.eventFunction( "MouseSelection" ) );
        textArea.addEventListener( "contextmenu", this.eventFunction( "Focus" ) );
        textArea.addEventListener( "paste", this.eventFunction( "Edit" ) );
        textArea.addEventListener( "cut", this.eventFunction( "Edit" ) );
        this.#textAreasNumber += 1;
        this.#documentStructures.push( new Document );

        this.#eventParams.isComposing[ i - 1 ] = false;
        this.#eventParams.inputStatus[ i - 1 ] = "Normal";
        this.#eventParams.dataSending[ i - 1 ] = false;
    }

    insertParagraph() {
        const paraNumber = this.#textAreasNumber;

        // Create Preview Display Area
        const previewDiv = document.createElement( "div" );
        previewDiv.id = "Preview" + String( paraNumber );
        previewDiv.style.width = "60%";
        previewDiv.style.minHeight = "400px";
        previewDiv.style.height = "fit-content";

        const image = document.createElement( "img" );
        image.id = "Illust" + String( paraNumber );
        image.style.float = "right";

        const para = document.createElement( "p" );
        para.id = this.#paragraphName + String( paraNumber );
        para.style.fontSize = "20px";

        previewDiv.appendChild( image );
        previewDiv.appendChild( para );
        this.#previewDiv.appendChild( previewDiv );

        // Create TextArea
        const textareaDiv = document.createElement( "div" );
        const textArea = document.createElement( "textarea" );
        textArea.id = this.#textAreaName + String( paraNumber );
        textArea.rows = 4;
        textArea.style.fontSize = "20px";
        textArea.style.width = "70%";
        textArea.style.marginBottom = "20px";

        textareaDiv.appendChild( textArea );
        this.#basicDiv.appendChild( textareaDiv );

        const buttonDiv = document.createElement( "div" );
        const button = document.createElement( "input" );
        button.type = "button";
        button.id = "Insert-Image" + String( paraNumber );
        button.value = "画像を挿入";

        buttonDiv.appendChild( button );
        this.#basicDiv.appendChild( buttonDiv );

        button.addEventListener( "click", insertIllust );

        this.#addTextArea();
    }
}

function insertParagraph( event, recorder ) {
    recorder.insertParagraph();
}


export { DocumentRecorder };