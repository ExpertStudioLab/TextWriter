/**
 * 
 */
export class DocumentList {
	#list;
	#tag;
	#title;
	#section;

	#parent;

	#idNumber;
	#contentWidth = 0;
	#contentDivs = [];
	#spaceDivs = [];
	#columns = [];

	#tagNumber = 0;
	#titleNumber;
	#sectionNumber;
	#columnNumber;

	constructor( list ) {
		this.#list = list;
	}

	appendElement( type, text ) {
		this.appendSettings( type );
		switch( type ) {
			case "Column":
				return this.#appendElementColumn( type, text );
			default:
				this.#appendElementDiv( type, text );
		}
	}
	#appendElementColumn( type, text ) {
		const contentDiv = document.createElement( "div" );
		contentDiv.id = "Div" + this.#idNumber;
		contentDiv.className = "Containor";
		contentDiv.style.cursor = "default";
		contentDiv.style.height = "fit-content";
		contentDiv.style.width = "fit-content";
		const textDiv = document.createElement( "div" );
		const spaceDiv = document.createElement( "div" );
		spaceDiv.className = "Space";
		spaceDiv.style.height = "2px";
		spaceDiv.style.backgroundColor = "rgb(145, 230, 250)";
		const displayText = document.createElement( "span" );
		displayText.style.fontSize = "16px";
		displayText.style.lineHeight = "24px";
		displayText.innerText = text;
		displayText.id = this.#idNumber;
		displayText.className = type;
		textDiv.appendChild( displayText );
		contentDiv.appendChild( textDiv );
		contentDiv.appendChild( spaceDiv );
		this.#parent.appendChild( contentDiv );

		this.#contentDivs.push( contentDiv );
		this.#spaceDivs.push( spaceDiv );
		this.#columns.push( displayText );
		if( contentDiv.clientWidth > this.#contentWidth ) {
			this.#contentWidth = contentDiv.clientWidth;
			for( const div of this.#contentDivs ) {
				div.style.width = String( this.#contentWidth ) + "px";
			}
			for( const div of this.#spaceDivs ) {
				div.style.width = String( this.#contentWidth ) + "px";
			}
		} else {
			contentDiv.style.width = String( this.#contentWidth ) + "px";
			spaceDiv.style.width = String( this.#contentWidth ) + "px";
		}
		return contentDiv;
	}
	#appendElementDiv( type, text ) {
		const blockDiv = document.createElement( "div" );
		blockDiv.id = type + this.#idNumber;
		blockDiv.style.margin = "5px 0 0 5%";
		const contentDiv = document.createElement( "div" );
		contentDiv.style.width = "fit-content";
		contentDiv.style.height = "fit-content";
		const displayText = document.createElement( "span" );
		displayText.innerText = text;
		displayText.id = this.#idNumber;
		displayText.className = type;
		displayText.fontSize = "16px";
		displayText.lineHeight = "24px";
		contentDiv.appendChild( displayText );
		if( type == "Section" ) {
			contentDiv.className = "Containor";
			const spaceDiv = document.createElement( "div" );
			spaceDiv.className = "Space";
			spaceDiv.style.height = "2px";
			spaceDiv.style.backgroundColor = "rgb(145, 230, 250)";
			contentDiv.appendChild( spaceDiv );
		}
		blockDiv.appendChild( contentDiv );
		this.#parent.appendChild( blockDiv );
		this.#saveDiv( blockDiv, type );
	}
	appendSettings( type ) {
		let idNumber;
		switch( type ) {
			case "Tag":
				this.#parent = this.#list;
				this.#tagNumber += 1;
				this.#titleNumber = 0;
				this.#sectionNumber = 0;
				this.#columnNumber = 0;
				idNumber = [ String( this.#tagNumber ) ];
				break;
			case "Title":
				this.#parent = this.#tag;
				this.#titleNumber += 1;
				this.#sectionNumber = 0;
				this.#columnNumber = 0;
				idNumber = [ String( this.#tagNumber ), String( this.#titleNumber ) ];
				break;
			case "Section":
				this.#parent = this.#title;
				this.#sectionNumber += 1;
				this.#columnNumber = 0;
				idNumber = [ String( this.#tagNumber ), String( this.#titleNumber ), String( this.#sectionNumber ) ];
				break;
			case "Column":
				this.#parent = this.#section;
				this.#columnNumber += 1;
				idNumber = [ String( this.#tagNumber ), String( this.#titleNumber ), String( this.#sectionNumber ), String( this.#columnNumber ) ];
				break;
		}
		this.#idNumber = "_" + idNumber.join( "_" );
	}
	#saveDiv( div, type ) {
		switch( type ) {
			case "Tag":
				this.#tag = div;
				break;
			case "Title":
				this.#title = div;
				break;
			case "Section":
				this.#section = div;
				break;
		}
	}

	getColumns() {
		return this.#columns;
	}
}
