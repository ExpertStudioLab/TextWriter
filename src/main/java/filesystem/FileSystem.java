package filesystem;

import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Serializable;
import java.io.UnsupportedEncodingException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import textwriter.datatransfer.Record;
import objstream.ObjectStream;

import javax.imageio.ImageIO;

import json.JsonConverter;

public class FileSystem {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
//		List<Record> records = new ArrayList<>();
//		ObjectStream<Record> objStream = new ObjectStream<>( records, "C:\\Users\\SmartBrightB\\Desktop\\Java Training\\Servlet Test\\TextWriter\\src\\main\\webapp\\Doc\\2_1_1_2.dat" );
//		objStream.read();
//		String docs = new String( records.get( 0 ).getRecord() );
		String path = Paths.get( "" ).toAbsolutePath().toString();
		File file = new File( path + "\\json.txt" );
		FileInputStream fileIn;
		try {
//			String doc = Files.readString( path );
			fileIn = new FileInputStream( file );
			byte[] buffer = fileIn.readAllBytes();
			
			JsonConverter converter = new JsonConverter( new String( buffer, "UTF-8" ) );
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}
}
