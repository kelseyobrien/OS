/* ----------------------------------
   DeviceDriverKeyboard.js
   
   Requires deviceDriver.js
   
   The Kernel Keyboard Device Driver.
   ---------------------------------- */

DeviceDriverKeyboard.prototype = new DeviceDriver;  // "Inherit" from prototype DeviceDriver in deviceDriver.js.

function DeviceDriverKeyboard()                     // Add or override specific attributes and method pointers.
{
    // "subclass"-specific attributes.
    // this.buffer = "";    // TODO: Do we need this?
    // Override the base method pointers.
    this.driverEntry = krnKbdDriverEntry;
    this.isr = krnKbdDispatchKeyPress;
    // "Constructor" code.
}

function krnKbdDriverEntry()
{
    // Initialization routine for this, the kernel-mode Keyboard Device Driver.
    this.status = "loaded";
    // More?
}

function krnKbdDispatchKeyPress(params)
{
    // Parse the params.
    var keyCode = params[0];
    var isShifted = params[1];
	
	//Check to see that keyCode is valid -- OS Trap Error is not
	if ((((keyCode >= 65) 	&& (keyCode <= 90)) 	||   // A..Z
         ((keyCode >= 97) 		&& (keyCode <= 123)) 	||	// a..z
		 ((keyCode >= 48) 		&& (keyCode <= 57)) 	||	// Digits 
          (keyCode === 32) 		|| (keyCode === 13)		||	// Space and enter
		  (keyCode  === 190) 	|| (keyCode  === 188)	|| 	//All punctuation
		  (keyCode  === 191)	|| (keyCode  === 222)	||
		  (keyCode  === 186)	|| (keyCode  === 189)	||
		  (keyCode  === 187)	|| (keyCode  === 192)	||
		  (keyCode  === 8)		|| (keyCode  === 38)	||	//Backspace and up arrow
		  (keyCode  === 40) 	|| (keyCode === 16)) )		//Down arrow and shift
		  
	{
	
	
		krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
		var chr = "";
	
		// Check to see if we even want to deal with the key that was pressed.
		if ( ((keyCode >= 65) && (keyCode <= 90)) ||   // A..Z
			((keyCode >= 97) && (keyCode <= 123)) )   // a..z
		{
			// Determine the character we want to display.  
			// Assume it's lowercase...
			chr = String.fromCharCode(keyCode + 32);
			// ... then check the shift key and re-adjust if necessary.
			if (isShifted)
			{
				chr = String.fromCharCode(keyCode);
			}
			// TODO: Check for caps-lock and handle as shifted if so.
			_KernelInputQueue.enqueue(chr);        
		}
	
		//------------------------------------------
		//Handle Numbers and their shifted partners
		//------------------------------------------
		else if ( ((keyCode >= 48) && (keyCode <= 57)) ||   // digits 
				(keyCode === 32)                     ||  	// space
				(keyCode === 13))					   		// enter
		{
			if (isShifted){
				if (keyCode === 49){
					chr = String.fromCharCode(33)
					_KernelInputQueue.enqueue(chr);
				}
				if (keyCode === 50){
					chr = String.fromCharCode(64)
					_KernelInputQueue.enqueue(chr);
				}
				if (keyCode === 51){
					chr = String.fromCharCode(35)
					_KernelInputQueue.enqueue(chr);
				}
				if (keyCode === 52){
					chr = String.fromCharCode(36)
					_KernelInputQueue.enqueue(chr);
				}
				if (keyCode === 53){
					chr = String.fromCharCode(37)
					_KernelInputQueue.enqueue(chr);
				}
				if (keyCode === 54){
					chr = String.fromCharCode(94)
					_KernelInputQueue.enqueue(chr);
				}
				if (keyCode === 55){
					chr = String.fromCharCode(38)
					_KernelInputQueue.enqueue(chr);
				}
				if (keyCode === 56){
					chr = String.fromCharCode(42)
					_KernelInputQueue.enqueue(chr);
				}
				if (keyCode === 57){
					chr = String.fromCharCode(40)
					_KernelInputQueue.enqueue(chr);
				}
				if (keyCode === 48){
					chr = String.fromCharCode(41)
					_KernelInputQueue.enqueue(chr);
				}
			}

			else{
				chr = String.fromCharCode(keyCode);
				_KernelInputQueue.enqueue(chr);
			}
		
		}
		//--------------------------------------------
		//Handle punctuation
		//--------------------------------------------
		
		//Handle period and arrow
		else if (keyCode  === 190){
			if (isShifted){
				chr = String.fromCharCode(62)
				_KernelInputQueue.enqueue(chr);
			}
			else{
				chr = String.fromCharCode(46)
				_KernelInputQueue.enqueue(chr);
			}
		}
		//Handle comma and arrow
		else if (keyCode  === 188){
			if (isShifted){
				chr = String.fromCharCode(60)
				_KernelInputQueue.enqueue(chr);
			}
			else{
				chr = String.fromCharCode(44)
				_KernelInputQueue.enqueue(chr);
			}
		}
		//Handle question mark and forward slash
		else if (keyCode  === 191){
			if(isShifted){
				chr = String.fromCharCode(63)
				_KernelInputQueue.enqueue(chr); 
			}
			else{
				chr = String.fromCharCode(47)
				_KernelInputQueue.enqueue(chr); 
			}
		}
		//Handle apostrophe and quote
		else if (keyCode  === 222){
			if(isShifted){
				chr = String.fromCharCode(34)
				_KernelInputQueue.enqueue(chr);
			}
			else{
				chr = String.fromCharCode(39)
				_KernelInputQueue.enqueue(chr);
			}
		}
		//Handle semicolon and colon
		else if (keyCode  === 186){
			if(isShifted){
				chr = String.fromCharCode(58)
				_KernelInputQueue.enqueue(chr);
			}
			else{
				chr = String.fromCharCode(59)
				_KernelInputQueue.enqueue(chr);
			}
		}
		//Handle minus and underscore
		else if (keyCode  === 189){
			if(isShifted){
				chr = String.fromCharCode(95)
				_KernelInputQueue.enqueue(chr);
			}
			else{
				chr = String.fromCharCode(45)
				_KernelInputQueue.enqueue(chr);
			}
		}
		//Handle plus and eqal signs
		else if (keyCode  === 187){
			if(isShifted){
				chr = String.fromCharCode(43)
				_KernelInputQueue.enqueue(chr);
			}
			else{
				chr = String.fromCharCode(61)
				_KernelInputQueue.enqueue(chr);
			}
		}
		//Handle tilde and whatever ` is
		else if (keyCode  === 192){
			if(isShifted){
				chr = String.fromCharCode(126)
				_KernelInputQueue.enqueue(chr);
			}
			else{
				chr = String.fromCharCode(96)
				_KernelInputQueue.enqueue(chr);
			}
		}
		//Handle backspace
		else if (keyCode === 8 && _Console.buffer.length > 0)
		{
			var deletedChar = _Console.buffer.charAt(_Console.buffer.length - 1);
			
			//Remove last char from the buffer
			_Console.buffer = _Console.buffer.slice(0, _Console.buffer.length - 1);
			
			var width = _DrawingContext.measureText(_Console.CurrentFont, _Console.CurrentFontSize, deletedChar);
			_Console.CurrentXPosition = _Console.CurrentXPosition - width;
			var xPosition = _Console.CurrentXPosition;
			var yPosition = (_Console.CurrentYPosition - _Console.CurrentFontSize) - 1;
			var height = _Console.CurrentFontSize + (_Console.CurrentFontSize / 2);
			
			 _DrawingContext.clearRect(xPosition, yPosition, width, height);
		}
		
		//Handle up key
		else if (keyCode === 38){
			var command = "";
			
			//Get command to display from _CommandHistory array
			command = _CommandHistory[_IndexOfCurrentCommand];

			 if (_IndexOfCurrentCommand > 0){
					_IndexOfCurrentCommand -= 1;
				}
				else{
					_IndexOfCurrentCommand = 0;
				}

			//Gather information to delete text in console before displaying command
			var startPoint = _DrawingContext.measureText(_Console.CurrentFont, _Console.CurrentFontSize, ">");
			_Console.CurrentXPosition = startPoint;
			var xPosition = _Console.CurrentXPosition;
			var yPosition = (_Console.CurrentYPosition - _Console.CurrentFontSize) - 1;
			var width = 500;
			var height = _Console.CurrentFontSize + (_Console.CurrentFontSize / 2);
			
			_DrawingContext.clearRect(xPosition, yPosition, width, height);
			//Display command
			if (command && _CommandHistory.length > 0) {
					_Console.buffer = command;
					_StdIn.putText(command);
				}
		
		}
		//Handle down key
		else if (keyCode === 40){
			var command = "";
		
			 if (_IndexOfCurrentCommand < _CommandHistory.length){
					_IndexOfCurrentCommand += 1;
				}
				else{
					_IndexOfCurrentCommand = _IndexOfCurrentCommand - 1;
				}
				command = _CommandHistory[_IndexOfCurrentCommand];
				
			//Gather information to delete text in console before displaying command
			var startPoint = _DrawingContext.measureText(_Console.CurrentFont, _Console.CurrentFontSize, ">");
			_Console.CurrentXPosition = startPoint;
			var xPosition = _Console.CurrentXPosition;
			var yPosition = (_Console.CurrentYPosition - _Console.CurrentFontSize) - 1;
			var width = 500;
			var height = _Console.CurrentFontSize + (_Console.CurrentFontSize / 2);
			
			_DrawingContext.clearRect(xPosition, yPosition, width, height);
			
			//Display command
			if (command && _CommandHistory.length > 0) {
					_Console.buffer = command;
					_StdIn.putText(command);
				}
				
				
		}
	}
	else{
		krnTrace("Invalid key pressed...ignoring");
	}
}
