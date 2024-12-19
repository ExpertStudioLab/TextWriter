/**
 * 
 */
export class DocumentList {
	#tag = 0;
	#title;
	#section;
	#column;
	#idNumber;

	appendElement( parent, type, text ) {
		appendSettings( type );

	}
	appendSettings( type ) {
		switch( type ) {
			case "Tag":
				this.#tag += 1;
				this.#title = 0;
				this.#section = 0;
				this.#column = 0;
				this.#idNumber = String( this.#tag );
				break;
			case "Title":
				this.#title += 1;
				this.#section = 0;
				this.#column = 0;
				this.#idNumber = String( this.#tag ) + String( this.#title );
				break;
			case "Section":
				this.#section += 1;
				this.#column = 0;
				this.#idNumber = String( this.#tag ) + String( this.#title ) + String( this.#section );
				break;
			case "Column":
				this.#column += 1;
				this.#idNumber = String( this.#tag ) + String( this.#title ) + String( this.#section ) + String( this.#column );
				break;
		}
	}
}
