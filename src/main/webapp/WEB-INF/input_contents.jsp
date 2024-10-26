<?xml version="1.0" encoding="UTF-8" ?>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<div id="Display-Area">
    <div><span>作成されるドキュメントの書式</span></div>
    <div><p id="Doc"></p></div>
</div>
<div id="Align-Containt">
    <div id="Left-Side">  
        <div class="Left-Justify">
         <h3><label>テキストを入力してください。</label></h3>
        </div>
        <div class="Left-Justify">
            <textarea id="Containts" rows="10" cols="80"></textarea>
        </div>
    </div>
    <div id="Right-Side">
        <div><img id="Img" /></div>
        <div id="Canvas">
            <ul id="popupMenu">
                <li>高さと幅を指定</li>
            </ul>
            <div id="drawRect"></div>
            <canvas id="Image" height="250px" width="500px"></canvas>
        </div>
        <form action="/TextWriter/storeimage" enctype="multipart/form-data" method="post">
            <input type="submit" id="Save" value="保存" />
        </form>
    </div>
</div>
<script type="text/javascript" src="${pageContext.request.contextPath}/storage.js" ></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/draw_graph.js"></script>
<script>
    // if write a text, display at the Display-Area
    const textOp = document.getElementById( "Containts" );

    textOp.addEventListener( "input", displayText );
    function displayText( event ) {
            const disp = document.querySelector( "p" );
            disp.innerText = String( textOp.value );
    }
    
    function init() {
    	console.log( "containt called");
    }
</script>
