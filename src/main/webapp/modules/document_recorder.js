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
    #textAreas = [];
    #textAreasNumber = 0;
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
        const index =this.#eventObject.findIndex( obj => obj.name == name );
        return this.#eventObject[ index ];
    }

    addTextArea( ) {
		const i = this.#textAreasNumber;
        this.#textAreas[ i ] = document.getElementById( this.#textAreaName + String( i + 1 ) );
        this.#textAreas[ i ].addEventListener( "input", this.eventFunction( "DataTransfer" ) );
        this.#textAreas[ i ].addEventListener( "input", this.eventFunction( "TextArea" ) );
        this.#textAreas[ i ].addEventListener( "click", this.eventFunction( "Focus" ) );
        this.#textAreas[ i ].addEventListener( "keydown", this.eventFunction( "KeyType" ) );
        this.#textAreas[ i ].addEventListener( "keyup", this.eventFunction( "Selection" ) );
        this.#textAreas[ i ].addEventListener( "compositionstart", this.eventFunction( "ComposeBegin" ) );
        this.#textAreas[ i ].addEventListener( "compositionend", this.eventFunction( "ComposeEnd" ) );
        this.#textAreas[ i ].addEventListener( "mouseup", this.eventFunction( "MouseSelection" ) );
        this.#textAreasNumber += 1;
        this.#documentStructures.push( new Document );

        this.#eventParams.isComposing[ i ] = false;
        this.#eventParams.inputStatus[ i ] = "Normal";
        this.#eventParams.dataSending[ i ] = false;
    }

}

export { DocumentRecorder };