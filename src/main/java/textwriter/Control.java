package textwriter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import textwriter.process.*;
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
		HttpSession session = this.getSession( request );
		StatusManager manager = ( StatusManager )session.getAttribute( "StatusManager" );
		manager.setRequest( request );

		manager.execute();
		switch( manager.getState() ) {
			case StatusManager.SECTION:
				session.setAttribute( "HeaderTitle", Boolean.TRUE );
				break;
			case StatusManager.COLUMN:
				session.setAttribute( "SectionTitle", Boolean.TRUE );
				break;
		}
		
/*
		if( session == null ) {
			this.initInputForm( request );
		} else if( request.getParameter( "title" ) != null ) {
			session.setAttribute( "HeaderTitle", Boolean.TRUE );
		} else if( request.getParameter( "sec-title" ) != null ) {
			session.setAttribute( "SectionTitle", Boolean.TRUE );
		} else if( request.getParameter( "column" ) != null ) {
			String column = request.getParameter( "column" );
			String count = request.getParameter( "count" );
			ArrayList<String> colNames = ( ArrayList<String> )session.getAttribute( "column_names" );
			if(  colNames.size() > 0  ) {
				if( colNames.get( colNames.size() - 1 ) != column ) {
					colNames.add( column );
				}
			} else {
				colNames.add( column );
				session.setAttribute( "NextOne", Boolean.FALSE );
			}
			if( !session.getAttribute( "Count").equals( count ) ) {
				session.setAttribute( "Count", count );
			}
		}

		String num = request.getParameter( "num" );
		if( num != null && num != "" ) {
			int j = Integer.valueOf( num );
			ArrayList<String> tags = ( ArrayList<String> )session.getAttribute( "Tags" );
			String in = request.getParameter( "start-index" );
			for( int i = Integer.valueOf( in ); i < j; i++ ) {
				String name = request.getParameter( "new-tag" + String.valueOf( i ) );
				tags.add( name );
			}
		}

		String strEnd = request.getParameter( "end" );
		if( strEnd != null && strEnd != "" ) {
			int end = Integer.valueOf( strEnd );
			ArrayList<String> tags = ( ArrayList<String> )session.getAttribute( "Tags" );
			List<Integer> delIndex = new ArrayList<>();
			for( int i = 0; i < end; i++ ) {
				String delTag = request.getParameter( "del-menu" + String.valueOf( i ) );
				delIndex.add( Integer.valueOf( delTag ) );
			}
			Collections.sort( delIndex, Collections.reverseOrder() );
			for( int i = 0; i < end; i++ ) {
				tags.remove( delIndex.get( i ).intValue() );
			}
		}
*/
		ServletContext sc = getServletContext();
		RequestDispatcher rd = sc.getRequestDispatcher( "/WEB-INF/" + session.getAttribute( "jsp_file" ) );
//		RequestDispatcher rd = sc.getRequestDispatcher( "/WEB-INF/sample.jsp" );
		rd.forward( request, response) ;
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

	private void initInputForm( HttpServletRequest request ) {
		HttpSession session = request.getSession( true );
		session.setAttribute( "Session", session);
		StatusManager manager = new StatusManager( session );
		session.setAttribute( "StatusManager", manager );
		List<String> tags = new ArrayList<>();
		session.setAttribute( "jsp_file",  "auto_text_writer.jsp" );
		session.setAttribute( "Tags", tags );
		session.setAttribute( "Count", "NONE" );
		session.setAttribute( "HeaderTitle", Boolean.FALSE );
		session.setAttribute( "SectionTitle", Boolean.FALSE );
		session.setAttribute( "NextOne", Boolean.TRUE );
	}

	private HttpSession getSession( HttpServletRequest request ) {
		HttpSession session = ( HttpSession ) request.getSession().getAttribute( "Session" );
		if( session == null ) {
			this.initInputForm( request );
			return ( HttpSession ) request.getSession().getAttribute( "Session" );
		} else {
			return session;
		}
	}
}
