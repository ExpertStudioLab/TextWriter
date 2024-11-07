/**
 * 
 */
    let paraNumber = 2;
    let state = -1;
    let point = { x : 0, y : 0 };
    let screen = { x : 0, y : 0 };
    let absolutePoint = { x : 0, y : 0 };
    let graphics = [];
    let preview;
    let drawRectLine;
    const cvs = document.getElementById( "Image" );
    const graph = cvs.getContext( "2d" );
    const insertBtn = document.getElementById( "Insert" );
    const insertPBtn = document.getElementById( "Paragraph" );
    const rectBtn = document.getElementById( "Rect" );
    const moveBtn = document.getElementById( "MoveGraph" );
    const logBtn = document.getElementById( "Log" );

	// show guideline when draw picture.
    const formLine = document.getElementById( "drawRect" );
    let offSet;
    let fileNumber;

    graph.fillStyle = "#fff"
    graph.fillRect( 0, 0, cvs.width, cvs.height );
    graph.strokeStyle = "#000";
    graph.lineWidth = "10px";
    graph.save();

    function drawSetting() {
        cvs.addEventListener( "mousedown", setBegin );
        document.body.addEventListener( "mousemove", setMove );
        document.body.addEventListener( "mouseup", setEnd );    
    }

    function deleteDrawSetting() {
        cvs.removeEventListener( "mousedown", setBegin );
        document.body.removeEventListener( "mousemove", setMove );
        document.body.removeEventListener( "mouseup", setEnd );
    }

    rectBtn.addEventListener( "click", setDrawRect );
    moveBtn.addEventListener( "click", setMoveGraph );
    logBtn.addEventListener( "click", showlog );


    function setDrawRect() {
        graph.restore();
        drawSetting();
        drawRectLine = function() {
            formLine.style.border = "1px solid black";
        };
        preview = function( w, h ) {
            formLine.style.width = String( Math.floor( w ) ) + "px";
            formLine.style.height = String( Math.floor( h ) ) + "px";    
        };
        draw = function( w, h ) {
            let x = Math.floor( point.x );
            let y = Math.floor( point.y );
            let width = Math.floor( w );
            let height = Math.floor( h );
            if( Math.sign( width ) == -1 ) {
                x = x + width;
                width = Math.abs( width );
            }
            if( Math.sign( height ) == -1 ) {
                y = y + height;
                height = Math.abs( height );
            }
            if( width != 0 && height != 0 ) {
                graph.strokeRect( x, y, width, height );
                const graphic = { 
                    name : "rect",
                    area : {
                        x,
                        y,
                        width,
                        height
                    }
                };
                graphics.push( graphic );
            }
        }
    }

    function showlog() {
        graphics.forEach( g => {
            console.log( "name: [ " + g.name + " ], area: x: [ " + g.area.x + " ], y: [ " + g.area.y + " ], width: [ " + g.area.width + " ], height: [ " + g.area.height + " ]" );
        });
    }

    function setMoveGraph() {
        deleteDrawSetting();
        cvs.addEventListener( "click", getActive );
    }

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
            document.body.style.userSelect = "none";
            screen.x = Math.floor( event.clientX );
            screen.y = Math.floor( event.clientY + window.scrollY );
            formLine.style.left = String( screen.x ) + "px";
            formLine.style.top = String( screen.y ) + "px";
            absolutePoint.x = offSet.left + point.x;
            absolutePoint.y = offSet.top + point.y;
            flag = true;

            drawRectLine();
        }
    }

    function setMove( event ) {
        graph.restore();
        event.preventDefault();
        if( flag ) {
            let w  = event.clientX - absolutePoint.x;
            let h = event.clientY - absolutePoint.y;

            if( ( state ^ ( ( ( Math.sign( w ) == 1 ) ? 2 : 0 ) | ( ( Math.sign( h ) == 1 ) ? 1 : 0 ) ) ) == 0 ) {
                formLine.style.top = String( screen.y + ( ( Math.sign( h ) == -1 ) ? h : 0 ) ) + "px";
                formLine.style.left = String( screen.x + ( ( Math.sign( w ) == -1) ? w : 0 ) ) + "px";
                h = Math.abs( h );
                w = Math.abs( w );
            }else {
                if( Math.sign( w ) == -1 && Math.sign( h ) == -1 ) {
                    if( !invalidH || !invalidW ) {
                        invalidH = true;
                        invalidW = true;
                    }
                    formLine.style.top = String( screen.y + h ) + "px";
                    formLine.style.left = String( screen.x + w ) + "px";
                    h = Math.abs( h );
                    w = Math.abs( w );
                    state = 0;
                } else if( Math.sign( w ) == -1 ) {
                    if( !invalidW ) {
                        invalidW = true;
                    }
                    if( invalidH ) {
                        invalidH = false;
                        formLine.style.top = String( screen.y ) + "px";
                    }
                    formLine.style.left = String( screen.x + w ) + "px";
                    w = Math.abs( w );
                    state = 1;
                } else if( Math.sign( h ) == -1 ) {
                    if( !invalidH ) {
                        invalidH = true;
                    }
                    if( invalidW ) {
                        invalidW = false;
                        formLine.style.left = String( screen.x ) + "px";
                    }
                    formLine.style.top = String( screen.y + h ) + "px";
                    h = Math.abs( h );
                    state = 2;
                } else {
                    if( invalidW || invalidH ) {
                        invalidW = false;
                        invalidH = false;
                        formLine.style.left = String( screen.x ) + "px";
                        formLine.style.top = String( screen.y ) + "px";
                    }
                    state = 3;
                }
            }
            preview( w, h );
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
            draw( w, h );
        }
    }

    function getActive( event ) {
        const curPoint = new Object();
        curPoint.x = event.clientX - offSet.left;
        curPoint.y = event.clientY - offSet.top;
        const index = getGraphIndex( curPoint );
        if( index != null ) {
            formLine.style.position = "absolute";
            formLine.style.zIndex = "10";
            document.body.style.userSelect = "none";
            formLine.style.border = "3px solid black";
            formLine.style.backgroundColor = "rgba(32, 46, 155, 0.301)";
            const g = graphics[ index ];
            formLine.style.left = String( Math.floor( offSet.left ) + g.area.x ) + "px";
            formLine.style.top = String( Math.floor( offSet.top + window.scrollY ) + g.area.y ) + "px";
            formLine.style.width = String( g.area.width ) + "px";
            formLine.style.height = String( g.area.height ) + "px";
        }
    }

    function getGraphIndex( curPoint ) {
        for( let i = graphics.length - 1; i >= 0; i-- ) {
            let g = graphics[ i ];
            console.log( "index: [ " + i + "], name: [ " + g.name + " ], area: x: [ " + g.area.x + " ], y: [ " + g.area.y + " ], width: [ " + g.area.width + " ], height: [ " + g.area.height + " ]" );
            if( ( g.area.x <= curPoint.x ) && ( curPoint.x <= ( g.area.x + g.area.width ) ) && ( g.area.y <= curPoint.y ) && ( curPoint.y <= ( g.area.y + g.area.height) ) ) {
                return i;
            }
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