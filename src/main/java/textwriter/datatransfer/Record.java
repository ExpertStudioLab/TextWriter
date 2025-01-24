package textwriter.datatransfer;

import java.io.Serializable;
import java.io.UnsupportedEncodingException;

public class Record implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1000L;
	static final int TEXT = 0;
	static final int BINARY = 1;
	private String text = null;
	private byte[] binary = null;
	
	public Record( byte[] data, int dataType ) {
		switch( dataType ) {
		case Record.TEXT:
			try {
				this.text = new String( data, "UTF-8" );
			} catch (UnsupportedEncodingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			break;
		case Record.BINARY:
			binary = data;
			break;
		}
	}
	
	public byte[] getRecord() {
		if( text == null ) {
			return this.binary;
		} else {
			return this.text.getBytes();
		}
	}
}
