/**
 * 
 */
    let paraNumber = 2;
    let point = { x : 0, y : 0 };
    let screen = { x : 0, y : 0 };
    let absolutePoint = { x : 0, y : 0 };
    const cvs = document.getElementById( "Image" );
    const graph = cvs.getContext( "2d" );
    const insertBtn = document.getElementById( "Insert" );
    const insertPBtn = document.getElementById( "Paragraph" );

	// show guideline when draw picture.
    const formLine = document.getElementById( "drawRect" );
    let offSet;
    let fileNumber;

    graph.fillStyle = "#fff"
    graph.fillRect( 0, 0, cvs.width, cvs.height );
    const drawRect = document.getElementById( "drawRect" );
    graph.strokeStyle = "#000";
    graph.lineWidth = "10px";
    graph.save();

    cvs.addEventListener( "mousedown", setBegin );
    document.body.addEventListener( "mousemove", setMove );
    document.body.addEventListener( "mouseup", setEnd );

let flag = false;
let invalidW = false;
let invalidH = false;
    function setBegin( event ) {
        if( !flag ) {
            offSet = event.target.getBoundingClientRect();
            point.x = event.clientX - offSet.left;
            point.y = event.clientY - offSet.top;
            formLine.style.position = "absolute";
            formLine.style.zIndex = 10;
            formLine.style.border = "1px solid black";
            document.body.style.userSelect = "none";
            screen.x = Math.floor( event.clientX );
            screen.y = Math.floor( event.clientY + window.scrollY );
            formLine.style.left = String( screen.x ) + "px";
            formLine.style.top = String( screen.y ) + "px";
            absolutePoint.x = offSet.left + point.x;
            absolutePoint.y = offSet.top + point.y;
            flag = true;
        }
    }

    function setMove( event ) {
        graph.restore();
        event.preventDefault();
        if( flag ) {
            let w  = event.clientX - absolutePoint.x;
            let h = event.clientY - absolutePoint.y;
            if( w < 0 && h <0 ) {
                if( !invalidH || !invalidW ) {
                    invalidH = true;
                    invalidW = true;
                }
                formLine.style.top = String( screen.y + h ) + "px";
                formLine.style.left = String( screen.x + w ) + "px";
                h = Math.abs( h );
                w = Math.abs( w );
            } else if( w < 0 ) {
                if( !invalidW ) {
                    invalidW = true;
                }
                if( invalidH ) {
                    invalidH = false;
                    formLine.style.top = String( screen.y ) + "px";
                }
                formLine.style.left = String( screen.x + w ) + "px";
                w = Math.abs( w );
            } else if( h < 0 ) {
                if( !invalidH ) {
                    invalidH = true;
                }
                if( invalidW ) {
                    invalidW = false;
                    formLine.style.left = String( screen.x ) + "px";
                }
                formLine.style.top = String( screen.y + h ) + "px";
                h = Math.abs( h );
            } else {
                if( invalidW || invalidH ) {
                    invalidW = false;
                    invalidH = false;
                    formLine.style.left = String( screen.x ) + "px";
                    formLine.style.top = String( screen.y ) + "px";
                }
            }
                formLine.style.width = String( Math.floor( w ) ) + "px";
                formLine.style.height = String( Math.floor( h ) ) + "px";
        }
    }
    function setEnd( event ) {
        if( flag ) {
            flag = false;
            formLine.style.cssText = "";
            document.body.style.cssText = "";
            const w  = event.clientX - offSet.left - point.x;
            const h = event.clientY - offSet.top - point.y
            graph.restore();
            // don't understand what means, offSet that get from here states has been set value 0.
            console.log( "[ offSet-X: " + Math.floor( offSet.left ) + ", offSet-Y: " + Math.floor( offSet.top ) + " ]" );
            console.log( "[ client-X: " + Math.floor( event.clientX ) + ", client-Y: " + Math.floor( event.clientY ) + " ]" );
            console.log( "[ width: " + Math.floor( w ) + ", height: " + Math.floor( h ) + " ]");
            graph.strokeRect( Math.floor( point.x ), Math.floor( point.y ), Math.floor( w ), Math.floor( h ) );
        }
    }


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