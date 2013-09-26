/*
 * programLoad.js
 *
 *Loads a user specified program (6502a machine language op codes)
 *	from "User Program Input" into main memory.
 */
 
 function loadProgram(userCode){
	var opCode = userCode.split(/\s/);
	//alert(opCode);
	for (var i = 0; i < opCode.length; i++){
		_MainMemory[i] = opCode[i];
	}
	//alert(_MainMemory);
	_StdIn.putText("Process loaded into memory.");
 }