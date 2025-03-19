package json;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

public abstract class Property {
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
	public String get( String key ) {
		if( this instanceof ValueProperty ) {
			return ( ( ValueProperty ) this ).getValue();
		}
		return null;
	}
	@Override
	public String toString() {
		this.objectNest = new ArrayList<>();
		String result = "";
		if( this instanceof ArrayProperty ) {
			result = this.toStringArray( ( ArrayProperty ) this, 0 );
		} else if( this instanceof ObjectProperty ) {
			result = this.toStringObject( ( ObjectProperty ) this, 0 );
		} else if( this instanceof ValueProperty ) {
			result += ( ( ValueProperty )this ).getValue();
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
				if( property.getName( 0 ).matches( "Array.*" ) ) {
					property = (( ObjectProperty ) property ).getObject().get( property.getName( 0 ) );
					result += toStringArray( (ArrayProperty) property, indent );
					return result;
				} else if( property.getName( 0 ).matches( "Object.*" ) ) {
					property = ( ( ObjectProperty ) property ).getObject().get( property.getName( 0 ) );
					result += toStringObject( ( ObjectProperty ) property, indent );
				}else {
					result += toStringObject( ( ObjectProperty ) property, indent );
				}
		} else if( property instanceof ArrayProperty ) {
			if( type != Property.OBJECT ) result += indentStr;
			result += toStringArray( ( ArrayProperty ) property, indent );
		} else if( property instanceof ValueProperty ) {
			result += ((ValueProperty) property).getValue() + '\n';
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
			result += "----------------------------\n";
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

			result += indentStr + "[ " + ( String ) names[ i ] + " ]:    ";
			Property value = object.get( ( String ) names[ i ] );
			if( value instanceof ArrayProperty || value instanceof ObjectProperty ) {
				this.objectNest.set( depth, Boolean.TRUE );
				flag = true;
				if( value instanceof ArrayProperty ) {
					ArrayProperty arrayValue = ( ArrayProperty ) object.get( ( String ) names[ i ] );
					result += toString( arrayValue, indent + 1, Property.OBJECT  );
				} else {
					ObjectProperty objectValue = ( ObjectProperty ) object.get( ( String ) names[ i ] );
					result += toString( objectValue, indent + 1, Property.OBJECT );
				}
			} else {
				result += toString( value, indent + 1, Property.OBJECT );
			}
			if( ! flag ) {
				result += '\n';
			} else {
				flag = false;
			}
		}
		return result;
	}
	public PropertyList getPropertyList() {
		return new PropertyList( this );
	}
	public PropertyList getPropertyList( int... index ) {
		Property targetProperty = this;
		for( int i = 0; i < index.length; i++ ) {
			targetProperty = targetProperty.indexOf( index[ i ] );
		}
		PropertyList propertyList = new PropertyList( targetProperty );
		return propertyList;
	}
	public abstract Property indexOf( int index );
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
	public Property getValue( String key ) {
		return this.object.get( key );
	}
	public Map<String,Property> getObject() {
		return this.object;
	}
	@Override
	public Property indexOf(int index) {
		// TODO Auto-generated method stub
		return null;
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
	@Override
	public Property indexOf(int index) {
		// TODO Auto-generated method stub
		return this.list.get( index );
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
	@Override
	public Property indexOf(int index) {
		// TODO Auto-generated method stub
		return null;
	}
}

