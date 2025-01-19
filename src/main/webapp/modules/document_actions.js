/**
 * 
 */
import { displayText } from "./display_text.js";
    function insertReservedWords( event, params ) {
        const typeOfReservedWord = String( event.target.id ).substring( 7, String( event.target.id ).length );
        console.log( "たぬきち：「" + typeOfReservedWord + "」" );
        let keywordType = 1;
		if( typeOfReservedWord == "Keyword" ) {
			keywordType = 2;
		}
        
        const reservedWordOp = document.getElementById( typeOfReservedWord );
        const reservedWord = reservedWordOp.value;
        const textArea = params.textArea;
		const paragraph = document.getElementById( "Doc" + String ( params.currentIndex + 1 ) );
		const doc = params.documentStructures[ params.currentIndex ];
        const pos = textArea.selectionEnd;

        doc.insertKeyword( String( reservedWord ), keywordType, pos );

		paragraph.innerHTML = doc.getHTMLDocument();
        textArea.value = textArea.value.substring( 0, textArea.selectionEnd ) + reservedWord + textArea.value.substring( textArea.selectionEnd, textArea.textLength );
 
    }

     function sendDocumentData( event, params ) {
        const index = params.currentIndex;
		params.dataSending = true;
        params.textArea.removeEventListener( "input", params.recorder.eventFunction( "DataTransfer" ) );
        params.timer = window.setTimeout( async () => {
			const doc = params.documentStructures[ params.currentIndex ];
			const blob = new Blob( [ JSON.stringify( doc ) ], { type: "application/json;charset=UTF-8" } );
			const myRequest = new Request( "storage", {
				method: "POST",
				body: blob,
				headers: { "Process": "Analysis",
									"Content-type": "application/json" }
			} );
			const response = await window.fetch( myRequest );
			try {
				if( ! response.ok ) {
					throw new Error( "response status: ${ response.status }" );
				}
			} catch( error ) {
				console.error( error );
			}
            params.textArea.addEventListener( "input", params.recorder.eventFunction( "DataTransfer" ) );
			params.dataSending = false;
        }, 1500 );
    }


    function composeOn( event, params ) {
		params.isComposing = true;
		console.log( params.inputStatus );
        if( params.inputStatus != "Select" ) {
            params.inputStatus = "Compose";
        }

        params.textArea.removeEventListener( "input", params.recorder.eventFunction( "TextArea" ) );
        params.textArea.removeEventListener( "input", params.recorder.eventFunction( "DataTransfer" ) );
        params.startCaret = event.target.selectionStart;
    }

    function composeOff( event, params ) {
		params.isComposing = false;

        params.textArea.addEventListener( "input", params.recorder.eventFunction( "TextArea" ) );
        params.textArea.addEventListener( "input", params.recorder.eventFunction( "DataTransfer" ) );

        displayText( event, params );
        sendDocumentData( event, params );
    }

    function getSelectedText( event, params ) {
        params.selectionStart = params.textArea.selectionStart;
        params.selectionEnd = params.textArea.selectionEnd;
        if( params.selectionStart > params.selectionEnd ) {
            params.selectionEnd = params.textArea.selectionStart;
            params.selectionStart = params.textArea.selectionEnd;
        }
        if( params.selectionStart != params.selectionEnd ) {
            params.inputStatus = "Select";
        }
    }

    function specialKeysSettings( event, params ) {
		if( params.inputStatus == "Compose" && !params.isComposing ) {
			params.inputStatus = "Normal";
		}
		if( params.inputStatus == "Select" ) {
			params.isSelect = true;
		} else {
			params.isSelect = false;
		}
        if( params.dataSending ) {
            window.clearTimeout( params.timer );
            params.textArea.addEventListener( "input", params.recorder.eventFunction( "DataTransfer" ) );
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

    function editText( event, params ) {
        params.isEdit = true;
        params.editStart = params.textArea.selectionStart;
        params.editEnd = params.textArea.selectionEnd;
    }

	function changeText( event, params ) {
		params.recorder.setButtonStatus( event );
	}

export { composeOn, composeOff, sendDocumentData,
				insertReservedWords, getSelectedText, specialKeysSettings, textSelection, editText,
				changeText }