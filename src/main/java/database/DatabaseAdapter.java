package database;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Types;
import java.util.ArrayList;

public class DatabaseAdapter {
	private Connection connection;
	private String url = "jdbc:mysql://localhost:3306/autotextwriter?useSSL=false";
	private String user = "root";
	private String password = "root";
	public DatabaseAdapter() {

	}
	
	public int getTagCount() {
		try {
			Class.forName( "com.mysql.jdbc.Driver" );
			this.connection = DriverManager.getConnection( url, this.user, this.password );
			
			CallableStatement statement = connection.prepareCall( "{ call GetTagCount( ? ) }" );
			statement.registerOutParameter( 1, Types.TINYINT );
			statement.execute();
			
			return statement.getInt( 1 );
		} catch( Exception e ) {
			
		}
		return 0;
	}
	public String getTag( int index ) {
		try {
			Class.forName( "com.mysql.jdbc.Driver" );
			this.connection = DriverManager.getConnection( url, this.user, this.password );
			
			CallableStatement statement = connection.prepareCall( "{ call GetTag( ?, ? ) }" );
			statement.registerOutParameter( 2, Types.VARCHAR );
			statement.setInt( 1, index );
			statement.execute();
			
			return statement.getString( 2 );
		} catch( Exception e ) {
			
		}		
		return null;
	}
	public boolean addTag( String name ) {
		try {
			Class.forName( "com.mysql.jdbc.Driver" );
			this.connection = DriverManager.getConnection( url, this.user, this.password );
			
			CallableStatement statement = connection.prepareCall( "{ call AddTag( ?, ? ) }" );
			statement.registerOutParameter( 2, Types.BOOLEAN );
			statement.setString( 1, name );
			statement.execute();
			
			return statement.getBoolean( 2 );
		} catch( Exception e ) {
			
		}
		return false;
	}
}
