package json;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class JsonString {
	private String data;
	private List<String> matchString;
	private int type;
	public JsonString( String data ) {
		matchString = new ArrayList<>();
		if( data.matches( "\s*\\{.*") ) {
			this.type = Blocks.OBJECT;
			this.data = data.substring( data.indexOf( '{' ) + 1, data.lastIndexOf( '}' ) );			
		} else if( data.matches( "\s*\\[.*") ) {
			this.type = Blocks.ARRAY;
			this.data = data.substring( data.indexOf( '[' ) + 1, data.lastIndexOf( ']' ) );
		}else {
			this.type = Blocks.NONE;
			this.data = data;
		}
		Blocks blocks = new Blocks( new StringBuilder(  ) );

		Pattern p = Pattern.compile( ":?\s*(\\[|\\{)" );
		Matcher m = p.matcher( this.data );
		while( m.find() ) {
			int index = m.end() - 1;
			blocks.add( index, ! m.group().contains( ":" ), ( this.data.charAt( index ) == '{' ) ? Blocks.OBJECT : Blocks.ARRAY );
		}
		p = Pattern.compile( "[^\\]\\}]*(\\]|\\})" );
		m = p.matcher( this.data );
		while( m.find() ) {
			int index = m.end() - 1;
			blocks.closeBlock( index, ( this.data.charAt( index ) == '}' ) ? Blocks.OBJECT : Blocks.ARRAY );
		}
		this.data = blocks.replaceData( this.data);
//		p = Pattern.compile( "(\"\\w+\"\s*:\s*)?(\\{[^\\}]*\\}|\\[[^\\]]*\\]|\"\\w*\"|-?\\d+[(\\.\\d+)]?|\\w+|\\@ARROUT\\$.*\\@ARROUT\\;|\\@OBJOUT\\$.*\\@OBJOUT\\;)" );
		p = Pattern.compile( "(\"\\w+\"\s*:\s*)?(\\{[^\\}]*\\}|\\[[^\\]]*\\]|\"[^\"]*\"|-?\\d+[(\\.\\d+)]?|\\w+|\\@ARROUT\\$.*\\@ARROUT\\;|\\@OBJOUT\\$.*\\@OBJOUT\\;)" );

		m = p.matcher( this.data );

		while( m.find() ) {
			String tmp = m.group();
			if( tmp.contains( "@" ) ) {
				tmp = tmp.replace( "@ARROUT$", "[" );
				tmp = tmp.replace( "@ARR$", "[" );
				tmp = tmp.replace( "@ARROUT;",  "]" );
				tmp = tmp.replace( "@ARR;", "]" );
				tmp = tmp.replace( "@OBJOUT$", "{" );
				tmp = tmp.replace( "@OBJ$", "{" );
				tmp = tmp.replace( "@OBJOUT;", "}" );
				tmp = tmp.replace( "@OBJ;", "}" );				
			}
			matchString.add( tmp );
		}
	}
	public String getData() {
		return this.data;
	}
	public int getType() {
		return this.type;
	}
	public int getCount() {
		return this.matchString.size();
	}
	public String get( int index ) {
		return this.matchString.get( index );
	}
}

