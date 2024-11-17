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
        <div>
            <input type="text" class="Reserved-Words" id="Equals" list="Equals-List" placeholder="- A is B -" />
            <datalist id="Equals-List">
                <option value="とは"></option>
                <option value="というのは"></option>
            </datalist>
            <input type="button" class="Reserved-Words-Button" id="Insert-Equals" value="追加" />
        </div>
        <div>
            <input type="text" class="Reserved-Words" id="Also" list="Also-List" placeholder="- also -" />
            <datalist id="Also-List">
                <option value="でもあり、また"></option>
                <option value="ともいわれ、また"></option>
            </datalist>
            <input type="button" class="Reserved-Words-Button" id="Insert-Also" value="追加" />
        </div>
        <div>
            <input type="text" class="Reserved-Words" id="With" list="With-List" placeholder="- with A -" />
            <datalist id="With-List">
                <option value="を使って"></option>
                <option value="を利用して"></option>
            </datalist>
            <input type="button" class="Reserved-Words-Button" id="Insert-With" value="追加" />
        </div>
        <div>
            <input type="text" class="Reserved-Words" id="Of" list="Of-List" placeholder="- B of A -" />
            <datalist id="Of-List">
                <option value="の"></option>
                <option value="が持つ"></option>
            </datalist>
            <input type="button" class="Reserved-Words-Button" id="Insert-Of" value="追加" />
        </div>
        <div>
            <input type="text" class="Reserved-Words" id="Cause" list="Cause-List" placeholder="- cause -" />
            <datalist id="Cause-List">
                <option value="によって"></option>
                <option value="が原因で"></option>
            </datalist>
            <input type="button" class="Reserved-Words-Button" id="Insert-Cause" value="追加" />
        </div>
        <div>
            <input type="text" class="Reserved-Words" id="Porpose" list="Porpose-List" placeholder="- in order to -" />
            <datalist id="Porpose-List">
                <option value="するために"></option>
                <option value="のために"></option>
            </datalist>
            <input type="button" class="Reserved-Words-Button" id="Insert-Porpose" value="追加" />
        </div>
    </div>
    <div id="Right-Side">
        <div id="drawRect"></div>
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
            <input type="button" id="Hline" value="――" />
            <input type="button" id="Vline" value="|" />
            <input type="button" id="MoveGraph" value="図形の移動" />
            <input type="button" id="Log" value="ログの表示" />
        </div>
    </div>
    <div>
        <input type="button" id="Next" value="追加" />
    </div>
    <form action="TextWriter" method="post" enctype="multipart/form-data" id="SendForm" >
        <input type="submit" id="Save" value="保存" />
        <input type="file" hidden="true" id="SendFile" />
    </form>
<% 		}
		} %>
<%  if( session.getAttribute( "NextOne" ).equals( false ) ) { %>
<script type="text/javascript" src="${ pageContext.request.contextPath }/canvas_graphics.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/draw_graph.js"></script>
<script type="text/javascript" src="${ pageContext.request.contextPath }/data_transfer.js"></script>
<script type="text/javascript" src="${ pageContext.request.contextPath }/edit_graph.js"></script>

<%  } %>
<script>
    function init() {
    	console.log( "containt called");
        column_nameOp = document.getElementById( "Column-Name" );
        if( column_nameOp != null ) {
            column_nameOp.addEventListener( "input", inputChange );

            permitBtn = document.getElementById( "permit" );
            permitBtn.addEventListener( "click", sendColumn );        	
        }
    }
let column_nameOp;
let permitBtn;
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
