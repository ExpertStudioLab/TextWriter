package json;

import java.util.HashMap;
import java.util.Map;

public class JsonData {
	private Map<String, String> data;
	
	public JsonData() {
		data = new HashMap<>();
	}
	public void push( String key, String value ) {
		data.put( key, value );
	}
	public String convertToJson() {
		String result = "{";
		for( Map.Entry<String, String> entry : this.data.entrySet() ) {
			result += word( entry.getKey() ) + " : " + word( entry.getValue() ) + ",";
		}
		result = result.substring( 0, result.lastIndexOf( ',' ) );
		result += "}";
		return result;
	}
	private String word( String word ) {
		return new String( "\"" + word + "\"" );
	}
}
