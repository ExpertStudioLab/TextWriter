/**
 * 
 */
    let point = { x : 0, y : 0 };
    const cvs = document.getElementById( "Image" );
    const graph = cvs.getContext( "2d" );
    const insertBtn = document.getElementById( "Insert" );
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
    function setBegin( event ) {
        if( !flag ) {
            offSet = event.target.getBoundingClientRect();
            point.x = event.clientX - offSet.left;
            point.y = event.clientY - offSet.top;
            formLine.style.position = "absolute";
            formLine.style.zIndex = 10;
            formLine.style.border = "1px solid black";
            document.body.style.userSelect = "none";
            formLine.style.left = String( Math.floor( event.clientX ) ) + "px";
            formLine.style.top = String( Math.floor( event.clientY + window.scrollY ) ) + "px";

            flag = true;
        }
    }
    function setMove( event ) {
        graph.restore();
        event.preventDefault();
        if( flag ) {
            const w  = event.clientX - offSet.left - point.x;
            const h = event.clientY - offSet.top - point.y

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


/*
    saveBtn.addEventListener( "click", ( event )=> {
        event.preventDefault();

        cvs.toBlob( ( pictBlob )=>{
            const fData = new FormData();
            fData.append( "file", pictBlob, "sample001.png" );
            
            const xhr = new XMLHttpRequest();
            xhr.open( "POST", "/TextWriter/storage", true );
            xhr.onload = function () {
                if( xhr.status == 200 ) {
                    console.log( "Upload successful!" );
                } else {
                    console.error( "error" );
                }
            }
            for( let val of fData.entries() ) {
                console.log( val );
            }
            console.log( fData.getAll("file" ) );
            xhr.send( fData );
        });

    } );
*/

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
   console.log( "hello" );
};

//    saveBtn.addEventListener( "click", sendData );
    insertBtn.addEventListener( "click", insertIllust );
/*
    function sendData( event ) {
        const illustData = document.getElementById( "Illust" );
        graph.drawImage( illustData, 0, 0 );
        cvs.toBlob( ( canvasImage ) => {
			const myHeaders = new Headers();
        	myHeaders.append( "Content-Type", "image/png" );
        	const myRequest = new Request( "/TextWriter/storage", {
            method: "POST",
            body: canvasImage,
            headers: myHeaders
        });
        try{
            const response = fetch( myRequest );
            console.log( "Success: ", response );
        } catch( error ) {
            console.error( "Error: ", error );
        }
        });
    }
*/
    function insertIllust( ) {
        cvs.toBlob( ( canvasImage ) => {
            const illust = document.getElementById( "Illust" );
            illust.src = window.URL.createObjectURL( canvasImage );
            illust.style.width = "500px";
            illust.style.height = "250px";

			const fileOp = document.getElementById( "SendFile" );
			fileOp.name = "img_" + fileNumber;
			const sendFile = new File( [ canvasImage ], fileNumber + ".png", { type: "image/png" } );
			const dataTransfer = new DataTransfer();
			dataTransfer.items.add( sendFile );
			if( fileOp.files.length > 0 ) {
				fileOp.value = '';
			}
			fileOp.files = dataTransfer.files;
        });

    }

