package textwriter.process;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

public class StatusManager {
	public static final int TITLE = 0;
	public static final int SECTION = 1;
	public static final int COLUMN = 2;
	public static final int END = -1;
	
	private int state = StatusManager.TITLE;
	HttpServletRequest request;
	HttpSession session;
	String title;
	String section;
	List<String> columns;
	
	public StatusManager( HttpSession session ) {
		this.session = session;
		columns = new ArrayList<>();
		session.setAttribute( "column_names", columns );
	}
	public void execute() {
		switch( state ) {
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
	
	public int getState() {
		return this.state;
	}
	
	private void titleFunction() {
		this.title = this.request.getParameter( "title" );
		if( this.title != null ) {
			this.state = this.SECTION;
		}
		String num = this.request.getParameter( "num" );
		if( num != null && num != "" ) {
			int j = Integer.valueOf( num );
			ArrayList<String> tags = ( ArrayList<String> )this.session.getAttribute( "Tags" );
			String in = this.request.getParameter( "start-index" );
			for( int i = Integer.valueOf( in ); i < j; i++ ) {
				String name = this.request.getParameter( "new-tag" + String.valueOf( i ) );
				tags.add( name );
			}
		}

		String strEnd = this.request.getParameter( "end" );
		if( strEnd != null && strEnd != "" ) {
			int end = Integer.valueOf( strEnd );
			ArrayList<String> tags = ( ArrayList<String> )this.session.getAttribute( "Tags" );
			List<Integer> delIndex = new ArrayList<>();
			for( int i = 0; i < end; i++ ) {
				String delTag = this.request.getParameter( "del-menu" + String.valueOf( i ) );
				delIndex.add( Integer.valueOf( delTag ) );
			}
			Collections.sort( delIndex, Collections.reverseOrder() );
			for( int i = 0; i < end; i++ ) {
				tags.remove( delIndex.get( i ).intValue() );
			}
		}
	}
	
	private void sectionFunction() {
		String section = this.request.getParameter( "sec-title" );
		if( section != null ) {
			this.section = section;
			this.state = StatusManager.COLUMN;
		}
	}
	
	private void columnFunction() {
		String column = this.request.getParameter( "column" );
		String count = this.request.getParameter( "count" );
		String end = this.request.getParameter( "end" );
		if(  this.columns.size() > 0 ) {
			if( this.columns.get( this.columns.size() - 1 ) != column ) {
				this.columns.add( column );
			}
		} else if( column != null ) {
			this.columns.add( column );
			this.session.setAttribute( "NextOne", Boolean.FALSE );
		}

		if( end != null ) {
			if( !this.session.getAttribute( "Count").equals( count ) ) {
				this.session.setAttribute( "Count", count );
			}
		} else {
			this.state = StatusManager.END;
		}
	}
}
