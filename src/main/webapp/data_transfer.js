

import { ImageGraphic } from "./modules/canvas_graphics.js";
import { DocumentRecorder } from "./modules/document_recorder.js";
import { Illustration } from "./modules/illustration.js";
import { IllustrationRecorder } from "./modules/illustration_recorder.js";
import { createKeywordButton } from "./modules/keyword_buttons.js";

/**
 * 
 */
const cvs = document.getElementById( "Image1" );

// button to send documents to servlet
const sendBtn = document.getElementById( "Save" );
sendBtn.addEventListener( "click", SendDocuments );

// recorders
const recorder = new DocumentRecorder( "Basic-Div", "Display-Area", "PreviousTextButtons" );
const illustRecorder = new IllustrationRecorder( "Image1", "New-Image" );

illustRecorder.setTextButton( "Text", "Text-Label" );
illustRecorder.setImageButton( "Insert-File", "FileImage", "ImageFileName" );
illustRecorder.setButton( "Rect", Illustration.RECTANGLE );
illustRecorder.setButton( "MoveGraph", Illustration.MOVE_GRAPH );

window.onload = function() {
	getKeywords();
	getCustomDatalist();
};

async function getKeywords() {
    const myRequest = new Request( "storage", {
        method: "GET",
        headers: { "Process": "Keywords" }
    } );

    const response = await window.fetch( myRequest );
    try{
        if( !response.ok ) {
            throw new Error( "response status: ${ response.status }" );
        } else {
            const jsonData = await response.json();
            jsonData.forEach( data => {
                const statement = createKeywordButton( data.keyword, data.placeholder, data.options );
                recorder.registerKeywordButton( "Insert-" + data.keyword, statement );
            });
            const statement = createKeywordButton( "Keyword", "キーワード", null );
            recorder.registerKeywordButton( "Insert-" + "Keyword", statement );
        }
    } catch( error ) {
        console.error( error );
    }
}

async function getCustomDatalist() {
	const myRequest = new Request( "storage", {
		method: "GET",
		headers: { "Process": "CustomDatalist" }
	} );
	const response = await window.fetch( myRequest );
	
	try{
        if( !response.ok ) {
            throw new Error( "response status: ${ response.status }" );
        } else {
            const jsonData = await response.json();
            jsonData.forEach( data => {
				recorder.setCustomDatalist( data );
				console.log( data );
            } );
        }
    } catch( error ) {
        console.error( error );
    }
}

async function SendDocuments() {
    const myHeaders = new Headers();
    myHeaders.append( "Process", "Save" );
    const blob = new Blob( [ JSON.stringify( recorder.getDocuments() ) ], { type: "application/json"} );
    const illustBlob = new Blob( [ JSON.stringify( illustRecorder.getIllustrations() ) ], { type: "application/json" } );
    const illustrations = illustRecorder.getIllustrations();
    const datalistBlob = new Blob( [ JSON.stringify( recorder.getCustomDatalist() ) ], { type: "application/json" } );

    const formData = new FormData();
    formData.append( "Docs", blob );
    formData.append( "Illusts", illustBlob );
    formData.append( "datalist", datalistBlob );

    let fileNumber = 1;
    for( let i = 0; i < illustrations.length; i++ ) {
        const graphics = illustrations[ i ].getGraphics();
        for( let j = 0; j < graphics.length; j++ ) {
            if( graphics[ j ] instanceof ImageGraphic ) {
                console.log( "tanukichi error!!" );
                const image = graphics[ j ].getImage();
                const imageType = graphics[ j ].getImageType();
                const canvas = document.createElement( "canvas" );
                const drawDevice = canvas.getContext( "2d" );
                canvas.width = image.width;
                canvas.height = image.height;
                drawDevice.drawImage( image, 0, 0 );
                const imageBlob = await createBlob( canvas, imageType );
                formData.append( "Image" + String( fileNumber ), imageBlob );
                fileNumber += 1;
            }
        }
    }
    const imageFileNumber = new Blob( [ String( fileNumber - 1 ) ], { type: "text/plain" } );
    formData.append( "FileNumber", imageFileNumber );

    const myRequest = new Request( "storage", {
        method: "POST",
        headers: myHeaders,
        body: formData
    } );

    const response = await window.fetch( myRequest );
    try {
        if( !response.ok ) {
            throw new Error( "response status: ${ response.status }" );
        }
    } catch( error ) {
        console.error( error );
    }
    const form = document.getElementById( "SendForm" );
    const sendForm = new FormData( form );
    sendForm.submit();
}

    export async function insertIllust( event ) {
        const str = String( event.target.id );
        const idNumber = str.substring( 12, str.length );

//        const illust = document.getElementById( "Illust" + String( idNumber ) );
		const illust = document.createElement( "img" );
		illust.id = "Illust" + String( idNumber );
        illust.src = cvs.toDataURL();
        illust.style.width = "350px";
        illust.style.height = "275px";
        illust.style.float = "right";
        
        const div = document.getElementById( "Preview" + String( idNumber ) );
        div.appendChild( illust );

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

    export function createBlob( canvas, imageType ) {
        return new Promise( ( resolve ) => {
            canvas.toBlob( ( canvasImage ) => {
                if( canvasImage ) {
                    resolve( canvasImage );
                } else {
                    throw new Error( "Failed to generate blob." );
                }
            }, imageType );
        } );
    }

