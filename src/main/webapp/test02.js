/**
 * 
 */
class TestClass {
	#num = 90;
	#myFunc = showDisplay;
	constructor() {

	}

	publicFunc() {
		this.#myFunc();
	}
}

function showDisplay() {
	console.log( "num is " + "." );
}


export { TestClass };