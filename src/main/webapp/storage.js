

   // { num : 0 } means "history.state.num = 0".
   history.pushState( { num : 0 }, null, window.location.href );
   // on update widow, make the servlet program to process orders previous values
   window.addEventListener( "DOMContentLoaded", ()=> {
      storeState();
      init();
   });
   // on browzer back, ... 
   window.addEventListener( "popstate", ()=> {
      storeState();
      // because a page will get old, update to present status.
      // create a new tag menus list. but recent delete commands are canceled.( permit button had not clicked.)
      window.location.reload();
   });

   function storeState() {
      var url = new URL( window.location.href );
      var params = url.searchParams;
      params.delete( "num" );
      params.delete( "end" );
      history.replaceState( "", "", url.pathname );
   }

   function setTitle( vals ) {
      sessionStorage.setItem( "hTitle", vals.title );
      sessionStorage.setItem( "tag-name", vals.tagName );
   }

   function getTitle( ) {
      const vals = { title : sessionStorage.getItem( "hTitle" ),
                     tagName : sessionStorage.getItem( "tag-name" ) };
      return vals;
   }


     // create form to send values to the servlet
     function sendValue( vName, vValue ) { 
		const formObj = document.getElementById( "send" );
		const inputEl = document.createElement( "input" );
		inputEl.type = "hidden";
		inputEl.name = vName;
		inputEl.value = vValue;
		formObj.appendChild( inputEl );
   }