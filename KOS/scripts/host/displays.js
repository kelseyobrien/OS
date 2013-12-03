function updateReadyQueueDisplay()
{
	var processes = _ReadyQueue.getSize();
	var process2Display;
	
	clearReadyQueueDisplay();
	
	for(var i = 0; i < processes; i++)
	{
		var displayRow = document.getElementsByName("RQ" + (i + 1));
		process2Display = _ReadyQueue.getItem(i);
		
		displayRow[0].innerHTML = process2Display.pid.toString();
		displayRow[1].innerHTML = translateState(process2Display.state);
		displayRow[2].innerHTML = formatHex(process2Display.base);
		displayRow[3].innerHTML = formatHex(process2Display.limit);
	}
}

function clearReadyQueueDisplay(){
	for (var i = 0; i < 3; i++){
		var displayRow = document.getElementsByName("RQ" + (i + 1));
		
		displayRow[0].innerHTML = "&nbsp;";
		displayRow[1].innerHTML = "&nbsp;";
		displayRow[2].innerHTML = "&nbsp;";
		displayRow[3].innerHTML = "&nbsp;";
	}

}


function displayCPUData()
{
	var currentPC 		= document.getElementById("pc");
	var currentACC 		= document.getElementById("acc");
	var currentXReg 	= document.getElementById("xreg");
	var currentYReg 	= document.getElementById("yreg");
	var currentZFlag 	= document.getElementById("zflag");
	
	currentPC.innerHTML 	= "0x" + _CPU.PC.toString(16).toUpperCase();
	currentACC.innerHTML 	= _CPU.Acc.toString(16).toUpperCase();
	currentXReg.innerHTML 	= _CPU.Xreg.toString(16).toUpperCase();
	currentYReg.innerHTML 	= _CPU.Yreg.toString(16).toUpperCase();
	currentZFlag.innerHTML 	= _CPU.Zflag.toString(16).toUpperCase();
}

function clearCPU(){
	_CPU.PC 	= 0;
	_CPU.Acc 	= 0;
	_CPU.Xreg 	= 0;
	_CPU.Yreg	= 0;
	_CPU.Zflag	= 0;
}

function createTable(){
	var table = document.getElementById("MemDisplay");
	var i = 0;
	for(var r = 0; r < 96; r++){
		var row = table.insertRow(-1);
        var firstCell = row.insertCell(-1);
        firstCell.appendChild(document.createTextNode("0x" + i.toString(16).toUpperCase()));
		
		if (r === 0 || r === 32 || r === 64){
			firstCell.style.color = "yellow";
			firstCell.style.backgroundColor = "red";
			firstCell.style.fontWeight = "900";
		}
		else{
			firstCell.style.color = "red";
			firstCell.style.fontWeight = "900";
		}
		
		 for (var c = 0; c < 8; c++) {
            var cell = row.insertCell(-1);
            cell.appendChild(document.createTextNode("00"));
			cell.style.color = "black";
            i++;
        }
	}
}

function updateTable() {
    // Get the table id
    var table = document.getElementById("MemDisplay");
    var memoryAddress = 0;

    // Update the rows with the new memory value
    for (var r = 0; r < 96; r++) {
        for (var c = 1; c < 9; c++) {
            table.rows[r].cells[c].innerHTML = _MainMemory[memoryAddress];
            memoryAddress++;
        }
    }
}

function formatHex(num){
	return "0x" + num.toString(16).toUpperCase();
}

function translateState(state){
	var stateStr = "";
	switch(state)
	{
		case 0 : stateStr = "NEW";
		break;
		case 1 : stateStr = "LOADED";
		break;
		case 2 : stateStr = "RUNNING";
		break;
		case 3 : stateStr = "READY";
		break;
		case 4 : stateStr = "TERMINATED";
		break;
		case 5 : stateStr = "ON DISK";
		break;
	}
	return stateStr;
}
