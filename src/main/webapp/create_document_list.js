/**
 * 
 */
import { DocumentList } from "./modules/document_list.js";
window.addEventListener( "DOMContentLoaded", createDocumentList );

async function createDocumentList() {
    const data =  await receiveData( "Count" );
    const length = parseInt( data.count );
    const docData = await receiveData( "Get-Record" );
    let changeTag = false;
    let changeTitle = false;
    let tag = null;
    let title = null;
    let section = null;

    const list = document.getElementById( "Document-List" );
    const documentList = new DocumentList( list );
    for( let i = 0; i < length; i++ ) {
        const tmp = docData[ i ];
        if( tmp.tag != tag ) {
            documentList.appendElement( "Tag", tmp.tag );
            tag = tmp.tag;
            changeTag = true;
        }
        if( tmp.title != title || changeTag ) {
            documentList.appendElement( "Title", tmp.title );
            title = tmp.title;
            changeTag = false;
            changeTitle = true;
        }
        if( tmp.section != section || changeTitle ) {
            documentList.appendElement( "Section", tmp.section );
            section = tmp.section;
            changeTitle = false;
        }
        const div = documentList.appendElement( "Column", tmp.column );
    
        div.addEventListener( "mousedown", dragStart );
        const columns = documentList.getColumns();
        for( const column of columns ) {
//            column.addEventListener( "click", linkDocument );
        }
    }
}

function linkDocument( event ) {
    event.target.style.color = "skyblue";
}
document.body.addEventListener( "mouseup", mouseUp );
document.body.addEventListener( "mousemove", dragRecord );
document.body.addEventListener( "mouseleave", mouseUp );

const point = new Object();
let drag = false;
let insertDiv = false;
let lost = false;

let target = null;
let targetDiv = null;
let spaceDiv = null;
let spaceRect = new Object();
let lineHalfHeight;
let offSet;
let className;
function dragStart( event ) {
    if( event.target.tagName != "SPAN" ) return;    
    target = event.target;
    targetDiv = event.target.parentElement.parentElement;
    lineHalfHeight = Math.floor( targetDiv.clientHeight / 2 );
    className = targetDiv.className;
    offSet = Math.floor( targetDiv.clientHeight / 5 );
    const parent = targetDiv.parentElement;
    const id = event.target.id;
    console.log( "ID: " + id );
    const extraId = id.substring( 0, id.lastIndexOf( "_" ) + 1 );
    const number = parseInt( id.substring( id.lastIndexOf( "_" ) + 1, id.length ) );
    console.log( "number: " + number );
    let nextDiv = null;

    drag = true;

    const emptyDiv = document.createElement( "div" );
    emptyDiv.id = "Empty";
    emptyDiv.style.backgroundColor = "skyblue";
    emptyDiv.style.width = String( targetDiv.clientWidth ) + "px";
    emptyDiv.style.height = String( targetDiv.clientHeight ) + "px";

    nextDiv = document.getElementById( "Div" + extraId + String( number + 1 ) );
    switch( nextDiv ) {
        case null:
            parent.insertAdjacentElement( "beforeend", emptyDiv );
            break;
        default:
            nextDiv.insertAdjacentElement( "beforebegin", emptyDiv );
    }
    
    event.target.style.opacity = 0.5;
    targetDiv.className = "Move";
    targetDiv.style.position = "absolute";
    targetDiv.style.zIndex = 100;
    targetDiv.style.cursor = "default";
    document.body.style.userSelect = "none";

    point.bounds = event.target.getBoundingClientRect();
    point.x = event.clientX;
    point.y = event.clientY;
    point.targetRect = new Object();
    point.targetRect.left = Math.floor( point.bounds.left + window.scrollX );
    point.targetRect.top = Math.floor( point.bounds.top + window.scrollY );
    point.leftEnd = Math.floor( point.targetRect.left - targetDiv.clientWidth );
    point.rightEnd = Math.floor( point.targetRect.left + targetDiv.clientWidth );

    targetDiv.style.left = String( point.targetRect.left );
    targetDiv.style.top = String( point.targetRect.top );
}

let count = 0;
let checkCount = 0;
let lostRange = false;
function dragRecord( event ) {
    if( drag ) {
        const curLeft = Math.floor( event.clientX - point.x + point.targetRect.left );
        const curTop = Math.floor( event.clientY - point.y + point.targetRect.top );
        if( count == 2 ) {
            event.preventDefault();
            targetDiv.style.left = String( curLeft ) + "px";
            targetDiv.style.top = String( curTop ) + "px";
            count = 0;
            checkCount += 1;
        }
        if( !insertDiv && !lost && count == 1 ) {
            const y = Math.floor( curTop + offSet - window.scrollY );
            const elements = document.elementsFromPoint( point.targetRect.left, y );
            const index = elements.findIndex( element => element.className == className );
            if( index != -1 ) {
                const bounds = elements[ index ].getBoundingClientRect();

                spaceDiv = elements[ index ].querySelector( ".Space" );
                spaceDiv.style.backgroundColor = "red";

                spaceRect = {
                    top : Math.floor( bounds.top + window.scrollY ) + offSet * 2,
                    bottom : Math.floor( bounds.bottom + window.scrollY ) - offSet,
                };
                insertDiv = true;
            }
        } else if( !lost && insertDiv ) {
            if( ( curTop < spaceRect.top || curTop > spaceRect.bottom ||  curLeft < point.leftEnd || curLeft > point.rightEnd ) ){
                insertDiv = false;
                spaceDiv.style.backgroundColor = "white";
                spaceDiv = null;
                lost = true;
                if(  curLeft < point.leftEnd || curLeft > point.rightEnd ) {
                    lost = true;
                    lostRange = true;
                }
            }
        } else if( lost ) {
            const curBottom = curTop + lineHalfHeight * 2;
            if( ( curTop > spaceRect.top || curBottom < spaceRect.bottom ) && !lostRange ) {
                lost = false;
            } else if( ( curLeft >= point.leftEnd && curLeft <= point.rightEnd ) && lostRange ) {
                lost = false;
                lostRange = false;
            }
        }
        if( checkCount == 4 ) {
            checkCount = 0;
            if( curLeft < point.leftEnd || curLeft > point.rightEnd ) {
                if( insertDiv ) {
                    insertDiv = false;
                    spaceDiv.style.backgroundColor = "white";
                    spaceDiv = null;
                    lostRange = true;
                    lost = true;
                }
            }
        }
        count += 1;
    }
}

function mouseUp( event ) {
    drag = false;
    if( insertDiv ) {
        console.log( target.innerText );
        insertDiv = false;
        spaceDiv.style.backgroundColor = "white";
        spaceDiv = null;
    }
    if( target == null ) return;
    document.body.style.userSelect = "auto";
    const parent = targetDiv.parentElement;

    parent.removeChild( document.getElementById( "Empty" ) );
    targetDiv.className = className;
    targetDiv.style.position = "relative";
    targetDiv.style.left = "auto";
    targetDiv.style.top = "auto";
    targetDiv.style.zIndex = 0;
    const textElement = targetDiv.querySelector( "span" );
    textElement.style.opacity = 1.0;
    target = null;
    targetDiv = null;
}

async function receiveData( process ) {
    const myHeaders = new Headers();
    myHeaders.append( "Process", "List" );
    myHeaders.append( "Option", process );

    const myRequest = new Request( "storage", {
        method: "GET",
        headers: myHeaders
    } );

    try {
        const response = await window.fetch( myRequest );
        if( !response.ok ) {
            throw new Error( "Network Error Occurred." );
        } else {
            return response.json();
        }
    
    } catch( error ) {
        console.log( error );
    }
}
