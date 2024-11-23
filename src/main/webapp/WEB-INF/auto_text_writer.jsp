<?xml version="1.0" encoding="UTF-8" ?>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.util.ArrayList" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<link rel="stylesheet" href="${pageContext.request.contextPath}/form_style.css" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>AutoTextWriter</title>
</head>
<body>
	<% if( session.getAttribute( "HeaderTitle" ).equals( true ) ) {	%>
	<div id="BackGround">
		<div class="Grid-Container">
			<div class="Grid-Item"><iframe class="Frame" src="${pageContext.request.contextPath}/View/title.html" ></iframe></div>
			<div class="Grid-Item"></div>
		</div>
	<% }	%>
	<% if( session.getAttribute( "SectionTitle").equals( true ) ) {	%>
		<div class="Grid-Container">
			<div class="Grid-Item"><iframe class="Frame" src="${ pageContext.request.contextPath }/View/sec_title.html"></iframe></div>
			<div class="Grid-Item"></div>
		</div>
	<% }	%>
	<% 	if( !session.getAttribute( "Count" ).equals( "NONE" ) ) {
				int len = Integer.valueOf( ( String )session.getAttribute( "Count" ) );
				for( int i = 0; i < len; i++ ) {
	%>
		<div class="Grid-Container">
			<div class="Grid-Item"><iframe class="Frame" src="${ pageContext.request.contextPath }/View/contents.html"></iframe></div>
			<div class="Grid-Item"></div>
		</div>
	<%		}
			}
	%>
	<% if( session.getAttribute( "HeaderTitle" ).equals( true ) ) { 	%>
	</div>
	<% } %>
	
	<!-- タイトル　セクション名　内容の順に入力させる -->
	<jsp:include page="${sessionScope.HeaderTitle.equals( false ) ?
																			\"input_title\" :
										  sessionScope.SectionTitle.equals( false ) ?
											  								\"input_sec_title\" :
											  								\"input_contents\"
	}.jsp" />
<script type="text/javascript" src="${pageContext.request.contextPath}/setting.js" ></script>
</body>
</html>