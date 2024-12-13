

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
illustRecorder.setImageButton( "Insert-File", "FileImage", "ImageFileName" );
illustRecorder.setButton( "Rect", Illustration.RECTANGLE );
illustRecorder.setButton( "MoveGraph", Illustration.MOVE_GRAPH );


window.addEventListener( "DOMContentLoaded", settings );

function settings() {
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
    const illustBlob = new Blob( [ JSON.stringify( illustRecorder.getIllustrations() ) ], { type: "application/json" } );

    const formData = new FormData();
    formData.append( "Docs", blob );
    formData.append( "Illusts", illustBlob );
    const myRequest = new Request( "storage", {
        method: "POST",
        headers: myHeaders,
        body: formData
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



    export async function insertIllust( event ) {
        const str = String( event.target.id );
        const idNumber = str.substring( 12, str.length );

        const illust = document.getElementById( "Illust" + String( idNumber ) );
        illust.src = cvs.toDataURL();
        illust.style.width = "350px";
        illust.style.height = "275px";

        recorder.setImage( parseInt( idNumber ), illustRecorder.getIllustration( illustRecorder.getCurrentIndex() ) );

        /*
        const blob = new Blob( [ JSON.stringify( recorder.getDocuments() ) ], { type: "application/json" } );
        const illustBlob = new Blob( [ JSON.stringify( illustRecorder.getIllustrations() ) ], { type: "application/json" } );
        const promise = await blob.text();
        const illustPromise = await illustBlob.text();

        const documents = recorder.getDocuments();
        for( const obj of documents ) {
            if( obj.isContainImage() ) {
                const imageBlob = obj.getImage();
            }
        }

        console.log( "blob" + promise );
        console.log( "blob" + illustPromise );
        */

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

