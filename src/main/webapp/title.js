/**
 * 
 */
	const selectEl = document.getElementById( "Tag-El" );
	const textOp = document.getElementById( "Title-Name" );

	function init() {
		textOp.addEventListener( "input", inputChange );
	}

    function inputChange( event ) {
        const btnOp = document.getElementById( "permit" );
        btnOp.disabled = ( event.currentTarget.value == "" );
    }

	// [Add tag menu] button has been pushed
   function popupAddTagWnd() {
    window.open( "DialogBox/add_tag.html", "タグの追加", "width=300,height=199,top=200,left=550" );
   }
   // [Delete tag ment] button has been pushed
   function popupDelTagWnd() {
	   window.open( "DialogBox/del_tag.html", "タグの削除", "width=300,height=199,top=200,left=550" );
	}

   function appendOption( data ) {
	   	const optionEl = document.createElement( "option" );
		optionEl.text = data;
		optionEl.value = data;
		selectEl.appendChild( optionEl );
   }
   // send a start index of Array Object and an end index
   function sendTitle() {
         sendValue( "title", String( textOp.value ) );
         sendValue( "tag-name", String( selectEl.value ) );	  
   }
   
   // send tag menus to Delete Tag Window
   function sendMenu() {
	   return selectEl;
   }

   // delete tag menu by index
   function delMenu( delIndex ) {
		selectEl.remove( parseInt( delIndex ) + 1  );

   }