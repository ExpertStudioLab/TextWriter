package json;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

//Find Breaking Point of ObjectBlock({}) and ArrayBlock([])
public class Blocks {
	public static final int ARRAY = 0;
	public static final int OBJECT = 1;
	public static final int BLOCKVALUE = 2;
	public static final int NONE = 3;
	private List<Block> blocks;
	private List<Integer> isClosed;
	private int count;
	private StringBuilder sb = null;

	public Blocks( StringBuilder data ) {
		this.sb = data;
		this.blocks = new ArrayList<>();
		this.isClosed = new ArrayList<>();
		this.count = 0;
	}
	public Blocks() {
		this.blocks = new ArrayList<>();
		this.isClosed = new ArrayList<>();
		this.count = 0;
	}
	public void add( int index, boolean isInternal ) {
		this.blocks.add( new Block( index, isInternal ) );
		if( count % 32 == 0 ) {
			this.isClosed.add( 0 );
		}
		this.count++;
	}
	public void add( int index, boolean isInternal, int type ) {
		this.blocks.add( new Block( index, isInternal, type ) );
		if( count % 32 == 0 ) {
			this.isClosed.add( 0 );
		}
		this.count++;
	}
	public void closeBlock( int index, int type ) {
		Block block = null;
		int blockIndex = this.count - 1;
		int checkDigit = 1;
		int checkIndex;
		for( int i = 1; i < this.count; i++ ) {
			if( this.blocks.get( i ).index > index ) {
				blockIndex = i - 1;
				break;
			}
		}
		checkDigit <<= blockIndex % 32;
		checkIndex = blockIndex / 32;
		Integer flags = this.isClosed.get( checkIndex );
		for( int i = blockIndex; i >= 0; i-- ) {
//			System.out.println( "flags: " + Integer.toBinaryString( flags ) + ", checkDigit: " + Integer.toBinaryString( checkDigit ) );
			if( ( flags & checkDigit ) == 0 && this.blocks.get( i ).type == type ) {
				block = this.blocks.get( i );
				block.isClosed = true;
				block.closeIndex = index;
				blockIndex = i;
				this.isClosed.set( checkIndex, flags + checkDigit );
				break;
			}
			if( checkDigit == 1 ) {
				checkDigit <<= 31;
				if( checkIndex != 0 ) {
					checkIndex--;
				}
				flags = this.isClosed.get( checkIndex );
			}
			checkDigit >>= 1;
		}
		for( int i = blockIndex + 1; i < this.count; i++ ) {
			Block tmpBlock = this.blocks.get( i );
			if( tmpBlock.index < index ) {
				tmpBlock.isNest = true;
				tmpBlock.depth++;
//				if( this.sb != null ) this.replaceNestedBlock( tmpBlock );
			} else {
				break;
			}
		}
	}
	public String getReplaceData() {
		if( this.sb != null ) {
			String data = new String( this.sb );
			data = data.replace( "#", "@$" );
			data = data.replace( "!", "@;" );
			return data;			
		}
		return null;
	}
	public String replaceData( String data ) {
		String replaceData = "";
		Pattern p = Pattern.compile( "[^\\[\\]\\{\\}]*(\\[|\\]|\\{|\\})" );
		Matcher m = p.matcher( data );
		while( m.find() ) {
			String tmp = m.group();
			int index = m.end() - 1;
			Block block = this.find( index );
			if( block.isNest ) {
				if( block.type == Blocks.ARRAY ) {
					if( block.index == index ) {
						tmp = tmp.replace( "[", ( block.depth != 1 ) ? "@ARR$" : "@ARROUT$" );
					} else if( block.closeIndex == index ) {
						tmp = tmp.replace( "]", ( block.depth != 1 ) ? "@ARR;" : "@ARROUT;" );
					}
				} else if( block.type == Blocks.OBJECT ) {
					if( block.index == index ) {
						tmp = tmp.replace( "{", ( block.depth != 1 ) ? "@OBJ$" : "@OBJOUT$" );
					} else if( block.closeIndex == index ) {
						tmp = tmp.replace( "}", ( block.depth != 1 ) ? "@OBJ;" : "@OBJOUT;" );
					}
				}
			} 
			replaceData += tmp;
		}
		if( replaceData == "" ) {
			replaceData = data;
		} else {
			int arrayIndex = data.lastIndexOf( ']' );
			int objectIndex = data.lastIndexOf( '}' );
			if( arrayIndex > objectIndex ) {
				replaceData += data.substring( arrayIndex + 1 );
			} else {
				replaceData += data.substring( objectIndex + 1 );
			}
		}
		return replaceData;
	}
	private Block find( int index ) {
		Block block = null;
		for( int i = 0; i < this.count; i++ ) {
			block = this.blocks.get( i );
			if( block.index == index || block.closeIndex == index ) {
				break;
			}
		}
		return block;
	}
	private void replaceNestedBlock( Block block ) {
		this.sb.replace( block.index, block.index + 1,  "#" );
		this.sb.replace( block.closeIndex, block.closeIndex + 1, "!" );
	}

	@Override
	public String toString() {
		String result = "[class: Block]\n";
		for( int i = 0; i < this.count; i++ ) {
			Block block = this.blocks.get( i );
			result += "Block[ " + i + " ]\n";
			result += "\tindex: " + String.valueOf( block.index ) + "\n";
			result += "\tcloseIndex: " + String.valueOf( block.closeIndex ) + "\n";
			result += "\tInternal: " + String.valueOf( block.isInternal ) + "\n";
			result += "\tNest: " + String.valueOf( block.isNest ) + "\n";
			result += "\tClosed: " + String.valueOf( block.isClosed ) + "\n";
			result += "\tType: " + ( ( block.type == Blocks.ARRAY ) ? "ARRAY" : "OBJECT" ) + "\n";
		}
		return result;
	}
}
class Block {
	public int index;
	public int closeIndex;
	public int depth;
	public boolean isInternal;
	public boolean isNest;
	public boolean isClosed;
	public int type;
	
	public Block( int index, boolean isInternal ) {
		this.index = index;
		this.closeIndex = -1;
		this.depth = 0;
		this.isInternal = isInternal;
		this.isNest = false;
		this.isClosed = false;
	}
	public Block( int index, boolean isInternal, int type ) {
		this.index = index;
		this.closeIndex = -1;
		this.isInternal = isInternal;
		this.isNest = false;
		this.isClosed = false;
		this.type = type;
	}
}

