
import { Point  } from "./illustration.js";
/**
 * 
 */
    // use on reducing processes
    let state = -1;
    // save a point position
    let point = new Object();

    export let graphics = [];

let flag = false;
let invalidW = false;
let invalidH = false;
    function setBegin( event, illust ) {
        event.preventDefault();
        if( !flag ) {
            const formLine = illust.getFormLine();
            point.offSet = event.target.getBoundingClientRect();
            // ( point.x, point.y ) on canvas
            point.x = event.clientX - point.offSet.left;
            point.y = event.clientY - point.offSet.top;
            formLine.style.position = "absolute";
            formLine.style.zIndex = 10;
            document.body.style.userSelect = "none";
            point.screenX = Math.floor( event.clientX + window.scrollX );
            point.screenY = Math.floor( event.clientY + window.scrollY );
            formLine.style.left = String( point.screenX ) + "px";
            formLine.style.top = String( point.screenY ) + "px";
            point.absoluteX = event.clientX;
            point.absoluteY = event.clientY;
            flag = true;

            illust.callDrawFormLine();
        }
    }

    function setMove( event, illust ) {
//        graph.restore();
        event.preventDefault();
        const formLine = illust.getFormLine();
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
            formLine.style.width = String( Math.floor( w ) ) + "px";
            formLine.style.height = String( Math.floor( h ) ) + "px";
        }
    }
    function setEnd( event, illust ) {
        event.preventDefault();
        const formLine = illust.getFormLine();
        let w, h;
        if( flag ) {
            flag = false;
            formLine.style.cssText = "";
            document.body.style.cssText = "";
            w  = event.clientX - point.offSet.left - point.x;
            h = event.clientY - point.offSet.top - point.y
            const pos = new Point( point.x, point.y );
            illust.callDraw( pos, Math.floor( w ), Math.floor( h ) );
        }
    }

    export { setBegin, setMove, setEnd };