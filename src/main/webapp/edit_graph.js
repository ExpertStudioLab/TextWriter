// canvas_graphics.js
// the definition of  Graphic Object.
class Graphic {
    area;
    graphicContext;
          
    constructor( area ) {
        this.area = new Area();
        this.area.x = area.getX();
        this.area.y = area.getY();
        this.area.width = area.getWidth();
        this.area.height = area.getHeight();
      }
  
    setContext( context ) {
      this.graphicContext = context;
    }
    getArea() {
        return this.area;
    }
    setX( x ) {
        this.area.setX( x );
    }
    setY( y ) {
        this.area.setY( y );
    }
    draw() {
      this.graphicContext.strokeRect( this.area.x, this.area.y, this.area.width, this.area.height );
    }

  }
  
  class TextGraphic extends Graphic {
    font;
    textAlign;
    fillStyle;
    text;
    textBottom;
  
    constructor( area, text ) {
        super( area );
        this.font = "25px Meiryo";
        this.textAlign = "left";
        this.fillStyle = "#000";
        this.text = text;
    }
    calculateSize() {
        this.graphicContext.save();
        this.graphicContext.font = this.font;

        const textMetrics = graph.measureText( this.text );
        const textHalfHeight = Math.floor( ( textMetrics.fontBoundingBoxAscent + textMetrics.fontBoundingBoxDescent ) / 4 );
        const halfHeight = Math.floor( this.area.height / 2 );
      
        if( halfHeight > textHalfHeight ) {
            this.textBottom = this.area.getY() + halfHeight + textHalfHeight;
        }
        else {
            this.textBottom = this.area.getY() + textHalfHeight;
        }
        this.area.setY( this.textBottom - textMetrics.fontBoundingBoxAscent );
        this.area.setHeight( this.textBottom + textMetrics.fontBoundingBoxDescent - this.area.y );
        this.area.setWidth( textMetrics.width );
        this.graphicContext.restore();
    }
    setContext( context ) {
        this.graphicContext = context;
        this.calculateSize();
    }
    setX( x ) {
        this.area.setX( x );
        this.calculateSize();
    }
    setY( y ) {
        this.area.setY( y );
        this.calculateSize();
    }
  
    draw() {
        this.graphicContext.save();
        this.graphicContext.font = this.font;
        this.graphicContext.textAlign = "left";
        this.graphicContext.fillStyle = "#000";
        this.graphicContext.beginPath();
        this.graphicContext.fillText( this.text, this.area.getX(), this.textBottom );
        this.graphicContext.restore();
    }
  }
  
  
  
  class Area {
    x;
    y;
    width;
    height;
    setArea( x, y, w, h ) {
      this.x = x;
      this.y = y;
      this.width = w;
      this.height = h;
    }
    getX() {
      return this.x;
    }
    setX( x ) {
        this.x = x;
    }
    getY() {
      return this.y;
    }
    setY( y ) {
        this.y = y;
    }
    getWidth() {
      return this.width;
    }
    setWidth( w ) {
        this.width = w;
    }
    getHeight() {
      return this.height;
    }
    setHeight( h ) {
        this.height = h;
    }
  }







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
            const g = graphics[ movingGraphIndex ];
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

