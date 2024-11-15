class Document {
    properties;
    textLength;
    textPieces;
    currentIndex;
    currentLength;
    constructor() {
        this.properties = [];
        this.properties.push( new DocumentProperties() );
        this.properties[ 0 ].isExists = false;
        this.textLength = 0;
        this.textPieces = 0;
        this.currentIndex = 0;
        this.currentLength = 0;
    }
    setText( text ) {
        this.currentIndex = this.textPieces;

        if( !this.properties[ 0 ].isExists ) {
            this.properties.push( new DocumentProperties() );
            this.properties[ 0 ].isExists = true;
            this.properties[ 1 ].isExists = false;
            this.currentLength = 0;
        } else {
            this.properties[ this.textPieces ].isExists = true;
            this.properties.push( new DocumentProperties() );
            this.properties[ this.textPieces + 1 ].isExists = false;
            this.currentLength = this.textLength;
        }
        this.properties[ this.textPieces ].text = String( text );
        this.properties[ this.textPieces ].isKeywords = false;
        this.properties[ this.textPieces ].keywordType = null;
        this.properties[ this.textPieces ].textPosition = new Caret( this.textLength, this.textLength + String( text ).length );
        this.textLength += String( text ).length;
        this.textPieces += 1;

    }
    insertText( index, pos ) {
        this.properties[ index ].text = "";
        this.properties[ index ].isExists = true;
        this.properties[ index ].isKeywords = false;
        this.properties[ index ].keywordType = null;
        this.properties[ index ].textPosition = new Caret( pos, pos );
        this.textPieces += 1;
        this.currentIndex += 1;
    }
    deleteText( index ) {
        this.properties.splice( index, 1 );
        // if delete text at last index
        if( index == this.currentIndex ) {
            this.currentLength = this.properties[ index - 1 ].textPosition.getStart();
            this.textLength = this.properties[ index - 1 ].textPosition.getEnd();
            this.textPieces -= 1;
            this.currentIndex -= 1;
        } else {
            this.properties.push( new DocumentProperties() );
            this.properties[ 0 ].isExists = false;
            this.textLength = 0;
            this.textPieces = 0;
            this.currentLength = 0;
        }
    }
    createEmptyText( index ) {
        this.properties.push( new DocumentProperties() );
        this.properties[ index + 1 ].isExists = false;
        this.properties[ index ].text = "";
        this.properties[ index ].textPosition = new Caret( this.currentLength, this.currentLength );
        this.properties[ index ].isExists = true;
        this.properties[ index ].isKeywords = false;
        this.properties[ index ].keywordType = null;
        this.currentLength = this.properties[ index - 1 ].textPosition.getEnd();
        this.textPieces += 1;
        this.currentIndex += 1;
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
        this.currentIndex = this.textPieces + 1;

        if( !this.properties[ 0 ].isExists ) {
            this.properties.push( new DocumentProperties() );
            this.properties[ 0 ].isExists = true;
            this.properties[ 1 ].isExists = false;
        } else {
            this.properties[ this.textPieces ].isExists = true;
            this.properties.push( new DocumentProperties() );
            this.properties[ this.textPieces + 1 ].isExists = false;
        }

        this.properties[ this.textPieces ].text = String( keyword );
        this.properties[ this.textPieces ].isKeywords = true;
        this.properties[ this.textPieces ].keywordType = parseInt( keywordType );
        this.properties[ this.textPieces ].textPosition = new Caret( this.textLength, this.textLength + String( keyword ).length );

        this.textLength += String( keyword ).length;
        this.currentLength = this.textLength;
        this.textPieces += 1;
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

    searchDocumentIndexInsert( pos ) {
        for( let i = 0; i < this.textPieces; i++ ) {
            const flag = Math.sign( pos - this.properties[ i ].textPosition.getStart() - 1 ) + Math.sign( this.properties[ i ].textPosition.getEnd() + 1 - pos );
            if( flag == 2 ) {
                return i;
            }
            if( flag == 1 && !this.properties[ i ].isKeywords ) {
                return i;
            }
            if( pos == 1 ) {
                this.properties.unshift( new DocumentProperties() );
                this.insertText( 0, 0 );
                return 0;
            }
            if( ( pos == this.properties[ i ].textPosition.getEnd() + 1 ) && this.properties[ i + 1 ].isKeywords ) {
                this.properties.splice( i + 1, 0, new DocumentProperties() );
                this.insertText( i + 1, pos - 1 );
                return i + 1;
            }
        }
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
    isExistsFunc( index ) {
        return this.properties[ index ].isExists;
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
    isExists;
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
    let isComposing = false;
    let startCaret = 0;
    let isBufferedText = false;

	const textOp = document.getElementById( "Contents1" );
    textOp.addEventListener( "input", displayText );
    textOp.addEventListener( "click", getCurrentTextArea );
    textOp.addEventListener( "keydown", specialKeysSettings );
    textOp.addEventListener( "compositionstart", composeOn );
    textOp.addEventListener( "compositionend", composeOff );

    function composeOn( event ) {
        isComposing = true;
        isBufferedText = true;
        startCaret = event.target.selectionEnd;
    }

    function composeOff( event ) {
        isComposing = false;
        displayText( event );
    }

    function displayText( event ) {
        currentTextArea = String( event.target.id );
        const idNumber = currentTextArea.substring( 8, currentTextArea.length );
        const textElement = document.getElementById( "Contents" + idNumber );
        const inputText = String( textElement.value );
        const paragraph = document.getElementById( "Doc" + idNumber );
        const doc = documents[ parseInt( idNumber ) - 1 ];
        let selectionEnd = textElement.selectionEnd;
        if( isComposing ) {
            return;
        }
        console.log( "currentLength: " + doc.getCurrentLength() );
//        isBufferedText = false;
        if( textElement.selectionStart == selectionEnd ) {
            // when appending letters
            if( textElement.textLength == selectionEnd ) {
                const currentIndex = doc.getCurrentIndex();
                const currentLength = doc.getCurrentLength();
                // if document class have at least two textPieces.
                if( doc.textPieces > 1 ) {
                    if( doc.isExistsFunc( currentIndex ) ) {
                        let newText;
                        if( inputText.length >= currentLength ) {
                            newText = inputText.substring( currentLength, selectionEnd );
                            if( newText.length > 0 ) {
                                doc.changeText( currentIndex, newText );
                            } else {
                                doc.deleteText( currentIndex );
                                doc.createEmptyText( currentIndex );
                            }
                        // in case backspace key is pressed at text start when text contain value[""] and isExists is true.
                        // if letters is inputted after a keyword, it will be appended into a keyword.
                        } else {
                            const textPosition = doc.getTextPosition( currentIndex - 1 );
                            newText = inputText.substring( textPosition.getStart(), selectionEnd );
                            doc.deleteText( currentIndex );
                            if( doc.isKeywordsFunc( currentIndex - 1 ) ) {
                                doc.deleteKeyword( currentIndex - 1 );
                            }
                            doc.changeText( currentIndex - 1, newText );
                        }
                        
                        const text = String( doc.getText( currentIndex ) );
                        const textPosition = doc.getTextPosition( currentIndex );

                    } else {
                        switch( keyEvent ) {
                            case "Normal":
                                if( !isBufferedText ) {
                                    doc.setText( inputText.substring( doc.getCurrentLength(), selectionEnd ) );
                                } else {
                                    doc.setText( inputText.substring( startCaret, selectionEnd ) );
                                }
                                break;
                            case "Backspace":
                            case "Delete":
                            default:

                        }
                    }
                // if document class have only one textPieces
                } else {
                    if( doc.textLength == 0 ) {
                        if( keyEvent == "Normal" ) {
                            doc.setText( textElement.value );
                        }
                    } else {
                        switch( keyEvent ) {
                            case "Normal":
                                doc.changeText( 0, textElement.value );
                            case "Backspace":
                                doc.changeText( 0, textElement.value );
                                /*
                                if( textElement.selectionEnd() != 2 ) {
                                    doc.changeText( 0, textElement.value );
                                } else {

                                }
                                */
                            case "Delete":
                        }
                        const caret = selectionEnd;
                        if( caret > 2 ) {
                            doc.changeText( 0, textElement.value );
                        } else if( caret == 2 ) {

                        }
                    }
                }
            // when inserting letters
            } else {
                const pos = selectionEnd + ( ( keyEvent == "Normal" ) ? 0 : 1 );
                const index = doc.searchDocumentIndexInsert( pos );

                if( doc.getText != "" || keyEvent == "Normal" ) {
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
                    index -= ( ( keyEvent == "Backspace" ) ? 1 : 0 );
                    doc.deleteKeyword( index );
                    doc.changeText( index );
                }
            }
            console.log( "properties: ", doc.properties );
            isBufferedText = false;
            paragraph.innerHTML = String( doc.getHTMLDocument() );
        } else {

        }
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