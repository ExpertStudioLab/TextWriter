<?xml version="1.0" encoding="UTF-8" ?>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<div id="Display-Area">
    <div id="Com"><span>作成されるドキュメントの書式</span></div>
</div>  
<div class="Left-Justify">
    <h3><label>テキストを入力してください。</label></h3>
</div>
<div class="Left-Justify">
    <textarea id="Containts" rows="10" cols="80"></textarea>
</div>
<script>
    // if write a text, display at the Display-Area
    let flag = false;
    const textOp = document.getElementById( "Containts" );
    textOp.addEventListener( "input", displayText );
    function displayText( event ) {
        if( !flag ) {
            const disp = document.getElementById( "Com" );
            disp.insertAdjacentHTML( "afterend", "<p>" + String( textOp.value ) + "</p>" );
            flag = true;
        } else {
            const disp = document.querySelector( "p" );
            disp.innerText = String( textOp.value );
        }
    }
</script>