<?xml version="1.0" encoding="UTF-8" ?>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<%
	if( session.getAttribute( "ColumnName" ).equals( false ) ) {
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

<%
	} else {
%>
    <div><span>作成されるドキュメントの書式</span></div>

<div class="Left-Justify">
	<h3 id="Column-Title"></h3>
</div>

<div id="Display-Area">
</div>
<div id="Align-Containt">
    <div id="Left-Side">  
        <div class="Left-Justify">
        	<h3><label>テキストを入力してください。</label></h3>
        </div>
        
        <div id="Basic-Div" class="Left-Justify" ></div>
    </div>
    <div id="Center">
    </div>
    <div id="Right-Side">
        <canvas id="Image1" height="275px" width="350px">
        </canvas>
        <div>
            <input type="button" id="Rect" value="▭" />
            <input type="button" id="Round" value="◯" />
            <button type="button"><img src="${ pageContext.request.contextPath }/picture/round-rect.png" width="20px" height="15px" ></button>
        </div>
        <div>
            <input type="button" id="Text" value="TEXT" />
            <input type="text" id="Text-Label" />
        </div>
        <div>
        	<input type="file" id="FileImage" accept="image/*" style="display: none;" />
        	<input type= "button" id="Insert-File" value="画像の指定" />
			<input type= "text" id="ImageFileName" readonly style="width: 200px;" />
        </div>
        <div>
            <input type="button" id="Hline" value="―" />
            <input type="button" id="Vline" value="|" />
            <input type="button" id="MoveGraph" value="図形の移動" />
        </div>
        <div id="Previous-Image"></div>
        <div>
        	<input type="button" id="New-Image" value="新しい画像" />
        </div>
        <div>
        	<input type="button" id="Download" value="画像のダウンロード" />
        </div>
    </div>
    <div>
        <input type="button" id="Next" value="追加" />
    </div>
    <div id="SendForm" >
        <input type="submit" id="Save" value="保存" />
        <input type="file" hidden="true" id="SendFile" />
    </div>
</div>
<% 	}
%>
<%  if( session.getAttribute( "ColumnName" ).equals( true ) ) { %>
<script type="module" src="${ pageContext.request.contextPath }/data_transfer.js"></script>

<%  } %>
<script>
	let permitBtn = document.getElementById( "permit" );
	let column_nameOp = document.getElementById( "Column-Name" );

    async function init() {
    	console.log( "containt called");
    	if( column_nameOp != null ) {
    	    column_nameOp.addEventListener( "input", inputChange );
    	    permitBtn.addEventListener( "click", sendColumn );
    	} else {
    		const jsonData = await receiveData( "Column" );
    		const column = document.getElementById( "Column-Title" );
    		column.innerHTML = jsonData.column;
    	}    	
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
