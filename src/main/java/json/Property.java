package json;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

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

class PropertyList {
	private Property curProperty;
	private Map<String,Property> object;
	private List<Property> list;
	
	public PropertyList( Property property ) {
		this.curProperty = property;
		this.object = null;
		this.list = null;
		if( this.curProperty instanceof ObjectProperty ) {
			this.object = ( ( ObjectProperty ) this.curProperty ).getObject();
		} else if( this.curProperty instanceof ArrayProperty ) {
			this.list = ( ( ArrayProperty ) curProperty ).getList();
		}
	}
	
	public PropertyList get( String key ) {
		Property property =  object.get( key );
		if( property instanceof ArrayProperty ) {
			return ( ( ArrayProperty ) property ).getList().get( 0 ).getPropertyList();
		}
		return property.getPropertyList();
	}
	
	public PropertyList get( int index ) {
		Map<String,Property> object = (( ObjectProperty )this.curProperty).getObject();
		Object[] keys = object.keySet().toArray();
		return object.get( ( String )keys[ index ] ).getPropertyList();
//		return this.list.get( index ).getPropertyList();
	}
	
	public String getValue() {
		return ( (ValueProperty ) this.curProperty ).getValue();
	}
	
	public Property indexOf( int index ) {
		return this.curProperty.indexOf( index );
	}
	
	@Override
	public String toString() {
		String result = "";
		if( this.curProperty instanceof ObjectProperty ) {
			Map<String,Property> object = ( ( ObjectProperty ) this.curProperty ).getObject();
			Object[] keys = object.keySet().toArray();
			for( int i = 0; i < keys.length; i++ ) {
//				result += "key: " + ( ( ObjectProperty ) this.curProperty ).getName( i );
				result += "key: " + ( String ) keys[ i ];
				Property value = object.get( ( String ) keys[ i ] );
				if( value instanceof ValueProperty ) {
					result += ", value: " + ( ( ValueProperty ) value ).getValue();
				} else if( value instanceof ObjectProperty ) {
					if( value.getName( 0 ).matches( "Object.*" ) ) {
						Map<String,Property> valueObject = ( ( ObjectProperty ) value ).getObject();
						Object[] valueKeys = valueObject.keySet().toArray();
						result += "\n   [ Properties ]\n";
						for( int j = 0; j < valueKeys.length; j++ ) {
//						result += "      " + valueObject.get( ( String ) valueKeys[ j ] ) + '\n';
							Property innerValue = valueObject.get( ( String ) valueKeys[ j ] );
							if( innerValue instanceof ValueProperty ) {
								result += "    " + valueObject.get( ( String ) valueKeys[ j ] ) + '\n';
							} else {
								Map<String,Property> innerValueObject = ( ( ObjectProperty ) innerValue ).getObject();
								Object[] innerValueKeys = innerValueObject.keySet().toArray();
								for( int k = 0; k < innerValueKeys.length; k++ ) {
									result += "    " + ( String )innerValueKeys[ k ] + '\n';							
								}
							}
						}
					} else {
						ArrayProperty arrayProperty = ( ArrayProperty ) ( ( ObjectProperty ) value ).getValue( ( ( ObjectProperty ) value ).getName( 0 ) );
						List<Property> valueList = ( arrayProperty ).getList();
						result += "\n   [ Properties ]\n";
						for( int j = 0; j < valueList.size(); j++ ) {
							Property innerValue = valueList.get( i );
							if( innerValue instanceof ValueProperty ) {
								result += "    value: " + ( ( ValueProperty ) innerValue ).getValue() + '\n';
							} else if( innerValue instanceof ArrayProperty || innerValue instanceof ObjectProperty ) {
								result += "    List[ " + j + " ]\n";
							}
						}
					}
				} else if( value instanceof ArrayProperty ) {
//					List<Property> valueList = ( ( ArrayProperty ) value ).getList();
					System.out.println( ( ( ArrayProperty ) value ).getList() );
					List<Property> valueList = (( ArrayProperty ) value ).getList();
//					List<Property> valueList = ((ArrayProperty)( ( ArrayProperty ) value ).getList().get( 0 )).getList();
					result += "\n   [ Properties ]\n";
					for( int j = 0; j < valueList.size(); j++ ) {
						Property listItem = valueList.get( j );
						if( listItem instanceof ValueProperty ) {
							result += "      value: " + ( ( ValueProperty ) listItem ).getValue() + '\n';
						} else if( listItem instanceof ArrayProperty || listItem instanceof ObjectProperty ) {
							result += "      LIST[ " + j + " ]\n";
						} /* else if( listItem instanceof ObjectProperty ) {
							Map<String,Property> properties = ( ( ObjectProperty ) listItem ).getObject();
							result += "      [ Element ]\n";
							for( int k = 0; k < properties.size(); k++ ) {
								result += "      " + ( ( ObjectProperty ) listItem ).getName( k ) + "\n";
							}
							System.out.println();
						} */
					}
				}
			}
		} else if( curProperty instanceof ArrayProperty ) {
			List<Property> list = ( ( ArrayProperty ) curProperty ).getList();
			for( int i = 0; i < list.size(); i++ ) {
				Property listItem = list.get( i );
				result += "[ " + i + " ]: ";
				if( listItem instanceof ValueProperty ) {
					result += ( ( ValueProperty ) listItem ).getValue() + '\n';
				} else if( listItem instanceof ArrayProperty )	{
					result += "LIST\n";
				} else if( listItem instanceof ObjectProperty ) {
					Map<String,Property> listObject = ( ( ObjectProperty ) listItem ).getObject();
					Object[] keys = listObject.keySet().toArray();
					result += "\n   [ Properties ]\n";
					for( int j = 0; j < keys.length; j++ ) {
						result += "      "  + ( String ) keys[ j ] + '\n';
					}
				}
			}
		}
		return result;
	}
}