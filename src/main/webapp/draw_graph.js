






/**
 * 
 */
    // use on reducing processes
    let state = -1;
    // save a point position
    let point = new Object();
    // array of graphics which are inputted from user.
    let graphics = [];

    // the method which shows guideline to draw graphics.
    let preview;
    // the method which sets border-line of formLine div.
    let drawRectLine;
    // the method which draws graphics on drag ends.
    let draw;
    // show guideline when draw picture.
    const formLine = document.getElementById( "drawRect" );
    
    // graphic object
    const cvs = document.getElementById( "Image" );
    const graph = cvs.getContext( "2d" );
    // buttons
    const rectBtn = document.getElementById( "Rect" );
    const textBtn = document.getElementById( "Text" );
    const logBtn = document.getElementById( "Log" );

    // text label
    const textLabel = document.getElementById( "Text-Label" );

    graph.fillStyle = "#fff"
    graph.fillRect( 0, 0, cvs.width, cvs.height );
    graph.strokeStyle = "#000";
    graph.lineWidth = "10px";
    graph.save();

    // selected drawing actions
    function drawSettings( ) {
        deleteMoveGraphSettings();
        graph.restore();
        formLine.style.cssText = "";
        cvs.addEventListener( "mousedown", setBegin );
        document.body.addEventListener( "mousemove", setMove );
        document.body.addEventListener( "mouseup", setEnd );    
    }
    // setting of buttons
    rectBtn.addEventListener( "click", drawGraphSettings );
    textBtn.addEventListener( "click", drawGraphSettings );
    logBtn.addEventListener( "click", showlog );

    // setting for drawing rectangles
    function drawGraphSettings( event ) {
        const id = event.target.id;
        drawSettings( );
        switch( id ) {
            case "Rect":
            case "Text":
                drawRectLine = function() {
                    formLine.style.border = "1px solid black";
                };
                break;
        }

        preview = function( w, h ) {
            formLine.style.width = String( Math.floor( w ) ) + "px";
            formLine.style.height = String( Math.floor( h ) ) + "px";    
        };


        if( id == "Rect" ) {
            draw = function( w, h ) {
                const area = registerRect( w, h );
                const graphic = new Graphic( area );
                graphic.setContext( graph );
                graphic.draw();
                graphics.push( graphic );
            }
        } else if( id == "Text" ) {
            draw = function( w, h ) {
                const area = registerRect( w, h );
                const graphic = new TextGraphic( area, textLabel.value );
                graphic.setContext( graph );
                graphic.draw();

                // register Graphic Object
                graphics.push( graphic );
            }
        }

    }

    function registerRect( w, h ) {
        const area = new Area();
        if( Math.sign( w ) == -1 ) {
            w = Math.abs( w );
            point.rectX = Math.floor( point.x - w );
        } else {
            point.rectX = Math.floor( point.x );
        }

        if( Math.sign( h ) == -1 ) {
            h = Math.abs( h );
            point.rectY = Math.floor( point.y - h );
        } else {
            point.rectY = Math.floor( point.y );
        }

        if( w != 0 && h != 0 ) {
            area.setArea( point.rectX, point.rectY, w, h );
        }
        return area;
    }

    function showlog() {
        graphics.forEach( g => {
            console.log( "name: [ " + g.name + " ], area: x: [ " + g.area.x + " ], y: [ " + g.area.y + " ], width: [ " + g.area.width + " ], height: [ " + g.area.height + " ]" );
        });
    }

    function deleteMoveGraphSettings() {
        cvs.removeEventListener( "click", getActive );
        formLine.removeEventListener( "dragstart", getCursorPoint );
        formLine.removeEventListener( "drag", moveGraph );
        cvs.removeEventListener( "dragover", hoverCanvas );
        formLine.removeEventListener( "dragover", hoverCanvas );
        cvs.removeEventListener( "dragend", setMoveGraphEnd );
    }

let flag = false;
let invalidW = false;
let invalidH = false;
    function setBegin( event ) {
        event.preventDefault();
        if( !flag ) {
            point.offSet = event.target.getBoundingClientRect();
            point.x = event.clientX - point.offSet.left;
            point.y = event.clientY - point.offSet.top;
            formLine.style.position = "absolute";
            formLine.style.zIndex = 10;
            document.body.style.userSelect = "none";
            point.screenX = Math.floor( event.clientX );
            point.screenY = Math.floor( event.clientY + window.scrollY );
            formLine.style.left = String( point.screenX ) + "px";
            formLine.style.top = String( point.screenY ) + "px";
            point.absoluteX = point.offSet.left + point.x;
            point.absoluteY = point.offSet.top + point.y;
            flag = true;

            drawRectLine();
        }
    }

    function setMove( event ) {
        graph.restore();
        event.preventDefault();
        if( flag ) {
            let w  = event.clientX - point.absoluteX;
            let h = event.clientY - point.absoluteY;

            if( ( state ^ ( ( ( Math.sign( w ) == 1 ) ? 2 : 0 ) | ( ( Math.sign( h ) == 1 ) ? 1 : 0 ) ) ) == 0 ) {
                formLine.style.top = String( point.screenY + ( ( Math.sign( h ) == -1 ) ? h : 0 ) ) + "px";
                formLine.style.left = String( point.screenX + ( ( Math.sign( w ) == -1) ? w : 0 ) ) + "px";
                h = Math.abs( h );
                w = Math.abs( w );
            }else {
                if( Math.sign( w ) == -1 && Math.sign( h ) == -1 ) {
                    if( !invalidH || !invalidW ) {
                        invalidH = true;
                        invalidW = true;
                    }
                    formLine.style.top = String( point.screenY + h ) + "px";
                    formLine.style.left = String( point.screenX + w ) + "px";
                    h = Math.abs( h );
                    w = Math.abs( w );
                    state = 0;
                } else if( Math.sign( w ) == -1 ) {
                    if( !invalidW ) {
                        invalidW = true;
                    }
                    if( invalidH ) {
                        invalidH = false;
                        formLine.style.top = String( point.screenY ) + "px";
                    }
                    formLine.style.left = String( point.screenX + w ) + "px";
                    w = Math.abs( w );
                    state = 1;
                } else if( Math.sign( h ) == -1 ) {
                    if( !invalidH ) {
                        invalidH = true;
                    }
                    if( invalidW ) {
                        invalidW = false;
                        formLine.style.left = String( point.screenX ) + "px";
                    }
                    formLine.style.top = String( point.screenY + h ) + "px";
                    h = Math.abs( h );
                    state = 2;
                } else {
                    if( invalidW || invalidH ) {
                        invalidW = false;
                        invalidH = false;
                        formLine.style.left = String( point.screenX ) + "px";
                        formLine.style.top = String( point.screenY ) + "px";
                    }
                    state = 3;
                }
            }
            preview( w, h );
        }
    }
    function setEnd( event ) {
        event.preventDefault();
        let w, h;
        if( flag ) {
            flag = false;
            formLine.style.cssText = "";
            document.body.style.cssText = "";
            w  = event.clientX - point.offSet.left - point.x;
            h = event.clientY - point.offSet.top - point.y
            graph.restore();
            draw( Math.floor( w ), Math.floor( h ) );
        }
    }
