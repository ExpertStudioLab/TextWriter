package textwriter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Servlet implementation class Control
 */
@WebServlet(name = "TextWriter", urlPatterns = { "/TextWriter" })
public class Control extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Control() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		HttpSession session = request.getSession( true );
		if( session.getAttribute( "HeaderTitle" ) == null ) {
			List<String> tags = new ArrayList<>();
			session.setAttribute( "jsp_file",  "auto_text_writer.jsp" );
			session.setAttribute( "Tags", tags );
			session.setAttribute( "HeaderTitle", Boolean.FALSE );
			session.setAttribute( "SectionTitle", Boolean.FALSE );
		}

		
		String num = request.getParameter( "num" );
		if( num != null && num != "" ) {
			int j = Integer.valueOf( num );
			ArrayList<String> tags = ( ArrayList<String> )session.getAttribute( "Tags" );
			String in = request.getParameter( "start-index" );
			System.out.println( in );
			for( int i = Integer.valueOf( in ); i < j; i++ ) {
				String name = request.getParameter( "new-tag" + String.valueOf( i ) );
				tags.add( name );
			}
		}

		
		ServletContext sc = getServletContext();
		RequestDispatcher rd = sc.getRequestDispatcher( "/WEB-INF/" + session.getAttribute( "jsp_file" ) );
		rd.forward( request, response) ;
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
