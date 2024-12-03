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
    <input type="button" value="送信" id="permit"  disabled="disabled"  /> <!-- onclick="sendColumn()"  -->
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
    <div id="Preview1"><img id="Illust1"></img><p id="Doc1"></p></div>
</div>
<div id="Align-Containt">
    <div id="Left-Side">  
        <div class="Left-Justify">
         <h3><label>テキストを入力してください。</label></h3>
        </div>
        <div class="Left-Justify">
            <textarea id="Contents1" rows="4" ></textarea>
        </div>
        <div>
            <input type="button" id="Insert-Image1" value="画像を挿入" />
        </div>
        <div id="Insert-Paragraph-Button">
            <input type="button" id="Paragraph" value="段落の追加" />
        </div>    
    </div>
    <div id="Center">
    </div>
    <div id="Right-Side">
        <canvas id="Image1" height="275px" width="350px">
        </canvas>
        <div>
            <input type="button" id="Rect" class="Button-Preference" value="▭" />
            <input type="button" id="Round" class="Button-Preference" value="◯" />
            <button type="button"><img src="${ pageContext.request.contextPath }/picture/round-rect.png" width="20px" height="15px" ></button>
        </div>
        <div>
            <input type="button" id="Text" class="Button-Preference" value="TEXT" />
            <input type="text" id="Text-Label" />
        </div>
            <input type="button" id="Hline" class="Button-Preference" value="―" />
            <input type="button" id="Vline" class="Button-Preference" value="|" />
            <input type="button" id="MoveGraph" class="Button-Pre" value="図形の移動" />
        </div>
    </div>
    <div>
        <input type="button" id="Next" value="追加" />
    </div>
    <div id="SendForm" >
        <input type="submit" id="Save" value="保存" />
        <input type="file" hidden="true" id="SendFile" />
    </div>
<% 		}
		} %>
<%  if( session.getAttribute( "NextOne" ).equals( false ) ) { %>
<script type="module" src="${pageContext.request.contextPath}/edit_graph.js"></script>
<script type="module" src="${ pageContext.request.contextPath }/data_transfer.js"></script>

<%  } %>
<script>
    function init() {
    	console.log( "containt called");
    }
let permitBtn = document.getElementById( "permit" );
let column_nameOp = document.getElementById( "Column-Name" );
if( column_nameOp != null ) {
    column_nameOp.addEventListener( "input", inputChange );
    permitBtn.addEventListener( "click", sendColumn );
}
    // make sure to input a column name.
    function inputChange( event ) {
        const btnOp = document.getElementById( "permit" );
        btnOp.disabled = ( event.currentTarget.value == "" );
    }

    function sendColumn() {
            sendValue( "column", column_nameOp.value );
            const form = document.getElementById( "send" );
             form.submit();
    }
</script>
