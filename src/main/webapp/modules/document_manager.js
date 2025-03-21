import { setEndKeywordSelector } from "./document_actions.js";
/**
 * 
 */
class Document {
    properties;
    textLength;
    textPieces;
    currentIndex;
    currentLength;
    keywordCount;
    containImage = false;
    constructor() {
        this.properties = [];
        this.textLength = 0;
        this.textPieces = 0;
        this.currentIndex = 0;
        this.currentLength = 0;
        this.keywordCount = 0;

        this.insertText( "", 0 );
    }

    insertText( text, index ) {
        this.properties.splice( index, 0, new DocumentProperties() );

        if( index + 1 == this.textPieces ) {
            this.currentLength = this.textLength;
            this.textLength += String( text ).length;
        } else {
            this.currentLength += String( text ).length;
            this.textLength += String( text ).length;
        }
        this.properties[ index ].text = String( text );
        this.properties[ index ].isKeywords = false;
        this.properties[ index ].keywordType = null;
        const start = ( index == 0 ) ? 0 : this.properties[ index - 1 ].textPosition.getEnd();
        const end = start + String( text ).length;
        this.properties[ index ].textPosition = new Caret( start, end );
        this.currentIndex = this.textPieces;
        this.textPieces += 1;

        for( let i = index + 1; i < this.textPieces; i++ ) {
            this.properties[ i ].textPosition.setStart( this.properties[ i ].textPosition.getStart() + String( text ).length );
            this.properties[ i ].textPosition.setEnd( this.properties[ i ].textPosition.getEnd() + String( text ).length );
        }
    }
    deleteText( index ) {
        // if delete text at last index
        if( this.textPieces == 1 ) {
            return;
        }
        if( index == this.currentIndex ) {
            this.currentLength = this.properties[ index - 1 ].textPosition.getStart();
            this.textLength = this.properties[ index - 1 ].textPosition.getEnd();
        } else {
            const dif = this.properties[ index ].textPosition.getEnd() - this.properties[ index ].textPosition.getStart();
            this.currentLength -= dif;
            this.textLength -= dif;
        }
        this.textPieces -= 1;
        this.currentIndex -= 1;
        this.properties.splice( index, 1 );
    }
    deleteKeywords( pos, endPos, textLength, textSelected, params ) {
		let start, end;
		if( textLength > 0 && ! textSelected ) endPos = pos = pos - textLength;

		for( start = 0; start < this.textPieces; start++ ) {
			let flag;
			if( start != this.textPieces - 1 ) {
				flag = Math.sign( pos - this.properties[ start ].textPosition.getStart() ) * Math.sign( this.properties[ start ].textPosition.getEnd() + 1 - pos );
			} else {
				flag = Math.sign( pos - this.properties[ start ].textPosition.getStart() ) * Math.sign( this.properties[ start ].textPosition.getEnd() - pos );
			}
			if( flag == 1 ) {
				if( this.properties[ start ].isKeywords && this.properties[ start ].textPosition.getEnd() == ( pos ) ) {
					start++;
				}
				break;
			}
		}
		for( end = 0; end < this.textPieces; end++ ) {
			let flag;
			if( end != this.textPieces - 1 ) {
				flag = Math.sign( endPos - this.properties[ end ].textPosition.getStart() ) * Math.sign( this.properties[ end ].textPosition.getEnd() + 1 - endPos );
			} else {
				flag = Math.sign( endPos - this.properties[ end ].textPosition.getStart() ) * Math.sign( this.properties[ end ].textPosition.getEnd() - endPos )
			}
			if( flag == 1 ) {
				if( this.properties[ end ].isKeywords && this.properties[ end ].textPosition.getEnd() == ( endPos ) ) {
					end++;
				}
				break;
			}
		}
		if( pos == 0 ) {
			start = end = 0;
		}
		/*
		if( ! textSelected ) {
			end = start;
		}
		*/
		console.log( `start: ${ start }, end: ${ end }` );

		let keywords = [];
		for( let i = start; i <= end; i++ ) {
			if( this.properties[ i ].isKeywords ) {
				keywords.push( this.properties[ i ] );
			}
		}
		let keywordName = null;
		const deleteEndKeywords = [];
		keywords.forEach( keyword => {
//			if( keyword.keywordName != "EndKeyword" && keyword.keywordName != "VerbValue" ) {
			if( ! keyword.keywordName.match( "(EndKeyword|VerbValue)" ) ) {
				this.keywordCount--;
				if( keyword.isEnd ) {
					deleteEndKeywords.push( `End${ keyword.keywordName }` );
				} else {
					keywordName = keyword.keywordName;
					let id = keywordName.substring( 7, keywordName.length );
					const endKeywordDiv = document.getElementById( "EndKeywordDiv" + id );
					params.endDiv.removeChild( endKeywordDiv );
				}
			} else if( keyword.keywordName != "VerbValue") {
				const matchIndex = deleteEndKeywords.findIndex( name => name == keyword.keywordId );
				if( matchIndex == -1 ) {
					const keywordIndex = this.properties.findIndex( property =>
														`End${ property.keywordName }` == keyword.keywordId );
					let id = keyword.keywordId;
					id = id.substring( 10, id.length );
					this.properties[ keywordIndex ].isEnd = false;

					setEndKeywordSelector( this.properties[ keywordIndex ].text, this.properties[ keywordIndex ].keywordId,
																id, params );
				}
			}
		} );

		let deleteIndexes = -1;
		if( start > 0 && keywords.length == 0 ) {
			keywordName = this.properties[ start - 1 ].keywordName;
		} else if( keywordName != null ) {
			deleteIndexes = parseInt( keywords[ 0 ].keywordName.substring( 7, keywords[ 0 ].keywordName.length ) );
		}

		keywords = [];
		for( let i = end + 1; i < this.properties.length; i++ ) {
			if( this.properties[ i ].keywordName != undefined && this.properties[ i ].keywordName.match( "Keyword\\d+" ) ) {
				keywords.push( this.properties[ i ] );
			}
		}

		let lastIndex = 0;

		if( keywordName != null ) {
			lastIndex = parseInt( keywordName.substring( 7, keywordName.length ) );
		}
		
		if( deleteIndexes == -1 ) {
			deleteIndexes = lastIndex + 1;
		} else {
			if( lastIndex == 0 ) {
				deleteIndexes = 1;
			}
		}

		keywords.forEach( val => {
			console.log( val.text );
		} );
		for( let i = 0; i < keywords.length; i++ ) {
			const name = keywords[ i ].keywordName;
			keywords[ i ].keywordName = `Keyword${ lastIndex + 1 + i }`;
			if( ! keywords[ i ].isEnd ) {
				console.log(lastIndex + 1 + i );
				const deleteDiv = document.getElementById( `EndKeywordDiv${ lastIndex + 1 + i }` );
				params.endDiv.removeChild( deleteDiv );

				console.log( `lastIndex: ${ lastIndex }` );
				console.log( `newIndex: ${ deleteIndexes }` );
				setEndKeywordSelector( keywords[ i ].text, keywords[ i ].keywordId, deleteIndexes + i, params );
			} else if( keywords[ i ].isEnd ) {
				const endIndex = this.properties.findIndex( val => val.keywordId == `End${ name }` );
				if( endIndex != -1 ) {
					this.properties.splice( endIndex, 1 );
				}
			}
		}
	}
    changeText( index, newText ) {
        const dif = String( newText ).length - String( this.properties[ index ].text ).length;
        this.properties[ index ].text = String( newText );
        this.textLength += dif;

        if( parseInt( index ) != this.currentIndex ) {
            this.currentLength += dif;
        }

        this.properties[ index ].textPosition.setEnd( this.properties[ index ].textPosition.getEnd() + dif );

        // change all texts textPosition parameters
        for( let i = index + 1; i < this.textPieces; i++ ) {
            this.properties[ i ].textPosition.setStart( this.properties[ i ].textPosition.getStart() + dif );
            this.properties[ i ].textPosition.setEnd( this.properties[ i ].textPosition.getEnd() + dif );
        }
    }
    concatText( index ) {
        if( index > 0 && !this.properties[ index - 1 ].isKeywords ) {
            this.changeText( index - 1, this.properties[ index - 1 ].text.concat( this.properties[ index ].text ) );
            this.deleteText( index );
            index -= 1;
        }
        if( index < this.textPieces - 1 && !this.properties[ index + 1 ].isKeywords ) {
            this.changeText( index, this.properties[ index ].text.concat( this.properties[ index + 1 ].text ) );
            this.deleteText( index + 1 );
        }
    }
    getText( index ) {
        if( index >= 0 && index < this.textPieces ) {
            return this.properties[ index ].text;
        }
        return null;
    }
    getSubText( index, start, end ) {
        const textOfIndex = this.properties[ index ].text;
        if( textOfIndex == null ) {
            return "";
        }
        return textOfIndex.substring( start, end );
    }

    insertKeyword( keyword, keywordType, keywordId, specify, pos ) {
        let index = this.searchDocumentIndex( pos );

        if( pos > this.properties[ index ].textPosition.getStart() && pos < this.properties[ index ].textPosition.getEnd() ) {
            if( this.properties[ index ].isKeywords ) {
                this.deleteKeyword( index );
                this.deleteText( index - 1 );
                this.deleteText( index );
                index -= 1;
            }
            const start = this.properties[ index ].textPosition.getStart();
            this.insertText( this.properties[ index ].text.substring( pos - start, this.properties[ index ].textPosition.getEnd() - start ), index + 1 );
            this.changeText( index, this.properties[ index ].text.substring( 0, pos - start ) );
        }else if( String( this.properties[ index ].text ).length > 0 && pos == this.properties[ index ].textPosition.getEnd() ) {
            this.insertText( "", index + 1 );
        } else {
            this.insertText( "", index );
        }

        this.insertText( keyword, index + 1 );
        this.properties[ index + 1 ].isKeywords = true;
        this.properties[ index + 1 ].keywordType = keywordType;
        this.properties[ index + 1 ].specify = specify;
		if( ! keywordId.match( "(EndKeyword\\d+|VerbValue|Keyword)" ) ) {
			this.keywordCount++;
			this.properties[ index + 1 ].keywordName = `Keyword${ this.keywordCount }`;
			this.properties[ index + 1 ].isEnd = false;
		} else if( ! keywordId.match( "(VerbValue|Keyword)" ) ) {
			this.properties[ index + 1 ].keywordName = "EndKeyword";
			this.properties[ index + 1 ].isEnd = true;
		} else if( keywordId.match( "Keyword" ) ) {
			this.properties[ index + 1 ].keywordName = "Keyword";
			this.properties[ index + 1 ].isEnd = true;
		} else {
			this.properties[ index + 1 ].keywordName = "VerbValue";
			this.properties[ index + 1 ].isEnd = true;
		}
        this.properties[ index + 1 ].keywordId = keywordId;

    }
    insertEndKeyword( keyword, keywordName, pos ) {
		const property = this.searchKeyword( keywordName );
		property.isEnd = true;
		this.insertKeyword( keyword, 3, "End" + keywordName, null, pos );
	}
	searchKeyword( keywordName ) {
		for( const property of this.properties ) {
			if( property.keywordName == keywordName ) {
				return property;
			}
		}
	}
	getKeywordCount() {
		return this.keywordCount;
	}
	getKeywordIndex( keywordName ) {
		for( let i = 0; i < this.properties.length; i++ ) {
			if( this.properties[ i ].keywordName == keywordName ) {
				return i;
			}
		}
	}
    deleteKeyword( index ) {
        this.properties[ index ].isKeywords = false;
        this.properties[ index ].keywordType = null;
    }
    isKeywordsFunc( index ) {
        if( index >= 0 && index < this.textPieces ) {
            return this.properties[ index ].isKeywords;
        }
        return false;
    }
    getDocument() {
        let doc = "";
        for( let i = 0; i < this.textPieces; i++ ) {
            doc += this.properties[ i ].text;
        }
        return doc;
    }
    getHTMLDocument() {
        let doc = "";
        for( let i = 0; i < this.textPieces; i++ ) {
            if( this.properties[ i ].isKeywords ) {
				console.log( `${this.properties[i].text}: ${this.properties[i].keywordType}` );
				const colorValue = [ 255, 225, 135, 0 ];
				const colorCode = [ `RGB(${colorValue[0]},${colorValue[1]},${colorValue[1]})`,
													`RGB(${colorValue[0]},${colorValue[3]},${colorValue[3]})`,
													`RGB(${colorValue[1]},${colorValue[3]},${colorValue[3]})`,
													`RGB(${colorValue[3]},${colorValue[1]},${colorValue[1]})` ];
				for( let k = 0; k < 3; k++ ) {
					const a = ( k != 0 ) ? 1 : 2;
					const b = ( k != 2 ) ? 3 : 2;
					colorCode.push( `RGB(${colorValue[k]},${colorValue[a]},${colorValue[b]})`);
					if( k != 0 ) colorCode.push( `RGB(${colorValue[k]},${colorValue[b]},${colorValue[a]})`);
				}

				doc += `<font style=\"color: ${colorCode[this.properties[i].keywordType]}; text-shadow: 1px 0px 2px #000;\">${this.properties[i].text}</font>`;
            } else {
                doc += this.properties[ i ].text;
            }
        }
        return doc;
    }

    searchDocumentIndex( pos ) {
        let i;
        
        for( i = 0; i < this.textPieces; i++ ) {
            const flag = Math.sign( pos - this.properties[ i ].textPosition.getStart() ) * Math.sign( this.properties[ i ].textPosition.getEnd() - pos );

            if( flag == 1 ) {
                return i;
            }
            if( flag == 0 && !this.properties[ i ].isKeywords ) {
                return i;
            }
        }
        if( pos == -1 ) {
            return 0;
        }
        return i;
    }
    
    getEndList() {
		const propertiesList = [];
		this.properties.forEach( property => {
			if( property.isKeywords && ! property.isEnd ) {
				propertiesList.push( property );
			}
		} );
		return propertiesList;
	}

    getTextPosition( index ) {
        return this.properties[ index ].textPosition;
    }
    getLength() {
        return this.textLength;
    }
    getTextPieces() {
        return this.textPieces;
    }
    getCurrentIndex() {
        return this.currentIndex;
    }
    getCurrentLength() {
        return this.currentLength;
    }

    createInstanceFromJson( jsonData ) {
		const jsonObject = JSON.parse( jsonData );
        this.textPieces = jsonObject.textPieces;
        this.textLength = jsonObject.textLength;
        this.currentIndex = jsonObject.currentIndex;
        this.currentLength = jsonObject.currentLength;
        this.properties.shift( );
        for( let i = 0; i < this.textPieces; i++ ) {
            this.properties.push( new DocumentProperties() );
            this.properties[ i ].text = jsonObject.properties[ i ].text;
            this.properties[ i ].isKeywords = jsonObject.properties[ i ].isKeywords;
            this.properties[ i ].keywordType = jsonObject.properties[ i ].keywordType;
            this.properties[ i ].textPosition = new Caret( jsonObject.properties[ i ].start, jsonObject.properties[ i ].end );
            this.properties[ i ].specify = new Specify( jsonObject.properties[ i ].operation,
            																	jsonObject.properties[ i ].verbType, jsonObject.properties[ i ].verbValue );
            this.properties[ i ].keywordName = jsonObject.properties[ i ].keywordName;
            this.properties[ i ].isEnd = jsonObject.properties[ i ].isEnd;
        }
    }
    setImage( illust ) {
//        this.#imageBlob = illust.getCanvasImage();
        this.containImage = true;
    }
    isContainImage() {
        return this.containImage;
    }
    /*
    getImage() {
        return this.#imageBlob;
    }
    deleteImage() {
        this.#imageBlob = null;
    }
    */
}

class DocumentProperties {
    text;
    isKeywords;
    keywordType;
    textPosition;
    specify;
    keywordName;
    isEnd;
    keywordId;
    target
}

class Caret {
    start;
    end;
    constructor( start, end ) {
        this.start = start;
        this.end = end;
    }
    getStart() {
        return this.start;
    }
    getEnd() {
        return this.end;
    }
    setStart( start ) {
        this.start = start;
    }
    setEnd( end ) {
        this.end = end;
    }
}

class Specify {
	operation;
	verbType;
	verbValue;

	constructor( name, operation, verbType, verbValue ) {
		this.operation = operation;
		this.verbType = verbType;
		this.verbValue = verbValue;
	}
}

class TextBuffer {
    before;
    after;
    end;
    constructor() {
        this.before = "";
        this.after = "";
        this.end = "";
    }
    setBeforeAndEndBuffer( doc, replace ) {
        const endText = doc.getText( replace.indexEnd );

        if( endText == null ) {
            this.before = "";
            this.end = ""
        } else {
            this.before = doc.getText( replace.indexStart ).substring( 0, replace.start - doc.getTextPosition( replace.indexStart ).getStart() );
            this.end = endText.substring( replace.replaceEnd - doc.getTextPosition( replace.indexEnd ).getStart(), doc.getTextPosition( replace.indexEnd ).getEnd() );
        }
    }
}

class ReplaceProperties {
    start;
    end;
    replaceEnd;
    indexStart;
    indexEnd;
}

export { Document, DocumentProperties, Caret, TextBuffer, ReplaceProperties, Specify };