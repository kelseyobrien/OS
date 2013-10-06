/**
* memoryManager.js
*	Manages three slots of memory 	
*
**/
function MemoryManager()
{
	this.mapOfMem = {
		spaceOne: { open : true, base : 0, limit : 255, spaceNum : 1},
		spaceTwo: { open : true, base : 256, limit : 511, spaceNum : 2},
		spaceThree: {open : true, base : 512, limit : 767, spaceNum : 3}
	};
	
	this.getRelocationValue = function()
	{
		//Reture 0 for now because there is only one process
		return 0;
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
		if (address >= 0 && address <= 255){
			return true;
		}
		else{
			return false;
		}
	}
	
	
}