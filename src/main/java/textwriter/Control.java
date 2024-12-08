package textwriter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import textwriter.process.StatusManager;

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
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HttpSession session = this.getSession( request );
		StatusManager manager = ( StatusManager ) session.getAttribute( "StatusManager" );
		manager.setRequest( request );
		manager.setResponse( response );

		manager.execute();
		switch (manager.getState()) {
		case StatusManager.SECTION:
			session.setAttribute("HeaderTitle", Boolean.TRUE);
			break;
		case StatusManager.COLUMN:
			session.setAttribute("SectionTitle", Boolean.TRUE);
			break;
		}
		System.out.println( "hello ねこまる" );
		ServletContext sc = getServletContext();
		RequestDispatcher rd = sc.getRequestDispatcher("/WEB-INF/" + session.getAttribute("jsp_file"));
//		RequestDispatcher rd = sc.getRequestDispatcher( "/test01.jsp" );
		rd.forward(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//		HttpSession session = request.getSession();

		/*
		 * String filename = "sample002.png"; String path =
		 * "C:\\Users\\SmartBrightB\\Desktop\\Java Training\\Servlet Test\\TextWriter\\src\\main\\webapp\\img\\"
		 * ;
		 */
		HttpSession session = this.getSession(request);
		StatusManager manager = (StatusManager) session.getAttribute("StatusManager");
		manager.setRequest(request);

		manager.execute();

/*
		ServletContext sc = getServletContext();
		RequestDispatcher rd = sc.getRequestDispatcher("/WEB-INF/" + session.getAttribute("jsp_file"));
//			RequestDispatcher rd = sc.getRequestDispatcher( "/test01.jsp" );
		rd.forward(request, response);
*/
	}

	private void initInputForm(HttpServletRequest request) {
		HttpSession session = request.getSession(true);
		session.setAttribute("Session", session);
		StatusManager manager = new StatusManager(session);
		session.setAttribute("StatusManager", manager);
		List<String> tags = new ArrayList<>();
		tags.add( "ノンジャンル" );
		session.setAttribute("jsp_file", "auto_text_writer.jsp");
		session.setAttribute("Tags", tags);
		session.setAttribute("Count", "NONE");
		session.setAttribute("HeaderTitle", Boolean.FALSE);
		session.setAttribute("SectionTitle", Boolean.FALSE);
		session.setAttribute("NextOne", Boolean.TRUE);
		session.setAttribute("FileNumber", "1");
	}

	private HttpSession getSession(HttpServletRequest request) {
		HttpSession session = (HttpSession) request.getSession().getAttribute("Session");
		if (session == null) {
			this.initInputForm(request);
			return (HttpSession) request.getSession().getAttribute("Session");
		} else {
			return session;
		}
	}
}
