

import { DocumentRecorder } from "./modules/document_recorder.js";
import { Illustration } from "./modules/illustration.js";
import { IllustrationRecorder } from "./modules/illustration_recorder.js";
import { createKeywordButton } from "./modules/keyword_buttons.js";

/**
 * 
 */
const cvs = document.getElementById( "Image1" );

const recorder = new DocumentRecorder( "Basic-Div", "Display-Area" );

// button to send documents to servlet
const sendBtn = document.getElementById( "Save" );
sendBtn.addEventListener( "click", SendDocuments );


const illustRecorder = new IllustrationRecorder( "Image1", "New-Image" );

illustRecorder.setTextButton( "Text", "Text-Label" );
illustRecorder.setButton( "Rect", Illustration.RECTANGLE );
illustRecorder.setButton( "MoveGraph", Illustration.MOVE_GRAPH );

     // identity of png file
    let fileNumber;
    // buttons
const insertBtn = document.getElementById( "Insert-Image1" );

window.addEventListener( "DOMContentLoaded", settings );

function settings() {
    getFileNumber();
    getKeywords();
}
async function getKeywords() {
    const myRequest = new Request( "storage", {
        method: "GET",
        headers: { "Process": "Keywords" }
    });

    const response = await window.fetch( myRequest );
    try{
        if( !response.ok ) {
            throw new Error( "response status: ${ response.status }" );
        } else {
            const jsonData = await response.json();
            jsonData.forEach( data => {
                const statement = createKeywordButton( data.keyword, data.placeholder, data.options );
                const div = document.getElementById( "Center" );
                div.insertAdjacentHTML( "beforeend", statement );
                recorder.registerKeywordButton( "Insert-" + data.keyword );
            });
        }
    } catch( error ) {
        console.error( error );
    }
}

async function SendDocuments() {
    const myHeaders = new Headers();
    myHeaders.append( "Content-Type", "application/json" );
    myHeaders.append( "Process", "Save" );
    const blob = new Blob( [ JSON.stringify( recorder.getDocuments() ) ], { type: "application/json"} );
    const myRequest = new Request( "storage", {
        method: "POST",
        headers: myHeaders,
        body: blob
    });

    const response = await window.fetch( myRequest );
    try {
        if( !response.ok ) {
            throw new Error( "response status: ${ response.status }" );
        }
    } catch( error ) {
        console.error( error );
    }
}


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

//    insertBtn.addEventListener( "click", insertIllust );
    
    export async function insertIllust( event ) {
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

    export function canvasToBlob( canvas ) {
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

