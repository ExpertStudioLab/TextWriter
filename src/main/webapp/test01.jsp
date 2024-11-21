<?xml version="1.0" encoding="UTF-8" ?>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Insert title here</title>
</head>
<body>
<script type="text/javascript" src="${ pageContext.request.contextPath }/test01.js"></script>
<script>
	var xhr = new XMLHttpRequest();
	xhr.open( "GET", "direction", true );
	xhr.onreadystatechange = function() {
		if( xhr.readyState == 4 && xhr.status == 200 ) {
			const jsonResource = JSON.parse( xhr.response );
			console.log( xhr.response );
			console.log( jsonResource.message );
		} else {
			console.error( "error occasion" );
		}
	}
	xhr.send( null );
	

</script>
</body>
</html>