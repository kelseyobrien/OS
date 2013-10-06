/*
 * programLoad.js
 *
 *Loads a user specified program (6502a machine language op codes)
 *	from "User Program Input" into main memory.
 */
 
 function loadProgram(userCode){
	
	var process = createProcess();
	//Load user program into _MainMemory
	var opCode = userCode.split(/\s/);
	for (var i = 0; i < opCode.length; i++){
		var code = opCode[i];
		_MainMemory[i] = code;
	}
	_StdIn.putText("Process loaded into memory with PID " + process.pid);
	//Change process state to loaded
	process.state = P_LOAD;
 }
 
 function createProcess()
 {
	var pid = getPID();
	//Hard coded for now because only have to handle 1 process
	var base = 0;
	var limit = 255;
	var PC = 0;
	var state = P_NEW;
	return (new PCB(pid, base, limit, PC, state));
 }
 
 function getPID()
 {
	return _PID++;
 }