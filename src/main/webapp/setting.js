window.addEventListener('pageshow', (event) => {
  if (event.persisted || performance.getEntriesByType("navigation")[0].type === 'back_forward') {
    location.reload();
  }
});
   // { num : 0 } means "history.state.num = 0".
 //  history.pushState( { num : 0 }, null, window.location.href );
   // on update widow, make the servlet program to process orders previous values
   window.addEventListener( "DOMContentLoaded", ()=> {
      storeState();
      init();
   });

   function storeState() {
      var url = new URL( window.location.href );
      history.replaceState( "", "", url.pathname  );
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
   
   	function receiveData( process ) {
			const myHeaders = new Headers();
			myHeaders.append( "Process", String( process ) );
			const myRequest = new Request( "/TextWriter/storage", {
			   method: "GET",
			   headers: myHeaders
		   });
		   try {
			   return window.fetch( myRequest ).then( response => {
				   if( !response.ok ) {
					   throw new Error( "response status: ${ response.status} ");
				   } else {
					   return response.json();
				   }
			   });
		   } catch( error ) {
			   console.error( error );
		   }
	}