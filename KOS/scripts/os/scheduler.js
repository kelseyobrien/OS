function Scheduler()
{
	//Round Robin algorithm by default with quantum = 6
	this.quantum = ROUND_QUANTUM
	this.algorithm = ROUNDR;
	
	this.contextSwitch = function()
	{
		//Check to see if there are other processes waiting
		if(_ReadyQueue.getSize() >= 1){
			//Log context switch
			krnTrace("Performing context switch");
			
			//Update current process PCB to current state of CPU
			//Add it back to readuy queue if it had not terminated
			if(_CurrentProcess.state != P_TERM){
				_CurrentProcess.update(P_READY, _CPU.PC,  _CPU.Acc,
										 _CPU.Xreg,  _CPU.Yreg,  _CPU.Zflag);
				_ReadyQueue.enqueue(_CurrentProcess);
			}
			
			//Get next process to execute
			_CurrentProcess = _ReadyQueue.dequeue();
			
			if(_CurrentProcess.base === -1)
			{
				//Only roll out if there are processes still on RQ and there is no memory open
				if(_ReadyQueue.getSize() != 0 && !_MemoryManager.openSpaceExists())
				{
					_MemoryManager.rollOut(_ReadyQueue.getItem(_ReadyQueue.getSize() - 1));
				}
				_MemoryManager.rollIn(_CurrentProcess);
			}
			
			clearCPU();
			//Update CPU to new process values
			_CPU.update(_CurrentProcess.pc, _CurrentProcess.acc,
						_CurrentProcess.x, _CurrentProcess.y, _CurrentProcess.z);

			if (!_CPU.isExecuting)
            {
                _CPU.isExecuting = true;
            }
		}
		//Reset cycle counter
		_Cycles = 1;
	};
}