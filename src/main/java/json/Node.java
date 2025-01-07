package json;

import java.util.ArrayList;
import java.util.List;

abstract class Node {
	public static final int NONE = 3;
	public static final int BOOLEAN = 0;
	public static final int INTEGER = 1;
	public static final int STRING = 2;
	
	protected String parent;
	protected String name;
	
	private String[] types = { "BOOLEAN", "INTEGER", "STRING" };

	public String getParent() {
		return this.parent;
	}
	public String getName() {
		return this.name;
	}
	public abstract String getValue();
	public abstract List<Node> getNodeList();
	public abstract Node getCurrentNode();
	protected abstract String display();
	public abstract void addNode( int type );
	@Override
	public String toString() {
		String result = "";
		String type = "";
		result += this.name + "\n";
		if( this instanceof ArrayNode ) {
			type = "ARRAY";
		} else if( this instanceof ObjectNode ) {
			type = "OBJECT";
		} else if( this instanceof ValueNode ) {
			type = "VALUE";
		} else if( this instanceof BlockValueNode ) {
			type = "BLOCKVALUE";
		}
		result += " [type]: " + type + "\n";
		result += " [parent]: " + this.parent + "\n";

		result += this.display();
		return result;
	}
	protected String toString( int indent ) {
		String result = "";
		String indentStr = "";
		for( int i = 0; i < indent; i++ ) {
			indentStr += "    ";
		}
		result += indentStr + this.name;
		
		List<Node> nodeList = this.getNodeList();

		if( nodeList != null ) {
			result += '\n';
			String type = "";
			if( this instanceof ArrayNode ) {
				type = "ARRAY";
			} else if( this instanceof ObjectNode ) {
				type = "OBJECT";
			} else if( this instanceof ValueNode ) {
				type = "VALUE";
			} else if( this instanceof BlockValueNode ) {
				type = "BLOCKVALUE";
			}
			result += indentStr + " [type]: " + type + "\n";
			result += indentStr + " [parent]: " + this.parent+ "\n";
			for( int i = 0 ; i < nodeList.size(); i++ ) {
				result += nodeList.get( i ).toString( indent + 1 );
			}
		} else {
			if( this instanceof ValueNode ) {
				result += "    ";
				result += this.getValue() + '\n';
				result += indentStr + " [type]: " + "VALUE" + "\n";
				result += indentStr + " [value type]: " + types[ ( ( ValueNode ) this).getValueType() ] + '\n';
				result += indentStr + " [parent]: " + this.parent + "\n";		
			} else if( this instanceof BlockValueNode ) {
				result += "\n";
				result += indentStr + " [type]: " + "BLOCKVALUE" + "\n";
				result += indentStr + " [parent]: " + this.parent + "\n";
				BlockValueNode blockValueNode = ( BlockValueNode ) this;
				result += blockValueNode.getNode().toString( indent + 1 );
			}
		}
		return result;
	}

	public Property getProperty() {
		// Is outerBlock ObjectBlock({}) or ArrayBlock([]) ?
		Property property = ( this instanceof ObjectNode ) ? new ObjectProperty() : new ArrayProperty();
		List<Node> nodeList = this.getNodeList();
		for( int i = 0; i < nodeList.size(); i++ ) {
			Node childNode = nodeList.get( i );
			Property childProperty = childNode.createProperty();
//			if( this.type == Blocks.OBJECT ) {
			if( this instanceof ObjectNode ) {
				property.set( nodeList.get( i ).getName(), childProperty );
//			} else if( this.type == Blocks.ARRAY ) {
			} else if( this instanceof ArrayNode ) {
				property.set( childProperty );
			}
		}
		return property;
	}
	private Property createProperty( ) {
		Property property = null;
		Property childProperty = null;

//		System.out.println( this.types[ this.type ] + ": " + this.name );
//		if( this.type == Blocks.BLOCKVALUE ) {
		if( this instanceof BlockValueNode ) {
			Node childNode = ( ( BlockValueNode ) this ).getNode();
			childProperty = childNode.createProperty();
//			if( childNode.type == Blocks.ARRAY ) {
			if( childNode instanceof ArrayNode ) {
				property = new ArrayProperty();
				property.set( childProperty );
//			} else if( childNode.type == Blocks.OBJECT ) {
			} else if( childNode instanceof ObjectNode ) {
				property = new ObjectProperty();
				property.set( this.name, childProperty );
			}
			return property;
//		} else if( this.type == Blocks.NONE ) {
		} else if( this instanceof ValueNode ) {
			if( ! this.name.matches( "Value.*" ) ) {
				property = new ObjectProperty();
				property.set( this.name, new ValueProperty( this.getValue() ) );
			} else {
				property = new ValueProperty( this.getValue() );
			}
//		} else if( this.type == Blocks.ARRAY ) {
		} else if( this instanceof ArrayNode ) {
			property = new ArrayProperty();
			List<Node> nodeList = this.getNodeList();
			for( int i = 0; i < nodeList.size(); i++ ) {
				Node childNode = nodeList.get( i );
//				if( childNode.getType() == Blocks.NONE ) {
				if( childNode instanceof ValueNode ) {
					property = childNode.createProperty();
				} else if( childNode instanceof ArrayNode ||
								childNode instanceof ObjectNode ) {
					childProperty = ( childNode instanceof ArrayNode ) ? new ArrayProperty() : new ObjectProperty();
					for( int j = 0; j < childNode.getNodeList().size(); j++ ) {
//						System.out.println( "[ " + j + " ]: " + childNode.getNodeList().get( j ).getName() );
//						System.out.println( childNode.getNodeList().get( j ).getName() );
						if( childProperty instanceof ArrayProperty ) {
							( ( ArrayProperty )childProperty ).set( childNode.getNodeList().get( j ).createProperty() );
						} else {
							( ( ObjectProperty ) childProperty ).set( childNode.getNodeList().get( j ).getName(), childNode.getNodeList().get( j ).createProperty() );
						}
					}
					property.set( childProperty );
				}
			}
//		} else if( this.type == Blocks.OBJECT ) {
		} else if( this instanceof ObjectNode ) {
			property = new ObjectProperty();
			List<Node> nodeList = this.getNodeList();
			for( int i = 0; i < nodeList.size(); i++ ) {
				Node childNode = nodeList.get( i );
//				if( childNode.getType() == Blocks.NONE ) {
				if( childNode instanceof ValueNode ) {
					property.set( childNode.getName(),  new ValueProperty( childNode.getValue() ) );
//				} else if( childNode.getType() == Blocks.BLOCKVALUE ) {
				} else if( childNode instanceof BlockValueNode ) {
					property.set( childNode.getName(), childNode.createProperty() );
				}
			}
		}
		return property;
	}

}

class ObjectNode extends Node {
	public static int count = 1;
	private List<Node> nodeList;
	
	public ObjectNode( String parent ) {
		this.name = "Object" + ( ObjectNode.count++ );
		this.parent = parent;
		this.nodeList = new ArrayList<>();
	}
	public ObjectNode() {
		this.name = "ObjectBlock";
		this.parent = "Root";
		this.nodeList = new ArrayList<>();
	}
	
	public void addBlockValue( String key, int type ) {
		this.nodeList.add( new BlockValueNode( this.name, key, type ) );
	}
	public void addValue( String key, String value ) {
		this.nodeList.add( new ValueNode( this.name, key, value ) );
	}
	@Override
	public String getValue() {
		return null;
	}
	@Override
	public List<Node> getNodeList() {
		return this.nodeList;
	}
	@Override
	public Node getCurrentNode() {
		return this.nodeList.get( this.nodeList.size() - 1 );
	}
	@Override
	protected String display() {
		String result = "";
		for( int i = 0; i < this.nodeList.size(); i++ ) {
			result += this.nodeList.get( i ).toString( 1 );
		}
		return result;
	}
	@Override
	public void addNode( int type ) {
		// TODO Auto-generated method stub
		
	}
}
class ArrayNode extends Node {
	public static int count = 1;
	private List<Node> nodeList;
	private String previousArray = null;
	
	public ArrayNode( String parent ) {
		this.name = "Array" + ( ArrayNode.count++ );
		this.parent = parent;
		this.nodeList = new ArrayList<>();
	}
	public ArrayNode() {
		this.name = "ArrayBlock";
		this.parent = "Root";
		this.nodeList = new ArrayList<>();
	}
	
	public void setPreviousArray( String name ) {
		this.previousArray = name;
	}
	public String getPreviousArray() {
		return this.previousArray;
	}
	public void addValue( String value ) {
		this.nodeList.add( new ValueNode( this.name, value ) );
	}
	@Override
	public void addNode( int type ) {
		this.nodeList.add( ( type == Blocks.ARRAY ) ? new ArrayNode( this.name ) : new ObjectNode( this.name ) );
	}
	@Override
	public String getValue() {
		return null;
	}
	@Override
	public List<Node> getNodeList() {
		return this.nodeList;
	}
	@Override
	public Node getCurrentNode() {
		return this.nodeList.get( this.nodeList.size() - 1 );
	}
	@Override
	protected String display() {
		String result = "";
		for( int i = 0; i < this.nodeList.size(); i++ ) {
			result += this.nodeList.get( i ).toString( 1 );
		}
		return result;
	}
}

class ValueNode extends Node {
	public static int count = 1;
	private String value;
	private int valueType;
	
	public ValueNode( String parent, String key, String value ) {
		this.parent = parent;
		this.name = key;
		this.value = value;
		this.valueType = Node.STRING;
		if( value.equals( "true" ) || value.equals( "false" ) ) {
			this.valueType = Node.BOOLEAN;
		} else if( value.matches( "-?\s*\\d+(\\.\\d+)?" ) ) {
			this.valueType = Node.INTEGER;
		}
	}
	public ValueNode( String parent, String value ) {
		this.parent = parent;
		this.name = "Value" + ( ValueNode.count++ );
		this.value = value;
	}
	
	public int getValueType() {
		return this.valueType;
	}
	@Override
	public String getValue() {
		return this.value;
	}
	@Override
	public List<Node> getNodeList() {
		return null;
	}
	@Override
	public Node getCurrentNode() {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	protected String display() {
		// TODO Auto-generated method stub
		return "";
	}
	@Override
	public void addNode(int type) {
		// TODO Auto-generated method stub
		
	}
}
class BlockValueNode extends Node {
	private Node node;
	
	public BlockValueNode( String parent, String name, int type ) {
		this.parent = parent;
		this.name = name;
		this.node = ( type == Blocks.ARRAY ) ? new ArrayNode( name ) : new ObjectNode( name );
	}

	public Node getNode() {
		return this.node;
	}
	@Override
	public String getValue() {
		return null;
	}

	@Override
	public List<Node> getNodeList() {
		return null;
	}
	public Node getValueNode() {
		return this.node;
	}

	@Override
	public Node getCurrentNode() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	protected String display() {
		return node.toString( 1 );
	}

	@Override
	public void addNode(int type) {
		// TODO Auto-generated method stub
		
	}
}
