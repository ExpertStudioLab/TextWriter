package database;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Types;
import java.util.ArrayList;

import json.JsonData;

public class DatabaseAdapter {
	private Connection connection;
	private String url = "jdbc:mysql://localhost:3306/autotextwriter?useSSL=false";
	private String user = "root";
	private String password = "root";
	public DatabaseAdapter() {
		try {
			Class.forName( "com.mysql.jdbc.Driver" );
			this.connection = DriverManager.getConnection( url, this.user, this.password );
		} catch( Exception e ) {
			
		}
	}
	
	public int getTagCount() {
		try {
			CallableStatement statement = connection.prepareCall( "{ call GetTagCount( ? ) }" );
			statement.registerOutParameter( 1, Types.TINYINT );
			statement.execute();
			
			return statement.getInt( 1 );
		} catch( Exception e ) {
			e.printStackTrace();
		}
		return 0;
	}
	public String getTag( int index ) {
		try {
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
			CallableStatement statement = connection.prepareCall( "{ call AddTag( ?, ? ) }" );
			statement.registerOutParameter( 2, Types.BOOLEAN );
			statement.setString( 1, name );
			statement.execute();
			
			return statement.getBoolean( 2 );
		} catch( Exception e ) {
			
		}
		return false;
	}
	
	public void createRecordView() {
		try {
			CallableStatement statement = connection.prepareCall( "{ call CreateRecord() }" );
			statement.execute();
		} catch( Exception e ) {
			
		}
	}
	public void deleteRecordView() {
		try {
			CallableStatement statement = connection.prepareCall( "{ call DeleteRecord() }" );
			statement.execute();
		} catch( Exception e ) {
			
		}
	}
	public int getRecordCount() {
		try {
			CallableStatement statement = connection.prepareCall( "{ call GetRowNumber( ? ) }" );
			statement.registerOutParameter( 1,  Types.BIGINT );
			statement.execute();
			return statement.getInt( 1 );
		} catch( Exception e ) {
			
		}
		return 0;
	}
	public JsonData getRecord( int index ) {
		try {
			JsonData data = new JsonData();
			CallableStatement statement = connection.prepareCall( "{ call GetRecord( ?, ?, ?, ?, ? ) }" );
			statement.setInt( 1, index );
			statement.registerOutParameter( 2, Types.VARCHAR );
			statement.registerOutParameter( 3, Types.TINYINT );
			statement.registerOutParameter( 4, Types.VARCHAR );
			statement.registerOutParameter( 5, Types.VARCHAR );
			statement.execute();
			
			data.push( "title", statement.getString( 2 ) );
			data.push( "tagIndex", String.valueOf( statement.getInt( 3 ) ) );
			data.push( "section", statement.getString( 4 ) );
			data.push( "column", statement.getString( 5 ) );
			
			return data;
		} catch( Exception e ) {
			
		}
		return null;
	}
}
