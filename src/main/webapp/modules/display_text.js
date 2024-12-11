/**
 * 
 */
import { TextBuffer, ReplaceProperties } from "./document_manager.js";

    export function displayText( event, params ) {
        params.currentTextArea = String( event.target.id );
        const idNumber = params.currentTextArea.substring( params.textAreaNameLength, ( String )( params.currentTextArea ).length );
        const textElement = document.getElementById( params.textAreaName + idNumber );
        const paragraph = document.getElementById( "Doc" + idNumber );
        const doc = params.documentStructures[ parseInt( idNumber ) - 1 ];

        if( params.isEdit ) {
            params.inputStatus[ params.currentIndex ] = "Paste";
            params.keyEvent[ params.currentIndex ] = "Normal";
        }

        let replace = new ReplaceProperties();
        let textBuffer = new TextBuffer();

        replace.end = textElement.selectionEnd;

        switch( params.inputStatus[ params.currentIndex ] ) {
            case "Normal":
                replace.start = parseInt( textElement.selectionStart - 1 ) + parseInt( ( params.keyEvent[ params.currentIndex ] == "Normal" ) ? 0 : 1 );
                replace.replaceEnd = replace.end - textElement.textLength + doc.getLength();
                break;
            case "Compose":
                replace.start = params.startCaret;
                replace.replaceEnd = params.startCaret;
                break;
            case "Select":
                replace.start = params.selectionStart[ params.currentIndex ];
                replace.replaceEnd = params.selectionEnd[ params.currentIndex ];
                break;
            case "Paste":
                replace.start = params.editStart;
                replace.replaceEnd = params.editEnd;
        }

        replace.indexStart = doc.searchDocumentIndex( replace.start );
        if( params.keyEvent[ params.currentIndex ] == "Normal" ||  replace.end == textElement.textLength ) {
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
        
//        const obj = JSON.stringify( doc );
//        const docCopy = new Document();
//        docCopy.createInstanceFromJson( obj );
//        console.log( "docCopy: ", docCopy );

//        params.inputStatus = "Normal";
        console.log( "properties: ", doc );
        paragraph.innerHTML = String( doc.getHTMLDocument() );

        if( params.isEdit ) {
            params.isEdit = false;
            params.inputStatus[ params.currentIndex ] = "Normal";
        }
    }

