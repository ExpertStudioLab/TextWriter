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
	#Menu {
		text-align: end;
		padding-top: 20px;
		padding-right: 20%;
	}


</style>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Auto Text Writer</title>
</head>
<body>
	<div id="Title">
		<h1>ドキュメント一覧</h1>
	</div>
	<div id="Menu">
		<span>モード</span>
		<select id="Mode">
			<option value="Edit">編集</option>
			<option value="Move">入れ替え</option>
		</select>
	</div>
	<div id="Document-List">
	</div>
	<script type="text/javascript" src="${pageContext.request.contextPath}/setting.js"></script>
	<script type="module" src="${pageContext.request.contextPath}/create_document_list.js"></script>
	<script>
		async function init() {
			console.log( "DocumentList" );
		}
	</script>	
</body>
</html>