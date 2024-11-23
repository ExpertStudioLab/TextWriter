package textwriter.process;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import json.JsonData;

public class StatusManager {
	public static final int TITLE = 0;
	public static final int SECTION = 1;
	public static final int COLUMN = 2;
	public static final int END = -1;

	private int state = StatusManager.TITLE;
	HttpServletRequest request;
	HttpServletResponse response;
	HttpSession session;
	String tagName;
	String title;
	String section;
	List<String> columns;

	public StatusManager(HttpSession session) {
		this.session = session;
		columns = new ArrayList<>();
		session.setAttribute("column_names", columns);
	}

	public void execute() {
		switch (state) {
		case StatusManager.TITLE:
			this.titleFunction();
			break;
		case StatusManager.SECTION:
			this.sectionFunction();
			break;
		case StatusManager.COLUMN:
			this.columnFunction();
			break;
		}
	}

	public void setRequest( HttpServletRequest request ) {
		this.request = request;
	}
	
	public void setResponse( HttpServletResponse response ) {
		this.response = response;
	}

	public int getState() {
		return this.state;
	}
	
	public void sendTitle() {
		JsonData data = new JsonData();
		data.push( "title", this.title );
		data.push( "tagName", this.tagName );
		sendData( data );
	}
	
	public void sendSection() {
		JsonData data = new JsonData();
		data.push( "section", this.section );
		sendData( data );
	}
	
	public void sendColumn( int index ) {
		JsonData data = new JsonData();
		data.push( "column", this.columns.get( index ) );
		sendData( data );
	}
	
	private void sendData( JsonData data ) {
		try {
			this.response.setContentType( "application/json; charset=UTF-8" );
			PrintWriter out = this.response.getWriter();
			out.print( data.convertToJson() );
			out.flush();
			out.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}		
	}

	private void titleFunction() {
		this.title = this.request.getParameter("title");
		this.tagName = this.request.getParameter( "tag-name" );

		if (this.title != null) {
			this.state = StatusManager.SECTION;
			this.session.setAttribute( "TitleName", this.title );

		}

		String name = this.request.getParameter( "send-tag" );
		if( name != "" && name != null ) {
			ArrayList<String> tags = ( ArrayList<String> ) this.session.getAttribute( "Tags" );
			tags.add( name );
			System.out.println( "new tag name: " + name );
		}

		name = this.request.getParameter( "delete-tag" );
		if( name != null ) {
			ArrayList<String> tags = ( ArrayList<String> ) this.session.getAttribute( "Tags" );
			System.out.println( "before tags: " + tags );
			tags.remove( tags.indexOf( name ) );
			System.out.println( "delete tag name: " + name );
			System.out.println( "after tags: " + tags );
		}
	}

	private void sectionFunction() {
		this.section = this.request.getParameter("sec-title");
		System.out.println( "section: " + this.section);
		if (section != null) {
			this.state = StatusManager.COLUMN;
		}
	}

	private void columnFunction() {
		String column = this.request.getParameter("column");
		String count = this.request.getParameter("count");
		String end = this.request.getParameter("end");
		System.out.println( "column: " + column );
		if (this.columns.size() > 0 && column != null ) {
			if (this.columns.get(this.columns.size() - 1) != column) {
				this.columns.add(column);
			}
		} else if (column != null) {
			this.columns.add(column);
			this.session.setAttribute("NextOne", Boolean.FALSE);
		}

		if (end == null && count != null ) {
			if (!this.session.getAttribute("Count").equals(count)) {
				this.session.setAttribute("Count", count);
			}
		} else if( end != null ){
			this.state = StatusManager.END;
		}
	}
}