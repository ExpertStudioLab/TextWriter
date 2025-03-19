package json;

import java.util.List;
import java.util.Map;

public class PropertyList {
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
		for( int i = 0; i < keys.length; i++ ) {
			System.out.println( ( String ) keys[ i ] );
		}
		return object.get( ( String )keys[ index ] ).getPropertyList();
//		return this.list.get( index ).getPropertyList();
	}
	
	public String getValue() {
		return ( (ValueProperty ) this.curProperty ).getValue();
	}
	
	public String getValue( int index ) {
		Object[] keys = this.object.keySet().toArray();
		ArrayProperty array = ( ArrayProperty ) this.object.get( ( String ) keys[ 0 ] );
		ValueProperty valueProperty = ( ValueProperty ) array.getList().get( index );
		return valueProperty.getValue();
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
				if( ( ( String ) keys[ i ] ).matches( "Array.*" ) ) {
					result += "[ LIST ]\n";
				} else {
					result += "key: " + ( String ) keys[ i ];
				}
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
						result += "     [ LIST ]\n";
					}
				} else if( value instanceof ArrayProperty ) {
//					List<Property> valueList = ( ( ArrayProperty ) value ).getList();
//					System.out.println( ( ( ArrayProperty ) value ).getList() );
					List<Property> valueList = (( ArrayProperty ) value ).getList();
//					List<Property> valueList = ((ArrayProperty)( ( ArrayProperty ) value ).getList().get( 0 )).getList();
					for( int j = 0; j < valueList.size(); j++ ) {
						Property listItem = valueList.get( j );
						if( listItem instanceof ValueProperty ) {
							result += "      [ " + j + " ]: " + ( ( ValueProperty ) listItem ).getValue() + '\n';
						} else if( listItem instanceof ArrayProperty || listItem instanceof ObjectProperty ) {
							result += "      [ LIST ]\n";
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