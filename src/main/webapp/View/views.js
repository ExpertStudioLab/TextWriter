/**
 * 
 */

    function drawSectionHeader( Canvas ) {
    var cvs = document.querySelector( Canvas );
    var graph = cvs.getContext( "2d" );

    graph.strokeStyle="#a9a9a9";
    graph.lineWidth = 40;
    graph.beginPath();
    graph.moveTo( 0, 0);
    graph.lineTo( 400, 200);
    graph.stroke();

    graph.fillStyle = "#fff8dc";
    graph.beginPath();
    graph.moveTo( 0, 5);
    graph.lineTo( 395, 200);
    graph.lineTo( 0, 200 );
    graph.fill();
    }

   function setCanvas( title_id, canvas_id ) {
	   // get size of a title name, and add 40 px space.
		const title_context = document.getElementById( title_id );
		var str = canvas_id + "{ width: " + String( title_context.clientWidth + 40 ) + "px;}";
		// set a status with style element in head element.
		const styleEl = document.createElement( "style" );
		document.head.appendChild( styleEl );
		const styleSheet = styleEl.sheet;
		styleSheet.insertRule( str );
   }
