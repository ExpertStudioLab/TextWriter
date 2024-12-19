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
<title>Auto Text Writer</title>
</head>
<body>
	<div id="Title">
		<h1>ドキュメント一覧</h1>
	</div>
	<div id="Document-List">
	</div>
	<script type="text/javascript" src="${pageContext.request.contextPath}/setting.js"></script>
	<script type="module" src="${pageContext.request.contextPath}/create_document_list.js"></script>
	<script>
		async function init() {
			console.log( "DocumentList" );
			const data =  await receiveData( "Count" );
			const length = parseInt( data.count );
			const docData = await receiveData( "Get-Record" );
			let tag = null;
			let title = null;
			let section = null;
			let tagNumber = 1;
			let titleNumber = 1;
			let sectionNumber = 1;
			let columnNumber = 1;
			let changeTag = false;
			let changeTitle = false;
			for( let i = 0; i < length; i++ ) {
				const tmp = docData[ i ];
				const list = document.getElementById( "Document-List" );

				if( tmp.tag != tag ) {
					const tagDiv = document.createElement( "div" );
					tagDiv.id = "Tag" + String( tagNumber );
					tagDiv.style.margin = "5px 0 0 5%";
					tagNumber += 1;
					const contentDiv = document.createElement( "div" );
					const tagName = document.createElement( "span" );
					tagName.innerText = tmp.tag;
					tag = tmp.tag;
					contentDiv.appendChild( tagName );
					tagDiv.appendChild( contentDiv );
					list.appendChild( tagDiv );
					changeTag = true;
				}
				if( tmp.title != title || changeTag ) {
					const titleDiv = document.createElement( "div" );
					titleDiv.id = "Title" + String( titleNumber );
					titleDiv.style.margin = "5px 0 0 5%";
					titleNumber += 1;
					const contentDiv = document.createElement( "div" );
					const titleName = document.createElement( "span" );
					titleName.innerText = tmp.title;
					title = tmp.title;
					contentDiv.appendChild( titleName );
					titleDiv.appendChild( contentDiv );
					const tagDiv = document.getElementById( "Tag" + String( tagNumber - 1 ) );
					tagDiv.appendChild( titleDiv );
					changeTag = false;
					changeTitle = true;
				}
				if( tmp.section != section || changeTitle ) {
					const sectionDiv = document.createElement( "div" );
					sectionDiv.id = "Section" + String( sectionNumber );
					sectionDiv.style.margin = "5px 0 0 5%";
					sectionNumber += 1;
					const contentDiv = document.createElement( "div" );
					const sectionName = document.createElement( "span" );
					sectionName.innerText = tmp.section;
					section = tmp.section;
					contentDiv.appendChild( sectionName );
					sectionDiv.appendChild( contentDiv );
					const titleDiv = document.getElementById( "Title" + String( titleNumber - 1 ) );
					titleDiv.appendChild( sectionDiv );
					changeTitle = false;
					columnNumber = 1;
				}
				const div = document.createElement( "div" );
				div.id = "Div" + String( columnNumber );
				div.style.cursor = "default";
				div.style.margin = "10px 0 10px 0";
				div.style.width = "fit-content";
				div.style.height = "fit-content";
				const record = document.createElement( "span" );
				record.id = String( i + 1 );

				record.innerText = tmp.column;
				const sectionDiv = document.getElementById( "Section" + String( sectionNumber - 1 ) );
				console.log( sectionDiv );
				div.appendChild( record );
				sectionDiv.appendChild( div );


				div.addEventListener( "mousedown", dragStart );
				div.addEventListener( "mouseup", mouseUp );
				div.addEventListener( "dragend", dragEnd );
//				div.addEventListener( "mousemove", dragRecord );
				div.addEventListener( "mouseleave", mouseLeave );
			}
		}
		document.body.addEventListener( "mouseup", mouseUp );
		document.body.addEventListener( "mousemove", dragRecord );


		const point = new Object();
		let drag = false;
		let leave = false;
		let target;
		function dragStart( event ) {
			target = event.target;
			const number = parseInt( event.target.id );
			let previousDiv = null;
			const width = event.target.parentElement.clientWidth;
			const height = event.target.parentElement.clientHeight;
			console.log( "( width, height ): ( " + width + ", " + height + " )" );

			drag = true;


			if( number > 1 ) {
				previousDiv = document.getElementById( "Div" + String( number - 1 ) );
			}
			if( previousDiv != null ) {
				const div = document.createElement( "div" );
				div.id = "Empty";
				const parentDiv = document.getElementById( "Div" + String( number ) );
				div.style.width = String( parentDiv.clientWidth ) + "px";
				div.style.height = String( parentDiv.clientHeight ) + "px";


				event.target.style.opacity = 0.5;
			event.target.style.position = "absolute";
			event.target.style.zIndex = 100;
			event.target.style.cursor = "default";
			document.body.style.userSelect = "none";



				previousDiv.insertAdjacentElement( "afterend", div );
			} else {

			}
			point.bounds = event.target.getBoundingClientRect();
			point.x = event.clientX;
			point.y = event.clientY;
			point.offSet = new Object();
			point.offSet.left = point.bounds.left;
			point.offSet.top = point.bounds.top - height - 10;

			event.target.style.left = String( Math.floor( point.offSet.left + window.scrollX ) );
			event.target.style.top = String( Math.floor( point.offSet.top + window.scrollY ) );

			console.log( "( x, y ): ( " + point.x + ", " + point.y + " )" );

		}
		function dragEnd( event ) {
			event.target.style.backgroundColor = "white";
			event.target.style.cursor = "default";
		}
		async function dragRecord( event ) {
			if( drag && event.target == target || leave ) {
				event.preventDefault();
			target.style.left = String( Math.floor( event.clientX - point.x + point.offSet.left + window.scrollX ) ) + "px";
			target.style.top = String( Math.floor( event.clientY - point.y + point.offSet.top + window.scrollY ) ) + "px";
			console.log( "( left, top ): ( " + event.target.style.left + ", " + event.target.style.top + " )" );
			}
		}
		function mouseUp( event ) {
			drag = false;
			leave = false;
			document.body.style.userSelect = "auto";
		}
		function mouseLeave( event ) {
			if( drag ) {
				leave = true;
				target.style.left = String( Math.floor( event.clientX - point.x + point.offSet.left + window.scrollX ) ) + "px";
				target.style.top = String( Math.floor( event.clientY - point.y + point.offSet.top + window.scrollY ) ) + "px";			
			}
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