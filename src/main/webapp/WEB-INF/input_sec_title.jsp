<?xml version="1.0" encoding="UTF-8" ?>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

    <div class="Left-Justify"><h1><label for="Section-Title">ラベルを指定</label></h1></div>
    <div class="Left-Justify">
        <input type="text" list="Section-List" id="Section-Title" value="" placeholder="- ラベルを記入または選択 -" />
        <datalist id="Section-List">
            <option value="Display here stored section names."></option>
        </datalist>
    </div>
    <form action="TextWriter" method="get" id="send">
        <input type="submit" alt="送信" id="permit" onclick="sendLabel()" disabled="disabled" />
    </form>
    <script>
        const sec_titleOp = document.getElementById( "Section-Title" );
        sec_titleOp.addEventListener( "input", inputChange );
        function inputChange( event ) {
            const btnOp = document.getElementById( "permit" );
            btnOp.disabled = ( event.currentTarget.value == "" );
        }

        function sendLabel() {
            const textOp = document.getElementById( "Section-Title" );
            sendValue( "sec-title", String( textOp.value ) );
            setSectionTitle( String( textOp.value ) );
        }
        
        function init() {
        	console.log( "section called" );
        }
    </script>