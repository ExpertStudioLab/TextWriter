package textwriter.process;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import database.DatabaseAdapter;
import json.JsonData;

public class StatusManager {
	public static final int ABORT = 999;
	public static final int TITLE = 0;
	public static final int SECTION = 1;
	public static final int COLUMN = 2;
	public static final int END = -1;

	private int state = StatusManager.ABORT;
	HttpServletRequest request;
	HttpServletResponse response;
	HttpSession session;
	String tagName;
	String title;
	String section;
	String column;

	public StatusManager(HttpSession session) {
		this.session = session;
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
	
	public void setStatus( int state ) {
		this.state = state;
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
	
	public String getTagName() {
		return this.tagName;
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
	
	public void sendColumn() {
		JsonData data = new JsonData();
		data.push( "column", this.column );
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
			System.out.println( "抜き打ちたぬきちチェック" );
			this.state = StatusManager.SECTION;
			this.session.setAttribute( "TitleName", this.title );
		}

		String name = this.request.getParameter( "send-tag" );
		if( name != "" && name != null ) {
			DatabaseAdapter adapter = new DatabaseAdapter();
			boolean check = adapter.addTag( name );
			if( check ) {
				ArrayList<String> tags = ( ArrayList<String> ) this.session.getAttribute( "Tags" );
				tags.add( name );
			} else {
				System.out.println( "タグ名[ " + name +" ]は存在します。" );
			}
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
		System.out.println( "column: " + column );

		if( column != null ) {
			this.column = column;
//			this.session.setAttribute( "NextOne", Boolean.FALSE );
			this.session.setAttribute( "ColumnName", Boolean.TRUE );
		}

	}
	
	public String getFileNumber() {
		try {
			Connection connection;
			String url = "jdbc:mysql://localhost:3306/autotextwriter?useSSL=false";
			String user = "root";
			String password = "root";
			
			ArrayList<String> tags = ( ArrayList<String> ) this.session.getAttribute( "Tags" );


			Class.forName( "com.mysql.jdbc.Driver" );
			connection = DriverManager.getConnection( url, user, password );
			CallableStatement statement = connection.prepareCall( "{ call CreateRecord() }" );
			statement.execute();
			statement = connection.prepareCall( "{ call InsertColumn( ?, ?, ?, ?, ? ) }" );
			statement.registerOutParameter( 5, Types.VARCHAR );
			statement.setString( 1, this.title );

			int index = tags.indexOf( this.tagName ) + 1;
			statement.setInt( 2,  index );
			statement.setString( 3, this.section );
			statement.setString(4, this.column );
			statement.execute();
			
			String result = statement.getString( 5 );
			
			statement = connection.prepareCall( "{ call DeleteRecord }" );
			statement.execute();
	
			return result;
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	public void deleteRecord() {
		try {
			Connection connection;
			String url = "jdbc:mysql://localhost:3306/autotextwriter?useSSL=false";
			String user = "root";
			String password = "root";
			
			ArrayList<String> tags = ( ArrayList<String> ) this.session.getAttribute( "Tags" );


			Class.forName( "com.mysql.jdbc.Driver" );
			connection = DriverManager.getConnection( url, user, password );
			CallableStatement statement = connection.prepareCall( "{ call CreateRecord() }" );
			statement.execute();
			statement = connection.prepareCall( "{ call DeleteColumn(?,?,?,?) }" );
			statement.setString( 1, this.title );
			int index = tags.indexOf( this.tagName ) + 1;
			statement.setInt( 2, index );
			statement.setString( 3, this.section );
			statement.setString( 4, this.column );
			statement.execute();
			statement = connection.prepareCall( "{ call DeleteRecord }" );
			statement.execute();
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public boolean existingDocument( String columnName ) {
		boolean result = false;
		try {
			Connection connection;
			String url = "jdbc:mysql://localhost:3306/autotextwriter?useSSL=false";
			String user = "root";
			String password = "root";
			
			ArrayList<String> tags = ( ArrayList<String> ) this.session.getAttribute( "Tags" );


			Class.forName( "com.mysql.jdbc.Driver" );
			connection = DriverManager.getConnection( url, user, password );
			CallableStatement statement = connection.prepareCall( "{ call CreateRecord() }" );
			statement.execute();
			statement = connection.prepareCall( "{ call ExistingDocument( ? , ? , ? , ? , ? ) }" );
			statement.registerOutParameter( 5, Types.BOOLEAN );
			int index = tags.indexOf( this.tagName ) + 1;
			statement.setInt( 1, index );
			statement.setString( 2, this.title );
			statement.setString( 3, this.section );
			System.out.println( columnName );
			statement.setString( 4, columnName );
			statement.execute();
			result = statement.getBoolean( 5 );
			System.out.println( result );
			statement = connection.prepareCall( "{ call DeleteRecord }" );
			statement.execute();

		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return result;
	}
}