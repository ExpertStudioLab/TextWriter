<?xml version="1.0" encoding="UTF-8" ?>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<div class="Partition" style="margin-top: 5px;">
    <div class="Left-Justify"><h1><label for="Section-Title">ラベルを指定</label></h1></div>
    <div class="Left-Justify">
        <input type="text" list="Section-List" id="Section-Title" class="Textbox" value="" placeholder="- ラベルを記入または選択 -" />
        <datalist id="Section-List">
            <option value="Display here stored section names."></option>
        </datalist>
    </div>
    <form action="TextWriter" method="get" id="send" style="margin-bottom: 5px;">
        <input type="submit" alt="送信" id="permit" onclick="sendLabel()" disabled="disabled" />
    </form>
</div>
    <script>
        const sec_titleOp = document.getElementById( "Section-Title" );
        sec_titleOp.addEventListener( "input", inputChange );
        function inputChange( event ) {
            const btnOp = document.getElementById( "permit" );
            btnOp.disabled = ( event.currentTarget.value == "" );
        }

        function sendLabel() {            
            sendValue( "sec-title", String( sec_titleOp.value ) );
        }

    	async function init() {
        	console.log( "section called" );
    		const jsonData = await receiveData( "Title" );
    		const hEl = document.getElementById( "Title" );
            const tagEl = document.getElementById( "Tag" );
    		hEl.insertAdjacentHTML( "afterbegin", "<h1 style=\"margin-top: 5px; margin-bottom: 0;\">" + jsonData.title + "</h1>" );
    		tagEl.insertAdjacentHTML( "afterbegin", "<span><small>" + jsonData.tagName + "</small></span>");
    	}
    </script>