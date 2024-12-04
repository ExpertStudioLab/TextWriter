/**
 * 
 */
import { setBegin, setEnd, setMove } from "../draw_graph.js";
import { getActive, lostActive, moveGraph, setMoveGraphEnd, hoverCanvas, getCursorPoint } from "../move_graph.js";
import { Graphic, TextGraphic, Area } from "../modules/canvas_graphics.js";

class Illustration {
    static RECTANGLE = "RectButton";
    static TEXT = "TextButton";
    static MOVE_GRAPH = "MoveButton";

    static GraphicType = {
        [ Illustration.RECTANGLE ] : Graphic,
        "UNDEFINED" : null
    };

    #graphicObject = [];
    #canvas;
    #graphicInterface;
    #activeIndex = -1;
    #eventObject;
    #formLine;
    #currentTextbox;
    #textOutline = "UNDEFINED";
    #buttonName = [];

    #drawFormLine;
    #draw;

    constructor( canvasId ) {
        this.#canvas = document.getElementById( canvasId );
        this.#graphicInterface = this.#canvas.getContext( "2d" );
        this.#graphicInterface.fillStyle = "#fff"
        this.#graphicInterface.fillRect( 0, 0, this.#canvas.width, this.#canvas.height );
        this.#graphicInterface.strokeStyle = "#000";
        this.#graphicInterface.lineWidth = "10px";
        this.#graphicInterface.save();

        this.#canvas.insertAdjacentHTML( "beforebegin", "<div id=\"formLine\" ></div>" );
        this.#formLine = document.getElementById( "formLine" );

        this.#eventObject = [
            { name: Illustration.RECTANGLE, illust: this, handleEvent: function( event ) { setDraw( event, this.illust, this.name ) } },
            { name: Illustration.TEXT, illust: this, handleEvent: function( event ) { setText( event, this.illust, this.name ) } },
            { name: Illustration.MOVE_GRAPH, illust: this, handleEvent: function( event ) { moveGraphSettings( event, this.illust ) } },
            { name: "SetBegin", illust: this, handleEvent: function( event ) { setBegin( event, this.illust ) } },
            { name: "SetMove", illust: this, handleEvent: function( event ) { setMove( event, this.illust ) } },
            { name: "SetEnd", illust: this, handleEvent: function( event ) { setEnd( event, this.illust ) } },
            { name: "GetActive", illust: this, handleEvent: function( event ) { getActive( event, this.illust ) } },
            { name: "DragStart", illust: this, handleEvent: function( event ) { getCursorPoint( event, this.illust ) } },
            { name: "MoveGraph", illust: this, handleEvent: function( event ) { moveGraph( event, this.illust ) } },
            { name: "MoveGraphEnd", illust: this, handleEvent: function( event ) { setMoveGraphEnd( event, this.illust ) } },
            { name: "LostActive", illust: this, handleEvent: function( event ) { lostActive( event, this.illust ) } }
        ];
    }
    
    eventFunction( name ) {
        const index = this.#eventObject.findIndex( obj => obj.name == name );
        return this.#eventObject[ index ];
    }

    setButton( btnId, btnType ) {
        this.#buttonName[ btnId ] = btnType;
        const btn = document.getElementById( btnId );
        btn.classList.add( "Button-Preference" );
        btn.addEventListener( "click", this.eventFunction( btnType ) );
    }

    setTextButton( btnId, textboxId ) {
        this.#buttonName[ btnId ] = Illustration.TEXT;
        const btn = document.getElementById( btnId );
        this.#currentTextbox = document.getElementById( textboxId );
        btn.addEventListener( "click", this.eventFunction( "TextButton" ) );
    }

    #drawSettings() {
        this.#deleteMoveGraphSettings();
        this.#formLine.style.cssText = "";
        this.#canvas.addEventListener( "mousedown", this.eventFunction( "SetBegin" ) );
        document.body.addEventListener( "mousemove", this.eventFunction( "SetMove" ) );
        document.body.addEventListener( "mouseup", this.eventFunction( "SetEnd" ) );    
    }
    
    #deleteDrawSettings() {
        this.#canvas.removeEventListener( "mousedown", this.eventFunction( "SetBegin" ) );
        document.body.removeEventListener( "mousemove", this.eventFunction( "SetMove" ) );
        document.body.removeEventListener( "mouseup", this.eventFunction( "SetEnd" ) );
    }

    #moveGraphSettings() {
        this.#canvas.addEventListener( "click", this.eventFunction( "GetActive" ) );
        this.#formLine.addEventListener( "dragstart", this.eventFunction( "DragStart" ) );
        this.#formLine.addEventListener( "drag", this.eventFunction( "MoveGraph" ) );
        this.#canvas.addEventListener( "dragover", hoverCanvas );
        this.#formLine.addEventListener( "dragover", hoverCanvas );
        this.#formLine.addEventListener( "dragend", this.eventFunction( "MoveGraphEnd" ));
        document.addEventListener( "click", this.eventFunction( "LostActive" ) );
        document.addEventListener( "contextmenu", this.eventFunction( "LostActive" ) );
    }

    #deleteMoveGraphSettings() {
        this.#canvas.removeEventListener( "click", this.eventFunction( "GetActive" ) );
        this.#formLine.removeEventListener( "dragstart", this.eventFunction( "DragStart") );
        this.#formLine.removeEventListener( "drag", this.eventFunction( "MoveGraph" ) );
        this.#canvas.removeEventListener( "dragover", hoverCanvas );
        this.#formLine.removeEventListener( "dragover", hoverCanvas );
        this.#canvas.removeEventListener( "dragend", this.eventFunction( "MoveGraphEnd" ) );
        document.removeEventListener( "click", this.eventFunction( "LostActive" ) );
        document.removeEventListener( "contextmenu", this.eventFunction( "LostActive" ) )

    }

    getFormLine() {
        return this.#formLine;
    }
    getGraphic( index ) {
        return this.#graphicObject[ index ];
    }
    getGraphicInterface() {
        return this.#graphicInterface;
    }
    getButtonName( btnId ) {
		return this.#buttonName[ btnId ];
	}
    setActiveIndex( curPoint ) {
        for( let i = this.#graphicObject.length - 1; i >= 0; i-- ) {
            let g = this.#graphicObject[ i ];
            if( ( g.getArea().getX() <= curPoint.getX() ) && ( curPoint.getX() <= ( g.getArea().getX() + g.getArea().getWidth() ) )
                    && ( g.getArea().getY() <= curPoint.getY() ) && ( curPoint.getY() <= ( g.getArea().getY() + g.getArea().getHeight() ) ) ) {
                this.#activeIndex = i;
                return i;
            }
        }    
    }
    getActiveIndex() {
        return this.#activeIndex;
    }
    setGraphicPosition( left, top ) {
        this.#graphicObject[ this.#activeIndex ].getArea().setX( left );
        this.#graphicObject[ this.#activeIndex ].getArea().setY( top );
        if( this.#graphicObject[ this.#activeIndex ] instanceof TextGraphic ) {
			this.#graphicObject[ this.#activeIndex ].setOutlineX( left );
			this.#graphicObject[ this.#activeIndex ].setOutlineY( top );
		}
    }
    repaint() {
        this.#graphicInterface.fillRect( 0, 0, this.#canvas.width, this.#canvas.height );
        for( let i = 0; i < this.#graphicObject.length; i++ ) {
            if( this.#activeIndex != i ) {
                this.#graphicObject[ i ].draw( this.#graphicInterface );
            }
        }    
    }
    setTextOutline( name ) {
        this.#textOutline = name;
    }
    deleteTextOutline() {
        this.#textOutline = "UNDEFINED";
    }

    #switchButtonStatus( btn ) {
        if( btn.classList.contains( "Press-Button" ) ) {
            btn.classList.remove( "Press-Button" );
            btn.classList.add( "Button-Preference" );
        } else {
            btn.classList.remove( "Button-Preference" );
            btn.classList.add( "Press-Button" );
        }
    }
    setButtonStatus( event, name ) {
        const buttons = document.querySelectorAll( ".Press-Button" );

        for( let i = 0; i < buttons.length; i++ ) {
            if( this.#buttonName[ buttons[ i ].id ] == name ) {
                this.#switchButtonStatus( buttons[ i ] );
                return false;
            }
        }
        if( buttons.length == 2 ) {
            for( let i = 0; i < buttons.length; i++ ) {
                if( this.#buttonName[ buttons[ i ].id ] != Illustration.TEXT ) {
                    this.#switchButtonStatus( buttons[ i ] );
                }
            }
        }

        this.#switchButtonStatus( event.target );
        return true;
    }

    setMoveGraph() {
        this.#deleteDrawSettings();
        this.#moveGraphSettings();
    }

    unsetDraw() {
        this.#deleteDrawSettings();
    }
    setDraw( name ) {
        this.#drawSettings();
        this.#drawFormLine = function() {
            this.#formLine.style.border = "1px solid black";
        }
        this.#draw = function( point, w, h ) {
            const area = registerRect( point, w, h );
            const graphic = new ( Illustration.GraphicType[ name ] )( area );
            graphic.draw( this.#graphicInterface );
            this.#graphicObject.push( graphic );
        }
    }

    setText() {
        this.#drawSettings();
        this.#drawFormLine = function() {
            this.#formLine.style.border = "1px solid black";
        }
        this.#draw = function( point, w, h ) {
            const area = registerRect( point, w, h );
            const graphic = new TextGraphic( area, this.#currentTextbox.value, this.#graphicInterface );
            graphic.setOutline( Illustration.GraphicType[ this.#textOutline ] );
            graphic.draw( this.#graphicInterface );
            this.#graphicObject.push( graphic );
        }

    }
    callDrawFormLine( ) {
        this.#drawFormLine( );
    }
    callDraw( point, w, h ) {
        this.#draw( point, w, h );
    }

}

function moveGraphSettings( event, illust ) {
    illust.setMoveGraph();
}

function setText( event, illust, name ) {
    if( illust.setButtonStatus( event, name ) ) {
        console.log( "setText" );
        illust.setText();
    } else {
        const buttons = document.querySelectorAll( ".Press-Button" );
        if( buttons.length == 0 ) {
			console.log( "unsetText" );
			
            illust.unsetDraw();
        } else if( buttons.length == 1 ) {
			console.log( "setDraw" );
			illust.setDraw( illust.getButtonName( buttons[ 0 ].id ) );
		}
    }
}

function setDraw( event, illust, name ) {
    if( illust.setButtonStatus( event, name ) ) {
        illust.setTextOutline( name );
        if( document.querySelectorAll( ".Press-Button" ).length == 1 ) {
			console.log( "setDraw" );
            illust.setDraw( name );
        }
    } else {
        illust.deleteTextOutline();
        if( document.querySelectorAll( ".Press-Button" ).length == 0 ) {
			console.log( "unsetDraw" );
            illust.unsetDraw();
        }
    }
}

    
function registerRect( point, w, h ) {
    const area = new Area();
    let rectX, rectY;
    if( Math.sign( w ) == -1 ) {
        w = Math.abs( w );
        rectX = Math.floor( point.getX() - w );
    } else {
        rectX = Math.floor( point.getX() );
    }

    if( Math.sign( h ) == -1 ) {
        h = Math.abs( h );
        rectY = Math.floor( point.getY() - h );
    } else {
        rectY = Math.floor( point.getY() );
    }

    if( w != 0 && h != 0 ) {
        area.setArea( rectX, rectY, w, h );
    }
    return area;
}


class Point {
    #x;
    #y;
    constructor( x, y ) {
        this.#x = x;
        this.#y = y;
    }

    getX() {
        return this.#x;
    }

    getY() {
        return this.#y;
    }
}


export { Illustration, Point };