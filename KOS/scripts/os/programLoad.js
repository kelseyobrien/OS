/*
 * programLoad.js
 *
 *Loads a user specified program (6502a machine language op codes)
 *	from "User Program Input" into main memory.
 */
 
 function loadProgram(userCode){
	_PCBUpToDate = createProcess();
	
	if (typeof _PCBUpToDate != "undefined"){
	
	//Load user program into _MainMemory
		var opCode = userCode.split(/\s/);
		
		for (var i = _PCBUpToDate.base; i < opCode.length + _PCBUpToDate.base; i++){
		// LOCATION 00 DOESN'T DISPLAY FOR SPACE 1 PROB SHOULD FIX THIS
			//If program goes beyond limit only stop loading 
			if ( i === _PCBUpToDate.limit + 1){
				i = opCode.length + _PCBUpToDate.base;
			}
			else{
				var code = opCode[i - _PCBUpToDate.base];
				_MainMemory[i] = code
			}
		}
		
		_ProgramsList[_PCBUpToDate.pid] = _PCBUpToDate;
		
		//Change process state to loaded
		_PCBUpToDate.state = P_LOAD;
		
		//Update display and return PID
		updateTable();
		return _PCBUpToDate.pid;
	}
	else{
		return undefined;
	}
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
		return (new PCB(pid, base, limit, PC, state));
	}
	else if (_MemoryManager.mapOfMem.spaceTwo.open){
		alert("2");
		base = _MemoryManager.mapOfMem.spaceTwo.base;
		limit = _MemoryManager.mapOfMem.spaceTwo.limit;
		_MemoryManager.mapOfMem.spaceTwo.open = false;
		return (new PCB(pid, base, limit, PC, state));
	}
	else if (_MemoryManager.mapOfMem.spaceThree.open){
		base = _MemoryManager.mapOfMem.spaceThree.base;
		limit = _MemoryManager.mapOfMem.spaceThree.limit;
		_MemoryManager.mapOfMem.spaceThree.open = false;
		return (new PCB(pid, base, limit, PC, state));
	}
	else{
		//_StdIn.putText("Sorry there is no space open")
		return undefined;
	}
	
 }
 
 function getPID()
 {
	return _PID++;
 }