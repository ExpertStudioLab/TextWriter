<?xml version="1.0" encoding="UTF-8" ?>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<style>
	body {
		background-color: dimgray;
	}
	#Title {
		margin: 20px 5% 0 5%;
		padding: 10px 0 10px 30px;
		background-color: aquamarine;
		border-bottom: 10px solid black;
	}
	h1 {
		line-height: 0;
	}
	.Forms {
		margin-top: 20px;
		margin-left: 10%;
	}
	a {
		font-size: 26px;
		color: aliceblue;
	}
	a:hover {
		color: gold;
	}
	a:active {
		color: cornflowerblue;
	}
	
	.Expression {
		padding-left: 20px;
	}
	.Expression-Statement {
		color: darkorange;
		font-size: 20px;
	}
</style>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Auto Text Writer</title>
</head>
<body>
	<div id="Title">
		<h1>Auto Text Writer</h1>
	</div>
	<form action="TextWriter" method="get" id="New-Document" class="Forms">
		<a id="New" href="">ドキュメントの作成</a>
		<div class="Expression">
			<p class="Expression-Statement">たぬきち：「説明文をだらだらとここに書いていきます。」(@^▽^@)</p>
		</div>
	</form>
	<form action="TextWriter" method="get" id="Edit-Document" class="Forms">
		<a id="Edit" href="">ドキュメントの閲覧・編集</a>
		<div class="Expression">
			<p class="Expression-Statement">たぬきち：「説明文をここに書いてね❤」(^_-)-☆</p>
		</div>
	</form>
	<script type="text/javascript" src="${pageContext.request.contextPath}/setting.js"></script>
	<script>
		
		function init() {
			console.log( "home" );
			
			const newDocument = document.getElementById( "New" );
			newDocument.addEventListener( "click", selectMenu );
			const editDocument = document.getElementById( "Edit" );
			editDocument.addEventListener( "click", selectMenu )
		}
		
		function selectMenu( event ) {
			event.preventDefault();
			
			if( this.id == "New" ) {
				pageDirection( "New-Document" );
			} else {
				pageDirection( "Edit-Document" );
			}
		}
		
		async function pageDirection( process) {
			event.preventDefault();
			
			const myHeaders = new Headers();
			myHeaders.append( "Process", process );
			const myRequest = new Request( "direction", {
				method: "POST",
				headers: myHeaders
			});
			const response = await window.fetch( myRequest );
			try {
				if( !response.ok ) {
					throw new Error( "Servlet Error occurred." );
				} else {
					const submitBtn = document.createElement( "input" );
					submitBtn.type = "submit";
					submitBtn.style.display = "none";
					const sendForm = document.getElementById( process );
					console.log( sendForm );
					sendForm.appendChild( submitBtn );
					submitBtn.click();
				}
			} catch( error ) {
				console.log( error );
			}
		}
	</script>
</body>
</html>