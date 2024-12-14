package objstream;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.Collection;

public class ObjectStream<S> {
	private Collection<S> collectionObj;
	private String fileName;
	public  ObjectStream( Collection<S> collection, String fileName ) {
		this.collectionObj = collection;
		this.fileName = fileName;
	}
	public void write() {
		if( this.collectionObj != null ) {
			this.writeCollectionObject();
		}
	}
	public void read() {
		if( this.collectionObj != null ) {
			this.readCollectionObject();
		}
	}
	private  void writeCollectionObject() {
		File f = new File( this.fileName );
		if( f.exists() ) {
			f.delete();
			f = new File( this.fileName );
		}
		try {
			FileOutputStream fileOut = new FileOutputStream( f );
			ObjectOutputStream out = new ObjectOutputStream( fileOut );
			out.writeObject( this.collectionObj );
			out.close();
			fileOut.close();
		} catch( FileNotFoundException e ) {
			e.printStackTrace();
		} catch( IOException e ) {
			e.printStackTrace();
		}
	}
	// The data of in.readObject() must be Collection<S> type.
	// If a Collection with different type is set, it won't be compiled.
	@SuppressWarnings("unchecked")
	private  void readCollectionObject() {
		File f = new File( this.fileName );
		try {
			FileInputStream fileIn = new FileInputStream( f );
			ObjectInputStream in = new ObjectInputStream( fileIn );
			this.collectionObj.addAll( ( Collection<S> ) in.readObject() );
			in.close();
			fileIn.close();
		} catch( FileNotFoundException e ) {
			e.printStackTrace();
		} catch( IOException e ) {
			e.printStackTrace();
		} catch( ClassNotFoundException e ) {
			e.printStackTrace();
		}
	}
}
