/**
 * 
 */
// canvas_graphics.js
// the definition of  Graphic Object.
class Graphic {
    area;

    constructor( area ) {
        this.area = new Area();
        this.area.setX( area.getX() );
        this.area.setY( area.getY() );
        this.area.setWidth( area.getWidth() );
        this.area.setHeight( area.getHeight() );
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
    draw( graphicContext ) {
      graphicContext.strokeRect( this.area.getX(), this.area.getY(), this.area.getWidth(), this.area.getHeight() );
    }
    getClassName() {
      if( this instanceof TextGraphic ) {
        return "TextGraphic";
      } else {
        return "Graphic";
      }
    }
  }
  
class TextGraphic extends Graphic {
  font;
  textAlign;
  fillStyle;
  #outlineClass;
  #text;
  #outline;
  
  constructor( area, text, outlineClass, graphicContext ) {
    super( area );
    this.font = "25px Meiryo";
    this.textAlign = "left";
    this.fillStyle = "#000";
    this.#text = text;
    this.#outlineClass = outlineClass;
    this.#setOutline( outlineClass );
    this.#calculateSize( graphicContext );
  }

  getText() {
    return this.#text;
  }
  getOutline() {
    return this.#outlineClass;
  }
	
  #setOutline( graphicType ) {
    if( graphicType != null ) {
      this.#outline = new graphicType( this.area );
    } else {
      this.#outline = null;
    }
  }
    
  setOutlineX( x ) {
		if( this.#outline != null ) {
			this.#outline.setX( x );
		}
	}
	setOutlineY( y ) {
		if( this.#outline != null ) {
			this.#outline.setY( y );
		}
	}
  #calculateSize( graphicContext ) {
    graphicContext.save();
    graphicContext.font = this.font;

    const textMetrics = graphicContext.measureText( this.#text );

    if( textMetrics.width > this.area.getWidth() ) {
      this.area.setWidth( Math.floor( textMetrics.width ) );
    }
      
    graphicContext.restore();
  }

  draw( graphicContext ) {
    this.#calculateSize( graphicContext );
    graphicContext.save();
    graphicContext.font = this.font;
    const textMetrics = graphicContext.measureText( this.#text );
    const textQuoteHeight = Math.floor( ( textMetrics.fontBoundingBoxAscent + textMetrics.fontBoundingBoxDescent ) / 4 );
    const halfHeight = Math.floor( this.area.getHeight() / 2 );
    const x = Math.floor( this.area.getX() + ( this.area.getWidth() - textMetrics.width ) / 2 );
    const y = Math.floor( this.area.getY() + halfHeight + textQuoteHeight );


    graphicContext.textAlign = "left";
    graphicContext.fillStyle = "#000";
    graphicContext.beginPath();
    graphicContext.fillText( this.#text, x, y );
    graphicContext.restore();
    if( this.#outline != null ) {
      this.#outline.draw( graphicContext );
    }
  }
}
  
  
  
  class Area {
    #x;
    #y;
    #width;
    #height;
    setArea( x, y, w, h ) {
      this.#x = x;
      this.#y = y;
      this.#width = w;
      this.#height = h;
    }
    getX() {
      return this.#x;
    }
    setX( x ) {
        this.#x = x;
    }
    getY() {
      return this.#y;
    }
    setY( y ) {
        this.#y = y;
    }
    getWidth() {
      return this.#width;
    }
    setWidth( w ) {
        this.#width = w;
    }
    getHeight() {
      return this.#height;
    }
    setHeight( h ) {
        this.#height = h;
    }
  }
export { Graphic, TextGraphic, Area };