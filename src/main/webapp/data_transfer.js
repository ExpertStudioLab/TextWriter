class Document {
    properties;
    textLength;
    textPieces;
    currentIndex;
    currentLength;
    constructor() {
        this.properties = [];
        this.textLength = 0;
        this.textPieces = 0;
        this.currentIndex = 0;
        this.currentLength = 0;

        this.setText( "" );
    }
    setText( text ) {
        this.properties.push( new DocumentProperties() );
        this.currentIndex = this.textPieces;
        this.currentLength = this.textLength;
        this.textLength += String( text ).length;

        this.properties[ this.textPieces ].text = String( text );
        this.properties[ this.textPieces ].isKeywords = false;
        this.properties[ this.textPieces ].keywordType = null;
        this.properties[ this.textPieces ].textPosition = new Caret( this.currentLength, this.textLength );
        this.textPieces += 1;
    }
    deleteText( index ) {
        // if delete text at last index
        if( index == this.currentIndex || this.textPieces == 1 ) {
            if( this.textPieces > 1 ) {
                this.currentLength = this.properties[ index - 1 ].textPosition.getStart();
                this.textLength = this.properties[ index - 1 ].textPosition.getEnd();
                this.textPieces -= 1;
                this.currentIndex -= 1;
            } else {
                return;
            }
        } else {
            const dif = this.properties[ index ].textPosition.getEnd() - this.properties[ index ].textPosition.getStart();
            this.currentLength -= dif;
            this.textLength -= dif;
            this.textPieces -= 1;
            this.currentIndex -= 1;
        }
        this.properties.splice( index, 1 );
    }
    createEmptyText( index ) {
        this.properties.splice( index, 0, new DocumentProperties() );
        const len = ( index < this.textPieces ) ? this.properties[ index + 1 ].textPosition.getStart() : this.properties[ index - 1 ].textPosition.getEnd();
        this.properties[ index ].text = "";
        this.properties[ index ].textPosition = new Caret( len, len );
        this.properties[ index ].isKeywords = false;
        this.properties[ index ].keywordType = null;
//        this.currentLength = this.properties[ index - 1 ].textPosition.getEnd();
        this.currentLength = this.properties[ this.textPieces ].textPosition.getEnd();
        this.currentIndex = this.textPieces;
        this.textPieces += 1;

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
        if( this.textPieces > index + 1 ) {
            for( let i = index + 1; i < this.textPieces; i++ ) {
                this.properties[ i ].textPosition.setStart( this.properties[ i ].textPosition.getStart() + dif );
                this.properties[ i ].textPosition.setEnd( this.properties[ i ].textPosition.getEnd() + dif );
            }
        }
    }
    getText( index ) {
        return this.properties[ index ].text;
    }
    setKeyword( keyword, keywordType ) {
        if( this.properties[ this.textPieces - 1 ].isKeywords ) {
            this.properties.push( new DocumentProperties() );
            this.properties[ this.textPieces ].text = "";
            this.properties[ this.textPieces ].textPosition = new Caret( this.properties[ this.textPieces - 1 ].textPosition.getEnd(), this.properties[ this.textPieces - 1 ].textPosition.getEnd() );
            this.properties[ this.textPieces ].isKeywords = false;
            this.properties[ this.textPieces ].keywordType = null;
            this.textPieces += 1;
        }
        this.properties.push( new DocumentProperties() );
        this.properties.push( new DocumentProperties() );
        this.currentIndex = this.textPieces + 1;

        this.properties[ this.textPieces + 1 ].text = "";
        this.properties[ this.textPieces + 1 ].textPosition = new Caret( this.textLength + String( keyword ).length, this.textLength + String( keyword ).length );
        this.properties[ this.textPieces + 1 ].isKeywords = false;
        this.properties[ this.textPieces + 1 ].keywordType = null;

        this.properties[ this.textPieces ].text = String( keyword );
        this.properties[ this.textPieces ].isKeywords = true;
        this.properties[ this.textPieces ].keywordType = parseInt( keywordType );
        this.properties[ this.textPieces ].textPosition = new Caret( this.textLength, this.textLength + String( keyword ).length );

        this.textLength += String( keyword ).length;
        this.currentLength = this.textLength;
        this.textPieces += 2;
    }
    deleteKeyword( index ) {
        this.properties[ index ].isKeywords = false;
        this.properties[ index ].keywordType = null;
    }
    isKeywordsFunc( index ) {
        return this.properties[ index ].isKeywords;
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
                doc += "<font color=\"darkmagenta\">" + this.properties[ i ].text + "</font>";
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
}

/**
 * 
 */
    // use on identifying textareas
    let paraNumber = 2;
     // identity of png file
    let fileNumber;
    // currently active TextArea Element
    let currentTextArea;
    // buttons
    const insertBtn = document.getElementById( "Insert-Image1" );
    const insertPBtn = document.getElementById( "Paragraph" );
    // buttons for Reserved Words
    const insertEquals = document.getElementById( "Insert-Equals" );

document.body.onload = function() {
   const xhr = new XMLHttpRequest();
   xhr.open( "GET", "/TextWriter/storage", true );
   xhr.setRequestHeader( 'Process', 'FileNumber' );
   xhr.onreadystatechange = function() {
	   if( xhr.readyState == 4 && xhr.status == 200 ) {
		   fileNumber = xhr.responseText;
		   console.log( "Success: ", fileNumber );
	   } else {
		   console.log( "Error ocasion" );
	   }
   };
   xhr.send( null );
};

    insertBtn.addEventListener( "click", insertIllust );
    insertPBtn.addEventListener( "click", insertParagraph );

    insertEquals.addEventListener( "click", insertReservedWords );
    
    function insertIllust( event ) { 
        const str = String( event.target.id );
        const idNumber = str.substring( 12, str.length );
        console.log( idNumber );
        cvs.toBlob( ( canvasImage ) => {
            const myHeaders = new Headers();
            myHeaders.append( "Process", "Image" );
            const myRequest = new Request( "/TextWriter/storage", {
                method: "POST",
                body: canvasImage,
                headers: myHeaders
            });
            try {
                window.fetch( myRequest );
                console.log( "Success" );
            } catch( error ) {
                console.error( "Error" );
            }
            // prohibit skipping processes.
            window.setTimeout( () => {
                const illust = document.getElementById( "Illust" + String( idNumber ) );
                illust.src = window.URL.createObjectURL( canvasImage );
                illust.style.width = "350px";
                illust.style.height = "275px";
            }, 2000 );

        });

    }

    function insertParagraph() {
        const previewDiv = document.getElementById( "Preview" + String( paraNumber - 1 ) );
        previewDiv.insertAdjacentHTML(
            "afterend",
            "<div id=\"Preview" + String( paraNumber ) + "\" style=\"width: 60%;\" >" +
                "<img id=\"Illust" + String( paraNumber ) + "\" style=\"float: right;\" ></img>" +
                "<p id=\"Doc" + String( paraNumber ) + "\" style=\"font-size: 24px;\" ></p>" +
            "</div>"
        );

        const newParagraphBtn = document.getElementById( "Insert-Paragraph-Button" );
        newParagraphBtn.insertAdjacentHTML(
            "beforebegin",
            "<div class=\"Left-Justify\" >" +
                "<textarea id=\"Contents" + String( paraNumber ) + "\" rows=\"4\" style=\"font-size: 24px; width: 100%; margin-top: 10px;\" ></textarea>" +
            "</div>" +
            "<div>" +
                "<input type=\"button\" id=\"Insert-Image" + String( paraNumber ) + "\" value=\"画像を挿入\" />" +
            "</div>"
        );

        const insertImgBtn = document.getElementById( "Insert-Image" + String( paraNumber ) );
        insertImgBtn.addEventListener( "click", insertIllust );

        const textArea = document.getElementById( "Contents" + String( paraNumber ) );
        textArea.addEventListener( "input", displayText );
        textArea.addEventListener( "click", getCurrentTextArea );
        textArea.addEventListener( "keydown", specialKeysSettings );
        // create new Document class object
        documents.push( new Document() );

        paraNumber += 1;
    }

    let documents = [];
    documents.push( new Document() );
    let keyEvent = "";
    let inputStatus = "Normal";
//    let selectedText = "";
//    let isComposing = false;
    let startCaret = 0;
    let selection = new Object();
//    let isBufferedText = false;

	const textOp = document.getElementById( "Contents1" );
    textOp.addEventListener( "input", displayText );
    textOp.addEventListener( "click", getCurrentTextArea );
    textOp.addEventListener( "keydown", specialKeysSettings );
    textOp.addEventListener( "keyup", textSelection );
    textOp.addEventListener( "compositionstart", composeOn );
    textOp.addEventListener( "compositionend", composeOff );
    textOp.addEventListener( "mouseup", getSelectedText );

    function composeOn( event ) {
//        isComposing = true;
        inputStatus = "Compose";
//        isBufferedText = true;
        startCaret = event.target.selectionStart;
    }

    function composeOff( event ) {
//        isComposing = false;
        displayText( event );
    }

    function displayText( event ) {
        currentTextArea = String( event.target.id );
        const idNumber = currentTextArea.substring( 8, currentTextArea.length );
        const textElement = document.getElementById( "Contents" + idNumber );
        const inputText = String( textElement.value );
        const paragraph = document.getElementById( "Doc" + idNumber );
        const doc = documents[ parseInt( idNumber ) - 1 ];

        let replaceProperties = new Object()
        let textBuffer = new TextBuffer();

        replaceProperties.end = textElement.selectionEnd;

        switch( inputStatus ) {
            case "Normal":
                replaceProperties.start = textElement.selectionStart - 1;
                break;
            case "Compose":
                replaceProperties.start = startCaret;
                break;
            case "Select":
                replaceProperties.start = selection.start;
                break;
        }

        replaceProperties.replaceEnd = replaceProperties.end - textElement.textLength + doc.getLength();
        indexStart = doc.searchDocumentIndex( replaceProperties.start );
        indexEnd = doc.searchDocumentIndex( replaceProperties.replaceEnd );

        // text0 text1 ... "[before]【insert letters】[after][end]" textn textn+1 ...
        textBuffer.before = doc.getText( indexStart ).substring( 0, replaceProperties.start - doc.getTextPosition( indexStart ).getStart() );
        textBuffer.end = doc.getText( indexEnd ).substring( replaceProperties.replaceEnd - doc.getTextPosition( indexEnd ).getStart(), doc.getTextPosition( indexEnd ).getEnd() );
        if( indexStart == indexEnd && String( doc.getText( indexStart ) ).length == 1 ) {
            textBuffer.end = "";
        }
        if( doc.isKeywordsFunc( indexStart ) ) {
            doc.deleteKeyword( indexStart );
        }

        if( replaceProperties.start - replaceProperties.replaceEnd > 0 ) {
            for( let i = indexStart + 1; i < indexEnd; i++ ) {
                textBuffer.after.concat( doc.getText( indexStart + 1 ) );
                doc.deleteText( indexStart + 1 );
            }
            doc.deleteText( indexStart + 1 );
        }
        doc.changeText( indexStart, textBuffer.before + inputText.substring( replaceProperties.start, replaceProperties.end ) + textBuffer.after + textBuffer.end );

        /*
        let selectionStart = null;
        let selectionEnd = textElement.selectionEnd > textElement.selectionStart ? textElement.selectionEnd : textElement.selectionStart;

        if( isComposing ) {
            return;
        }

        if( textElement.textLength == selectionEnd ) {
            const currentIndex = doc.getCurrentIndex();
            const currentLength = doc.getCurrentLength();
            let newText;
            if( inputText.length >= currentLength ) {
                newText = inputText.substring( currentLength, selectionEnd );
                doc.changeText( currentIndex, newText );
            // in case backspace key is pressed at text start when text contain value[""].
            // if letters is inputted after a keyword, it will be appended into a keyword.    
            } else {
                const index = doc.searchDocumentIndex( selectionEnd );
                if( index != null ) {
                    const textPosition = doc.getTextPosition( index );
                    newText = inputText.substring( textPosition.getStart(), selectionEnd );
                    for( let i = currentIndex; i > index; i-- ) {
                        doc.deleteText( i );
                    }
                    if( doc.isKeywordsFunc( index ) ) {
                        doc.deleteKeyword( index );
                    }
                    //doc.changeText( currentIndex - 1, newText );
                    doc.changeText( index, newText );
                }
            }
        // when inserting letters
        } else {
            const pos = isBufferedText ? startCaret : selectionEnd - ( ( keyEvent == "Normal" ) ? 1 : 0 );
            let index = doc.searchDocumentIndex( pos );
            let flag = false;
            if( doc.isKeywordsFunc( index ) ) {
                flag = true;
                doc.deleteKeyword( index );
                if( keyEvent == "Backspace" && pos == ( doc.getTextPosition( index ).getEnd() - 1 ) ) {
                    index += 1;
                } else if( keyEvent == "Delete" ) {
                }
            }
            if( keyEvent == "Normal" || !flag ) {
                // if words at index is keyword
                if( doc.isKeywordsFunc( index ) ) {
                    doc.deleteKeyword( index );
                }
                const dif = textElement.textLength - doc.getLength();
                const textPosition = doc.getTextPosition( index );
                const text = inputText.substring( textPosition.getStart(), textPosition.getEnd() + dif );
                doc.changeText( index, text );
            } else if( keyEvent == "Backspace" || keyEvent == "Delete" ) {
                // delete object at index.
                doc.deleteText( index );
                console.log( "index: " + index );
                index -= ( ( keyEvent == "Backspace" ) ? 1 : 0 );
                const textPosition = doc.getTextPosition( index );
                const text = inputText.substring( textPosition.getStart(), selectionEnd );
                doc.changeText( index, text );
            }
        }
        */
        inputStatus = "Normal";
        console.log( "properties: ", doc );
        isBufferedText = false;
        paragraph.innerHTML = String( doc.getHTMLDocument() );
    }


    function getCurrentTextArea( event ) {
        currentTextArea = String( event.target.id );
    }

    function insertReservedWords( event ) {
        const typeOfReservedWord = String( event.target.id ).substring( 7, String( event.target.id ).length );
        const reservedWordOp = document.getElementById( typeOfReservedWord );
        const reservedWord = reservedWordOp.value;
        const htmlForm = "<font color=\"darkmagenta\">" + reservedWord + "</font>";
        const textArea = document.getElementById( currentTextArea );
        const idNumber = currentTextArea.substring( 8, String( currentTextArea ).length );
        const paragraph = document.getElementById( "Doc" + idNumber );
        paragraph.innerHTML = textArea.value.substring( 0, textArea.selectionEnd ) + htmlForm + textArea.value.substring( textArea.selectionEnd, textArea.textLength );
        textArea.value = textArea.value.substring( 0, textArea.selectionEnd ) + reservedWord + textArea.value.substring( textArea.selectionEnd, textArea.textLength );
        const doc = documents[ parseInt( idNumber ) - 1 ];
        doc.setKeyword( String( reservedWord ), 1 );
    }

    function getSelectedText( event ) {
  //      selectedText = window.getSelection().toString();
        selection.start = event.target.selectionStart;
        selection.end = event.target.selectionEnd;
        inputStatus = "Select";
    }

    function specialKeysSettings( event ) {
        switch( event.key ) {
            case "Enter":
                event.preventDefault();
                break;
            case "Tab":
                event.preventDefault();
                break;
            case "Backspace":
                keyEvent = "Backspace";
                break;
            case "Delete":
                keyEvent = "Delete";
                break;
            default:
                keyEvent = "Normal";
                break;
        }
    }

    function textSelection( event ) {
        switch( event.key ) {
            case "ArrowUp":
            case "ArrowDown":
            case "ArrowRight":
            case "ArrowLeft":
                getSelectedText( event );
                break;
            default:
        }
    }