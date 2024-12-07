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
    #contextMenu;
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

        this.#canvas.insertAdjacentHTML( "beforebegin", "<div id=\"formLine\" ></div><div id=\"contextMenu\" ></div>" );
        this.#formLine = document.getElementById( "formLine" );
        this.#contextMenu = document.getElementById( "contextMenu" );

        this.#eventObject = [
            { name: Illustration.RECTANGLE, illust: this, handleEvent: function( event ) { setDraw( event, this.illust, this.name ) } },
            { name: Illustration.TEXT, illust: this, handleEvent: function( event ) { setText( event, this.illust, this.name ) } },
            { name: Illustration.MOVE_GRAPH, illust: this, handleEvent: function( event ) { moveGraphSettings( event, this.illust, this.name ) } },
            { name: "SetBegin", illust: this, handleEvent: function( event ) { setBegin( event, this.illust ) } },
            { name: "SetMove", illust: this, handleEvent: function( event ) { setMove( event, this.illust ) } },
            { name: "SetEnd", illust: this, handleEvent: function( event ) { setEnd( event, this.illust ) } },
            { name: "GetActive", illust: this, handleEvent: function( event ) { getActive( event, this.illust ) } },
            { name: "DragStart", illust: this, handleEvent: function( event ) { getCursorPoint( event, this.illust ) } },
            { name: "MoveGraph", illust: this, handleEvent: function( event ) { moveGraph( event, this.illust ) } },
            { name: "MoveGraphEnd", illust: this, handleEvent: function( event ) { setMoveGraphEnd( event, this.illust ) } },
            { name: "ContextMenu", illust: this, handleEvent: function( event ) { showContextMenu( event, this.illust ) } },
            { name: "LostFocus", illust: this, handleEvent: function( event ) { lostFocus( event, this.illust ) } }
        ];

        this.#canvas.addEventListener( "contextmenu", this.eventFunction( "ContextMenu" ) );
        document.addEventListener( "click", this.eventFunction( "LostFocus" ) );
        document.addEventListener( "contextmenu", this.eventFunction( "LostFocus" ) );
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
    }

    #deleteMoveGraphSettings() {
        this.#canvas.removeEventListener( "click", this.eventFunction( "GetActive" ) );
        this.#formLine.removeEventListener( "dragstart", this.eventFunction( "DragStart") );
        this.#formLine.removeEventListener( "drag", this.eventFunction( "MoveGraph" ) );
        this.#canvas.removeEventListener( "dragover", hoverCanvas );
        this.#formLine.removeEventListener( "dragover", hoverCanvas );
        this.#canvas.removeEventListener( "dragend", this.eventFunction( "MoveGraphEnd" ) );
    }

    getFormLine() {
        return this.#formLine;
    }
    getContextMenu() {
        return this.#contextMenu;
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
    #clearButtonStatus() {
        const buttons = document.querySelectorAll( ".Press-Button" );
        buttons.forEach( btn => {
            btn.classList.remove( "Press-Button" );
            btn.classList.add( "Button-Preference" );
        })
    }
    setButtonStatus( event, name ) {
        const buttons = document.querySelectorAll( ".Press-Button" );

        for( let i = 0; i < buttons.length; i++ ) {
            if( this.#buttonName[ buttons[ i ].id ] == name ) {
                this.#switchButtonStatus( buttons[ i ] );
                return false;
            } else if( this.#buttonName[ buttons[ i ].id ] != Illustration.TEXT && name != Illustration.TEXT ) {
                if( this.#buttonName[ buttons[ i ].id ] == Illustration.MOVE_GRAPH || name == Illustration.MOVE_GRAPH ) {
                    this.#clearButtonStatus();
                    break;
                }
                // unset button
                this.#switchButtonStatus( buttons[ i ] );
                break;
            } else if( this.#buttonName[ buttons[ i ].id ] == Illustration.MOVE_GRAPH || name == Illustration.MOVE_GRAPH ) {
                this.#clearButtonStatus();
                break;
            }
        }
        this.#switchButtonStatus( event.target );
        return true;
    }

    setMoveGraph() {
        this.#deleteDrawSettings();
        this.#moveGraphSettings();
    }
    unsetMoveGraph() {
        this.#deleteMoveGraphSettings();
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
            if( area != null ) {
            	const graphic = new ( Illustration.GraphicType[ name ] )( area );
            	graphic.draw( this.#graphicInterface );
            	this.#graphicObject.push( graphic );
			}
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

    showContextMenu( left, top ) {
		this.#contextMenu.style.zIndex = 100;
        this.#contextMenu.style.left = String( left ) + "px";
        this.#contextMenu.style.top = String( top ) + "px";
        this.#contextMenu.style.width = "100px";
        this.#contextMenu.style.height = "100px";
        this.#contextMenu.style.backgroundColor = "blue";
        this.#contextMenu.style.position = "absolute";
    }
}

function moveGraphSettings( event, illust, name ) {
    if( illust.setButtonStatus( event, name ) ) {
        illust.setMoveGraph();
    } else {
        illust.unsetMoveGraph();
    }
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

function showContextMenu( event, illust ) {
	event.preventDefault();
    const menu = illust.getContextMenu();
    menu.innerHTML = "<li class=\"Graphic-Menu\" >コピー</li>"
                   + "<li class=\"Graphic-Menu\" >切り取り</li>"
                   + "<li class=\"Graphic-Menu\" >貼り付け</li>"
                   + "<li class=\"Graphic-Menu\" >画像貼り付け</li>";
    menu.style.cssText = "";
    const x = Math.floor( event.clientX + window.scrollX );
    const y = Math.floor( event.clientY + window.scrollY );
    const width = 200;
    const height = 150;

    const list = document.querySelectorAll( ".Graphic-Menu" );
    list.forEach( value => {
       // top, right, bottom, left
        value.style.margin = "10px 10px 10px 10px";
        value.style.borderBottom = "2px solid rgb( 150, 140, 200 )";
    });

    menu.style.listStyleType = "none";
    menu.style.borderRadius = "5px";
    menu.style.boxShadow = "3px 5px 4px, -1px -1px 3px";
    menu.style.zIndex = 100;
    menu.style.position = "absolute";
    menu.style.width = String( width ) + "px";
    menu.style.height = String( height ) + "px";
    menu.style.backgroundColor = "rgb( 240, 240, 240 )";
    const rightRange = window.innerWidth - event.clientX
    const bottomRange = window.innerHeight - event.clientY;

    if( bottomRange > height ) {
        menu.style.top = String( y ) + "px";
    } else {
        menu.style.top = String( y - height ) + "px";
    }
    if( rightRange > width ) {
        menu.style.left = String( x ) + "px";
    } else {
        menu.style.left = String( x - width ) + "px";
    }
}

function lostFocus( event, illust ) {
    const buttons = document.querySelectorAll( ".Press-Button" );
    const name = illust.getButtonName( buttons[ 0 ].id );
    console.log( name );
    if( name == Illustration.MOVE_GRAPH ) {
        if( event.type == "contextmenu" && event.target.contains( illust.getFormLine() ) ) {
            showContextMenu( event, illust );
        } else {
            lostActive( event, illust );
        }
    }
    
    if( !event.target.closest( illust.getContextMenu().id ) && event.type == "click" ) {
        const menu = illust.getContextMenu();
        menu.style.cssText = "";
        menu.innerHTML = "";
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
    } else {
		return null;
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