<?xml version="1.0" encoding="UTF-8" ?>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.util.ArrayList" %>

<div id="Title-Partition" style="">
	<div style="width: 220px; display: inline-block; padding-right: 15px;">
		<div class="Right-Justify">
			<label for="Tag-El" class="Comment" style="margin-top: 5px; margin-right: 100px; font-weight: bold; font-size: 20px;">タグの入力</label> 
		</div>
		<div style="border: 2px solid lightgray; width: fit-content; padding: 30px 10px 10px 10px;">
			<div class="Right-Justify">
    			<select name="Tag" class="Selector" id="Tag-El">
<%
	        if( session.getAttribute( "Tags" ) != null ) {
    	    	ArrayList<String> tags = ( ArrayList<String> )session.getAttribute( "Tags" );
        		if( !tags.isEmpty() ) {
	        		String tag;
        			for( int i = 0; i < tags.size(); i++ ) {
        				tag = tags.get( i );													%>
					        <option value="<%= tag %>"><%= tag %></option>
<%					}
        		}
        	} 																					%>
    			</select>
			</div>
			<div class="Right-Justify">
    			<input type="button" value="タグを追加" class="Tag-Button" id="Add-Tag" onclick="popupAddTagWnd()" />
			</div>
			<div class="Right-Justify">
				<input type="button" value="タグの削除" class="Tag-Button" id="Del-Tag" onclick="popupDelTagWnd()" />
			</div>
		</div>
	</div>
	<div style="width: 50%; min-width: 700px; display: inline-block; float: left;">
		<div class="Left-Justify" style="padding-top: 20px;">
			<div style="height: fit-content; width: fit-content; background-color: lightyellow; padding-top: 5px; padding-right: 50px; border-top: 10px solid maroon; border-bottom: 10px solid maroon; padding-left: 10px;">
				<h1 style="margin: 0;"><label for="Title-Name">タイトルを指定してください</label></h1>
			</div>
		</div>
		<div class="Left-Justify" style="width: fit-content; min-width: 500px;">
			<span><small>過去のタイトルを使用する場合は、タイトルをクリックして指定してください。</small></span>
		</div>
		<div class="Left-Justify">
			<input type="text" list="Title-List" id="Title-Name" class="Textbox" placeholder="- タイトルを入力 -" />
			<datalist id="Title-List">
				<option value="Display here stored title names."></option>
			</datalist>
		</div>
		<form action="TextWriter" method="get" id="send" >
			<input type="submit" alt="送信" id="permit" disabled onclick="sendTitle()" />
		</form>
	</div>
</div>
<script type="text/javascript" src="${pageContext.request.contextPath}/title.js" ></script>
<script>
	window.onload = function() {
		const height = window.innerHeight;
		const width = window.innerWidth;
		const div = document.getElementById( "Title-Partition" );
		div.style.height = String( height - 60 ) + "px";
		  const background = document.getElementById( "FormBackGround" );
		  background.style.width = div.style.width;
		  background.style.height = div.style.height;
		if( width < 550 ) {
			div.style.width = "5500px";
			background.style.width = "550px";
		}
	}
	
</script>