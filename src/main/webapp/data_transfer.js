class Document {
    text;
    isKeywords;
    keywordType;
    textPosition;
    textLength;
    textPieces;
    isExists;
    currentIndex;
    currentLength;
    constructor() {
        this.text = [];
        this.isKeywords = [];
        this.keywordType = [];
        this.textPosition = [];
        this.isExists = [];
        this.textLength = 0;
        this.textPieces = 0;
        this.currentIndex = 0;
        this.currentLength = 0;
    }
    setText( text ) {
        this.currentIndex = this.text.length;
        let len = 0;
        for( let value in this.text ) {
            len += value.length;
        }
        if( this.textLength == 0 ) {
            this.isExists.push( true, false );
            this.currentLength = 0;
        } else {
            this.isExists[ this.text.length ] = true;
            this.isExists.push( false );
            this.currentLength = this.textLength;
        }
        this.text.push( String( text ) );
        this.isKeywords.push( false );
        this.keywordType.push( null );
        this.textPosition.push( new Caret( len, len + String( text ).length ) );
        this.textLength += String( text ).length;
        this.textPieces += 1;

    }
    changeText( index, newText ) {
        const dif = String( newText ).length - String( this.text[ index ] ).length;
        this.text[ index ] = String( newText );
        this.textLength += dif;
        this.textPosition[ index ].setEnd( this.textPosition.getEnd + dif );
        // change all texts textPosition parameters
        if( this.text.length > index + 1 ) {
            for( let i = index + 1; i < this.text.length; i++ ) {
                this.textPosition[ i ].setStart( this.textPosition[ i ].getStart() + dif );
                this.textPosition[ i ].setEnd( this.textPosition[ i ].getEnd() + dif );
            }
        }

    }
    getText( index ) {
        return this.text[ index ];
    }
    setKeyword( keyword, keywordType ) {
        this.currentIndex = this.text.length + 1;
        let len = 0;
        for( let value in this.text ) {
            len += value.length;
        }
        if( this.textLength == 0 ) {
            this.isExists.push( true, false );
        } else {
            this.isExists[ this.text.length ] = true;
            this.isExists.push( false );
        }

        this.text.push( String( keyword ) );
        this.isKeywords.push( true );
        this.keywordType.push( parseInt( keywordType ) );
        this.textPosition.push( new Caret( len, len + String( keyword ).length ) );
        this.textLength += String( keyword ).length;
        this.textPieces += 1;
    }
    deleteKeyword( index ) {
        this.isKeywords[ index ] = false;
        this.keywordType = null;
    }
    isKeywordsFunc( index ) {
        return this.isKeywords[ index ];
    }
    getDocument() {
        let doc = "";

        for( let i = 0; i < this.text.length; i++ ) {
            doc += this.text[ i ];
        }
        return doc;
    }
    getHTMLDocument() {
        let doc = "";
        for( let i = 0; i < this.text.length; i++ ) {
            if( this.isKeywords[ i ] ) {
                doc += "<font color=\"darkmagenta\">" + this.text[ i ] + "</font>";
            } else {
                doc += this.text[ i ];
            }
        }
        return doc;
    }
    getTextPositions( ) {
        return this.textPosition;
    }
    getTextPosition( index ) {
        return this.textPosition[ index ];
    }
    getLength() {
        return this.textLength;
    }
    getTextPieces() {
        return this.textPieces;
    }
    isExistsFunc( index ) {
        return this.isExists[ index ];
    }
    getCurrentIndex() {
        return this.currentIndex;
    }
    getCurrentLength() {
        return this.currentLength;
    }
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
        const paraOp = document.createElement( "p" );
        paraOp.style.fontSize = "24px";
        paraOp.id = "Doc" + String( paraNumber );
        const imageOp = document.createElement( "img" );
        imageOp.id = "Illust" + String( paraNumber );
        imageOp.style.float = "right";
        const container = document.createElement( "div" );
        container.id = "Preview" + String( paraNumber );
        container.style.width = "60%";
        container.appendChild( imageOp );
        container.appendChild( paraOp );
        const preview = document.getElementById( "Display-Area" );
        preview.appendChild( container );
        const textContainer = document.createElement( "div" );
        textContainer.className = "Left-Justify";
        const textArea = document.createElement( "textarea" );
        textArea.id = "Contents" + String( paraNumber );
        textArea.style.fontSize = "24px";
        textArea.style.width = "100%";
        textArea.style.marginTop = "10px";
        textArea.rows = "4";
        textContainer.appendChild( textArea );
        const textInputArea = document.getElementById( "Left-Side" );
        const btn = document.getElementById( "Insert-Paragraph-Button" );
        textInputArea.insertBefore( textContainer, btn );
        const btnContainer = document.createElement( "div" );
        const insertImgBtn = document.createElement( "input" );
        insertImgBtn.type = "button";
        insertImgBtn.id = "Insert-Image" + String( paraNumber );
        insertImgBtn.value = "画像を挿入";
        btnContainer.appendChild( insertImgBtn );
        textInputArea.insertBefore( btnContainer, btn );
        insertImgBtn.addEventListener( "click", insertIllust );
        paraNumber += 1;
        textArea.addEventListener( "input", displayText );
        documents.push( new Document() );
    }

    let documents = [];
    documents.push( new Document() );
	const textOp = document.getElementById( "Contents1" );
    textOp.addEventListener( "input", displayText );
    textOp.addEventListener( "click", getCurrentTextArea );


    function displayText( event ) {
        currentTextArea = String( event.target.id );
        const idNumber = currentTextArea.substring( 8, currentTextArea.length );
        const textOp = document.getElementById( "Contents" + idNumber );
        const paragraph = document.getElementById( "Doc" + idNumber );
        const doc = documents[ parseInt( idNumber ) - 1 ];
        if( textOp.textLength == textOp.selectionEnd ) {
            if( doc.textPieces > 1 ) {
                if( doc.isExistsFunc( doc.getCurrentIndex() ) ) {
                    const text = String( textOp.value ).substring( doc.getCurrentLength(), textOp.textLength );
                    doc.changeText( doc.getCurrentIndex(), text );
                } else {
                    doc.setText( textOp.value );
                }
            } else {
                if( doc.textLength == 0 ) {
                    doc.setText( textOp.value );
                } else {
                    doc.changeText( 0, textOp.value );
                }
            }
        } else {
            const index = serchDocumentIndex( doc, textOp.selectionEnd );
            if( doc.isKeywordsFunc( index ) ) {
                doc.deleteKeyword( index );
            }
            const dif = textOp.textLength - doc.getLength();
            let text = doc.getText( index );
            const textPosition = getTextPosition( index );
            text = String( textOp.value ).substring( textPosition.getStart(), textPosition.getEnd() + dif );
            doc.changeText( index, text );
        }
        paragraph.innerHTML = String( doc.getHTMLDocument() );
    }

    function serchDocumentIndex( doc, pos ) {
        let textPosition = [...doc.getTextPositions()];
        textPosition.forEach( ( value, index ) => {
            if( value.getStart() < pos && pos < value.getEnd() ) {
                return index;
            }
        });
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