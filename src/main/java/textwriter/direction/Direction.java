package textwriter.direction;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import textwriter.process.StatusManager;

/**
 * Servlet implementation class Direction
 */
@WebServlet("/direction")
public class Direction extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Direction() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		HttpSession session = request.getSession();
		StatusManager manager = ( StatusManager ) session.getAttribute( "StatusManager" );
		manager.setRequest( request );
		manager.setResponse( response );

		if( request.getHeader( "Process" ).equals( "New-Document" ) ) {
			manager.setStatus( StatusManager.TITLE );
			session.setAttribute( "jsp_file", "auto_text_writer.jsp" );
		}else if( request.getHeader( "Process" ).equals( "Edit-Document" ) ) {
			session.setAttribute( "jsp_file", "document_list.jsp" );
		}
	}

}
