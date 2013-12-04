/*
 * programLoad.js
 *
 *Loads a user specified program (6502a machine language op codes)
 *	from "User Program Input" into main memory.
 */
 
 function loadProgram(userCode, priority){
	if (_MemoryManager.openSpaceExists()){
		_PCBUpToDate = createProcess(priority);
		//Load user program into _MainMemory
		var opCode = userCode.split(/\s/);
		
		for (var i = _PCBUpToDate.base; i < opCode.length + _PCBUpToDate.base; i++){
		// LOCATION 00 DOESN'T DISPLAY FOR SPACE 1 PROB SHOULD FIX THIS
			//If program goes beyond limit only stop loading 
				var code = opCode[i - _PCBUpToDate.base];
				_MainMemory[i] = code
		}
		
		_ProgramsList[_PCBUpToDate.pid] = _PCBUpToDate;
		
		//Change process state to loaded
		_PCBUpToDate.state = P_LOAD;
		
		//Update display and return PID
		updateTable();
		return _PCBUpToDate.pid;
	}
	//No open space exists to load into filesystem
	else if(!_MemoryManager.openSpaceExists())
	{
		_PCBUpToDate = createProcess();
		var processName = "process " + _PCBUpToDate.pid.toString();
		
		//Create file in filesystem and write program to it
		krnFileSystemDriver.create(processName);
		krnFileSystemDriver.write(processName, userCode);
		
		//Update process state
		_PCBUpToDate.state = P_ON_DISK;
		//Add process to programs list
		_ProgramsList[_PCBUpToDate.pid] = _PCBUpToDate;
		
		return _PCBUpToDate.pid
	}
	else{
		return undefined;
	}
 }
 
 
 function createProcess(priority)
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
		base = -1;
		limit = -1;
		return (new PCB(pid, base, limit, PC, state, priority));
	}
 }
 
 function getPID()
 {
	return _PID++;
 }