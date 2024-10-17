<?xml version="1.0" encoding="UTF-8" ?>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>


<div class="Right-Justify">
	<label for="Tag-El" id="Tag-Comment">タグの入力</label> 
</div>
<div class="Right-Justify">
    <select name="Tag" class="Selector" id="Tag-El">
        <option value="">ノンジャンル</option>
    </select>
</div>
<div class="Right-Justify">
    <input type="button" value="タグを追加" id="Add-Tag" >
</div>
<form action="TextWriter" method="get">
    <input type="submit" alt="送信">
</form>