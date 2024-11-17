package textwriter.datatransfer;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Paths;

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

/**
 * Servlet implementation class Storage
 */
@WebServlet("/storage")
//@MultipartConfig
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
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		HttpSession session = request.getSession();
		OutputStream outStream = response.getOutputStream();
		if (request.getHeader("Process").equals("FileNumber")) {
			String num = (String) session.getAttribute("FileNumber");
			outStream.write(num.getBytes());
		} else {
//		response.setContentType( "image/png");
			response.setContentType("application/octet-stream");
//		response.setHeader( "Content-Disposition", "attachment;filename = \"sample001.png\"" );
			InputStream inStream = getServletContext().getResourceAsStream("/img/sample001.png");
			byte[] dataStream = inStream.readAllBytes();
			inStream.close();

			outStream.write(dataStream);
			outStream.flush();
		}
		outStream.close();

		 ServletContext sc = getServletContext();
		 RequestDispatcher rd = sc.getRequestDispatcher( "/WEB-INF/sample.jsp" );
		 rd.forward( request, response) ;

//		request.getRequestDispatcher( "/WEB-INF/" + session.getAttribute( "jsp_file") ).forward( request, response );

	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		if( request.getHeader( "Process" ).equals( "Image" ) ) {
		String path = "C:\\Users\\SmartBrightB\\Desktop\\Java Training\\Servlet Test\\TextWriter\\src\\main\\webapp\\img\\";
		ByteArrayInputStream byteStream = new ByteArrayInputStream( request.getInputStream().readAllBytes());
		File file = new File(path + "sample003.png" );
		file.createNewFile();
		BufferedImage img = ImageIO.read(byteStream);
		ImageIO.write(img, "png", file);
		byteStream.close();
		}	

		HttpSession session = request.getSession();
		
		
		
		/*
		Part filePart = request.getPart("img_" + session.getAttribute("FileNumber"));
		String filename = Paths.get(filePart.getSubmittedFileName()).getFileName().toString();
		String path = "C:\\Users\\SmartBrightB\\Desktop\\Java Training\\Servlet Test\\TextWriter\\src\\main\\webapp\\img\\";
		ByteArrayInputStream byteStream = new ByteArrayInputStream(filePart.getInputStream().readAllBytes());
		File file = new File(path + filename);
		file.createNewFile();
		BufferedImage img = ImageIO.read(byteStream);
		ImageIO.write(img, "png", file);
		byteStream.close();
*/
		/*
		 * String filename = "sample002.png"; String path =
		 * "C:\\Users\\SmartBrightB\\Desktop\\Java Training\\Servlet Test\\TextWriter\\src\\main\\webapp\\img\\"
		 * ;
		 */

		ServletContext sc = getServletContext();
		RequestDispatcher rd = sc.getRequestDispatcher("/WEB-INF/" + session.getAttribute("jsp_file"));
//			RequestDispatcher rd = sc.getRequestDispatcher( "/WEB-INF/sample.jsp" );
		rd.forward(request, response);

	}

}
