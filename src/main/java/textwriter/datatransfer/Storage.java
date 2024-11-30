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
import java.nio.file.Paths;
import java.sql.DriverManager;
import java.sql.SQLException;

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

		if( request.getHeader( "Process" ).equals( "Image" ) ) {

			Part filePart = request.getPart( "file" );
			System.out.println( filePart );
			String filename = Paths.get(filePart.getSubmittedFileName()).getFileName().toString();
			String path = "C:\\Users\\SmartBrightB\\Desktop\\Java Training\\Servlet Test\\TextWriter\\src\\main\\webapp\\img\\";
			InputStream inStream = filePart.getInputStream();
			byte[] buffer = inStream.readAllBytes();
			ByteArrayInputStream byteStream = new ByteArrayInputStream( buffer );
			File file = new File(path + filename);
			file.createNewFile();
			BufferedImage img = ImageIO.read(byteStream);
			ImageIO.write(img, "png", file);
			inStream.close();
			byteStream.close();
		} else if( request.getHeader( "Process" ).equals( "Save" ) ) {
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
		}	
	}
}
