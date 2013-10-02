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
        krnTrace("CPU cycle");
        // TODO: Accumulate CPU usage and profiling statistics here.
        // Do the real work here. Be sure to set this.isExecuting appropriately.
	
	this.fetch = function(){
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
    };
}

// A9 = Load accumulator with constant
function loadAccConst()
{
}

//AD = Load accumulator from memory
function loadAccMem()
{
}

//8D = Store accumulator in memory
function storeAccMem()
{
}

//6D = Add with carry
function addWCarry()
{
}

//A2 = Load X register with constant
function loadXWConst()
{
}

//AE = Load X register from memory
function loadXMem()
{
}

//A0 = Load Y register with constant
function loadYWConst()
{
}

//AC = Load Y register from memory
function loadYMem()
{
}

//EA = No operation
function noOp()
{
}

//00 = break or system call
function breakSysCall()
{
}

//EC = compare byte in memory to X reg
//	Z flag set to ) if equal
function compToX()
{
}

//D0 = Brank X bytes if Z flag = 0
function branchXBytes()
{
}

//EE = Increment value of a byte
function incByte()
{
}

//FF = System call
function sysCall()
{
}