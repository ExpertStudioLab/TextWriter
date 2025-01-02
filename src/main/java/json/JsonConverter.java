package json;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Stack;
import java.util.TreeMap;
import java.util.function.IntFunction;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class JsonConverter {
	
	public JsonConverter( String data ) {
		data = "{ \"tanukichi\" : [ { \"nekomaru\" : \"raamen\", \"tanubou\" : \"yakisoba\"},"
					+ " { \"akuma\" : \"onigiri\", \"kitsune\" : \"udon\" },"
					+ " { \"mikezou\" : \"takoyaki\", \"capipalla\" : \"watagashi\" }] }";
		Stack<Statement> statements = new Stack<>();
		Stack<Count> countStack = new Stack<>();
		Stack<Node> nodeStack = new Stack<>();
		JsonString jsonStr = new JsonString( data );
		int length = jsonStr.getCount();
		int type = jsonStr.getType();
		Node node = new Node( type );
		Node rootNode = node;
		for( int i = length - 1; i >= 0; i-- ) {
			statements.push( new Statement( type, jsonStr.get( i ), node.getParent() ) );
		}
		Count count = new Count();
		int objectCount = 1;
		int arrayCount = 1;
		int valueCount = 1;
		Statement statement = null;
		String parent = "Root";
		boolean nest = false;

		List<String> nestNode = new ArrayList<>();

		while( ! statements.empty() ) {
			statement = statements.pop();
//			if( ! statement.parent.equals( parent ) ) {
			if( ! node.getName().equals( statement.parent ) && !statement.parent.equals( "Root" ) ) {
				boolean flag = true;
				if( node.getName().matches( "[(Object)(Array)].*" ) && statement.parent.matches( "Array.*" ) ) {
					node = nodeStack.pop();
					flag = false;
				}
				parent = statement.parent;
				while( flag ) {
					node = nodeStack.pop();
					count = countStack.pop();
					System.out.println( "pop: " + node.getParent() );
					if( node.getParent().equals( parent ) ) {
						String parentName = node.getParent();
						if( parentName.matches( "Object.*" ) ||
								parentName.matches( "Array.*" ) ||
								parentName.matches( "Value.*" ) ) {
							node = nodeStack.pop();
							count = countStack.pop();
						}
						break;
					}
				}
			} else {
				parent = statement.parent;
			}
			jsonStr = new JsonString( statement.value );
			length = 0;
			type = jsonStr.getType();
			System.out.println( type );
			if( statement.type == Blocks.ARRAY  || nest ) {
				if( type == Blocks.ARRAY || type == Blocks.OBJECT ) {
					String name = ( type == Blocks.ARRAY ) ? "Array" + ( arrayCount++ ) : "Object" + ( objectCount++ );
					node.addNode( type, name );
					Node newNode = node.getCurrentNode();
					countStack.push( count );
					count = new Count();
					nodeStack.push( node );
					node = newNode;
//					parent = node.getParent();
					if( nest && parent.matches( "Array.*" ) ) {
						nestNode.add( parent );
					}
					parent = name;
					length = jsonStr.getCount();
				} else if( type == Blocks.NONE ) {
					node.add( "Value" + ( valueCount++ ), statement.value.replace( "\"", "" ) );
				}
				nest = false;

			} else if( statement.type == Blocks.OBJECT ) {
				String name = statement.value.substring( statement.value.indexOf( '\"' ) + 1, statement.value.indexOf( ':' ) );
				name = name.substring( 0, name.indexOf( '\"' ) );
				String value = statement.value.substring( statement.value.indexOf( ':' ) + 1 );
				if( value.matches( "\s*(\\[|\\{).*") ) {
//					type = value.matches( "\s*\\[.*" ) ? Blocks.ARRAY : Blocks.OBJECT;
//					node.addNode( type, name );
					node.addNode( Blocks.BLOCKVALUE, name );
//					type = value.matches( "\s*\\[.*" ) ? Blocks.ARRAY : Blocks.OBJECT;
					type = Blocks.BLOCKVALUE;
					Node newNode = node.getCurrentNode();
					countStack.push( count );
					count = new Count();
					nodeStack.push( node );
					node = newNode;
//					parent = node.getParent();
					parent = name;
					length = jsonStr.getCount();
					nest = true;
				} else {
					value = value.replaceAll( "\s*\"\s*", "" );
					node.add( name, value );
				}
			} else if( statement.type == Blocks.BLOCKVALUE ) {
				
			}
			for( int i = length - 1; i >= 0; i-- ) {
				String insertStatement = null;
				if( jsonStr.get( i ).equals( statement.value ) ) {
					insertStatement = statement.value.substring( statement.value.indexOf( ':' ) + 1 );
				} else {
					insertStatement = jsonStr.get( i );
				}
				statements.push( new Statement( type, insertStatement, parent ) );
			}
		}
		System.out.println( rootNode );
		Property property = rootNode.getProperty();
		System.out.println( "ねこまるチェックです！！" );
		System.out.println( property );
	}
}

abstract class Property {
	public static final int STRING = 0;
	public static final int INTEGER = 1;
	public static final int BOOLEAN = 2;
	
	public static final int OBJECT = 0;
	public static final int ARRAY = 1;
	private int depth = 0;
	private List<Boolean> objectNest;
	
	public abstract void set( String name, Property property );
	public abstract void set( Property property );
	public abstract String getName( int index );
	public String get( int[] index, String key ) {
		if( this instanceof ArrayProperty ) {
		} else {
			
		}
		
		return null;
	}
	@Override
	public String toString() {
		this.objectNest = new ArrayList<>();
		String result = "";
		if( this instanceof ArrayProperty ) {
			result = this.toStringArray( ( ArrayProperty ) this, 0 );
		} else {
			result = this.toStringObject( ( ObjectProperty ) this, 0 );
		}
		return result;
	}
	private String toString( Property property, int indent, int type ) {
		String result = "";
		String indentStr = "";
		for( int i = 0; i < indent; i++ ) {
			indentStr += "    ";
		}
		if( property instanceof ObjectProperty ) {
			if( type != Property.ARRAY ) result += indentStr;
			result += toStringObject( ( ObjectProperty ) property, indent );
		} else if( property instanceof ArrayProperty ) {
			if( type != Property.OBJECT ) result += indentStr;
			result += toStringArray( ( ArrayProperty ) property, indent );
		} else if( property instanceof ValueProperty ) {
			ValueProperty valueProperty = ( ValueProperty ) property;
			result += valueProperty.getValue();
		}
		return result;
	}
	private String toStringArray( ArrayProperty property, int indent ) {
		String result = "";
		int depth = this.depth++;
		this.objectNest.add( Boolean.FALSE );

		List<Property> list = property.getList();
		for( int i = 0; i < list.size(); i++ ) {
			this.depth = depth + 1;
			result += this.toString( list.get( i ), indent, Property.ARRAY );
		}
		return result;
	}
	private String toStringObject( ObjectProperty property, int indent ) {
		String result = "";
		String indentStr = "";
		boolean flag = false;
		int depth = this.depth++;
		this.objectNest.add( Boolean.FALSE );
		for( int i = 0; i < indent; i++ ) {
			indentStr += "    ";
		}
		Map<String,Property> object = property.getObject();
		Object[] names = object.keySet().toArray();

		for( int i = 0; i < object.size(); i++ ) {
			this.depth = depth + 1;
			if( i == 0 ) {
				for( int j = this.objectNest.size() - 1; j >= 0; j-- ) {
					if( this.objectNest.get( j ).equals( Boolean.TRUE ) ) {
						result += '\n';
						this.objectNest.set( j, Boolean.FALSE );
						break;
					}
				}
			}

			result += indentStr + "[ " + ( String )names[ i ] + " ]:    ";
			Property value = object.get( ( String ) names[ i ] );
			if( value instanceof ArrayProperty || value instanceof ObjectProperty ) {
				this.objectNest.set( depth, Boolean.TRUE );
				flag = true;
			}
			result += toString( value, indent + 1, Property.OBJECT );
			if( ! flag ) {
				result += '\n';
			} else {
				flag = false;
			}
		}
		return result;
	}
}
class ObjectProperty extends Property {
	private Map<String,Property> object;
	public ObjectProperty() {
		this.object = new TreeMap<>();
	}
	public void set( String name, Property property ) {
		this.object.put( name, property );
	}
	public void set( Property property ) {
	}
	public String getName( int index ) {
		Object[] names = object.keySet().toArray();
		return ( String ) names[ index ];
	}
	public Map<String,Property> getObject() {
		return this.object;
	}
}
class ArrayProperty extends Property {
	private List<Property> list;
	public ArrayProperty() {
		this.list = new ArrayList<>();
	}
	public void set( Property property ) {
		this.list.add( property );
	}
	public void set( String name, Property property ) {
	}
	public String getName( int index ) {
		return null;
	}
	public List<Property> getList() {
		return this.list;
	}
}
class ValueProperty extends Property {
	private String value;
	private int valueType;
	public ValueProperty( String value ) {
		this.valueType = Property.STRING;
		if( value.equals( "true" ) || value.equals( "false" ) ) {
			this.valueType = Property.BOOLEAN;
		} else if( value.matches( "\s*-?\s*\\d+(.\\d+)?" ) ) {
			this.valueType = Property.INTEGER;
		}
		this.value = value;
	}
	public void set( Property property ) {
	}
	public void set( String name, Property property ) {
	}
	public String getName( int index ) {
		return null;
	}
	public String getValue() {
		return this.value;
	}
}


class Count {
	public int arrayValue = 1;
}
class Statement {
	public String value;
	public int type;
	public String parent;
	public Statement( int type, String value, String parent ) {
		this.type = type;
		this.value = value;
		this.parent = parent;
	}
}

class Node {
	public static final int NONE = 3;
	public static final int BOOLEAN = 0;
	public static final int INTEGER = 1;
	public static final int STRING = 2;
	private int type;
	private String parent;
	private String name;
	private String value;
	private int valueType;
	private List<Node> nodeList;
	private String[] types = { "ARRAY", "OBJECT", "BLOCKVALUE", "NONE" };
	public Node( int type ) {
		this.nodeList = null;
		String name = ( type == Blocks.ARRAY ) ? "ArrayBlock" : "ObjectBlock";
		this.createNode( type, "Root", name, null, Node.NONE );
	}
	public Node( int type, String parent, String name, String value, int valueType ) {
		this.nodeList = null;
		this.createNode( type, parent, name, value, valueType );
	}
	private void createNode( int type, String parent, String name, String value, int valueType ) {
		this.type = type;
		this.parent = parent;
		this.name = name;
		this.value = value;
		this.valueType = valueType;
		if( this.value == null ) {
			nodeList = new ArrayList<>();
		}
	}
	public void addNode( int type, String name ) {
		this.nodeList.add( new Node( type, this.name, name, null, Node.NONE ) );
	}
	public void add( String name, String value ) {
		int valueType = Node.STRING;
		if( value == "true" || value == "false" ) {
			valueType = Node.BOOLEAN;
		} else if( value.matches( "\s*-?\s*\\d+(\\.\\d+)?") ) {
			valueType = Node.INTEGER;
		}
		this.nodeList.add( new Node( Blocks.NONE, this.name, name, value, valueType ) );
	}
	public int getType() {
		return this.type;
	}
	public String getParent() {
		return this.parent;
	}
	public String getValue() {
		return this.value;
	}
	public int getValueType() {
		return this.valueType;
	}
	public List<Node> getNodeList() {
		return this.nodeList;
	}
	public Node getCurrentNode() {
		return this.nodeList.get( this.nodeList.size() - 1 );
	}
	@Override
	public String toString() {
		String result = "";
		result += this.name + "\n";
		result += " [type]: " + this.types[ this.type ] + "\n";
		result += " [parent]: " + this.parent + "\n";
		for( int i = 0; i < this.nodeList.size(); i++ ) {
			result += this.nodeList.get( i ).toString( 1 );
		}
		return result;
	}
	public String getName() {
		return this.name;
	}
	private String toString( int indent ) {
		String result = "";
		String indentStr = "";
		for( int i = 0; i < indent; i++ ) {
			indentStr += "    ";
		}
		result += indentStr + this.name;

		if( this.nodeList != null ) {
			result += '\n';
			result += indentStr + " [type]: " + types[ this.type ] + "\n";
			result += indentStr + " [parent]: " + this.parent+ "\n";
			for( int i = 0 ; i < this.nodeList.size(); i++ ) {
				result += this.nodeList.get( i ).toString( indent + 1 );
			}
		} else {
			for( int i = 0; i < indent + 1; i++ ) {
				result += "    ";
			}
			result += this.value + '\n';
			result += indentStr + " [type]: " + types[ this.type ] + "\n";
			result += indentStr + " [parent]: " + this.parent + "\n";
		}
		return result;
	}
	
	public Property getProperty() {
		// Is outerBlock ObjectBlock({}) or ArrayBlock([]) ?
		Property property = ( this.type == Blocks.OBJECT ) ? new ObjectProperty() : new ArrayProperty();
		for( int i = 0; i < this.nodeList.size(); i++ ) {
			Node childNode = this.nodeList.get( i );
			Property childProperty = childNode.createProperty();
			if( this.type == Blocks.OBJECT ) {
				property.set( this.nodeList.get( i ).getName(), childProperty );
			} else if( this.type == Blocks.ARRAY ) {
				property.set( childProperty );
			}
		}
		return property;
	}
	private Property createProperty( ) {
		Property property = null;
		Property childProperty = null;

		System.out.println( this.types[ this.type ] + ": " + this.name );
		if( this.type == Blocks.BLOCKVALUE ) {
			if( this.parent.equals( "ObjectBlock" ) || this.parent.equals( "ArrayBlock" ) ) {
				return this.nodeList.get( 0 ).createProperty();
			} else {
				Node childNode = this.nodeList.get( 0 );
				childProperty = childNode.createProperty();
				if( childNode.type == Blocks.ARRAY ) {
					property = new ArrayProperty();
					property.set( childProperty );
				} else if( childNode.type == Blocks.OBJECT ) {
					property = new ObjectProperty();
					property.set( this.name, childProperty );
				}
				return property;
			}
		} else if( this.type == Blocks.NONE ) {
			if( ! this.name.matches( "Value.*" ) ) {
				property = new ObjectProperty();
				property.set( this.name, new ValueProperty( this.value ) );
			} else {
				property = new ValueProperty( this.value );
			}
		} else if( this.type == Blocks.ARRAY ) {
			property = new ArrayProperty();
			for( int i = 0; i < this.nodeList.size(); i++ ) {
				Node childNode = this.nodeList.get( i );
				if( childNode.getType() == Blocks.NONE ) {
					if( childNode.getName().matches( "Value.*" ) ) {
						property.set( new ValueProperty( childNode.getValue() ) );
					} else {
						childProperty = new ObjectProperty();
						childProperty.set( childNode.getName(), new ValueProperty( childNode.getValue() ) );
						property.set( childProperty );
					}
				} else if( childNode.getType() == Blocks.ARRAY ||
								childNode.getType() == Blocks.OBJECT ) {
					for( int j = 0; j < childNode.getNodeList().size(); j++ ) {
						childProperty = childNode.getNodeList().get( j ).createProperty();
						property.set( childProperty );	
					}
				}
			}
		} else if( this.type == Blocks.OBJECT ) {
			property = new ObjectProperty();
			for( int i = 0; i < this.nodeList.size(); i++ ) {
				Node childNode = this.nodeList.get( i );
				if( childNode.getType() == Blocks.NONE ) {
					property.set( childNode.getName(),  new ValueProperty( childNode.getValue() ) );
				} else if( childNode.getType() == Blocks.BLOCKVALUE ) {
					property.set( childNode.getName(), childNode.createProperty() );
				}
			}
		}
		return property;
	}

}