package textwriter.datatransfer;

import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.Serializable;
import java.nio.file.Paths;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.imageio.ImageIO;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.http.Part;

import database.DatabaseAdapter;
import objstream.ObjectStream;

import java.sql.Connection;

import textwriter.process.StatusManager;

/**
 * Servlet implementation class Storage
 */
@WebServlet("/storage")
@MultipartConfig
public class Storage extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private final String webapp = "C:\\Users\\SmartBrightB\\Desktop\\Java Training\\Servlet Test\\TextWriter\\src\\main\\webapp";
	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public Storage() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		HttpSession session = request.getSession();
		StatusManager manager = ( StatusManager ) session.getAttribute( "StatusManager" );
		manager.setRequest( request );
		manager.setResponse( response );

		if ( request.getHeader("Process").equals("FileNumber") ) {
			PrintWriter outWriter = response.getWriter();
			response.setContentType( "application/octet-stream" );
			String num = (String) session.getAttribute("FileNumber");
			outWriter.print( num );
			outWriter.flush();
			outWriter.close();

		} else if( request.getHeader( "Process").equals( "Title" ) ) {
			manager.sendTitle();
		} else if( request.getHeader( "Process" ).equals( "Section" ) ) {
			manager.sendSection();
		} else if( request.getHeader( "Process" ).equals( "Keywords") ) {
			response.setContentType( "application/json" );
			response.setCharacterEncoding( "UTF-8" );
			PrintWriter outWriter = response.getWriter();
			File file = new File( webapp + "\\JSON\\keywords.json" );
			FileInputStream fileIn = new FileInputStream( file );
			InputStreamReader inStreamReader = new InputStreamReader( fileIn, "UTF-8" );
			BufferedReader bufferedReader = new BufferedReader( inStreamReader );
			String line;
			while( ( line = bufferedReader.readLine() ) != null ) {
				outWriter.write( line );
			}
			outWriter.flush();
			
			fileIn.close();
			inStreamReader.close();
			bufferedReader.close();
			outWriter.close();
		}

	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		HttpSession session = request.getSession();
		StatusManager manager = ( StatusManager ) session.getAttribute( "StatusManager" );
		manager.setRequest( request );
		manager.setResponse( response );

		if( request.getHeader( "Process" ).equals( "Save" ) ) {
			System.out.println( "たぬきち：「セーブ！！！！」" );
			List<Record> records = new ArrayList<Record>();
			BufferedData bufferedData = new BufferedData( request );
			byte[] buffer = bufferedData.getData( "Docs" );
			records.add( new Record( buffer, Record.TEXT ) );

			buffer = bufferedData.getData( "Illusts" );
			records.add( new Record( buffer, Record.TEXT ) );

			buffer = bufferedData.getData( "FileNumber" );
			records.add( new Record( buffer, Record.TEXT ) );
			int length = Integer.valueOf( new String( buffer ) );
			
			for( int i = 0; i < length; i++ ) {
				buffer = bufferedData.getData( "Image" + String.valueOf( i + 1 ) );
				records.add( new Record( buffer, Record.BINARY ) );
			}
			String fileNumber = manager.getFileNumber();
			ObjectStream<Record> saveStream = new ObjectStream<>( records, webapp + "\\Doc\\" + fileNumber + ".dat");
			saveStream.write();
			/*
			InputStream inStream = ( InputStream ) request.getInputStream();
			InputStreamReader inReader = new InputStreamReader( inStream, "UTF-8" );
			BufferedReader bufferedReader = new BufferedReader( inReader );
			String fileNumber = manager.getFileNumber();
			File file = new File( webapp + "\\Doc\\Document" + fileNumber + ".json" );
			file.createNewFile();
			
			FileOutputStream fOut = new FileOutputStream( file );
			OutputStreamWriter outWriter = new OutputStreamWriter( fOut, "UTF-8" );
			
			String line;
			while( ( line = bufferedReader.readLine() ) != null ) {
				System.out.println( line );
				outWriter.write(line);
			}
			outWriter.close();
			fOut.close();
			inStream.close();
			inReader.close();
			bufferedReader.close();
			*/
		}
	}
}

class Record implements Serializable {
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

class BufferedData {
	private HttpServletRequest request;
	
	public BufferedData( HttpServletRequest request ) {
		this.request = request;
	}
	
	public byte[] getData( String name ) {
		try {
		Part filePart = this.request.getPart( name );
		InputStream inStream = filePart.getInputStream();
		byte[] buffer = inStream.readAllBytes();
		inStream.close();
		return buffer;
		} catch( Exception e ) {
			e.printStackTrace();
		}
		return null;
	}
}