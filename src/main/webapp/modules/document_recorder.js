/**
 * 
 */
import { Document } from "./document_manager.js";
import * as action from "./document_actions.js";
import { displayText } from "./display_text.js";

class DocumentRecorder {
    #documentStructures = [];
    #paragraphName;
    #textAreaName;
    #textAreasNumber = 1;
    #buttons = [];
    #eventObject;
    #eventObjectNumber;
    #eventParams = new Object();


    constructor( paragraphName, textAreaName ) {
		this.#paragraphName = paragraphName;
		this.#textAreaName = textAreaName;
		
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
            { name: "Selection" , params: this.#eventParams, handleEvent: function( event ) { action.textSelection( event, this.params ); } },
            { name: "MouseSelection", params: this.#eventParams, handleEvent: function( event ) { action.getSelectedText( event, this.params ); } },
            { name: "KeyType", params: this.#eventParams, handleEvent: function( event ) { action.specialKeysSettings( event, this.params ); } },
            { name: "Focus", params: this.#eventParams, handleEvent: function( event ) { action.getCurrentTextArea( event, this.params ); } },
            { name: "ComposeBegin", params: this.#eventParams, handleEvent: function( event ) { action.composeOn( event, this.params ); } },
            { name: "ComposeEnd", params: this.#eventParams, handleEvent: function( event ) { action.composeOff( event, this.params ); } },
            { name: "DataTransfer", params: this.#eventParams, handleEvent: function( event ) { action.sendDocumentData( event, this.params ); } },
            { name: "TextArea", params: this.#eventParams, handleEvent: function( event ) { displayText( event, this.params ); } }
        ];
        this.#eventObjectNumber = this.#eventObject.length;
        
        this.addTextArea();
    }

    getDocuments() {
        return this.#documentStructures;
    }

    registerButton( name, id, callback ) {
        const button = new Object();
        button.name = name;
        button.element = document.getElementById( id );
        this.#buttons.push( button );

        button.element.addEventListener( "click", callback );
    }

    registerKeywordButton( name, id ) {
        const button = new Object();
        button.name = name;
        button.element = document.getElementById( id );
        this.#buttons.push( button );

        this.#eventObject[ this.#eventObjectNumber ] = {
            name: name, params: this.#eventParams, handleEvent: function( event ) { action.insertReservedWords( event, this.params ); }
        };
        button.element.addEventListener( "click", this.eventFunction( name ) );
    }


    getParagraphNumber() {
        return this.#textAreasNumber;
    }

	eventFunction( name ) {
        const index = this.#eventObject.findIndex( obj => obj.name == name );
        return this.#eventObject[ index ];
    }

    addTextArea( ) {
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
        this.#textAreasNumber += 1;
        this.#documentStructures.push( new Document );

        this.#eventParams.isComposing[ i - 1 ] = false;
        this.#eventParams.inputStatus[ i - 1 ] = "Normal";
        this.#eventParams.dataSending[ i - 1 ] = false;
    }

}

export { DocumentRecorder };