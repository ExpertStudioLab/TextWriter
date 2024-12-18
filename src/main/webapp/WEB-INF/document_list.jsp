<?xml version="1.0" encoding="UTF-8" ?>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<style>
	body {
		margin: 0 auto auto auto;
		padding: 30px 0 30px 10px;
		border: solid 30px cornflowerblue;
	}
	#Title {
		margin: 20px 5% 0 5%;
		padding: 10px 0 10px 30px;
		background-color: burlywood;
		border-bottom: 10px solid black;
	}
	h1 {
		line-height: 0;
	}
</style>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Insert title here</title>
</head>
<body>
	<div id="Title">
		<h1>ドキュメント一覧</h1>
	</div>
	<div id="Document-List">
	</div>
	<script type="text/javascript" src="${pageContext.request.contextPath}/setting.js"></script>
	<script>
		async function init() {
			console.log( "DocumentList" );
			const data =  await receiveData( "Count" );
			const length = parseInt( data.count );
			const docData = await receiveData( "Get-Record" );
			for( let i = 0; i < length; i++ ) {
				const tmp = docData[ i ];
				const div = document.createElement( "div" );
				div.id = "Div" + String( i + 1 );
				div.draggable = true;
				const record = document.createElement( "span" );
				record.id = String( i + 1 );
				record.innerText = tmp.tag + " " + tmp.title + " " + tmp.section + " " + tmp.column;
				const list = document.getElementById( "Document-List" );
				div.appendChild( record );
				list.appendChild( div );
				div.addEventListener( "dragstart", dragStart );
				div.addEventListener( "dragend", dragEnd );
				div.addEventListener( "drag", dragRecord );
			}
		}

		function dragStart( event ) {
			event.target.style.backgroundColor = "blue";
		}
		function dragEnd( event ) {
			event.target.style.backgroundColor = "white";
		}
		function dragRecord( event ) {
			
		}
		
		async function receiveData( process ) {
			const myHeaders = new Headers();
			myHeaders.append( "Process", "List" );
			myHeaders.append( "Option", process );
			
			const myRequest = new Request( "storage", {
				method: "GET",
				headers: myHeaders
			});

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
	</script>	
</body>
</html>