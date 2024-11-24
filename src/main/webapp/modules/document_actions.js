/**
 * 
 */
import { displayText } from "./display_text.js";
    function composeOn( event, params ) {
        params.isComposing = true;
        if( params.inputStatus != "Select" ) {
            params.inputStatus = "Compose";
        }

        event.target.removeEventListener( "input", displayText );
        event.target.removeEventListener( "input", sendDocumentData );
        params.startCaret = event.target.selectionStart;
    }

    function composeOff( event, params ) {
        params.isComposing = false;

        event.target.addEventListener( "input", displayText );
        event.target.addEventListener( "input", sendDocumentData );
        displayText( event, params );
        sendDocumentData( event, params );
    }

    function sendDocumentData( event, params ) {
        params.dataSending = true;
        event.target.removeEventListener( "input", sendDocumentData );
        params.timer = window.setTimeout( () => {
            console.log( "send data!" );
            event.target.addEventListener( "input", sendDocumentData );
            params.dataSending = false;
        }, 1500 );
    }

    function getCurrentTextArea( event, params ) {
        params.currentTextArea = String( event.target.id );
    }

    function insertReservedWords( event, params ) {
        const typeOfReservedWord = String( event.target.id ).substring( 7, String( event.target.id ).length );
        const reservedWordOp = document.getElementById( typeOfReservedWord );
        const reservedWord = reservedWordOp.value;
        const htmlForm = "<font color=\"darkmagenta\">" + reservedWord + "</font>";
        const textArea = document.getElementById( params.currentTextArea );
        const idNumber = params.currentTextArea.substring( 8, String( params.currentTextArea ).length );
        const paragraph = document.getElementById( "Doc" + idNumber );
        const doc = documents[ parseInt( idNumber ) - 1 ];
        const pos = textArea.selectionEnd;

        doc.insertKeyword( String( reservedWord ), 1, pos );
        console.log( "doc: ", doc );

        paragraph.innerHTML = textArea.value.substring( 0, textArea.selectionEnd ) + htmlForm + textArea.value.substring( textArea.selectionEnd, textArea.textLength );
        textArea.value = textArea.value.substring( 0, textArea.selectionEnd ) + reservedWord + textArea.value.substring( textArea.selectionEnd, textArea.textLength );
 
    }

    function getSelectedText( event, params ) {
  //      selectedText = window.getSelection().toString();
        params.selectionStart = event.target.selectionStart;
        params.selectionEnd = event.target.selectionEnd;
        if( params.selectionStart > params.selectionEnd ) {
            params.selectionEnd = event.target.selectionStart;
            params.selectionStart = event.target.selectionEnd;
        }
        if( params.selectionStart != params.selectionEnd ) {
            inputStatus = "Select";
        }
    }

    function specialKeysSettings( event, params ) {
        if( params.dataSending ) {
            window.clearTimeout( params.timer );
            document.getElementById( params.currentTextArea ).addEventListener( "input", sendDocumentData );
            params.dataSending = false;
        }
        switch( event.key ) {
            case "Enter":
                event.preventDefault();
                break;
            case "Tab":
                event.preventDefault();
                break;
            case "Backspace":
                params.keyEvent = "Backspace";
                break;
            case "Delete":
                params.keyEvent = "Delete";
                break;
            default:
                params.keyEvent = "Normal";
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

export { composeOn, composeOff, sendDocumentData, getCurrentTextArea,
				insertReservedWords, getSelectedText, specialKeysSettings, textSelection }