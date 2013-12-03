/**
* memoryManager.js
*	Manages three slots of memory 	
*
**/
function MemoryManager()
{
	this.mapOfMem = {
		spaceOne: { 
			open : true, 
			base : 0, 
			limit : 255, 
			spaceNum : 1
			},
		spaceTwo: { 
			open : true, 
			base : 256, 
			limit : 511, 
			spaceNum : 2
			},
		spaceThree: {
			open : true, 
			base : 512, 
			limit : 767, 
			spaceNum : 3
		}
	};
	
	this.getRelocationValue = function()
	{
		//Reture 0 for now because there is only one process
		return _CurrentProcess.base;
	}
	
	this.getNextByte = function()
	{
		return _MainMemory[(++_CPU.PC) + this.getRelocationValue()];
	}
	
	//Convert hex address from user program input
	this.convertAddress = function(hexCode)
	{
		return parseInt(hexCode, 16 ) + this.getRelocationValue();
	}
	
	this.isValidAddress = function(address)
	{
		var base = _CurrentProcess.base;
		var limit = _CurrentProcess.limit;

		return ( address >= base && address <= limit );
	}
	
	this.getOpenSpace = function()
	{
		var spaceToReturn;
		
		if(_MemoryManager.mapOfMem.spaceOne.open == true)
		{
			spaceToReturn = _MemoryManager.mapOfMem.spaceOne;
		}
		else if(_MemoryManager.mapOfMem.spaceTwo.open == true)
		{
			spaceToReturn = _MemoryManager.mapOfMem.spaceTwo;
		}
		else if(_MemoryManager.mapOfMem.spaceThree.open == true)
		{
			spaceToReturn = _MemoryManager.mapOfMem.spaceThree;
		}
		//No available slots
		else
		{
			spaceToReturn = null;
		}
		return spaceToReturn;
	}
	
	this.openSpaceExists = function()
	{
		var spaceOneStatus   = this.mapOfMem.spaceOne.open;
		var spaceTwoStatus   = this.mapOfMem.spaceTwo.open;
		var spaceThreeStatus = this.mapOfMem.spaceThree.open;
		
		// Return true if at least one slot is open
		return ( spaceOneStatus || spaceTwoStatus || spaceThreeStatus );
	}
	
	this.reverseSpaceStatus = function(spaceBase)
	{
		if (spaceBase)
		{
			if(spaceBase === this.mapOfMem.spaceOne.base)
			{
				if (this.mapOfMem.spaceOne.open === true)
					this.mapOfMem.spaceOne.open = false;
				else if(this.mapOfMem.spaceOne.open === false)
					this.mapOfMem.spaceOne.open = true;
			}
			else if(spaceBase === this.mapOfMem.spaceTwo.base)
			{
				if (this.mapOfMem.spaceTwo.open === true)
					this.mapOfMem.spaceTwo.open = false;
				else if(this.mapOfMem.spaceTwo.open === false)
					this.mapOfMem.spaceTwo.open = true;
			}
			if(spaceBase === this.mapOfMem.spaceThree.base)
			{
				if (this.mapOfMem.spaceThree.open === true)
					this.mapOfMem.spaceThree.open = false;
				else if(this.mapOfMem.spaceThree.open === false)
					this.mapOfMem.spaceThree.open = true;
			}
		}
	}
	
	this.getMemoryContent = function(spaceBase)
	{
		var base = spaceBase;
		var limit;
		var opcodeArr = []
		
		if(base === _MemoryManager.mapOfMem.spaceOne.base)
		{
			limit = _MemoryManager.mapOfMem.spaceOne.limit;
		}
		else if(base === _MemoryManager.mapOfMem.spaceTwo.base)
		{
			limit = _MemoryManager.mapOfMem.spaceTwo.limit;
		}
		else if(base === _MemoryManager.mapOfMem.spaceThree.base)
		{
			limit = _MemoryManager.mapOfMem.spaceThree.limit;
		}
		
		for(i = base; i <= limit; i++)
		{
			opcodeArr.push(_MainMemory[i]);
		}
		return opcodeArr;
	}
	
	this.clearMemorySpace = function(spaceBase)
	{
		var limit;
		
		if (spaceBase === _MemoryManager.mapOfMem.spaceOne.base)
			limit = _MemoryManager.mapOfMem.spaceOne.limit;
		else if (spaceBase === _MemoryManager.mapOfMem.spaceTwo.base)
			limit = _MemoryManager.mapOfMem.spaceTwo.limit;
		else if(spaceBase === _MemoryManager.mapOfMem.spaceThree.base)
			limit = _MemoryManager.mapOfMem.spaceThree.limit;
			
		for(var i = spaceBase; i < limit; i++){
			_MainMemory[i] = "00";
		}
	}
	
	this.rollIn = function(process)
	{
		//File names in the format of [process (pid)]
		//Borrowed from J(OS)EPH because it makes too much sense
		var fileName = "process " + process.pid.toString();
		var opcodesFromFile = krnFileSystemDriver.read(fileName);
		
		//Split opcodes for execution
		opcodeArr = opcodesFromFile.split(/\s/);
		
		var memSpace = _MemoryManager.getOpenSpace();
		alert(memSpace.base);
		process.base = memSpace.base;
		process.limit = memSpace.limit;
		process.state = P_LOAD;
		
		this.reverseSpaceStatus(process.base);
		
		var opcode = "";
		//Add opcodes to memory
		for(var i = process.base; i < opcodeArr.length + process.base; i++)
		{
			opcode = opcodeArr[i - process.base];
			_MainMemory[i] = opcode.toUpperCase();
		}
		
		krnFileSystemDriver.delete(fileName);
	}
	
	this.rollOut = function(process)
	{
		//File names in the format of [process (pid)]
		var fileName = "process " + process.pid.toString();
		//Get op codes from memory
		var opcodeArr = this.getMemoryContent(process.base);
		//Join array
		var data = opcodeArr.join(" ");
		
		//Create file in file system and write data to the file
		krnFileSystemDriver.create(fileName);
		krnFileSystemDriver.write(fileName, data);
		
		//Reverse space status to open
		this.reverseSpaceStatus(process.base);
		
		//Clear memory space
		this.clearMemorySpace(process.base);
		
		//Update process to reflect it is in the filesystem
		process.base  = -1;
		process.limit = -1;
		process.state = P_ON_DISK;	
	}
}
