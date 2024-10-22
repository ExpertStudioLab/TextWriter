/**
 * 
 */
	// the number of dropdown list menu into i
   const selectEl = document.getElementById( "Tag-El" );
   const textOp = document.getElementById( "Title-Name" );
   let i = selectEl.length - 1;
   // the storage position of additional tag menus in order
   let startIndex = 0;
   // the number of delete menus
   let delNum = 0;


   sessionStorage.setItem( "index", String( i ) );

   if( i > 0 ) {
      startIndex = parseInt( sessionStorage.getItem( "index" ) );
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
		const optionEl = document.createElement( "option" );
		optionEl.text = data;
		optionEl.value = data;
		selectEl.appendChild( optionEl );
		// send an additional tag menu to the servlet program   ex. new-tag0, new-tag1, ...
		sendValue( "new-tag" + String( i ), data );
		i += 1;
   }
   // send a start index of Array Object and an end index
   function addIndex() {
      if( i > startIndex ) {
			sendValue( "num", String( i ) );
			sendValue( "start-index", String( startIndex ) );
      }
		 if( delNum > 0 ) {
			sendValue( "end", String( delNum ) );
		 }
       sessionStorage.setItem( "index", String( i - delNum ) );
       if( String( textOp.value ) != "" ) {
         const vals = { title : String( textOp.value ),
                        tagName : String( selectEl.value )};
         setTitleStorage( vals );
         sendValue( "title", "true" );
       }
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