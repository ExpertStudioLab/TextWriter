/**
 * 
 */
    // use on identifying textareas
    let paraNumber = 2;
     // identity of png file
    let fileNumber;
    // buttons
    const insertBtn = document.getElementById( "Insert" );
    const insertPBtn = document.getElementById( "Paragraph" );

document.body.onload = function() {
   const xhr = new XMLHttpRequest();
   xhr.open( "GET", "/TextWriter/storage", true );
   xhr.setRequestHeader( 'Process', 'FileNumber' );
   xhr.onreadystatechange = function() {
	   if( xhr.readyState == 4 && xhr.status == 200 ) {
		   fileNumber = xhr.responseText;
		   console.log( "Success: ", fileNumber );
	   } else {
		   console.log( "Error ocasion" );
	   }
   };
   xhr.send( null );
};

    insertBtn.addEventListener( "click", insertIllust );
    insertPBtn.addEventListener( "click", insertParagraph );

    
    function insertIllust( ) { 
        cvs.toBlob( ( canvasImage ) => {
            const myHeaders = new Headers();
            myHeaders.append( "Process", "Image" );
            const myRequest = new Request( "/TextWriter/storage", {
                method: "POST",
                body: canvasImage,
                headers: myHeaders
            });
            try {
                window.fetch( myRequest );
                console.log( "Success" );
            } catch( error ) {
                console.error( "Error" );
            }
            // prohibit skipping processes.
            window.setTimeout( () => {
                const illust = document.getElementById( "Illust" );
                illust.src = window.URL.createObjectURL( canvasImage );
                illust.style.width = "500px";
                illust.style.height = "350px";
            }, 2000 );

        });

    }

    function insertParagraph() {
        const paraOp = document.createElement( "p" );
        paraOp.style.fontSize = "24px";
        paraOp.id = "Doc" + String( paraNumber );
        const container = document.getElementById( "Preview" );
        container.appendChild( paraOp );
        const textContainer = document.createElement( "div" );
        textContainer.className = "Left-Justify";
        const textArea = document.createElement( "textarea" );
        textArea.id = "Contents" + String( paraNumber );
        textArea.style.fontSize = "24px";
        textArea.style.width = "100%";
        textArea.style.marginTop = "10px";
        textArea.rows = "10";
        textArea.cols = "80";
        textContainer.appendChild( textArea );
        const textInputArea = document.getElementById( "Left-Side" );
        textInputArea.appendChild( textContainer );
        paraNumber += 1;
        textArea.addEventListener( "input", displayText );
    }

	const textOp = document.getElementById( "Contents1" );
    textOp.addEventListener( "input", displayText );
    
    function displayText( event ) {
        const str = String( event.target.id );
        const idNumber = str.substring( 8, str.length );
        const textOp = document.getElementById( "Contents" + idNumber );
        const paragraph = document.getElementById( "Doc" + idNumber );
        paragraph.innerText = String( textOp.value );
    }