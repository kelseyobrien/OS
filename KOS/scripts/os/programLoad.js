/*
 * programLoad.js
 *
 *Loads a user specified program (6502a machine language op codes)
 *	from "User Program Input" into main memory.
 */
 
 function loadProgram(userCode){
	_PCBUpToDate = createProcess();
	//Load user program into _MainMemory
	var opCode = userCode.split(/\s/);
	for (var i = _PCBUpToDate.base; i < opCode.length + _PCBUpToDate.base; i++){
		// LOCATION 00 DOESN'T DISPLAY FOR SPACE 1 PROB SHOULD FIX THIS
		var code = opCode[i - _PCBUpToDate.base];
		_MainMemory[i] = code;
	}
	_ProgramsList[_PCBUpToDate.pid] = _PCBUpToDate.pid;
	//Change process state to loaded
	_PCBUpToDate.state = P_LOAD;
	updateTable();
	return _PCBUpToDate.pid;
 }
 
 
 function createProcess()
 {
	//All info needed to create new PCB
	var pid = getPID();
	var PC = 0;
	var state = P_NEW;
	var base;
	var limit;
	
	//Find open space in MemoryManager
	//Set base and limit registers appropriate to space
	//Set open status to false
	if (_MemoryManager.mapOfMem.spaceOne.open){
		base = _MemoryManager.mapOfMem.spaceOne.base;
		limit = _MemoryManager.mapOfMem.spaceOne.limit;
		_MemoryManager.mapOfMem.spaceOne.open = false;
	}
	else if (_MemoryManager.mapOfMem.spaceTwo.open){
		alert("2");
		base = _MemoryManager.mapOfMem.spaceTwo.base;
		limit = _MemoryManager.mapOfMem.spaceTwo.limit;
		_MemoryManager.mapOfMem.spaceTwo.open = false;
	}
	else if (_MemoryManager.mapOfMem.spaceThree.open){
		base = _MemoryManager.mapOfMem.spaceThree.base;
		limit = _MemoryManager.mapOfMem.spaceThree.limit;
		_MemoryManager.mapOfMem.spaceThree.open = false;
	}
	else{
		_StdIn.putText("Sorry there is no space open")
	}
	
	return (new PCB(pid, base, limit, PC, state));
 }
 
 function getPID()
 {
	return _PID++;
 }