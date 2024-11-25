import { DocumentRecorder } from "./modules/document_recorder.js";
import { cvs } from "./draw_graph.js";

/**
 * 
 */

const recorder = new DocumentRecorder( "Doc", "Contents" );
// button to add paragraph.
recorder.registerButton( "InsertParagraph", "Paragraph", insertParagraph );
recorder.registerKeywordButton( "InsertEquals", "Insert-Equals" )
//recorder.registerTextArea( "Contents1" );
     // identity of png file
    let fileNumber;
    // buttons
    const insertBtn = document.getElementById( "Insert-Image1" );

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
        const paraNumber = recorder.getParagraphNumber();
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

		recorder.addTextArea();
//        recorder.registerTextArea( "Contents" + String( paraNumber ) );
    }
