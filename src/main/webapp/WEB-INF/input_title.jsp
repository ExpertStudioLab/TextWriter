<?xml version="1.0" encoding="UTF-8" ?>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.util.ArrayList" %>

<div class="Right-Justify">
	<label for="Tag-El" id="Tag-Comment">タグの入力</label> 
</div>
<div class="Right-Justify">
    <select name="Tag" class="Selector" id="Tag-El">
        <option value="">ノンジャンル</option>

        <%
	        if( session.getAttribute( "Tags" ) != null ) {
    	    	ArrayList<String> tags = ( ArrayList<String> )session.getAttribute( "Tags" );
        		if( !tags.isEmpty() ) {
	        		String tag;
        			for( int i = 0; i < tags.size(); i++ ) {
        				tag = tags.get( i );													%>
					        <option value="<%= i %>"><%= tag %></option>
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
<div class="Left-Justify">
	<h1><label for="Title-Name">タイトルを指定してください</label></h1>
</div>
<div class="Left-Justify">
	<input type="text" id="Title-Name" class="Textbox" placeholder="- タイトルを入力 -" />
</div>
<form action="TextWriter" method="get" id="send">
	<input type="submit" alt="送信" id="permit" onclick="addIndex()" />
</form>