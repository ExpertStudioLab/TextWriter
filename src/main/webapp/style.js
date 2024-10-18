
    function drawSectionHeader( Canvas, Section ) {
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
    const title_context = document.getElementById( title_id );
    var str = canvas_id + "{ width: " + String( title_context.clientWidth + 40 ) + "px;}";
    const styleEl = document.createElement( "style" );
    document.head.appendChild( styleEl );
    const styleSheet = styleEl.sheet;
    styleSheet.insertRule( str, 0 );
   }

   const add_tag_btn = document.getElementById( "Add-Tag" );
   let dlgWnd;
   var tags = new String( "" );
   let i = 1;
   add_tag_btn.addEventListener( "click", popupAddTagWnd );

   function popupAddTagWnd() {
    const dlgWnd = window.open( "DialogBox/add_tag.html", "タグの追加", "width=300,height=199,top=200,left=550" );
   }

// タグ指定プルダウンボックス関連のコード   
   function getData( data ) {
	   if( data != "" ) {
		   const selectObj = document.getElementById( "Tag-El" );
		   const optionEl = document.createElement( "option" );
		   optionEl.text = data;
		   optionEl.value  = data;
		   selectObj.appendChild( optionEl );
		   
			const formObj = document.getElementById( "send" );
			const inputEl = document.createElement( "input" );
			inputEl.type = "hidden";
			inputEl.name = "new-tag" + String( i );
			inputEl.id = String( i );
			inputEl.value = data;
			formObj.appendChild( inputEl );
			i += 1;
	   }
   }
   
   function addInput() {
			const formObj = document.getElementById( "send" );
			const inputEl = document.createElement( "input" );
			inputEl.type = "hidden";
			inputEl.name = "num";
			inputEl.id = "number";
			inputEl.value = String( i - 1 );
			formObj.appendChild( inputEl );	
   }