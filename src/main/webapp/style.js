
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
	   // get an element of section title space
		const title_context = document.getElementById( title_id );
		// set canvas width to be larger 40 px than this section title space 
		var str = canvas_id + "{ width: " + String( title_context.clientWidth + 40 ) + "px;}";
		// insert <style> tag into <head> tag
		const styleEl = document.createElement( "style" );
		document.head.appendChild( styleEl );
		const styleSheet = styleEl.sheet;
		// insert into top of style tag
		styleSheet.insertRule( str, 0 );
   }

// プルダウン・ボックスの要素を取得するテスト
/*
var ops = [];
var cnt = 0;
const sel = document.getElementById( "Tag-El" );
for( const option of sel.options ) {
	ops[cnt] = option.label;
	alert( ops[cnt]);
	cnt += 1;
}
*/

	// the number of dropdown list menu into i
   const selectEl = document.getElementById( "Tag-El" );
   let i = selectEl.length - 1;
   // the storage position of additional tag menus in order
   let startIndex = 0;

	// the Array of tag menus is empty
   if( i == 0 ) {
      sessionStorage.setItem( "index", "0" );
    // the Array contains tag menus
   } else {
      i = parseInt( sessionStorage.getItem( "index" ) );
      startIndex = i;
   }

	// [Add tag menu] button has been pushed
   function popupAddTagWnd() {
    window.open( "DialogBox/add_tag.html", "タグの追加", "width=300,height=199,top=200,left=550" );
   }

	// get an additional tag menu from [Add tag menu] Window
   function getData( data ) {
	   	// put an additional tag menu into pull-down menu box
		 const selectObj = document.getElementById( "Tag-El" );
		 const optionEl = document.createElement( "option" );
		optionEl.text = data;
		optionEl.value  = data;
		selectObj.appendChild( optionEl );
		// send an additional tag menu to the servlet program   
		const formObj = document.getElementById( "send" );
		const inputEl = document.createElement( "input" );
		inputEl.type = "hidden";
		inputEl.name = "new-tag" + String( i );
		inputEl.id = String( i );
		inputEl.value = data;
		formObj.appendChild( inputEl );
		i += 1;
   }
   // send a start index of Array Object
   function addIndex() {
         const j = parseInt( sessionStorage.getItem( "index" ) );
         if( i > j ) {
   			const formObj = document.getElementById( "send" );
	   		const inputEl = document.createElement( "input" );
		   	inputEl.type = "hidden";
			inputEl.name = "num";
			inputEl.id = "number";
			inputEl.value = String( i );
			formObj.appendChild( inputEl );

	   		const inputEl2 = document.createElement( "input" );
		   	inputEl2.type = "hidden";
			inputEl2.name = "start-index";
			inputEl2.id = "in";
			inputEl2.value = String( startIndex );
			formObj.appendChild( inputEl2 );

            sessionStorage.setItem( "index", String( i ) );
         }
   }