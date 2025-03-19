package textwriter.datatransfer;

import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
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
import javax.servlet.ServletInputStream;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.http.Part;

import database.DatabaseAdapter;
import json.JsonData;
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
		} else if( request.getHeader( "Process" ).equals( "Column" ) ) {
			manager.sendColumn();
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
		} else if( request.getHeader( "Process" ).equals( "List" ) ) {
			DatabaseAdapter adapter = new DatabaseAdapter();
			adapter.createRecordView();
			response.setContentType( "application/json; charset=UTF-8" );
			PrintWriter out = response.getWriter();
			if( request.getHeader( "Option" ).equals( "Count" ) ) {
				int count = adapter.getRecordCount();
				session.setAttribute( "Count", String.valueOf( count ) );
				JsonData data = new JsonData();
				data.push( "count", String.valueOf( count ) );
				out.print( data.convertToJson() );
			} else if( request.getHeader( "Option" ).equals( "Get-Record" ) ) {
				String result = "[";
				ArrayList<String> tags = ( ArrayList<String> )session.getAttribute( "Tags" );
				int length = Integer.valueOf( ( String ) session.getAttribute( "Count" ) );
				for( int i = 0; i < length; i++ ) {
					JsonData data = adapter.getRecord( i + 1 );
					int index = Integer.valueOf( data.get( "tagIndex" ) ) - 1;
					String tagName = tags.get( index );
					data.push( "tag", tagName );
					result += data.convertToJson();
					System.out.println( result );
					if( i != length - 1 ) {
						result += ",";
					}
				}
				result += "]";
				out.print( result );
			}
			out.flush();
			out.close();
			adapter.deleteRecordView();
		} else if( request.getHeader( "Process" ).equals( "CustomDatalist" ) ) {
			sendData( "custom_datalist.json", "{}", response );
		} else if( request.getHeader( "Process" ).equals( "Verb" ) ) {
			sendData( "verb.json", "{\"label\":{},\"action\":[]}", response );
		} else if( request.getHeader( "Process" ).equals( "ReservedKeywords" ) ) {
			response.setContentType( "application/json" );
			response.setCharacterEncoding( "UTF-8" );
			ArrayList<String> tags = ( ArrayList<String> )session.getAttribute( "Tags" );
			String tagName = manager.getTagName();
			int tagIndex = tags.indexOf( tagName );
			File file = new File( webapp + "\\JSON\\reserved_keywords.json" );
			if( file.createNewFile() ) {
				try {
					List<String> reservedKeywords = new ArrayList<>();
					ObjectStream<String> oStream = new ObjectStream<>( reservedKeywords, webapp + "\\JSON\\reserved_keywords.json" );
					oStream.write();
				} catch( Exception e ) {
					
				}
			}
			/*
				System.out.println( line.substring( line.indexOf( '{' ), line.indexOf( '}' ) + 1 ) );
			*/
			List<String> reservedKeywordsList = new ArrayList<>();
			ObjectStream<String> oStream = new ObjectStream<>( reservedKeywordsList, webapp + "\\JSON\\reserved_keywords.json" );
			oStream.read();
			String reservedKeywords = "";
			try {
				reservedKeywords = reservedKeywordsList.get( tagIndex );
			} catch( IndexOutOfBoundsException e ) {
				e.printStackTrace();
			}
			PrintWriter outWriter = response.getWriter();
			outWriter.write( reservedKeywords );
			outWriter.close();
		} else if( request.getHeader( "Process" ).equals( "DocumentIndex" ) ) {
			response.setContentType( "text/plain" );
			response.setCharacterEncoding( "UTF-8" );
			String index = manager.getFileNumber();
			manager.deleteRecord();
			PrintWriter outWriter = response.getWriter();
			outWriter.write( index.substring( index.indexOf( '_' ) + 1 ) );
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
			List<Record> records = new ArrayList<Record>();
			BufferedData bufferedData = new BufferedData( request );
			byte[] buffer = bufferedData.getData( "Docs" );
			records.add( new Record( buffer, Record.TEXT ) );

			buffer = bufferedData.getData( "Illusts" );
			records.add( new Record( buffer, Record.TEXT ) );
			
			buffer = bufferedData.getData( "datalist" );
			File file = new File( webapp + "\\JSON\\custom_datalist.json" );
			PrintWriter printWriter = new PrintWriter( new BufferedWriter( new OutputStreamWriter( new FileOutputStream( file ), "UTF-8" ) ) );
			printWriter.print( new String( buffer, "UTF-8" ) );
			printWriter.close();
			
			buffer = bufferedData.getData( "Verb" );
			file = new File( webapp + "\\JSON\\verb.json" );
			printWriter = new PrintWriter( new BufferedWriter( new OutputStreamWriter( new FileOutputStream( file ), "UTF-8" ) ) );
			printWriter.print( new String( buffer, "UTF-8" ) );
			printWriter.close();
			
			buffer = bufferedData.getData( "Keywords" );
			file = new File( webapp + "\\JSON\\reserved_keywords.json" );
			String reservedKeywords = new String( buffer, "UTF-8" );
			ArrayList<String> tags = ( ArrayList<String> )session.getAttribute( "Tags" );
			int index = tags.indexOf( manager.getTagName() );
			List<String> reservedKeywordsList = new ArrayList<>();
			ObjectStream<String> oStream = new ObjectStream<>( reservedKeywordsList, webapp + "\\JSON\\reserved_keywords.json" );
			oStream.read();
			int newTagsNum = tags.size() - reservedKeywordsList.size();
			for( int i = 0; i < newTagsNum; i++ ) {
				reservedKeywordsList.add( "" );
			}
			reservedKeywordsList.remove( index );
			reservedKeywordsList.add( index, reservedKeywords );
			oStream.write();

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
		} else if( request.getHeader( "Process" ).equals( "Analysis" ) ) {
			request.setCharacterEncoding( "UTF-8" );
			InputStream inStream = ( InputStream ) request.getInputStream();
			byte[] buffer = inStream.readAllBytes();
			System.out.println( new String( buffer, "UTF-8" ) );
			inStream.close();
		} else if( request.getHeader( "Process" ).equals( "ExistingDocument" ) ) {
			response.setContentType( "application/json" );
			response.setCharacterEncoding( "UTF-8" );
			String columnName = null;
			ServletInputStream inStream = request.getInputStream();
			final byte[] buffer = inStream.readAllBytes();
			columnName = new String( buffer, "UTF-8" );
			System.out.println( columnName );
			boolean booleanValue = manager.existingDocument( columnName );
			PrintWriter outWriter = response.getWriter();
			System.out.println( booleanValue );
			outWriter.write( "{ \"isExists\" : " + booleanValue +" }" );
			outWriter.close();
		}
	}
	
	private void sendData( String filename, String initialize, HttpServletResponse response ) throws IOException {
		response.setContentType( "application/json" );
		response.setCharacterEncoding( "UTF-8" );
		PrintWriter outWriter = response.getWriter();
		File file = new File( webapp + "\\JSON\\" + filename );
		if( file.createNewFile() ) {
			try {
				FileWriter fileWriter = new FileWriter( webapp + "\\JSON\\" + filename );
				PrintWriter printWriter = new PrintWriter( new BufferedWriter( fileWriter ) );
				printWriter.print( initialize );
				printWriter.close();
			} catch( Exception e) {
				
			}
		}
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