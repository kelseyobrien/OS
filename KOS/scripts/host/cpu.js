/* ------------  
   CPU.js

   Requires global.js.
   
   Routines for the host CPU simulation, NOT for the OS itself.  
   In this manner, it's A LITTLE BIT like a hypervisor,
   in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
   that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
   JavaScript in both the host and client environments.

   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

function Cpu() {
    this.PC    = 0;     // Program Counter
    this.Acc   = 0;     // Accumulator
    this.Xreg  = 0;     // X register
    this.Yreg  = 0;     // Y register
    this.Zflag = 0;     // Z-ero flag (Think of it as "isZero".)
    this.isExecuting = false;
    
    this.init = function() {
        this.PC    = 0;
        this.Acc   = 0;
        this.Xreg  = 0;
        this.Yreg  = 0;
        this.Zflag = 0;      
        this.isExecuting = false;  
    };
    
    this.cycle = function() {
		this.execute(this.fetch());
        krnTrace("CPU cycle");
		
		//Update display every cycle
		displayCPUData();
		updateTable();
		//displayMemory();
        // TODO: Accumulate CPU usage and profiling statistics here.
        // Do the real work here. Be sure to set this.isExecuting appropriately.
    };
	
	this.fetch = function(){
		var relocation = _MemoryManager.getRelocationValue() + this.PC;
		return _MainMemory[relocation];
	}
	
	this.execute = function(code)
	{
		switch(code)
		{
			case "A9" : loadAccConst();
			break;
			case "AD" : loadAccMem();
			break;
			case "8D" : storeAccMem();
			break
			case "6D" : addWCarry();
			break;
			case "A2" : loadXWConst();
			break;
			case "AE" : loadXMem();
			break;
			case "A0" : loadYWConst();
			break;
			case "AC" : loadYMem();
			break;
			case "EA" : noOp();
			break;
			case "00" : breakSysCall();
			break;
			case "EC" : compToX();
			break;
			case "D0" : branchXBytes();
			break;
			case "EE" : incByte();
			break;
			case "FF" : sysCall();
			break;
			
			
		}
	}
}

// A9 = Load accumulator with constant
function loadAccConst()
{
	_CPU.Acc = parseInt(_MemoryManager.getNextByte(), 16);
	_CPU.PC++;
}

//AD = Load accumulator from memory
function loadAccMem()
{
	var byte1 = _MemoryManager.getNextByte();
	var byte2 = _MemoryManager.getNextByte();
	//Concatinate bytes
	var decAddr = parseInt((byte2 + byte1), 16);
	
	//If address is a valid address for this process put it in Acc
	if (_MemoryManager.isValidAddress(decAddr))
	{
		_CPU.Acc = parseInt(_MainMemory[decAddr]);
	}
	else{	//Address is not valid: shut down OS and log event
		krnShutdown();
		krnTrace("The requested address is not valid");
	}

	_CPU.PC++;
}

//8D = Store accumulator in memory
function storeAccMem()
{
	var byte1 = _MemoryManager.getNextByte();
	var byte2 = _MemoryManager.getNextByte();
	var decAddr = parseInt((byte2 + byte1), 16);
	if (_MemoryManager.isValidAddress(decAddr))
	{
		var hexAcc = _CPU.Acc.toString(16).toUpperCase();
		
		//Format Address
		if (hexAcc.length === 1){
			hexAcc = "0" + hexAcc;
		}
		
		_MainMemory[decAddr] = hexAcc;
	}
	else{	//Address is not valid: shut down OS and log event
		krnShutdown();
		krnTrace("The requested address is not valid");
	}
	_CPU.PC++;
	
}

//6D = Add with carry
function addWCarry()
{
	var byte1 = _MemoryManager.getNextByte();
	var byte2 = _MemoryManager.getNextByte();
	var decAddr = parseInt((byte2 + byte1), 16);
	if (_MemoryManager.isValidAddress(decAddr))
	{
		_CPU.Acc += parseInt(_MainMemory[decAddr], 16);
	}
	else{	//Address is not valid: shut down OS and log event
		krnShutdown();
		krnTrace("The requested address is not valid");
	}
	_CPU.PC++;
}

//A2 = Load X register with constant
function loadXWConst()
{
	_CPU.Xreg = parseInt(_MemoryManager.getNextByte(), 16);
	_CPU.PC++;
}

//AE = Load X register from memory
function loadXMem()
{
	var byte1 = _MemoryManager.getNextByte();
	var byte2 = _MemoryManager.getNextByte();
	var decAddr = parseInt((byte2 + byte1), 16);
	
	//If address is a valid address for this process put it in Acc
	if (_MemoryManager.isValidAddress(decAddr))
	{
		_CPU.Xreg = parseInt(_MainMemory[decAddr]);
	}
	else{	//Address is not valid: shut down OS and log event
		krnShutdown();
		krnTrace("The requested address is not valid");
	}
	_CPU.PC++;

}

//A0 = Load Y register with constant
function loadYWConst()
{
	_CPU.Yreg = parseInt(_MemoryManager.getNextByte(), 16);
	_CPU.PC++;
}

//AC = Load Y register from memory
function loadYMem()
{
	var byte1 = _MemoryManager.getNextByte();
	var byte2 = _MemoryManager.getNextByte();
	var decAddr = parseInt((byte2 + byte1), 16);
	
	//If address is a valid address for this process put it in Acc
	if (_MemoryManager.isValidAddress(decAddr))
	{
		_CPU.Yreg = parseInt(_MainMemory[decAddr]);
	}
	else{	//Address is not valid: shut down OS and log event
		krnShutdown();
		krnTrace("The requested address is not valid");
	}
	_CPU.PC++;
}

//EA = No operation
function noOp()
{
	_CPU.PC++;
}

//00 = break or system call
function breakSysCall()
{
	_PCBUpToDate.pc 	= _CPU.PC.toString(16).toUpperCase();
	_PCBUpToDate.acc	= _CPU.Acc.toString(16).toUpperCase();
	_PCBUpToDate.x		= _CPU.Xreg.toString(16).toUpperCase();
	_PCBUpToDate.y		= _CPU.Yreg.toString(16).toUpperCase();
	_PCBUpToDate.z		= _CPU.Zflag.toString(16).toUpperCase();
	_PCBUpToDate.state 	= P_TERM;
	
	var str1 = "PCB [pid: " + _PCBUpToDate.pid + 
					", base: " + _PCBUpToDate.base + 
					", limit : " + _PCBUpToDate.limit +
					", pc : " + _PCBUpToDate.pc +
					", acc : " + _PCBUpToDate.acc + ",";
	
	var str2 = "x reg : " + _PCBUpToDate.x +
				", y reg : " + _PCBUpToDate.y +
				", z flag : " + _PCBUpToDate.z + "]";
	_StdIn.putText(str1);
	_StdIn.advanceLine();
	
	_StdIn.putText(str2);
	_StdIn.advanceLine();
	_StdIn.putText(">");
	
	_CPU.isExecuting = false;
}

//EC = compare byte in memory to X reg
//	Z flag set to 0 if equal
function compToX()
{
	var byte1 = _MemoryManager.getNextByte();
	var byte2 = _MemoryManager.getNextByte();
	var decAddr = parseInt((byte2 + byte1), 16);
	if (_MemoryManager.isValidAddress(decAddr))
	{
		if(_CPU.Xreg === parseInt(_MainMemory[decAddr])){
			_CPU.Zflag = 1;
		}
		else{
			_CPU.Zflag = 0;
		}
	}
	else{	//Address is not valid: shut down OS and log event
		krnShutdown();
		krnTrace("The requested address is not valid");
	}
	_CPU.PC++;
}

//D0 = Brank X bytes if Z flag = 0
function branchXBytes()
{
	if(_CPU.Zflag === 0){
		//Next byte = branch distance
		var branch = parseInt(_MemoryManager.getNextByte(), 16);
		//Branch PC
		_CPU.PC += branch;
		if(_CPU.PC > 255){
			_CPU.PC -= 256;
		}
		_CPU.PC++;
	}
	else{ //Move PC ahead 2 spaces to avoid the branch code
		_CPU.PC += 2;
	}
}

//EE = Increment value of a byte
function incByte()
{
	var byte1 = _MemoryManager.getNextByte();
	var byte2 = _MemoryManager.getNextByte();
	var decAddr = parseInt((byte2 + byte1), 16);

	//If address is a valid address for this process put it in Acc
	if (_MemoryManager.isValidAddress(decAddr))
	{
		//Get decimal value and increment
		var decValue = parseInt(_MainMemory[decAddr], 16);

		decValue++;

		//Convert back to hec
		var hexValue = decValue.toString(16).toUpperCase();
		
		//Format Address
		if (hexValue.length === 1){
			hexValue = "0" + hexValue;
		}
		
		_MainMemory[decAddr] = hexValue;
	}
	else{	//Address is not valid: shut down OS and log event
		krnShutdown();
		krnTrace("The requested address is not valid");
	}
	_CPU.PC++;
}

//FF = System call
function sysCall()
{
	if (_CPU.Xreg === 1){
		YString = _CPU.Yreg.toString();
		
		for (var i = 0; i < YString.length; i++) 
        {
            _StdIn.putText(YString.charAt(i));
        }
		_StdIn.advanceLine();
		_StdIn.putText(">");
	}
	else if (_CPU.Xreg === 2){
		var strAddr = _CPU.Yreg;
		var currentByte = _MainMemory[strAddr];
		var keyCode = 0;
		var chr = "";
		
		while (currentByte != "00"){
			keyCode = parseInt(currentByte, 16);
			chr = String.fromCharCode(keyCode);
			_StdIn.putText(chr);
			// Increment address to get next byte
			strAddr++;
			currentByte = _MainMemory[strAddr];
		}
		_StdIn.advanceLine();
		_StdIn.putText(">");
	}
	 _CPU.PC++;
}