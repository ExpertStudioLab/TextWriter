
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

   const selectEl = document.getElementById( "Tag-El" );
   let i = selectEl.length - 1;
   let startIndex = 0;

   if( i == 0 ) {
      sessionStorage.setItem( "index", "0" );
   } else {
      i = parseInt( sessionStorage.getItem( "index" ) );
      startIndex = i;
   }

   function popupAddTagWnd() {
    window.open( "DialogBox/add_tag.html", "タグの追加", "width=300,height=199,top=200,left=550" );
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