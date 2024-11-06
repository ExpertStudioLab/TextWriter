<?xml version="1.0" encoding="UTF-8" ?>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.util.ArrayList" %>
<% 	ArrayList<String> cols = ( ArrayList<String> )session.getAttribute( "column_names" );
		final int  len = cols.size() > 0 ? cols.size() : 1;
		for( int i = 0; i < len; i++ ) {
			if( session.getAttribute( "NextOne").equals( true ) ) {
%>
<div class="Left-Justify">
    <h1><label for="Column-Name">コラム名を指定してください</label></h1>
</div>
<div class="Left-Justify">
    <input type="text" id="Column-Name" class="Textbox" placeholder="- コラム名を入力 -" value="" />
</div>
<form action="TextWriter" method="get" id="send" >
    <input type="submit" alt="送信" id="permit" disabled onclick="sendColumn()" />
</form>
	<% } else { %>
    <div><span>作成されるドキュメントの書式</span></div>
<%			if( cols.size() > 0 ) {
				%>
<div class="Left-Justify">
<h3><%= cols.get( i ) %></h3>
</div>
<% 			}
%>
<div id="Display-Area">
    <div id="Preview"><img id="Illust"></img><p id="Doc1"></p></div>
</div>
<div id="Align-Containt">
    <div id="Left-Side">  
        <div class="Left-Justify">
         <h3><label>テキストを入力してください。</label></h3>
        </div>
        <div class="Left-Justify">
            <textarea id="Contents1" rows="10" cols="80"></textarea>
        </div>
    </div>
    <div id="Right-Side">
        <div><img id="Img" /></div>
        <div id="Canvas">
            <div id="drawRect"></div>
            <canvas id="Image" height="350px" width="500px">
            </canvas>
        </div>
        <input type="button" id="Insert" value="挿入" />
    </div>
    <div>
        <input type="button" id="Paragraph" value="段落の追加" />
    </div>
    <div>
        <input type="button" id="Next" value="追加" />
    </div>
    <form action="TextWriter" method="post" enctype="multipart/form-data" id="SendForm" >
        <input type="submit" id="Save" value="保存" />
        <input type="file" hidden="true" id="SendFile" />
    </form>
</div>
<% 		}
		} %>
<%  if( session.getAttribute( "NextOne" ).equals( false ) ) { %>
<script type="text/javascript" src="${pageContext.request.contextPath}/draw_graph.js"></script>
<%  } %>
<script>
    function init() {
    	console.log( "containt called");
    }

    // make sure to input a column name.
    const column_nameOp = document.getElementById( "Column-Name" );
    if( column_nameOp != null ) column_nameOp.addEventListener( "input", inputChange );
    function inputChange( event ) {
        const btnOp = document.getElementById( "permit" );
        btnOp.disabled = ( event.currentTarget.value == "" );
    }

    function sendColumn() {
        sendValue( "column", column_nameOp.value );
    }
    
</script>
