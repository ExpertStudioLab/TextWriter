import { TestClass } from "./test02.js";
/**
 * 
 */
	const obj = new TestClass();
	obj.publicFunc();
	console.log( obj );

async function getData() {
  const url = "direction";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`レスポンスステータス: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error(error.message);
  }
}
getData();

 function getDate( callback ) {
	 callback( new Date );
 }
 
 getDate( getYear );
 
 function getYear( date ) {
	 const year = date.getFullYear();
	 console.log( "現在の西暦: " + year );
 }
 
 function func1( ) {
	 return new Promise( result => {
		 window.setTimeout( () => {
			 result( "１つめの処理" );
		 }, 2000 );
	 });
 }
 function func2( ) {
	 return new Promise( result => {
		 window.setTimeout( () => {
			 result( "2つめの処理" );
		 }, 2000 );
	 });
 }
  function func3( ) {
	 return new Promise( result => {
		 window.setTimeout( () => {
			 result( "3つめの処理" );
		 }, 2000 );
	 });
 }
 
 Promise.all( [ func1(), func2(), func3() ] )
 .then( data => {
	 console.log( data[ 0 ] + ", " + data[ 1 ] + ", " + data[ 2 ] );
 });
 