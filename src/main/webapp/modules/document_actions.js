/**
 * 
 */
import { displayText } from "./display_text.js";
import { Specify } from "./document_manager.js";
import { setVerbButtonStatus } from "./document_recorder.js";
    function insertReservedWords( event, params ) {
        const typeOfReservedWord = String( event.target.id ).substring( 7, String( event.target.id ).length );
        let keywordType = 1;
		switch( typeOfReservedWord ) {
			case "Keyword":
				keywordType = 2;
				break;
			case "Verb":
				keywordType = 3;
				break;
		}
		const reservedWordOp = document.getElementById( typeOfReservedWord );
        const reservedWord = reservedWordOp.value;
        if( typeOfReservedWord != "VerbValue" ) {
			const datalistIdList = Object.keys( params.registeredDatalist );
			if( ! datalistIdList.includes( typeOfReservedWord ) ) {
				params.registeredDatalist[ typeOfReservedWord ] = [];
			}
			if( ! params.registeredDatalist[ typeOfReservedWord ].includes( reservedWord ) ) {
				console.log( "typeOfReservedWord: " + typeOfReservedWord );
				params.registeredDatalist[ typeOfReservedWord ].push( reservedWord );
				console.log( "keywords: ", params.registeredDatalist[ typeOfReservedWord ] );
			}
			reservedWordOp.value = "";
		} else if( typeOfReservedWord == "VerbValue" ) {
			if( ! params.verb.entry( params.labelTextbox.value, params.typeSelector.value, reservedWord ) ) {
				return;
			}
		}

        const textArea = params.textArea;
		const paragraph = document.getElementById( "Doc" + String ( params.currentIndex + 1 ) );
		const doc = params.documentStructures[ params.currentIndex ];
        const pos = textArea.selectionEnd;
        const specify = ( typeOfReservedWord == "VerbValue" ) ?
        							new Specify( typeOfReservedWord, params.operationTextbox, params.typeSelect, params.valueTextbox ) :
        							new Specify( typeOfReservedWord, null, null, null );

        doc.insertKeyword( String( reservedWord ), keywordType, specify, pos );

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

		const bottom = Math.floor( textAreaBounds.bottom + window.scrollY );
		params.toolPanel.style.top = String( bottom ) + "px";

		params.toolPanel.style.display = "block";
		params.toolPanel.style.animation = "SlideIn 1.6s";
		params.toolPanel.style.position = "absolute";
		params.toolPanel.style.left = "10px";
	}
	
	async function pulldown( event, params ) {
		if( ! params.listIsActive ) {
			let name = event.target.id;
			if( name.includes( "-" ) ) {
				name = name.substring( 0, name.indexOf( "-" ) );
			}
			let list = Object.keys( params.verb.label );
			if( name == "VerbValue" ) {
				if( list.includes( params.labelTextbox.value ) ) {
					list = params.verb.action[ parseInt( params.verb.label[ params.labelTextbox.value ] ) ][ parseInt( params.typeSelector.value ) ];
				} else {
					list = [];
				}
			} else if( name != "Label" ) {
				list = params.registeredDatalist[ name ];
			}
			if( list.length > 0 ) {
				const datalist = document.createElement( "div" );
				datalist.id = "Datalist";
				document.body.appendChild( datalist );
				params.curTextbox = document.getElementById( name );
				params.curPulldownBtn = document.getElementById( name + "-PulldownBtn" );
				const bounds = params.curTextbox.getBoundingClientRect();
				datalist.style.cssText = `top: ${ Math.floor( bounds.bottom + window.scrollY ) }px;
											left: ${ Math.floor( bounds.left + window.scrollX ) }px;
											width: ${ Math.floor( bounds.right - bounds.left - 3 ) }px;
											overflow-x: hidden;
											overflow-y: scroll;
											position: absolute;
											height: 0px;
											border: 2px solid black;`;
					params.curPulldownBtn.value = "▲";
				for( let i = 0; i < list.length; i++ ) {
					const div = document.createElement( "div" );
					div.className = "List-Item-Div";
					div.id = String( i );
					div.style.cssText = `width: ${ datalist.style.width }; background-color: white;`;
					const span = document.createElement( "span" );
					span.innerText = list[ i ];
					span.style.cssText = "font-size: 14px; cursor: default;";
					div.appendChild( span );
					datalist.appendChild( div );
					div.addEventListener( "mouseenter", hoverItem );
					div.addEventListener( "mouseleave", leaveItem );
					div.addEventListener( "click", params.selectItemFunc );
				}
				for( let i = 0; i < 26; i++ ) {
					await timer();
					datalist.style.height = String( ( list.length < 6 ) ? ( i * list.length ) : i * 6 ) + "px";
				}
				params.listIsActive = true;
			}
		}
	}
	
	function closeList( event, params ) {
		const element = document.elementFromPoint( event.clientX, event.clientY );
		if( params.listIsActive && element != document.getElementById( "Datalist" ) && element != params.curTextbox ) {
			params.listIsActive = false;
			const divs = document.querySelectorAll( ".List-Item-Div" );
			divs.forEach( div => {
				div.removeEventListener( "mouseenter", hoverItem );
				div.removeEventListener( "mouseleave", leaveItem );
				div.removeEventListener( "click", params.selectItemFunc );
			} );
			document.body.removeChild( document.getElementById( "Datalist" ) );
			params.curPulldownBtn.value = "▼";
		}
	}
	
	function hoverItem( event ) {
		event.target.style.backgroundColor = "lightblue";
	}
	
	function leaveItem( event ) {
		event.target.style.backgroundColor = "white";
	}
	
	function selectItem( event, params ) {
		const outerHTML = event.target.outerHTML;
		const elementType = outerHTML.substring( outerHTML.indexOf( "<" ) + 1, outerHTML.indexOf( " " ) );
		switch( elementType ) {
			case "div":
				params.curTextbox.value = event.target.querySelector( "span" ).innerText;	
				break;
			case "span":
				params.curTextbox.value = event.target.innerText;
		}
		setVerbButtonStatus();
	}
	
	function timer() {
		return new Promise( resolve => {
			window.setTimeout( () => {
				resolve();
			}, 5 );
		} );
	}

export { composeOn, composeOff, sendDocumentData,
				insertReservedWords, getSelectedText, specialKeysSettings, textSelection, editText,
				changeText, scrollScreen, moveToolPanel, pulldown, closeList, selectItem }