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
