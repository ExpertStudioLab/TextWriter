//import { Illustration } from "./illustration.js";
/**
 * 
 */
class Document {
    properties;
    textLength;
    textPieces;
    currentIndex;
    currentLength;
//    #imageBlob = null;
    containImage = false;
    constructor() {
        this.properties = [];
        this.textLength = 0;
        this.textPieces = 0;
        this.currentIndex = 0;
        this.currentLength = 0;

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

    insertKeyword( keyword, keywordType, pos ) {
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
                if( this.properties[ i ].keywordType == 1 ) {
				 	doc += "<font color=\"darkmagenta\">" + this.properties[ i ].text + "</font>";	
				} else if( this.properties[ i ].keywordType == 2 ) {
					doc += "<font color=\"darkyellow\">" + this.properties[ i ].text + "</font>";
				}
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

export { Document, DocumentProperties, Caret, TextBuffer, ReplaceProperties };