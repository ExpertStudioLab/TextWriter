/**
 * 
 */
import { Illustration  } from "./illustration.js";

export class IllustrationRecorder {
	#illustration = [];
	#imageNumber = 0;
	#currentIndex;
	#canvasId;
	#registeredButtons = [];
	#eventObject;

	constructor( canvasId, newImageBtnId ) {
		this.#canvasId = canvasId;

		this.#eventObject = [
			{ name: "NewImage", recorder: this, handleEvent: function( event ) { addIllustration( event, this.recorder ) } },
			{ name: "ChangeIllust", recorder: this, handleEvent: function( event ) { changeIllustration( event, this.recorder ) } }
		];

		const newImageBtn = document.getElementById( newImageBtnId );
		newImageBtn.addEventListener( "click", this.eventFunction( "NewImage" ) );

		this.addIllustration();
	}

	eventFunction( name ) {
		const index = this.#eventObject.findIndex( obj => obj.name == name );
		return this.#eventObject[ index ];
	}

	getIllustration( index ) {
		return this.#illustration[ index ];
	}
	getIllustrations() {
		return this.#illustration;
	}

	getCurrentIndex() {
		return this.#currentIndex;
	}

	addIllustration() {
		if( this.#imageNumber != 0 ) {
			this.#illustration[ this.#currentIndex ].deleteAllSettings();
		}

		this.#currentIndex = this.#imageNumber;
		this.#illustration.push( new Illustration( this.#canvasId ) );
		for( const button of this.#registeredButtons ) {
			if( button.type != Illustration.TEXT ) {
				this.#illustration[ this.#currentIndex ].setButton( button.id, button.type );
			} else {
				this.#illustration[ this.#currentIndex ].setTextButton( button.id, button.textboxId );
			}
		}

		this.#imageNumber += 1;
		const previousButtons = document.getElementById( "Previous-Image" );
		const button = document.createElement( "input" );
		button.type = "button";
		button.value = "画像" + String( this.#imageNumber );
		button.id = "Previous-Image" + String( this.#imageNumber );
		previousButtons.appendChild( button );
		button.addEventListener( "click", this.eventFunction( "ChangeIllust" ) );

	}
	setButton( btnId, btnType ) {
		this.#registeredButtons.push( { id: btnId, type: btnType } );
		for( let i = 0; i < this.#imageNumber; i++ ) {
			this.#illustration[ i ].setButton( btnId, btnType);
		}
	}
	setTextButton( btnId, textboxId ) {
		this.#registeredButtons.push( { id: btnId, textboxId: textboxId, type: Illustration.TEXT } );
		for( let i = 0; i < this.#imageNumber; i++ ) {
			this.#illustration[ i ].setTextButton( btnId, textboxId );
		}
	}

	changeIllustration( event ) {
		this.#illustration[ this.#currentIndex ].deleteAllSettings();
		const id = event.target.id;
		this.#currentIndex = parseInt( id.substring( 14, id.length ) ) - 1;
		this.#illustration[ this.#currentIndex ].restoreAllSettings();
	}
}


function addIllustration( event, recorder ) {
	recorder.addIllustration();
}

function changeIllustration( event, recorder ) {
	recorder.changeIllustration( event );
}
