import { Point } from "./modules/illustration.js";

/**
 * 
 */
    const point = new Object();


    function lostActive( event, illust ) {
        const formLine = illust.getFormLine();
		if( event.target.id != "Image1" || event.type == "contextmenu" ) {
			formLine.style.cssText = "";
			document.body.style.userSelect = "auto";
            const child = document.querySelectorAll( ".child" );
            if( child.length > 0 ) {
                child.forEach( element => formLine.removeChild( element ) );
            }

		}
	}
    
    function getActive( event, illust ) {
        const formLine = illust.getFormLine();
        event.preventDefault();
        point.offSet = event.target.getBoundingClientRect();
        const curPoint = new Object();
        curPoint.x = event.clientX - point.offSet.left;
        curPoint.y = event.clientY - point.offSet.top;
        const pos = new Point( curPoint.x, curPoint.y );
        const movingGraphIndex = illust.setActiveIndex( pos );
        if( movingGraphIndex != null ) {
            formLine.style.position = "absolute";
            formLine.style.zIndex = "10";
            document.body.style.userSelect = "none";
            formLine.style.backgroundColor = "rgba(32, 46, 155, 0.301)";
            const g = illust.getGraphic( movingGraphIndex );
            point.left = Math.floor( point.offSet.left + window.scrollX ) + g.getArea().getX() + 2;
            formLine.style.left = String( point.left ) + "px";
            point.top = Math.floor( point.offSet.top + window.scrollY ) + g.getArea().getY() + 2;
            formLine.style.top = String( point.top ) + "px";
            formLine.style.width = String( g.getArea().getWidth() ) + "px";
            formLine.style.height = String( g.getArea().getHeight() ) + "px";
            formLine.draggable = "true";
            formLine.style.cursor = "all-scroll";

            const child = document.querySelectorAll( ".child" );
            if( child.length > 0 ) {
                child.forEach( element => formLine.removeChild( element ) );
            }

            const div = document.createElement( "div" );
            div.className = "child";
            div.style.cssText = "top: -4px; left: -4px; position: absolute;";
            div.style.width = "12px";
            div.style.height = "12px";
            div.style.top = "-7px";
            div.style.left = String( Math.floor( g.getArea().getWidth() / 2 ) - 6 ) + "px";
            div.style.backgroundColor = "rgba(255,0,0,1.0)";
            formLine.appendChild( div );
        }
    }
    function getCursorPoint( event, illust ) {
        illust.repaint();
        point.x = 0;
        point.y = 0;
        point.dragStartX = event.clientX;
        point.dragStartY = event.clientY;

    }
    function moveGraph( event, illust ) {
        const x = Math.floor( event.clientX - point.dragStartX );
        const y = Math.floor( event.clientY - point.dragStartY );
        const formLine = illust.getFormLine();
        formLine.style.left = String( point.left + x ) + "px";
        formLine.style.top = String( point.top + y ) + "px";
    }
    function keyboardMove( event, illust ) {
        event.preventDefault();
        switch( event.key ) {
            case "ArrowUp":
                point.dragStartY -= 1;
                point.top -= 1;
                break;
            case "ArrowDown":
                point.dragStartY += 1;
                point.top += 1;
                break;
            case "ArrowLeft":
                point.dragStartX -= 1;
                point.left -= 1;
                break;
            case "ArrowRight":
                point.dragStartX += 1;
                point.left += 1;
                break;
        }
        illust.repaint();
        setMoveGraphEnd( event,illust );
    }

    function setMoveGraphEnd( event, illust ) {
        let left, top;
        if( event.clientX != undefined ) {
            const disX = event.clientX - point.dragStartX;
            left = Math.floor( point.left + disX - point.offSet.left );
            const disY = event.clientY - point.dragStartY;
            top = Math.floor( point.top + disY - point.offSet.top - window.scrollY );    
        } else {
            left = point.left - Math.floor( point.offSet.left + window.scrollX ) - 2;
            top = point.top - Math.floor( point.offSet.top + window.scrollY ) - 2;
            console.log( "( left, top ): ( " + left + ", " + top + " )" );
        }
        const index = illust.getActiveIndex();
        const formLine = illust.getFormLine();

        illust.setGraphicPosition( left, top );
        const g = illust.getGraphic( index );
        g.draw( illust.getGraphicInterface() );
        point.left = Math.floor( point.offSet.left ) + g.getArea().getX() + 2;
        point.top = Math.floor( point.offSet.top + window.scrollY ) + g.getArea().getY() + 2;
        formLine.style.left = String( point.left ) + "px";
        formLine.style.top = String( point.top ) + "px";
        formLine.style.width = String( g.getArea().getWidth() ) + "px";
        formLine.style.height = String( g.getArea().getHeight() ) + "px";
    }

    function hoverCanvas( event ) {
        event.preventDefault();
    }
export { lostActive, getActive, getCursorPoint, moveGraph, keyboardMove, setMoveGraphEnd, hoverCanvas };