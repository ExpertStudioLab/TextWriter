/**
 * 
 */
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
