package graphics;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import javax.imageio.ImageIO;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class StoreImage
 */
//@WebServlet("/storeimage")
@WebServlet(name = "storeimage", urlPatterns = { "/storeimage" })
public class StoreImage extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private static String fileName;
	private String startBoundaryLine;
	private String finishBoundaryLine;
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
		
		ServletContext sc = getServletContext();
		RequestDispatcher rd = sc.getRequestDispatcher( "/WEB-INF/sample.jsp" );
		rd.forward( request, response) ;

	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost( HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		int index;
		final byte[] buffer = new byte[ 1024 ];
		int streamBytes;

		ServletInputStream servletInputStream = request.getInputStream();
		
		init( request );
		try {		
			while( ( streamBytes = servletInputStream.readLine( buffer, 0, buffer.length ) ) != -1 ) {
				String line = new String( buffer, 0, streamBytes, "UTF-8" );
				if( line.equals( this.startBoundaryLine ) ) continue;	// ignore line cause boundaryline
				if( buffer[ 0 ] == '\r' ) break;									// Header End
				// get a filename that will be used when this program store received data.
				if( ( index = line.indexOf( "filename") ) != -1 ) {
					index = index + "filename".length() + 2;
					String tmp = line.substring( index );
					index = tmp.indexOf( '"' );
					fileName = tmp.substring( 0, index );
				}
			}
		
			File f = new File( "C:\\Users\\SmartBrightB\\Desktop\\Java Training\\Servlet Test\\TextWriter\\src\\main\\webapp\\img\\" + fileName );
			FileOutputStream fos = new FileOutputStream( f );
		
			while( ( streamBytes = servletInputStream.readLine(buffer, 0, buffer.length ) ) != -1
								&& !( new String( buffer, 0, streamBytes, "UTF-8" ).equals( this.finishBoundaryLine ) ) ) {
				fos.write( buffer, 0, streamBytes );
			}
			fos.close();
			
			// make image file data available.
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
	
	private void init ( HttpServletRequest request ) {
		int index;
		String boundaryLine = request.getHeader( "Content-Type" );
		index = boundaryLine.indexOf( '=' ) + 1;
		this.startBoundaryLine = "--" + boundaryLine.substring( index ) + "\r\n";
		this.finishBoundaryLine = "--" + boundaryLine.substring( index ) + "--\r\n";
		
	}
}
