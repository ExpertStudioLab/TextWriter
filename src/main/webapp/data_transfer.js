import { Document, TextBuffer, ReplaceProperties } from "./modules/document_manager.js";
import { cvs } from "./draw_graph.js";

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

window.addEventListener( "DOMContentLoaded", getFileNumber );
//document.body.onload = getFileNumber;
async function getFileNumber() {
	const myHeaders = new Headers();
    myHeaders.append( "Process", "FileNumber" );
    const myRequest = new Request( "storage", {
        method: "GET",
        headers: myHeaders
    });
    try {
	    window.fetch( myRequest )
	    .then( response => {
			if( !response.ok ) {
				throw new Error( "response status: ${ response.status }" );
			} else {
				return response.text();
			}
		})
		.then( number => {
			fileNumber = parseInt( number );
		});
	} catch( error ) {
		console.error( "error: ", error );
	}
}

function sendData( process, data ) {
    const myHeaders = new Headers();
    myHeaders.append( "Process", String( process ) );
    const myRequest = new Request( "storage", {
        method: "GET",
        headers: myHeaders,
        body: data
    } );
    try {
        window.fetch( myRequest )
        .then( response => {
            if( !response.ok ) {
                throw new Error( "response status: ${ response.status }" );
            }
        })
    } catch( error ) {
        console.error( "error: ", error );
    }
}

    insertBtn.addEventListener( "click", insertIllust );
    insertPBtn.addEventListener( "click", insertParagraph );

    insertEquals.addEventListener( "click", insertReservedWords );
    
    async function insertIllust( event ) {
        const str = String( event.target.id );
        const idNumber = str.substring( 12, str.length );

        try{
            const canvasImage = await canvasToBlob( cvs );
            const myHeaders = new Headers();
            const formdata = new FormData();
            formdata.append( "file", canvasImage, "img_" + fileNumber + ".png" );
            myHeaders.append( "Process", "Image" );
            const myRequest = new Request( "/TextWriter/storage", {
                method: "POST",
                body: formdata,
                headers: myHeaders
            });
            const response = await window.fetch( myRequest );
            if( response.ok ){
                const illust = document.getElementById( "Illust" + String( idNumber ) );
                illust.src = window.URL.createObjectURL( canvasImage );
                illust.style.width = "350px";
                illust.style.height = "275px";	
            } else {
                throw new Error( "response status: ${ response.status }" )
            }
    
        } catch( error ) {
            console.error( "error: ", error );
        }
        
    }

    function canvasToBlob( canvas ) {
        return new Promise(( resolve, reject ) => {
            canvas.toBlob( ( canvasImage ) => {
                if( canvasImage ) {
                    resolve( canvasImage );
                } else {
                    reject( new Error( "Failed to generate blob." ) );
                }
            });
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
        textArea.addEventListener( "input", sendDocumentData );
        textArea.addEventListener( "input", displayText );
        textArea.addEventListener( "click", getCurrentTextArea );
        textArea.addEventListener( "keydown", specialKeysSettings );
        textArea.addEventListener( "keyup", textSelection );
        textArea.addEventListener( "compositionstart", composeOn );
        textArea.addEventListener( "compositionend", composeOff );
        textArea.addEventListener( "mouseup", getSelectedText );
        // create new Document class object
        documents.push( new Document() );

        paraNumber += 1;
    }

    let documents = [];
    documents.push( new Document() );
    let selection = new Object();
    let keyEvent = "";
    let inputStatus = "Normal";
    let isComposing = false;
    let startCaret = 0;
    let dataSending = false;
    let timer;

	const textOp = document.getElementById( "Contents1" );
	textOp.addEventListener( "input", sendDocumentData );
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

        event.target.removeEventListener( "input", displayText );
        event.target.removeEventListener( "input", sendDocumentData );
        startCaret = event.target.selectionStart;
    }

    function composeOff( event ) {
        isComposing = false;

        event.target.addEventListener( "input", displayText );
        event.target.addEventListener( "input", sendDocumentData );
        displayText( event );
        sendDocumentData( event );
    }

    function sendDocumentData( event ) {
        dataSending = true;
        event.target.removeEventListener( "input", sendDocumentData );
        timer = window.setTimeout( () => {
            console.log( "send data!" );
            event.target.addEventListener( "input", sendDocumentData );
            dataSending = false;
        }, 1500 );
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
        
        const obj = JSON.stringify( doc );
        const docCopy = new Document();
        docCopy.createInstanceFromJson( obj );
//        console.log( "docCopy: ", docCopy );

        inputStatus = "Normal";
//        console.log( "properties: ", doc );
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
        if( dataSending ) {
            window.clearTimeout( timer );
            document.getElementById( currentTextArea ).addEventListener( "input", sendDocumentData );
            dataSending = false;
        }
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