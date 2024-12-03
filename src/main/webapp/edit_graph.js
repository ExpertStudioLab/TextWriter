/**
 * 
 */
import { Illustration  } from "./modules/illustration.js";

const illustration = [];
illustration.push( new Illustration( "Image1") );
illustration[ 0 ].setButton( "Rect", Illustration.RECTANGLE );
illustration[ 0 ].setTextButton( "Text", "Text-Label" );
illustration[ 0 ].setButton( "MoveGraph", Illustration.MOVE_GRAPH );
// buttons
