<?xml version="1.0" encoding="UTF-8" ?>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <link rel="stylesheet" href="${pageContext.request.contextPath}/style.css"/>
    <script type="text/javascript" src="${pageContext.request.contextPath }/style.js"></script>
<title>TextWriterSample</title>
</head>
<body>
 
    <div id="Form">
        <header><h1>タイトル</h1></header><hr>
        <main>
            <div id="Canvas-Block">
                <h2 id="Section-Name1">セクション</h2>
                <div id="Section-Header1">
                    <canvas class="Section-Devider"></canvas>
                </div>
            </div>
            <script type="module">window.addEventListener( "load", ()=>{ setCanvas( "Section-Name1", "#Section-Header1" ) } )</script>
 <!--           <div id="Section-Block"><h2>セクション</h2><canvas id="Space"></canvas></div>       -->
            <script type="module">window.addEventListener( "load", ()=>{drawSectionHeader( ".Section-Devider", "セクション" );} )</script>
        </main>
    </div>
</body>
</html>