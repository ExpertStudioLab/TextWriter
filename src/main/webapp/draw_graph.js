/**
 * 
 */
    let rect = { x : 0, y : 0, endX : 0, endY : 0 };
    const cvs = document.getElementById( "Image" );
    const graph = cvs.getContext( "2d" );
    const saveBtn = document.getElementById( "Save" );
    const formLine = document.getElementById( "drawRect" );
    let offSet;

    graph.fillStyle = "#fff"
    graph.fillRect( 0, 0, cvs.width, cvs.height );
    graph.save();
    const drawRect = document.getElementById( "drawRect" );
    graph.strokeStyle = "#000";
    graph.lineWidth = "10px";

    cvs.addEventListener( "contextmenu", showMenu );
    cvs.addEventListener( "mousedown", setBegin );
    document.body.addEventListener( "mousemove", setMove );
    document.body.addEventListener( "mouseup", setEnd );

    function showMenu( event ) {
        event.preventDefault();
        const offSet = event.target.getBoundingClientRect();
        rect.x = event.clientX - offSet.left;
        rect.y = event.clientY - offSet.top;

        document.getElementById( "popupMenu" ).style.display = "block";
    }

    const lis = document.querySelector( "li" );
    lis.addEventListener( "click", offDisp );

    function offDisp() {
        document.getElementById( "popupMenu" ).style.display = "none";
        window.open( "DialogBox/input.html", "数値入力", "width=300,height=199,top=200,left=550" );
    }

    function getRect( data ) {
        graph.restore();
        rect.endX = data.x;
        rect.endY = data.y;
        graph.strokeRect( Math.floor( rect.x ), Math.floor( rect.y ), Math.floor( rect.endX ), Math.floor( rect.endY ) );
    }
let flag = false;
    function setBegin( event ) {
        if( !flag ) {
            offSet = event.target.getBoundingClientRect();
            rect.x = event.clientX - offSet.left;
            rect.y = event.clientY - offSet.top;
            formLine.style.position = "absolute";
            formLine.style.zIndex = 10;
            formLine.style.border = "1px solid black";
            document.body.style.userSelect = "none";
            formLine.style.left = String( Math.floor( event.clientX ) ) + "px";
            formLine.style.top = String( Math.floor( event.clientY ) ) + "px";
            flag = true;
        }
    }
    function setMove( event ) {
        graph.restore();
        event.preventDefault();
        if( flag ) {
            const w  = event.clientX - offSet.left - rect.x;
            const h = event.clientY - offSet.top - rect.y

            formLine.style.width = String( Math.floor( w ) ) + "px";
            formLine.style.height = String( Math.floor( h ) ) + "px";
        }
    }
    function setEnd( event ) {
        if( flag ) {
            flag = false;
            formLine.style.cssText = "";
            document.body.style.cssText = "";
            const w  = event.clientX - offSet.left - rect.x;
            const h = event.clientY - offSet.top - rect.y
            graph.restore();
            // don't understand what means, offSet that get from here states has been set value 0.
            console.log( "[ offSet-X: " + Math.floor( offSet.left ) + ", offSet-Y: " + Math.floor( offSet.top ) + " ]" );
            console.log( "[ client-X: " + Math.floor( event.clientX ) + ", client-Y: " + Math.floor( event.clientY ) + " ]" );
            console.log( "[ width: " + Math.floor( w ) + ", height: " + Math.floor( h ) + " ]");
            graph.strokeRect( Math.floor( rect.x ), Math.floor( rect.y ), Math.floor( w ), Math.floor( h ) );
        }
    }



    saveBtn.addEventListener( "click", ( event )=> {
        event.preventDefault();
   //     const url = cvs.toDataURL();
   //     document.getElementById( "Img" ).src = url;
/*
        cvs.toBlob( ( pictBlob )=> {
            const url = URL.createObjectURL( pictBlob );
            document.getElementById( "Img" ).src = url;
            const link = document.createElement( "a" );
            link.href = url;
            link.download = "test.png";
            link.click();
        })
*/

        cvs.toBlob( ( pictBlob )=>{
            const fData = new FormData();
            fData.append( "file", pictBlob, "sample001.png" );
            
            const xhr = new XMLHttpRequest();
            xhr.open( "POST", "/TextWriter/storeimage", true );
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