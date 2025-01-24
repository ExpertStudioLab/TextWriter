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
				System.out.println( "たぬきち：「数をかぞえる！！！」(._.)" );
				int count = adapter.getRecordCount();
				session.setAttribute( "Count", String.valueOf( count ) );
				JsonData data = new JsonData();
				data.push( "count", String.valueOf( count ) );
				out.print( data.convertToJson() );
			} else if( request.getHeader( "Option" ).equals( "Get-Record" ) ) {
				System.out.println( "たぬきち：「レコードを返す！！！」('_')" );
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
			response.setContentType( "application/json" );
			response.setCharacterEncoding( "UTF-8" );
			PrintWriter outWriter = response.getWriter();
			File file = new File( webapp + "\\JSON\\custom_datalist.json" );
			if( file.createNewFile() ) {
				try {
					FileWriter fileWriter = new FileWriter( webapp + "\\JSON\\custom_datalist.json" );
					PrintWriter printWriter = new PrintWriter( new BufferedWriter( fileWriter ) );
					printWriter.print( "[]" );
					printWriter.close();
				} catch( Exception e) {
					
				}
			}
			FileInputStream fileIn = new FileInputStream( file );
			InputStreamReader inStreamReader = new InputStreamReader( fileIn, "UTF-8" );
			BufferedReader bufferedReader = new BufferedReader( inStreamReader );
			String line;
			while( ( line = bufferedReader.readLine() ) != null ) {
				System.out.print( line );
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
			
			buffer = bufferedData.getData( "datalist" );
			File file = new File( webapp + "\\JSON\\custom_datalist.json" );
			PrintWriter printWriter = new PrintWriter( new BufferedWriter( new OutputStreamWriter( new FileOutputStream( file ), "UTF-8" ) ) );
			printWriter.print( new String( buffer, "UTF-8" ) );
			printWriter.close();

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
		} else if( request.getHeader( "Process" ).equals( "Analysis" ) ) {
			request.setCharacterEncoding( "UTF-8" );
			InputStream inStream = ( InputStream ) request.getInputStream();
			byte[] buffer = inStream.readAllBytes();
			System.out.println( new String( buffer, "UTF-8" ) );
			inStream.close();
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