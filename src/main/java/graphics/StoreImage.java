package graphics;

import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Enumeration;
import java.util.List;

import javax.imageio.ImageIO;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import org.apache.tomcat.util.http.fileupload.FileItem;
import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.apache.tomcat.util.http.fileupload.RequestContext;
import org.apache.tomcat.util.http.fileupload.disk.DiskFileItemFactory;
import org.apache.tomcat.util.http.fileupload.servlet.ServletFileUpload;

/**
 * Servlet implementation class StoreImage
 */
//@WebServlet("/storeimage")
@WebServlet(name = "storeimage", urlPatterns = { "/storeimage" })
public class StoreImage extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private static String fileName;
    /**
     * @see HttpServlet#HttpServlet()
     */
    public StoreImage() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost( HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		int index;

		try {
			ServletInputStream servletInputStream = request.getInputStream();
			final byte[] buffer = new byte[ 1024 ];
			int streamBytes;
		
			String boundaryLine = request.getHeader( "Content-Type" );
			index = boundaryLine.indexOf( '=' ) + 1;
			String startBoundaryLine = "--" + boundaryLine.substring( index ) + "\r\n";
			String finishBoundaryLine = "--" + boundaryLine.substring( index ) + "--\r\n";
		
			while( ( streamBytes = servletInputStream.readLine( buffer, 0, buffer.length ) ) != -1 ) {
				String line = new String( buffer, 0, streamBytes, "UTF-8" );
				if( line.equals( startBoundaryLine ) ) continue;	// ignore line cause boundaryline
				if( buffer[ 0 ] == '\r' ) break;									// Header End
				if( ( index = line.indexOf( "filename") ) != -1 ) {
					index = index + "filename".length() + 2;
					fileName = line.substring( index );
					index = fileName.indexOf( '"' );
					fileName = fileName.substring( 0, index );
				}
			}
		
			File f = new File( "C:\\Users\\SmartBrightB\\Desktop\\Java Training\\Servlet Test\\TextWriter\\src\\main\\webapp\\img\\" + fileName );
			FileOutputStream fos = new FileOutputStream( f );
		
			while( ( streamBytes = servletInputStream.readLine(buffer, 0, buffer.length ) ) != -1
								&& !( new String( buffer, 0, streamBytes, "UTF-8" ).equals( finishBoundaryLine ) ) ) {
				fos.write( buffer, 0, streamBytes );
			}
			fos.close();
			
			BufferedImage bImage = ImageIO.read( f );

			ImageIO.write( bImage, "png", f );
		} catch ( Exception e) {
			System.out.println( "error" );
			e.printStackTrace( );
		}
		

		ServletContext sc = getServletContext();
		RequestDispatcher rd = sc.getRequestDispatcher( "/WEB-INF/sample.jsp" );
		rd.forward( request, response) ;
	}
}
