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
        			tag = tags.get( i );
        %>
        <option value="<%= i %>"><%= tag %></option>
        <%
        		}
        	}
        } 
        %>
    </select>
</div>
<div class="Right-Justify">
    <input type="button" value="タグを追加" id="Add-Tag" onclick="popupAddTagWnd()" />
</div>
<form action="TextWriter" method="get" id="send">
    <input type="submit" alt="送信" onclick="addIndex()" />
</form>