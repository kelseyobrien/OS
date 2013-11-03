function Scheduler()
{
	//Round Robin default quantum = 6
	this.quantum = ROUND_QUANTUM
	
	this.contextSwitch = function()
	{
		//Check to see if there are other processes waiting
		if(_ReadyQueue.getSize() >= 1){
			//Log context switch
			krnTrace("Performing context switch");
			
			//Update current process PCB to current state of CPU
			//Add it back to readu queue if it had not terminated
			if(_CurrentProcess.state != P_TERM){
				_CurrentProcess.update(P_READY, _CPU.PC,  _CPU.Acc,
										 _CPU.Xreg,  _CPU.Yreg,  _CPU.Zflag);
				_ReadyQueue.enqueue(_CurrentProcess);
			}
			
			//Get next process to execute
			_CurrentProcess = _ReadyQueue.dequeue();
			
			//Update CPU to new process values
			_CPU.update(_CurrentProcess.pc, _CurrentProcess.acc,
						_CurrentProcess.x, _CurrentProcess.y, _CurrentProcess.z);
		}
		//Reset cycle counter
		_Cycles = 1;
	}
}