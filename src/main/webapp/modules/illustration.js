/**
 * 
 */
import { setBegin, setEnd, setMove } from "./draw_graph.js";
import { getActive, lostActive, moveGraph, keyboardMove, setMoveGraphEnd, hoverCanvas, getCursorPoint } from "./move_graph.js";
import { Graphic, ImageGraphic, TextGraphic, Area } from "./canvas_graphics.js";

class Illustration {
    static RECTANGLE = "RectButton";
    static TEXT = "TextButton";
    static MOVE_GRAPH = "MoveButton";
    static IMAGE = "ImageButton";
    static MENU = "Graphic-Menu";

    static LOST_ACTIVE = 0;
    static ACTIVE = 1;

    static GraphicType = {
        [ Illustration.RECTANGLE ] : Graphic,
        "UNDEFINED" : null
    };
    static MenuList = [
        { actionType: Illustration.ACTIVE, eventHandler: copy, value: "コピー" },
        { actionType: Illustration.ACTIVE, eventHandler: cut, value: "切り取り" },
        { actionType: Illustration.LOST_ACTIVE, eventHandler: paste, value: "貼り付け" }
    ];
    static reservedButtons = [
        Illustration.RECTANGLE,
        Illustration.TEXT,
        Illustration.MOVE_GRAPH,
        Illustration.IMAGE
    ];

    graphicObject = [];
    #copyGraphic = null;
    #point = new Object();
    #canvas;
//    #canvasImage;
    #graphicInterface;
    #currentImage;
    #currentImageType;
    #activeIndex = -1;
    #eventObject;
    #formLine;
    #contextMenu;
    #currentTextbox;
    #imageTextbox;
    #fileSelector;
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
            { name: Illustration.IMAGE, illust: this, handleEvent: function( event ) { setImage( event, this.illust, this.name ) } },
            { name: Illustration.MOVE_GRAPH, illust: this, handleEvent: function( event ) { moveGraphSettings( event, this.illust, this.name ) } },
            { name: "FileSelector", illust: this, handleEvent: function( event ) { fileSelect( event, this.illust, this.name ) } },
            { name: "GetFileName", illust: this, handleEvent: function( event ) { setImageFile( event, this.illust, this.name ) } },
            { name: "Cancel", illust: this, handleEvent: function( event ) { cancelFileSelect( event, this.illust, this.name ) } },
            { name: "LoadImage", illust: this, handleEvent: function( event ) { loadImage( event, this.illust, this.name ) } },
            { name: "SetBegin", illust: this, handleEvent: function( event ) { setBegin( event, this.illust ) } },
            { name: "SetMove", illust: this, handleEvent: function( event ) { setMove( event, this.illust ) } },
            { name: "SetEnd", illust: this, handleEvent: function( event ) { setEnd( event, this.illust ) } },
            { name: "GetActive", illust: this, handleEvent: function( event ) { getActive( event, this.illust ) } },
            { name: "DragStart", illust: this, handleEvent: function( event ) { getCursorPoint( event, this.illust ) } },
            { name: "MoveGraph", illust: this, handleEvent: function( event ) { moveGraph( event, this.illust ) } },
            { name: "MoveGraphEnd", illust: this, handleEvent: function( event ) { setMoveGraphEnd( event, this.illust ) } },
            { name: "KeyboardMove", illust: this, handleEvent: function( event ) { keyboardMove( event, this.illust ) } },
            { name: "ContextMenu", illust: this, handleEvent: function( event ) { showContextMenu( event, this.illust, Illustration.LOST_ACTIVE ) } },
            { name: "TargetContextMenu", illust: this, handleEvent: function( event ) { showContextMenu( event, this.illust, Illustration.ACTIVE ) } },
            { name: "ClickMenu", illust: this, handleEvent: function( event ) { clickMenuList( event, this.illust ) } },
            { name: "LostFocus", illust: this, handleEvent: function( event ) { lostFocus( event, this.illust ) } }
        ];

        this.#formLine.addEventListener( "contextmenu", this.eventFunction( "TargetContextMenu" ) );
        this.#canvas.addEventListener( "contextmenu", this.eventFunction( "ContextMenu" ) );
        document.addEventListener( "click", this.eventFunction( "LostFocus" ) );
        document.addEventListener( "contextmenu", this.eventFunction( "LostFocus" ) );
    }
    
    eventFunction( name ) {
        const index = this.#eventObject.findIndex( obj => obj.name == name );
        return this.#eventObject[ index ];
    }

    setButton( btnId, btnType ) {
		this.#buttonName.push( { id: btnId, name: btnType } );
        const btn = document.getElementById( btnId );
        btn.classList.add( "Button-Preference" );
        btn.addEventListener( "click", this.eventFunction( btnType ) );
    }

    setTextButton( btnId, textboxId ) {
		this.#buttonName.push( { id: btnId, name: Illustration.TEXT } );
        const btn = document.getElementById( btnId );
        btn.classList.add( "Button-Preference" );
        this.#currentTextbox = document.getElementById( textboxId );
        btn.addEventListener( "click", this.eventFunction( Illustration.TEXT ) );
    }

    setImageButton( btnId, fileSelectorId, textboxId ) {
        this.#buttonName.push( { id: btnId, name: Illustration.IMAGE } );
        const btn = document.getElementById( btnId );
        btn.classList.add( "Button-Preference" );
        this.#imageTextbox = document.getElementById( textboxId );
        this.#fileSelector = document.getElementById( fileSelectorId );
        btn.addEventListener( "click", this.eventFunction( Illustration.IMAGE ) );
        this.#fileSelector.addEventListener( "click", this.eventFunction( "FileSelector" ) );
        this.#fileSelector.addEventListener( "change", this.eventFunction( "GetFileName" ) );
        this.#fileSelector.addEventListener( "cancel", this.eventFunction( "Cancel" ) );
    }

    deleteAllSettings() {
        this.#graphicInterface.fillStyle = "#fff"
        this.#graphicInterface.fillRect( 0, 0, this.#canvas.width, this.#canvas.height );
        this.#graphicInterface.strokeStyle = "#000";
        this.#graphicInterface.lineWidth = "10px";
        this.#graphicInterface.save();

        this.#deleteDrawSettings();
        this.#deleteMoveGraphSettings();

        for( const name of Illustration.reservedButtons ) {
            const button = document.getElementById( this.getButtonId( name ) );
            button.removeEventListener( "click", this.eventFunction( name ) );
        }
        this.#fileSelector.removeEventListener( "click", this.eventFunction( "FileSelector" ) );
        this.#fileSelector.removeEventListener( "change", this.eventFunction( "GetFileName" ) );
        this.#fileSelector.removeEventListener( "cancel", this.eventFunction( "Cancel" ) );

        const buttons = document.querySelectorAll( ".Press-Button" );
        for( const button of buttons ) {
            this.#switchButtonStatus( button );
        }

        this.#formLine.removeEventListener( "contextmenu", this.eventFunction( "TargetContextMenu" ) );
        this.#canvas.removeEventListener( "contextmenu", this.eventFunction( "ContextMenu" ) );
        document.removeEventListener( "click", this.eventFunction( "LostFocus" ) );
        document.removeEventListener( "contextmenu", this.eventFunction( "LostFocus" ) );

//        const parent = document.getElementById( "Right-Side" );
        const parent = this.#canvas.parentElement;
        parent.removeChild( this.#formLine );
        parent.removeChild( this.#contextMenu );
    }
    restoreAllSettings() {
        for( const name of Illustration.reservedButtons ) {
            const button = document.getElementById( this.getButtonId( name ) );
            button.addEventListener( "click", this.eventFunction( name ) );
        }
        this.#fileSelector.addEventListener( "click", this.eventFunction( "FileSelector" ) );
        this.#fileSelector.addEventListener( "change", this.eventFunction( "GetFileName" ) );
        this.#fileSelector.addEventListener( "cancel", this.eventFunction( "Cancel" ) );


        for( const graphic of this.graphicObject ) {
            graphic.draw( this.#graphicInterface );
        }

        this.#formLine.addEventListener( "contextmenu", this.eventFunction( "TargetContextMenu" ) );
        this.#canvas.addEventListener( "contextmenu", this.eventFunction( "ContextMenu" ) );
        document.addEventListener( "click", this.eventFunction( "LostFocus" ) );
        document.addEventListener( "contextmenu", this.eventFunction( "LostFocus" ) );
        
        this.#canvas.insertAdjacentHTML( "beforebegin", "<div id=\"formLine\" ></div><div id=\"contextMenu\" ></div>" );
        this.#formLine = document.getElementById( "formLine" );
        this.#contextMenu = document.getElementById( "contextMenu" );
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
        this.#formLine.addEventListener( "dragend", this.eventFunction( "MoveGraphEnd" ) );
        document.body.addEventListener( "keydown", this.eventFunction( "KeyboardMove" ) );
    }

    #deleteMoveGraphSettings() {
        this.#canvas.removeEventListener( "click", this.eventFunction( "GetActive" ) );
        this.#formLine.removeEventListener( "dragstart", this.eventFunction( "DragStart") );
        this.#formLine.removeEventListener( "drag", this.eventFunction( "MoveGraph" ) );
        this.#canvas.removeEventListener( "dragover", hoverCanvas );
        this.#formLine.removeEventListener( "dragover", hoverCanvas );
        this.#canvas.removeEventListener( "dragend", this.eventFunction( "MoveGraphEnd" ) );
        document.body.removeEventListener( "keydown", this.eventFunction( "KeyboardMove" ) );
    }

    getFormLine() {
        return this.#formLine;
    }
    getContextMenu() {
        return this.#contextMenu;
    }
    getCanvas() {
        return this.#canvas;
    }
    /*
    getCanvasImage() {
        return this.#canvasImage;
    }
    */
    getGraphic( index ) {
        return this.graphicObject[ index ];
    }

    getGraphics() {
        return this.graphicObject;
    }
    
    getCopyGraphic() {
        return this.#copyGraphic;
    }
    getGraphicInterface() {
        return this.#graphicInterface;
    }
    getButtonName( btnId ) {
		const index = this.#buttonName.findIndex( btn => btn.id == btnId );
        return this.#buttonName[ index ].name;
	}
    getButtonId( btnName ) {
        const index = this.#buttonName.findIndex( btn => btn.name == btnName );
        return this.#buttonName[ index ].id;
    }
	
    setActiveIndex( curPoint ) {
        for( let i = this.graphicObject.length - 1; i >= 0; i-- ) {
            let g = this.graphicObject[ i ];
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
        this.graphicObject[ this.#activeIndex ].getArea().setX( left );
        this.graphicObject[ this.#activeIndex ].getArea().setY( top );
        if( this.graphicObject[ this.#activeIndex ] instanceof TextGraphic ) {
			this.graphicObject[ this.#activeIndex ].setOutlineX( left );
			this.graphicObject[ this.#activeIndex ].setOutlineY( top );
		}
    }
    repaint() {
        this.#graphicInterface.fillRect( 0, 0, this.#canvas.width, this.#canvas.height );
        for( let i = 0; i < this.graphicObject.length; i++ ) {
            if( this.#activeIndex != i ) {
                this.graphicObject[ i ].draw( this.#graphicInterface );
            }
        }    
    }
    setPoint( x, y ) {
        this.#point.x = Math.floor( x );
        this.#point.y = Math.floor( y );
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
        });
    }
    setButtonStatus( event, name ) {
        const buttons = document.querySelectorAll( ".Press-Button" );

        for( let i = 0; i < buttons.length; i++ ) {
            const btnName = this.getButtonName( buttons[ i ].id );
            if( btnName == name ) {
                this.#switchButtonStatus( buttons[ i ] );
                return false;
            } else if( btnName != Illustration.TEXT && name != Illustration.TEXT ) {
                if( btnName == Illustration.MOVE_GRAPH || name == Illustration.MOVE_GRAPH ) {
                    this.#clearButtonStatus();
                    break;
                } else if( btnName == Illustration.IMAGE || name == Illustration.IMAGE ) {
                    this.#clearButtonStatus();
                    break;
                }
                // unset button
                this.#switchButtonStatus( buttons[ i ] );
                break;
            } else if( btnName == Illustration.MOVE_GRAPH || name == Illustration.MOVE_GRAPH ) {
                this.#clearButtonStatus();
                break;
            } else if( btnName == Illustration.IMAGE || name == Illustration.IMAGE ) {
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
            	this.graphicObject.push( graphic );
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
            if( area != null ) {
                const graphic = new TextGraphic( area, this.#currentTextbox.value, Illustration.GraphicType[ this.#textOutline ], this.#graphicInterface );
                graphic.draw( this.#graphicInterface );
                this.graphicObject.push( graphic );    
            }
        }
    }

    setImage() {
        this.#drawSettings();
        this.#drawFormLine = function() {
            this.#formLine.style.border = "1px solid black";
        }
        this.#draw = function( point, w, h ) {
            const area = registerRect( point, w, h );
            if( area != null ) {
                const graphic = new ImageGraphic( area, this.#currentImage.src, this.#currentImageType );
                graphic.draw( this.#graphicInterface );
                this.graphicObject.push( graphic );
            }
        }
    }
    callDrawFormLine( ) {
        this.#drawFormLine( );
    }
    callDraw( point, w, h ) {
        this.#draw( point, w, h );
        //   this.saveImage();
    }

    copy( ) {
        console.log( "たぬきち：「コピーします！」" );
        const graphic = this.getGraphic( this.getActiveIndex() );

        switch( graphic.getClassName() ) {
            case "TextGraphic":
                this.#copyGraphic = new TextGraphic( graphic.getArea(), graphic.getText(), graphic.getOutline(), this.#graphicInterface );
                break;
            case "ImageGraphic":
				this.#copyGraphic = new ImageGraphic( graphic.getArea(), graphic.getImage().src, graphic.getImageType() );
				break;
            case "Graphic":
                this.#copyGraphic = new Graphic( graphic.getArea() );
                break;
            default:
        }
    }

    cut( ) {
        console.log( "たぬきち：「切り取りましょうか(;ﾟロﾟ)」" );
        const graphic = this.getGraphic( this.getActiveIndex() );
        switch( graphic.getClassName() ) {
            case "TextGraphic":
                this.#copyGraphic = new TextGraphic( graphic.getArea(), graphic.getText(), graphic.getOutline(), this.#graphicInterface );
                break;
            case "ImageGraphic":
				this.#copyGraphic = new ImageGraphic( graphic.getArea(), graphic.getImage().src, graphic.getImageType() );
				break;
            case "Graphic":
                this.#copyGraphic = new Graphic( graphic.getArea() );
                break;
            default:
        }
        this.#formLine.style.cssText = "";
        document.body.style.cssText = "";
        this.repaint();
        this.graphicObject.splice( this.#activeIndex, 1 );
        //   this.saveImage();
    }

    paste() {
        console.log( "たぬきち：「貼り付けます(^0^)/」" );
        this.#copyGraphic.setX( this.#point.x );
        this.#copyGraphic.setY( this.#point.y );
        switch( this.#copyGraphic.getClassName() ) {
            case "TextGraphic":
                this.#copyGraphic.setOutlineX( this.#point.x );
                this.#copyGraphic.setOutlineY( this.#point.y );
                this.graphicObject.push( this.#copyGraphic );
                this.#copyGraphic = new TextGraphic( this.#copyGraphic.getArea(), this.#copyGraphic.getText(), this.#copyGraphic.getOutline(), this.#graphicInterface );
                this.#copyGraphic.setOutlineX( this.#point.x );
                this.#copyGraphic.setOutlineY( this.#point.y );
                break;
            case "ImageGraphic":
				this.graphicObject.push( this.#copyGraphic );
				this.#copyGraphic = new ImageGraphic( this.#copyGraphic.getArea(), this.#copyGraphic.getImage().src, this.#copyGraphic.getImageType() );
				break;
            default:
                this.graphicObject.push( this.#copyGraphic );
                this.#copyGraphic = new Graphic( this.#copyGraphic.getArea() );
                break;
        }
        this.#copyGraphic.draw( this.#graphicInterface );
        //   this.saveImage();
    }
/*
    async saveImage() {
        try {
//            this.#canvasImage = await canvasToBlob( this.#canvas );
            this.#canvasImage = await createBlob( this.#canvas, "image/png" );
        } catch( error ) {
            console.error( "error: ", error );
        }
    }
    */

    cancelFileSelect( event ) {
        const files = event.target.files;
        if( files.length == 0 ) {
            this.unsetDraw();
            this.#clearButtonStatus();
        }
    }
    setFileName( event ) {
        const files = event.target.files;

        if( files.length > 0 ) {
			const filename = files[ 0 ].name;
            this.#imageTextbox.value = filename;
            const fileType = filename.substring( filename.lastIndexOf( "." ) + 1, filename.length );
            this.#currentImageType = "image/" + fileType;
            const reader = new FileReader();
            reader.readAsDataURL( files[ 0 ] );
            reader.addEventListener( "load", this.eventFunction( "LoadImage" ) );    
        } else {
            this.unsetDraw();
            this.#clearButtonStatus();
        }
    }
    resetTextbox() {
        this.#imageTextbox.value = "";
    }
    setImageSource( event ) {
        this.#currentImage = new Image();
        this.#currentImage.src = event.target.result;
    }

    sendClickEvent() {
        const myEvent = new Event( "click" );
        this.#fileSelector.dispatchEvent( myEvent );
    }
}

function fileSelect( event, illust, name ) {
    event.target.click();
}

function cancelFileSelect( event, illust, name ) {
    illust.cancelFileSelect( event );
}

function setImageFile( event, illust, name ) {
    illust.setFileName( event );
}

function loadImage( event, illust, name ) {
    illust.setImageSource( event );
}

function moveGraphSettings( event, illust, name ) {
    if( illust.setButtonStatus( event, name ) ) {
        illust.setMoveGraph();
    } else {
        illust.unsetMoveGraph();
    }
}

function setImage( event, illust, name ) {
    lostActive( event, illust );

    if( illust.setButtonStatus( event, name ) ) {
        illust.sendClickEvent();
        illust.setImage();
    } else {
        illust.unsetDraw();
        illust.resetTextbox();
    }
}

function setText( event, illust, name ) {
    lostActive( event, illust );
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
    lostActive( event, illust );
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

function setContextMenuList( menu, value ) {
    const menuList = document.createElement( "li" );
    const menuName = document.createElement( "span" );
    menuName.innerText = value;
    menuList.className = Illustration.MENU;
    menuList.appendChild( menuName );
    menu.appendChild( menuList );
}


function showContextMenu( event, illust, actionType ) {
	event.preventDefault();
    const offSet = event.target.getBoundingClientRect();
    const canvasX = event.clientX - offSet.left;
    const canvasY = event.clientY - offSet.top;
    illust.setPoint( canvasX, canvasY );
    const menu = illust.getContextMenu();
    menu.innerHTML = "";
    for( const item of Illustration.MenuList ) {
        setContextMenuList( menu, item.value );
    }
    const x = Math.floor( event.clientX + window.scrollX );
    const y = Math.floor( event.clientY + window.scrollY );
    const width = 200;
    const height = 180;

    const list = document.querySelectorAll( "." + Illustration.MENU );
    list.forEach( async ( value ) => {
        const index = Illustration.MenuList.findIndex( item => item.value == value.innerText );
        const clipboardFlag = ( ( illust.getCopyGraphic() != null && actionType != Illustration.ACTIVE ) || actionType == Illustration.ACTIVE ) ? true : false;
        const flag = Illustration.MenuList[ index ].actionType == actionType && clipboardFlag;
        const menuName = value.querySelector( "span" );
        menuName.style.color = flag ? "black" : "darkgray";
        value.style.marginBottom = "8px";
        value.style.borderRadius = "1px";
        value.style.paddingLeft = "10px";
        value.style.boxShadow = "2px 2px 4px", "-1px -1px 2px";
        value.style.backgroundColor = flag ? "aliceblue" : "lightgray";
        value.style.cursor = "default";
        value.style.userSelect = "none";
        value.style.lineHeight = "30px";
        if( flag ) {
            value.addEventListener( "mouseover", hoverMenuList );
            value.addEventListener( "mouseleave", leaveMenuList );
            value.addEventListener( "mousedown", mousedownMenuList );
            value.addEventListener( "click", illust.eventFunction( "ClickMenu" ) );    
        }
    } );

  
    menu.style.padding = "10px 10px 10px 10px";
    menu.style.listStyleType = "none";
    menu.style.borderRadius = "5px";
    menu.style.boxShadow = "3px 5px 4px, -1px -1px 3px";
    menu.style.zIndex = 100;
    menu.style.position = "absolute";
    menu.style.width = String( width ) + "px";
    menu.style.height = String( height ) + "px";
    menu.style.backgroundColor = "rgb(225, 240, 255)";
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

function deleteContextMenu( event, illust ) {
    const menu = illust.getContextMenu();
    const list = document.querySelectorAll( "." + Illustration.MENU );
    if( list.length == 0 ) {
        return;
    }
    list.forEach( value => {
        value.removeEventListener( "mouseover", hoverMenuList );
        value.removeEventListener( "mouseleave", leaveMenuList );
        value.removeEventListener( "mousedown", mousedownMenuList );
        value.removeEventListener( "click", illust.eventFunction( "ClickMenu" ) );
    });
    menu.style.cssText = "";
    menu.innerHTML = "";
}

function hoverMenuList() {
    this.style.backgroundColor = "lightblue";
}
function leaveMenuList() {
    this.style.backgroundColor = "aliceblue";
}
function mousedownMenuList() {
    this.style.backgroundColor = "rgb(114, 197, 224)";
    this.style.fontColor = "white";
}
function clickMenuList( event, illust) {
    deleteContextMenu( event, illust );
    for( const item of Illustration.MenuList ) {
        if( event.target.innerText == item.value ) {
            item.eventHandler( event, illust );
        }
    }
}
function copy( event, illust ) {
    illust.copy();
}
function cut( event, illust ) {
    illust.cut();
}
function paste( event, illust ) {
    illust.paste();
}

function lostFocus( event, illust ) {
    const buttons = document.querySelectorAll( ".Press-Button" );
    let name = ( buttons.length > 0 ) ? illust.getButtonName( buttons[ 0 ].id ) : null;
    if( name == Illustration.MOVE_GRAPH ) {
        if( event.target.closest( "#" + illust.getContextMenu().id ) ) {
            // select menu
        } else if( event.type == "contextmenu" && event.target.contains( illust.getFormLine() ) ) {
            showContextMenu( event, illust, Illustration.ACTIVE );
        } else if( event.type == "contextmenu" && event.target.contains( illust.getCanvas() ) ) {
            lostActive( event, illust );
            showContextMenu( event, illust, Illustration.LOST_ACTIVE );
        } else {
            lostActive( event, illust );
            deleteContextMenu( event, illust, Illustration.LOST_ACTIVE );
        }
    } else {
        if( event.target.closest( "#" + illust.getContextMenu().id ) ) {
            event.preventDefault();
            // select menu
        } else if( event.type == "contextmenu" && event.target.contains( illust.getCanvas() ) ) {
            showContextMenu( event, illust, Illustration.LOST_ACTIVE );
        } else {
            deleteContextMenu( event,illust, Illustration.LOST_ACTIVE );
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