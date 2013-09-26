function PCB(pid, base, limit, pc){

	this.pid = pid;		//Process ID
	this.base = base;	//Base memory address
	this.limit = limit	//Limit memory address (maximum)
	this.pc = pc		//Program counter
	
	//Registers
	this.acc = 0;
	this.x  = 0;
	this.y = 0;
	this.z = 0;
}