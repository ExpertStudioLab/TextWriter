/**
 * 
 */
import { Document } from "./document_manager.js";
import * as action from "./document_actions.js";
import { displayText } from "./display_text.js";

class DocumentRecorder {
    #documentStructures = [];
    #paragraphNumber = 1;
    #currentTextArea;
    #textAreas = [];
    #buttons = [];
    #eventObject;
    #eventObjectNumber;
    #eventParams = new Object();


    constructor() {
        this.#eventParams.documentStructures = this.#documentStructures;
        this.#eventParams.isComposing = false;
        this.#eventParams.inputStatus = "Normal";
        this.#eventParams.dataSending = false;
        this.#eventParams.selectionStart = 0;

        this.#eventObject = [
            { name: "Selection" , params: this.#eventParams, handleEvent: function( event ) { action.textSelection( event, this.params ); } },
            { name: "MouseSelection", params: this.#eventParams, handleEvent: function( event ) { action.getSelectedText( event, this.params ); } },
            { name: "keyType", params: this.#eventParams, handleEvent: function( event ) { action.specialKeysSettings( event, this.params ); } },
            { name: "Focus", params: this.#eventParams, handleEvent: function( event ) { action.getCurrentTextArea( event, this.params ); } },
            { name: "ComposeBegin", params: this.#eventParams, handleEvent: function( event ) { action.composeOn( event, this.params ); } },
            { name: "ComposeEnd", params: this.#eventParams, handleEvent: function( event ) { action.composeOff( event, this.params ); } },
            { name: "DataTransfer", params: this.#eventParams, handleEvent: function( event ) { action.sendDocumentData( event, this.params ); } },
            { name: "TextArea", params: this.#eventParams, handleEvent: function( event ) { displayText( event, this.params ); } }
        ];
        this.#eventObjectNumber = this.#eventObject.length;
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
        button.element.addEventListener( "click", this.#eventFunction( name ) );
    }


    getParagraphNumber() {
        return this.#paragraphNumber;
    }

    #eventFunction( name ) {
        const index =this.#eventObject.findIndex( obj => obj.name == name );
        return this.#eventObject[ index ];
    }

    registerTextArea( id ) {
        this.#textAreas = document.getElementById( id );
        this.#textAreas.addEventListener( "input", this.#eventFunction( "DataTransfer" ) );
        this.#textAreas.addEventListener( "input", this.#eventFunction( "TextArea" ) );
        this.#textAreas.addEventListener( "click", this.#eventFunction( "Focus" ) );
        this.#textAreas.addEventListener( "keydown", this.#eventFunction( "KeyType" ) );
        this.#textAreas.addEventListener( "keyup", this.#eventFunction( "Selection" ) );
        this.#textAreas.addEventListener( "compositionstart", this.#eventFunction( "ComposeBegin" ) );
        this.#textAreas.addEventListener( "compositionend", this.#eventFunction( "ComposeEnd" ) );
        this.#textAreas.addEventListener( "mouseup", this.#eventFunction( "MouseSelection" ) );
        this.#paragraphNumber += 1;
        this.#documentStructures.push( new Document );
    }

}

export { DocumentRecorder };