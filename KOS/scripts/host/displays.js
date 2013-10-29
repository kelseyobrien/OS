function updateReadyQueueDisplay()
{
	var processes = _ReadyQueue.getSize();
	var process2Display;
	
	for(var i = 0; i < processes; i++)
	{
		var displayRow = document.getElementsByName("RQ" + (i + 1));
		process2Display = _ReadyQueue.getItem(i);
		
		displayRow[0].innerHTML = process2Display.pid.toString();
		displayRow[2].innerHTML = process2Display.base.toString();
		displayRow[3].innerHTML = process2Display.limit.toString();
	}
}