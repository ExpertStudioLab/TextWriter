package textwriter.datatransfer;

import java.io.Serializable;

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
			text = new String( data );
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
