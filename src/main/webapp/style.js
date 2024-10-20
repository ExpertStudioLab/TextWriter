
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
   // the number of delete menus
   let delNum = 0;

	// the Array of tag menus is empty
   if( i == 0 ) {
      sessionStorage.setItem( "index", "0" );
    // the Array contains tag menus
   } else {
		if( sessionStorage.getItem( "index" ) != null ) {
	      i = parseInt( sessionStorage.getItem( "index" ) );
    	  startIndex = i;
		}
		else {
			sessionStorage.setItem( "index", "i" );
		}
   }

	// [Add tag menu] button has been pushed
   function popupAddTagWnd() {
    window.open( "DialogBox/add_tag.html", "タグの追加", "width=300,height=199,top=200,left=550" );
   }
   // [Delete tag ment] button has been pushed
   function popupDelTagWnd() {
	   window.open( "DialogBox/del_tag.html", "タグの削除", "width=300,height=199,top=200,left=550" );
	}

	// get an additional tag menu from [Add tag menu] Window
   function getData( data ) {
	   	// put an additional tag menu into pull-down menu box
//		 const selectObj = document.getElementById( "Tag-El" );
		const optionEl = document.createElement( "option" );
		optionEl.text = data;
		optionEl.value  = String( i );
		selectEl.appendChild( optionEl );
		// send an additional tag menu to the servlet program   
		sendValue( "new-tag" + String( i ), data );
		i += 1;
   }
   // send a start index of Array Object and an end index
   function addIndex() {
         const j = parseInt( sessionStorage.getItem( "index" ) );
         if( i > j ) {
			sendValue( "num", String( i ) );
			sendValue( "start-index", String( startIndex ) );
            sessionStorage.setItem( "index", String( i ) );
         }
		 if( delNum > 0 ) {
			sendValue( "end", String( delNum ) );
			sessionStorage.setItem( "index", String( i - delNum ) );
		 }
   }
let id = 0;
   // create form to send values to the servlet
   function sendValue( vName, vValue ) { 
		const formObj = document.getElementById( "send" );
		const inputEl = document.createElement( "input" );
		inputEl.type = "hidden";
		inputEl.name = vName;
		inputEl.value = vValue;
		inputEl.id = String( id );
		formObj.appendChild( inputEl );
		id += 1;
   }
   
   // send tag menus to Delete Tag Window
   function sendMenu() {
	   return selectEl;
   }

   // delete tag menu by index
   function delMenu( delIndex ) {
		selectEl.remove( parseInt( delIndex ) + 1  );
		sendValue( "del-menu" + String( delNum ), delIndex );
		delNum += 1;
   }