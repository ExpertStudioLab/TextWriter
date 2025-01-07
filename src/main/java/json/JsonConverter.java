package json;

import java.util.Stack;


public class JsonConverter {
	public Property property;
	public JsonConverter( String data ) {
		data = "{ \"hitsuji\" : [ [ { \"tanukichi\" : \"akuma\", \"kitsune\" : \"udon\" },{ \"nekomaru\" : \"ramen\" } ],"
				+ "[ { \"mikezou\" : \"takoyaki\"}, { \"tanubou\" : \"yakisoba\" } ] ] }";
		Stack<Statement> statements = new Stack<>();
		Stack<Node> nodeStack = new Stack<>();
		JsonString jsonStr = new JsonString( data );
		int length = jsonStr.getCount();
		int type = jsonStr.getType();
		Node node = null;
		if( type == Blocks.ARRAY ) {
			node = new ArrayNode();
		} else {
			node = new ObjectNode();
		}
		String parent = "Root";
		Statement statement = null;
		Node rootNode = node;
		for( int i = length - 1; i >= 0; i-- ) {
			Statement tmpStatement = new Statement( type, jsonStr.get( i ), node.getParent() );
			if( ( length > 0 ) && ( i != 0 ) ) {
				if( tmpStatement.value.matches( "\\[[^\\]]*\\]" ) ) {
					tmpStatement.nest = false;
				}
			}
			statements.push( tmpStatement );
		}

		while( ! statements.empty() ) {
			statement = statements.pop();

			if( ( ( ! node.getName().equals( statement.parent ) && !statement.parent.equals( "Root" ) )
					|| ( node.getName().matches( "[(Object)(Array)][^\\d]*\\d+" ) && statement.parent.equals( "Root" ) ) )
					&& statement.nest ) {
				boolean flag = true;
				if( ( node.getName().matches( "[(Object)(Array)].*" ) && statement.parent.matches( "Array.*" ) )
						|| ( statement.parent.equals( "Root" ) && node.getName().matches( "[(Object)(Array)].*" ) ) ) {
					node = nodeStack.pop();
					flag = false;
				}
				parent = statement.parent;
				while( flag ) {
					node = nodeStack.pop();
					if( node.getParent().equals( parent ) ) {
						if( parent.matches( "[(Object)(Array)(Value)].*" ) ) {
							node = nodeStack.pop();
						}
						break;
					}
				}
			} else if( ! statement.nest ) {
				while( ! node.getParent().equals( statement.parent ) ) {
					node = nodeStack.pop();
				}
				if( ! statement.parent.equals( "Root" ) ) {
					node = nodeStack.pop();
				}
			}
			
			jsonStr = new JsonString( statement.value );
			length = 0;
			type = jsonStr.getType();
			if( statement.type == Blocks.ARRAY  || statement.type == Blocks.BLOCKVALUE ) {
				if( type == Blocks.ARRAY || type == Blocks.OBJECT ) {
					if( ! ( node instanceof BlockValueNode ) ) ( ( ArrayNode )node ).addNode( type );
					Node newNode = ( node instanceof BlockValueNode ) ? ( ( BlockValueNode ) node ).getNode() : node.getCurrentNode();
					nodeStack.push( node );
					node = newNode;
					parent = node.getName();
					length = jsonStr.getCount();
				} else if( type == Blocks.NONE ) {
					( ( ArrayNode)node ).addValue( statement.value.replace( "\"", "") );
				}
			} else if( statement.type == Blocks.OBJECT ) {
				String name = statement.value.substring( statement.value.indexOf( '\"' ) + 1, statement.value.indexOf( ':' ) );
				name = name.substring( 0, name.indexOf( '\"' ) );
				String value = statement.value.substring( statement.value.indexOf( ':' ) + 1 );
				if( value.matches( "\s*(\\[|\\{).*") ) {
					type = ( value.matches( "\s*\\[.*" ) ) ? Blocks.ARRAY : Blocks.OBJECT;
					( ( ObjectNode ) node ).addBlockValue( name, type );
					type = Blocks.BLOCKVALUE;
					
					Node newNode = node.getCurrentNode();
					nodeStack.push( node );
					node = newNode;
					parent = name;
					length = jsonStr.getCount();
				} else {
					value = value.replaceAll( "\s*\"\s*", "" );
					if( node instanceof BlockValueNode ) {
						Node newNode = ( ( BlockValueNode )node ).getNode();
						nodeStack.push( node );
						node = newNode;
						parent = node.getName();
					}
					( ( ObjectNode ) node ).addValue( name, value );
				}
			}
			for( int i = length - 1; i >= 0; i-- ) {
				String insertStatement = null;
				if( i == 0 && jsonStr.get( i ).equals( statement.value ) ) {
					insertStatement = statement.value.substring( statement.value.indexOf( ':' ) + 1 );
				} else {
					insertStatement = jsonStr.get( i );
				}
				statements.push( new Statement( type, insertStatement, parent ) );
				if( ( length > 0 ) && ( i != 0 ) ) {
					if( insertStatement.matches( "\\[[^\\]]*\\]" ) ) {
						Statement tmpStatement = statements.pop();
						tmpStatement.nest = false;
						statements.push( tmpStatement );
					}
				}
			}
			if( length == 0 ) {
				
			}
		}
		this.property = rootNode.getProperty();
	}
}

class Statement {
	public String value;
	public int type;
	public String parent;
	public boolean nest = true;
	public Statement( int type, String value, String parent ) {
		this.type = type;
		this.value = value;
		this.parent = parent;
	}
}

/*
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
*/