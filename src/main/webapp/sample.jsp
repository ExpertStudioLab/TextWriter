<?xml version="1.0" encoding="UTF-8" ?>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

<title>TextWriterSample</title>
</head>
<body>
 
    <div id="Form">
        <div id="Tag">タグネーム</div>
		<header id="Title">タイトルネーム</header><hr>
    
        <main>
            <div id="Canvas-Block">
                <h2 id="Section-Name1">第1章．サーブレットプログラムでのデータベースの利用</h2>
                <div id="Section-Header1">
                    <canvas class="Section-Devider"></canvas>
                </div>
            </div>
            <img id="image" style="width: 200px; height: 200px;" ></img>
            <img id="image2" style="width: 300px; height: 300px;"></img>
 <!--           <div id="Section-Block"><h2>セクション</h2><canvas id="Space"></canvas></div>       -->
            <script>
            var array = [ 1, 2, 3 ];
            console.log( typeof( array ) );
            const jsonArray = JSON.stringify( array, null, 8 );
            console.log( jsonArray );
            
            const encodedData = window.btoa("Hello, world"); // 文字列をエンコード
            const decodedData = window.atob(encodedData); // 文字列をデコード
            console.log( encodedData );
            
            const str = "Hello World"
            const myBlob = new Blob( [ str ], { type: 'text/plain' } );
            const url = window.URL.createObjectURL( myBlob );
            console.log( url );
            
            window.fetch( new Request( "img02.png" ) )
            	.then( ( response ) => response.blob() )
            	.then( ( blob ) => {
            		const img = document.getElementById( "image2" );
            		img.src = window.URL.createObjectURL( blob );
            	});
            
            function fetchImage() {
                const xhr = new XMLHttpRequest();
                xhr.open( "GET", "/TextWriter/send", true);
                xhr.responseType = "blob";
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        const blob = xhr.response;
                        const img = document.getElementById( "image" );
                        img.src = URL.createObjectURL(blob);
                      	console.log( "Load image, OK" );
                    } else {
                    	console.log( "The error has  happened" );
                    }
                };
                xhr.send( null );
            }
            document.body.onload = fetchImage;
            
/*
            fetch('/TextWriter/send')
            .then(response => response.blob())
            .then(blob => {
                // Create a URL for the Blob and use it as needed
                const url = URL.createObjectURL(blob);
                console.log(url);

                // Example: Display the Blob content in an image element
//                const img = document.createElement('img');
                const img = document.getElementById( "image" );
                img.src = url;

//                document.body.appendChild(img);
            })
            .catch(error => console.error('Error fetching Blob:', error));
*/
            </script>
        </main>
    </div>
</body>
</html>