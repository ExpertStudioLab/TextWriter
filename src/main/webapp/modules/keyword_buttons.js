/**
 * 
 */
export function createKeywordButton( keywordType, placeHolder, options ) {
	let  statement = "<div>";
	statement +=			"<input type=\"text\" class=\"Reserved-Words\" id=\"" + keywordType + "\" "
																		+	"list=\"" + keywordType + "-List\" placeholder=\"" + placeHolder + "\" />";
	statement +=			"<datalist id=\"" + keywordType +"-List\" >";
	if( options != null ) {
		for( let i = 0; i < options.length; i++ ) {
			statement += "<option value=\"" + options[ i ] + "\" ></option>";
		}
	}
	statement +=			"</datalist>";
	statement +=			"<input type=\"button\" class=\"Reserved-Words-Button\" id=\"Insert-" + keywordType + "\" value=\"追加\" />"
	statement += 	  "</div>";
	return statement;
}