/**
 * 
 */
import { displayText } from "./display_text.js";
    function insertReservedWords( event, params ) {
        const typeOfReservedWord = String( event.target.id ).substring( 7, String( event.target.id ).length );
        const reservedWordOp = document.getElementById( typeOfReservedWord );
        const reservedWord = reservedWordOp.value;
        const htmlForm = "<font color=\"darkmagenta\">" + reservedWord + "</font>";
        const textArea = document.getElementById( params.currentTextArea );
        const idNumber = params.currentTextArea.substring( 8, String( params.currentTextArea ).length );
        const paragraph = document.getElementById( "Doc" + idNumber );
        const doc = params.documentStructures[ parseInt( idNumber ) - 1 ];
        const pos = textArea.selectionEnd;

        doc.insertKeyword( String( reservedWord ), 1, pos );
        console.log( "doc: ", doc );

        paragraph.innerHTML = textArea.value.substring( 0, textArea.selectionEnd ) + htmlForm + textArea.value.substring( textArea.selectionEnd, textArea.textLength );
        textArea.value = textArea.value.substring( 0, textArea.selectionEnd ) + reservedWord + textArea.value.substring( textArea.selectionEnd, textArea.textLength );
 
    }

    function sendDocumentData( event, params ) {
        const index = params.currentIndex;
        params.dataSending[ index ] = true;
        event.target.removeEventListener( "input", params.recorder.eventFunction( "DataTransfer" ) );
        params.timer[ index ] = window.setTimeout( () => {
            console.log( "send data!" );
            event.target.addEventListener( "input", params.recorder.eventFunction( "DataTransfer" ) );
            params.dataSending[ index ] = false;
        }, 1500 );
    }


    function composeOn( event, params ) {
		params.isComposing[ params.currentIndex ] = true;
        if( params.inputStatus[ params.currentIndex ] != "Select" ) {
            params.inputStatus[ params.currentIndex ] = "Compose";
        }

        event.target.removeEventListener( "input", params.recorder.eventFunction( "TextArea" ) );
        event.target.removeEventListener( "input", params.recorder.eventFunction( "DataTransfer" ) );
        params.startCaret = event.target.selectionStart;
    }

    function composeOff( event, params ) {
		params.isComposing[ params.currentIndex ] = false;

        event.target.addEventListener( "input", params.recorder.eventFunction( "TextArea" ) );
        event.target.addEventListener( "input", params.recorder.eventFunction( "DataTransfer" ) );

        displayText( event, params );
        sendDocumentData( event, params );
    }

    function getCurrentTextArea( event, params ) {
        params.currentTextArea = String( event.target.id );
        params.currentIndex = params.currentTextArea.substring( 8, ( String )( params.currentTextArea ).length ) - 1;
    }


    function getSelectedText( event, params ) {
        params.selectionStart[ params.currentIndex ] = event.target.selectionStart;
        params.selectionEnd[ params.currentIndex ] = event.target.selectionEnd;
        if( params.selectionStart[ params.currentIndex ] > params.selectionEnd[ params.currentIndex ] ) {
            params.selectionEnd[ params.currentIndex ] = event.target.selectionStart;
            params.selectionStart[ params.currentIndex ] = event.target.selectionEnd;
        }
        if( params.selectionStart[ params.currentIndex ] != params.selectionEnd[ params.currentIndex ] ) {
            params.inputStatus[ params.currentIndex ] = "Select";
        }
    }

    function specialKeysSettings( event, params ) {
		if( params.inputStatus[ params.currentIndex ] == "Compose" && !params.isComposing[ params.currentIndex ] ) {
			if( params.inputStatus[ params.currentIndex ] != "Select" ) {
				params.inputStatus[ params.currentIndex ] = "Normal";
			}
		}
        if( params.dataSending[ params.currentIndex ] ) {
            window.clearTimeout( params.timer[ params.currentIndex ] );
            document.getElementById( params.currentTextArea ).addEventListener( "input", params.recorder.eventFunction( "DataTransfer" ) );
            params.dataSending[ params.currentIndex ] = false;
        }
        switch( event.key ) {
            case "Enter":
                event.preventDefault();
                break;
            case "Tab":
                event.preventDefault();
                break;
            case "Backspace":
                params.keyEvent[ params.currentIndex ] = "Backspace";
                break;
            case "Delete":
                params.keyEvent[ params.currentIndex ] = "Delete";
                break;
            default:
                params.keyEvent[ params.currentIndex ] = "Normal";
                break;
        }
    }

    function textSelection( event, params ) {
        switch( event.key ) {
            case "ArrowUp":
            case "ArrowDown":
            case "ArrowRight":
            case "ArrowLeft":
                getSelectedText( event, params );
                break;
            default:
        }
    }

    function editText( event, params ) {
        params.isEdit = true;
        params.editStart = event.target.selectionStart;
        params.editEnd = event.target.selectionEnd;
    }


export { composeOn, composeOff, sendDocumentData, getCurrentTextArea,
				insertReservedWords, getSelectedText, specialKeysSettings, textSelection, editText }