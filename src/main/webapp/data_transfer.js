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
        this.insertText( text, this.textPieces );
    }
    insertText( text, index ) {
        this.properties.splice( index, 0, new DocumentProperties() );
        this.currentIndex = this.textPieces;

        if( index + 1 == this.currentIndex ) {
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
    setKeyword( keyword, keywordType ) {
        if( this.properties[ this.textPieces - 1 ].isKeywords ) {
            this.setText( "" );
        }
        this.properties.push( new DocumentProperties() );

        this.properties[ this.textPieces ].text = String( keyword );
        this.properties[ this.textPieces ].isKeywords = true;
        this.properties[ this.textPieces ].keywordType = parseInt( keywordType );
        this.properties[ this.textPieces ].textPosition = new Caret( this.textLength, this.textLength + String( keyword ).length );

        this.textLength += String( keyword ).length;
        this.currentLength = this.textLength;
        this.currentIndex = this.textPieces;
        this.textPieces += 1;

        this.setText( "" );
    }
    insertKeyword( keyword, keywordType, pos ) {
        let index = this.searchDocumentIndex( pos );

        console.log( "index: " + index );
        console.log( "pos: " + pos );
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
            this.insertText( "", index + 1 )
        } else {
            this.insertText( "", index );
        }


        this.insertText( keyword, index + 1 );
        this.properties[ index + 1 ].isKeywords = true;
        this.properties[ index + 1 ].keywordType = keywordType;
/*
        if( this.properties[ index - 1 ].isKeywords ) {
            this.insertText( "", index );
            index += 1;
        }
        this.properties.splice( index, 0, new DocumentProperties() );

        this.properties[ index ].text = String( keyword );
        this.properties[ index ].isKeywords = true;
        this.properties[ index ].keywordType = parseInt( keywordType );
        const start = this.properties[ index - 1 ].textPosition.getStart();
        const end = start + String( keyword ).length;
        this.properties[ index ].textPosition = new Caret( start, end )
        
        this.textPieces += 1;
        this.textLength += String( keyword ).length;
        if( index == this.textPieces - 1 ) {
            this.currentLength = this.textLength;
            this.currentIndex = index;
        } else {
            this.currentLength += String( keyword ).length;
        }

        this.insertText( "", index + 1 );
*/
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
    let isComposing = false;
    let startCaret = 0;
    let selection = new Object();

	const textOp = document.getElementById( "Contents1" );
    textOp.addEventListener( "input", displayText );
    textOp.addEventListener( "click", getCurrentTextArea );
    textOp.addEventListener( "keydown", specialKeysSettings );
    textOp.addEventListener( "keyup", textSelection );
    textOp.addEventListener( "compositionstart", composeOn );
    textOp.addEventListener( "compositionend", composeOff );
    textOp.addEventListener( "mouseup", getSelectedText );

    function composeOn( event ) {
        isComposing = true;
        if( inputStatus != "Select" ) {
            inputStatus = "Compose";
        }

        for( let i = 1; i < paraNumber; i++ ) {
            const textOperator = document.getElementById( "Contents" + String( i ) );
            textOperator.removeEventListener( "input", displayText );
        }
        startCaret = event.target.selectionStart;
    }

    function composeOff( event ) {
        isComposing = false;
        for( let i = 1; i < paraNumber; i++ ) {
            const textOperator = document.getElementById( "Contents" + String( i ) );
            textOperator.addEventListener( "input", displayText );
        }
        displayText( event );
    }

    function displayText( event ) {
        currentTextArea = String( event.target.id );
        const idNumber = currentTextArea.substring( 8, currentTextArea.length );
        const textElement = document.getElementById( "Contents" + idNumber );
        const paragraph = document.getElementById( "Doc" + idNumber );
        const doc = documents[ parseInt( idNumber ) - 1 ];

        let replace = new ReplaceProperties();
        let textBuffer = new TextBuffer();

        replace.end = textElement.selectionEnd;

        switch( inputStatus ) {
            case "Normal":
                replace.start = parseInt( textElement.selectionStart - 1 ) + parseInt( ( keyEvent == "Normal" ) ? 0 : 1 );
                replace.replaceEnd = replace.end - textElement.textLength + doc.getLength();
                break;
            case "Compose":
                replace.start = startCaret;
                replace.replaceEnd = startCaret;
                break;
            case "Select":
                replace.start = selection.start;
                replace.replaceEnd = selection.end;
                break;
        }

        replace.indexStart = doc.searchDocumentIndex( replace.start );
        if( keyEvent == "Normal" ||  replace.end == textElement.textLength ) {
            replace.indexEnd = doc.searchDocumentIndex( replace.replaceEnd );
        } else {
            replace.indexEnd = doc.searchDocumentIndex( replace.replaceEnd + 1 );
        }
//        replace.indexEnd = doc.searchDocumentIndex( replace.replaceEnd + parseInt( ( ( keyEvent == "Normal" || inputStatus == "Select" ) ? 0 : 1 ) ) );
        // text0 text1 ... "[before]【insert letters】[after][end]" textn textn+1 ...
        textBuffer.setBeforeAndEndBuffer( doc, replace)
        
        if( doc.isKeywordsFunc( replace.indexStart ) ) {
            doc.deleteKeyword( replace.indexStart );
        }
        
        if( Math.abs( replace.start - replace.replaceEnd ) > 0 && replace.indexStart != replace.indexEnd ) {
            for( let i = replace.indexStart + 1; i < replace.indexEnd; i++ ) {
                textBuffer.after.concat( doc.getText( replace.indexStart + 1 ) );
                doc.deleteText( replace.indexStart + 1 );
            }
            doc.deleteText( replace.indexStart + 1 );
        }

        console.log( "additional letters: " + textElement.value.substring( replace.start, replace.end ) );
        doc.changeText( replace.indexStart, textBuffer.before + textElement.value.substring( replace.start, replace.end ) + textBuffer.after + textBuffer.end );
        doc.concatText( replace.indexStart );

        inputStatus = "Normal";
        console.log( "properties: ", doc );
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
        const doc = documents[ parseInt( idNumber ) - 1 ];
        const pos = textArea.selectionEnd;

        doc.insertKeyword( String( reservedWord ), 1, pos );
        console.log( "doc: ", doc );

        paragraph.innerHTML = textArea.value.substring( 0, textArea.selectionEnd ) + htmlForm + textArea.value.substring( textArea.selectionEnd, textArea.textLength );
        textArea.value = textArea.value.substring( 0, textArea.selectionEnd ) + reservedWord + textArea.value.substring( textArea.selectionEnd, textArea.textLength );
 
    }

    function getSelectedText( event ) {
  //      selectedText = window.getSelection().toString();
        selection.start = event.target.selectionStart;
        selection.end = event.target.selectionEnd;
        if( selection.start > selection.end ) {
            selection.end = event.target.selectionStart;
            selection.start = event.target.selectionEnd;
        }
        if( selection.start != selection.end ) {
            inputStatus = "Select";
        }
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