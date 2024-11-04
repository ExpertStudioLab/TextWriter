package textwriter.datatransfer;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class Storage
 */
@WebServlet("/storage")
public class Storage extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Storage() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//		response.setContentType( "image/png");
		response.setContentType( "application/octet-stream");
//		response.setHeader( "Content-Disposition", "attachment;filename = \"sample001.png\"" );
		InputStream inStream = getServletContext().getResourceAsStream( "/img/sample001.png");
		byte[] dataStream = inStream.readAllBytes();
		inStream.close();

		OutputStream outStream = ( OutputStream )response.getOutputStream();
		outStream.write( dataStream );
		outStream.flush();
		outStream.close();
		
		/*
		ServletContext sc = getServletContext();
		RequestDispatcher rd = sc.getRequestDispatcher( "/WEB-INF/sample.jsp" );
		rd.forward( request, response) ;
		*/
		request.getRequestDispatcher( "/WEB-INF/sample.jsp" ).forward( request, response );

	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		ByteArrayInputStream byteStream = new ByteArrayInputStream( request.getInputStream().readAllBytes() );
		String filename = "sample002.png";
		String path = "C:\\Users\\SmartBrightB\\Desktop\\Java Training\\Servlet Test\\TextWriter\\src\\main\\webapp\\img\\";
		File file = new File( path + filename );
		file.createNewFile();
		BufferedImage img = ImageIO.read( byteStream );
		ImageIO.write( img, "png", file );
		byteStream.close();

	}

}
