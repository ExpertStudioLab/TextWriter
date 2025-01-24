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
        const reservedWordListOp = document.getElementById( typeOfReservedWord + "-List" );
        const options = Array.from( reservedWordListOp.options );
        let addFlag = true;
        for( const option of options ) {
			if( option.value == reservedWord ) {
				addFlag = false;
			}
		}
		if( addFlag ) {
			const option = document.createElement( "option" );
			option.value = reservedWord;
			reservedWordListOp.appendChild( option );
			let check = false;
			for( const datalist of params.customDatalist ) {
				if( datalist.datalistId == typeOfReservedWord ) {
					datalist.options.push( reservedWord );
					check = true;
				}
			}
			if( !check ) {
				const object = {
					datalistId: typeOfReservedWord,
					options: []
				}
				object.options.push( reservedWord );
				params.customDatalist.push( object );
				console.log( params.customDatalist );
			}
		}
        reservedWordOp.value = "";
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

	function moveToolPanel( event, params ) {
		const panelTop = params.toolPanel.style.top;
		let panelBoundsTop = Math.floor( params.toolPanel.getBoundingClientRect().top );
		const textAreaBoundsBottom = Math.floor( params.textArea.getBoundingClientRect().bottom );
		const panelTopInt = parseInt( panelTop.substring( 0, panelTop.indexOf( 'p' ) ) );
		let distance = textAreaBoundsBottom - panelBoundsTop;
		let compare = panelTopInt - panelBoundsTop - window.scrollY;
		if( compare > -1 && compare < 1 ) {
			params.toolPanel.style.top = String( panelTopInt + distance ) + "px";
		} else {
			window.setTimeout( () => {
				const inputEvent = new CustomEvent( "changeposition" );
        		event.target.dispatchEvent( inputEvent );
			}, 200 );
		}
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
	
	async function scrollScreen( event, params ) {
//		await scroll();
		const scrollPoint = document.getElementById( "Scroll-Point" );
		const scrollBounds = scrollPoint.getBoundingClientRect();
		const scrollVolume = Math.floor( scrollBounds.top );
		window.scrollTo( {
			behavior: "smooth",
			top: window.scrollY + scrollVolume,
			left: 0
		});
		
		const textAreaBounds = event.target.getBoundingClientRect();
		const bottomRest = Math.floor( textAreaBounds.bottom - window.scrollY - window.innerHeight );
		if( bottomRest < 300 ) {
			window.scrollTo( {
				behavior: "smooth",
				top: window.scrollY + scrollVolume + 300 - bottomRest,
				left: 0
			} );
		}
//		const height = bounds.bottom - bounds.top;
		// absolute point ( 0, bottom )
//		const rest = window.innerHeight - bounds.bottom;
//		console.log( "bottom: " + bounds.bottom );
/*
		if( rest < slideDivHeight ) {
			const space = window.innerHeight - height - 50;
			if( space < slideDivHeight ) {
				slideDivHeight = space;
			}
			window.scrollTo( {
				behavior: "smooth",
				top: window.scrollY+ slideDivHeight - rest,
				left: 0
			} );
			const bottom = Math.floor( window.scrollY + slideDivHeight - rest + bounds.bottom - bounds.top );
			params.toolPanel.style.top = String( bottom + 70 ) + "px";
		} else {
			params.toolPanel.style.top = String( Math.floor( window.innerHeight + window.scrollY - rest ) ) + "px";
		}
		*/
		const bottom = Math.floor( textAreaBounds.bottom + window.scrollY );
		params.toolPanel.style.top = String( bottom ) + "px";

		
		params.toolPanel.style.display = "block";
		params.toolPanel.style.animation = "SlideIn 1.6s";
		params.toolPanel.style.position = "absolute";
		params.toolPanel.style.left = "10px";
	}

export { composeOn, composeOff, sendDocumentData,
				insertReservedWords, getSelectedText, specialKeysSettings, textSelection, editText,
				changeText, scrollScreen, moveToolPanel }