/**
 * 
 */
import { Document } from "./modules/document_manager.js";
class TestClass {
	#num = 90;
	#myFunc = showDisplay;
	constructor() {
		console.log( "TestClass" );
	}

	publicFunc() {
		this.#myFunc();
	}
}

function showDisplay() {
	console.log( "num is " + "." );
}
class DocumentRecorder {
    #documentStructures;
    #paragraphNumber;
    #currentTextArea;
    #insertParagraphBtn;
    #display;
    static InsertParagraph = 0;

    constructor() {
    	this.#paragraphNumber = 0;
    	this.#currentTextArea = { num : 100, name: "text" };
    	this.#insertParagraphBtn = 0;
		this.#documentStructures = [];
        this.#documentStructures.push( new Document() );
        this.#documentStructures[ 0 ].changeText( 0, "Hello" );
        console.log( this.#documentStructures[ 0 ].getTextPosition( 0 ) );
//        document.body.addEventListener( "click", this.display( event ) );
    }
    
    
    registerEventListener() {
		this.#display = {
			textArea : this.#currentTextArea.num,
			handleEvent : function( event ) {
				console.log( this.textArea );
			}
		}
		document.body.addEventListener( "click", this.#display );
	}
	setTextArea( newNumber ) {
		this.#currentTextArea.num = newNumber;
	}
    getText() {
		return this.#documentStructures[ 0 ].getText( 0 );
	}
	getCurrentTextArea() {
		return this.#currentTextArea;
	}    
}


export { TestClass, DocumentRecorder };