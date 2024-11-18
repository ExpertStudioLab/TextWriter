

/**
 * 
 */
	// button
    const moveBtn = document.getElementById( "MoveGraph" );
    // listener
    moveBtn.addEventListener( "click", moveGraphSettings );
    // information of current moving graphics
    let movingGraphIndex;


    // end of drawing actions, it disable all drawing actions
    function deleteDrawSetting() {
        cvs.removeEventListener( "mousedown", setBegin );
        document.body.removeEventListener( "mousemove", setMove );
        document.body.removeEventListener( "mouseup", setEnd );
    }

    function moveGraphSettings() {
        deleteDrawSetting();
        cvs.addEventListener( "click", getActive );
        formLine.addEventListener( "dragstart", getCursorPoint );
        formLine.addEventListener( "drag", moveGraph );
        cvs.addEventListener( "dragover", hoverCanvas );
        formLine.addEventListener( "dragover", hoverCanvas );
        formLine.addEventListener( "dragend", setMoveGraphEnd);
    }

    
    function getActive( event ) {
        event.preventDefault();
        offSet = event.target.getBoundingClientRect();
        const curPoint = new Object();
        curPoint.x = event.clientX - offSet.left;
        curPoint.y = event.clientY - offSet.top;
        movingGraphIndex = getGraphIndex( curPoint );
        if( movingGraphIndex != null ) {
            formLine.style.position = "absolute";
            formLine.style.zIndex = "10";
            document.body.style.userSelect = "none";
            formLine.style.backgroundColor = "rgba(32, 46, 155, 0.301)";
            const g = graphics[ movingGraphIndex ];
            point.left = Math.floor( offSet.left ) + g.getArea().getX();
            formLine.style.left = String( point.left ) + "px";
            point.top = Math.floor( offSet.top + window.scrollY ) + g.getArea().getY();
            formLine.style.top = String( point.top ) + "px";
            formLine.style.width = String( g.getArea().getWidth() ) + "px";
            formLine.style.height = String( g.getArea().getHeight() ) + "px";
            formLine.draggable = "true";
            formLine.style.cursor = "all-scroll";
            formLine.style.border = ( !( g instanceof TextGraphic ) ) ? "3px solid black" : "";
        }
    }

    function getGraphIndex( curPoint ) {
        for( let i = graphics.length - 1; i >= 0; i-- ) {
            let g = graphics[ i ];
            if( ( g.area.x <= curPoint.x ) && ( curPoint.x <= ( g.area.x + g.area.width ) ) && ( g.area.y <= curPoint.y ) && ( curPoint.y <= ( g.area.y + g.area.height) ) ) {
                return i;
            }
        }
    }

    function getCursorPoint( event ) {
        graph.fillRect( 0, 0, cvs.width, cvs.height );
        for( let i = 0; i < graphics.length; i++ ) {
            if( movingGraphIndex != i ) {
                graphics[ i ].draw();
            }
        }
        point.x = 0;
        point.y = 0;
        point.dragStartX = event.clientX;
        point.dragStartY = event.clientY;
    }
let count = 0;
    function moveGraph( event ) {
        const x = Math.floor( event.clientX - point.dragStartX );
        const y = Math.floor( event.clientY - point.dragStartY );
        if( count % 4 == 0 ) {
            formLine.style.left = String( point.left + x ) + "px";
            formLine.style.top = String( point.top + y ) + "px";    
        }
        if( count % 3 == 0 ) {
//            const g = graphics[ movingGraphIndex ];
//            g.draw( );
//            console.log( "[ x, y, width, height ]: [ " + g.area.x + ", " + g.area.y + ", " + g.textWidth + ", " + g.textY + " ]" );
//            graph.fillRect( g.area.x + x, g.area.y + y, g.textWidth, g.textHeight );
        }
    }

    function setMoveGraphEnd( event ) {
        const disX = event.clientX - point.dragStartX;
        const left = Math.floor( point.left + disX - offSet.left );
        const disY = event.clientY - point.dragStartY;
        const top = Math.floor( point.top + disY - offSet.top - window.scrollY );

        graphics[ movingGraphIndex ].setX( left );
        graphics[ movingGraphIndex ].setY( top );
        const g = graphics[ movingGraphIndex ];
        g.draw();
        formLine.style.left = String( g.area.x + Math.floor( offSet.left ) ) + "px";
        formLine.style.top = String( g.area.y + Math.floor( offSet.top + window.scrollY ) ) + "px";
        formLine.style.width = String( g.area.width ) + "px";
        formLine.style.height = String( g.area.height ) + "px";
        point.left = Math.floor( offSet.left ) + g.area.x;
        point.top = Math.floor( offSet.top + window.scrollY ) + g.area.y;

        // moving graph test
        /*
        const tmpCvs = document.getElementById( "temporaryCanvas" );
        tmpCvs.remove();
        */
    }

    function hoverCanvas( event ) {
        event.preventDefault();
    }

