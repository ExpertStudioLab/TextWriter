<?xml version="1.0" encoding="UTF-8" ?>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.util.ArrayList" %>

<div class="Partition">
	<div id="Title-Right">
		<label for="Tag-El" id="TagLabel">タグの入力</label> 
		<div id="Tag-Selector">
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
			<div class="Right-Justify">
    			<input type="button" value="タグを追加" class="Tag-Button" id="Add-Tag" onclick="popupAddTagWnd()" />
			</div>
			<div class="Right-Justify">
				<input type="button" value="タグの削除" class="Tag-Button" id="Del-Tag" onclick="popupDelTagWnd()" />
			</div>
		</div>
	</div>
	<div id="Title-Left">
		<div class="Left-Justify" style="padding-top: 20px;">
			<div class="Title-Background">
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
		<form action="TextWriter" method="get" id="send" style="display: block;" >
			<input type="submit" alt="送信" id="permit" disabled onclick="sendTitle()" />
		</form>
	</div>
</div>
<script type="text/javascript" src="${pageContext.request.contextPath}/title.js" ></script>
<script>
	let height;
	let width;
	let formHeight;
	const div = document.querySelector( ".Partition" );
	window.onload = function() {
		height = div.clientHeight * 2;
		width = window.outerWidth;
		const form = document.getElementById( "send" );
		formHeight = send.clientHeight;
		console.log( height );
		console.log( formHeight );
		div.style.height = String( height + formHeight ) + "px";
		if( width < 770 ) {
			div.style.width = "770px";
		} else {
			div.style.width = String( window.innerWidth - 80 ) + "px";
		}
	}
	window.onresize = function() {
		div.style.height = String( height + formHeight ) + "px";	
		console.log( window.outerWidth );
		if( window.outerWidth < 770 ) {
			div.style.width = "770px";
		} else {
			div.style.width = String( window.innerWidth - 120 ) + "px";
		}
	}
</script>