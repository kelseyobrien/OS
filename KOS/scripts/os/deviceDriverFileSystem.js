/* deviceDriverFileSystem.js
*	extends deviceDriver.js
*/

DeviceDriverFileSystem.prototype = new DeviceDriver;

function DeviceDriverFileSystem()
{
	//Base Methods
	this.driverEntry = fileSystemDriverEntry;
	this.isr = null;
	
	//Main functions
	this.format = fsFormat;
	this.create = fsCreate;
	this.write 	= fsWrite;
	/*this.read 	= fsRead;
	this.delete = fsDelete;
	this.list 	= fsListFiles;*/
}

function fileSystemDriverEntry()
{
		this.status = "loaded";
		
		fsFormat();
}


function fsFormat()
{
	try
	{
		localStorage.clear();
		var fsKey = "";
		var fsValue = "";
		
		//4 Tracks (0-3)
		for(var t = 0; t < 4; t++)
		{
			//8 Sectors (0-7)
			for(var s = 0; s < 8; s++)
			{
				//8 Blocks (0-7)
				for(var b = 0; b < 8; b++)
				{
					//Create key (track, sector, block)
					fsKey = fileSystemKey(t, s, b);
					//Create value ( 0/1 [0 = unused, 1 = used], 
					//				track, sector, block, 59 bytes of data)
					fsValue = fileSystemValue(0, -1, -1, -1, "");
					
					localStorage[fsKey] = fsValue;
				}
			}
		}
		localStorage[MBRKEY] = fileSystemValue(1, -1, -1, -1, "MBR");
		return true;
	}
	catch (error)
	{
		return false;
	}
}

function fsCreate(fileName)
{
	//Find next open directory and file blocks
	var directoryKey = findOpenDirectoryBlock();
	var fileKey = findOpenFileBlock();
	
	//Make sure there is a directory and block open and fileName < 10 characters
	if (directoryKey && fileKey && fileName.length < 10)
	{
		localStorage[directoryKey] = setValueToUsed(fileKey, filename);
		localStorage[fileKey] = setValueToUsed(NULLTSB, "");
		
		return true;	//Create was successful
	}
	else{
		return false;	//Create was unsuccessful
	}
}

function fsWrite(fileName, data)
{
	//Get directory associated with specified fileName
	var directoryKey = getDirectory(fileName);
	
	 if(directoryKey)
	 {
		alert(true);
	 }
}

function fileSystemKey(track, sector, block)
{
	return JSON.stringify([track, sector, block]);
}

function fileSystemValue(used, track, sector, block, data)
{
	return JSON.stringify([used, track, sector, block, fillEmptySpace(data)]);
}

//Fill all empty bytes of data with ~
function fillEmptySpace(data)
{
	for(var i = data.length; i < 60; i++)
	{
		data += "~";
	
	}
	return data;
}

//Find next open directory block
function findOpenDirectoryBlock()
{
	var keyInt = 0;
	var valueArr;
	var usedBit;
	
	for(key in localStorage)
	{
		keyInt = cleanKey(key);
		if (keyInt >= 0 && keyInt <= 77)
		{
			valueArr = JSON.parse(localStorage[key]);
			usedBit = valueArr;
			
			if (usedBit === 0)
			{
				//Open directory block so return key (T,S,B)
				return(key);
			}
		}
	}
	//Return null if no directory blocks are open
	return null;	
}

//Find next open file block
function findOpenFileBlock()
{
	var keyInt = 0;
	var valueArr;
	var usedBit;
	
	for(key in localStorage)
	{
		keyInt = cleanKey(key);
		
		if(keyInt >= 100 && keyInt <= 300)
		{
			valueArr = JSON.parse(localStorage[key]);
			usedBit = valueArr[0]
			
			if(usedBit === 0)
			{
				//Open file block so return key (T,S,B)
				return(key);
			}
		}
	}
	
	//No file blocks open
	return null;
}

//Function to remove commas and brackets from key
function cleanKey(key)
{
	//Remove extras
	key = key.replace(/\]|\[|,/g, "");
	key = parseInt(key);
	
	return key
	
}

function setValueToUsed(key, data)
{
	var TSBArr = JSON.parse(key);
	
	var track = TSBArr[0];
	var sector = TSBArr[1];
	var block = TSBArr[2];
	
	//Return value with used status and TSB and data
	return (fileSystemValue(1, track, sector, block, data));
}

function getDirectory(fileName)
{
	var keyInt = 0;
	var valueArr;
	var used;
	var data;
	var storedName;
	
	for(key in localStorage)
	{
		if (keyInt >= 0 && keyInt <= 77)
		{
			valueArr = JSON.parse(localStorage[key]);
			used = valueArr[0];
			data = valueArr[4]
			
			if (used === 1)
			{
				//Get stored file name
				storedName = data.substring(0, data.indexOf("`"));
				//If file name is found return the key
				if(fileName === storedName)
				{
					return key;
				}
			}
		}
	}
	
	return null;
}
