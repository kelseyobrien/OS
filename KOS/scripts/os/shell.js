/* ------------
   Shell.js
   
   The OS Shell - The "command line interface" (CLI) for the console.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

function Shell() {
    // Properties
    this.promptStr   = ">";
    this.commandList = [];
    this.curses      = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
    this.apologies   = "[sorry]";
    // Methods
    this.init        = shellInit;
    this.putPrompt   = shellPutPrompt;
    this.handleInput = shellHandleInput;
    this.execute     = shellExecute;
}

function shellInit() {
    var sc = null;
    //
    // Load the command list.

    // ver
    sc = new ShellCommand();
    sc.command = "ver";
    sc.description = "- Displays the current version data.";
    sc.function = shellVer;
    this.commandList[this.commandList.length] = sc;
    
    // help
    sc = new ShellCommand();
    sc.command = "help";
    sc.description = "- This is the help command. Seek help.";
    sc.function = shellHelp;
    this.commandList[this.commandList.length] = sc;
    
    // shutdown
    sc = new ShellCommand();
    sc.command = "shutdown";
    sc.description = "- Shuts down the virtual OS but leaves the underlying hardware simulation running.";
    sc.function = shellShutdown;
    this.commandList[this.commandList.length] = sc;

    // cls
    sc = new ShellCommand();
    sc.command = "cls";
    sc.description = "- Clears the screen and resets the cursor position.";
    sc.function = shellCls;
    this.commandList[this.commandList.length] = sc;

    // man <topic>
    sc = new ShellCommand();
    sc.command = "man";
    sc.description = "<topic> - Displays the MANual page for <topic>.";
    sc.function = shellMan;
    this.commandList[this.commandList.length] = sc;
    
    // trace <on | off>
    sc = new ShellCommand();
    sc.command = "trace";
    sc.description = "<on | off> - Turns the OS trace on or off.";
    sc.function = shellTrace;
    this.commandList[this.commandList.length] = sc;

    // rot13 <string>
    sc = new ShellCommand();
    sc.command = "rot13";
    sc.description = "<string> - Does rot13 obfuscation on <string>.";
    sc.function = shellRot13;
    this.commandList[this.commandList.length] = sc;

    // prompt <string>
    sc = new ShellCommand();
    sc.command = "prompt";
    sc.description = "<string> - Sets the prompt.";
    sc.function = shellPrompt;
    this.commandList[this.commandList.length] = sc;
	
	// date
    sc = new ShellCommand();
    sc.command = "date";
    sc.description = "- Displays the current date and time.";
    sc.function = shellDate;
    this.commandList[this.commandList.length] = sc;
	
	// whereami
    sc = new ShellCommand();
    sc.command = "whereami";
    sc.description = "- Displays the current location.";
    sc.function = shellWhereami;
    this.commandList[this.commandList.length] = sc;
	
	
	// ten
    sc = new ShellCommand();
    sc.command = "ten";
    sc.description = "- See information in ten seconds.";
    sc.function = shellTen;
    this.commandList[this.commandList.length] = sc;
	
	// status <string>
    sc = new ShellCommand();
    sc.command = "status";
    sc.description = "<string> - sets the status.";
    sc.function = shellStatus;
    this.commandList[this.commandList.length] = sc;
	
	// load
    sc = new ShellCommand();
    sc.command = "load";
    sc.description = "- loads and verifys user program input.";
    sc.function = shellLoad;
    this.commandList[this.commandList.length] = sc;
	
	//krnTrapError
	sc = new ShellCommand();
    sc.command = "krntrap";
    sc.description = "- Tests what happens when the kernal traps an OS error.";
    sc.function = shellKrnTrap;
    this.commandList[this.commandList.length] = sc;
	
	//run
	sc = new ShellCommand();
    sc.command = "run";
    sc.description = "<pid> - Run program specified by <pid>.";
    sc.function = shellRun;
    this.commandList[this.commandList.length] = sc;

	sc = new ShellCommand();
    sc.command = "runall";
    sc.description = "- Run all programs at once.";
    sc.function = shellRunAll;
    this.commandList[this.commandList.length] = sc;

	sc = new ShellCommand();
    sc.command = "quantum";
    sc.description = "<int> - Set the Round Robin quantum.";
    sc.function = shellQuantum;
    this.commandList[this.commandList.length] = sc;
	
	sc = new ShellCommand();
    sc.command = "activepids";
    sc.description = "- Displays the PIDs of all active processes.";
    sc.function = shellActivePIDs;
    this.commandList[this.commandList.length] = sc;
	
	sc = new ShellCommand();
    sc.command = "kill";
    sc.description = "<pid> - Kill active process with specified PID.";
    sc.function = shellKill;
    this.commandList[this.commandList.length] = sc;
	
    // processes - list the running processes and their IDs
    // kill <id> - kills the specified process id.

    //
    // Display the initial prompt.
    this.putPrompt();
}

function shellPutPrompt()
{
    _StdIn.putText(this.promptStr);
}

function shellHandleInput(buffer)
{
    krnTrace("Shell Command~" + buffer);
    // 
    // Parse the input...
    //
    var userCommand = new UserCommand();
    userCommand = shellParseInput(buffer);
    // ... and assign the command and args to local variables.
    var cmd = userCommand.command;
    var args = userCommand.args;
    //
    // Determine the command and execute it.
    //
    // JavaScript may not support associative arrays in all browsers so we have to
    // iterate over the command list in attempt to find a match.  TODO: Is there a better way? Probably.
    var index = 0;
    var found = false;
    while (!found && index < this.commandList.length)
    {
        if (this.commandList[index].command === cmd)
        {
            found = true;
            var fn = this.commandList[index].function;
        }
        else
        {
            ++index;
        }
    }
    if (found)
    {
        this.execute(fn, args);
    }
    else
    {
        // It's not found, so check for curses and apologies before declaring the command invalid.
        if (this.curses.indexOf("[" + rot13(cmd) + "]") >= 0)      // Check for curses.
        {
            this.execute(shellCurse);
        }
        else if (this.apologies.indexOf("[" + cmd + "]") >= 0)      // Check for apologies.
        {
            this.execute(shellApology);
        }
        else    // It's just a bad command.
        {
            this.execute(shellInvalidCommand);
        }
    }
}

function shellParseInput(buffer)
{
    var retVal = new UserCommand();

    // 1. Remove leading and trailing spaces.
    buffer = trim(buffer);

    // 2. Lower-case it.
    buffer = buffer.toLowerCase();

    // 3. Separate on spaces so we can determine the command and command-line args, if any.
    var tempList = buffer.split(" ");

    // 4. Take the first (zeroth) element and use that as the command.
    var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
    // 4.1 Remove any left-over spaces.
    cmd = trim(cmd);
    // 4.2 Record it in the return value.
    retVal.command = cmd;

    // 5. Now create the args array from what's left.
    for (var i in tempList)
    {
        var arg = trim(tempList[i]);
        if (arg != "")
        {
            retVal.args[retVal.args.length] = tempList[i];
        }
    }
    return retVal;
}

function shellExecute(fn, args)
{
    // We just got a command, so advance the line...
    _StdIn.advanceLine();
    // ... call the command function passing in the args...
    fn(args);
    // Check to see if we need to advance the line again
    if (_StdIn.CurrentXPosition > 0)
    {
        _StdIn.advanceLine();
    }
    // ... and finally write the prompt again.
    this.putPrompt();
}


//
// The rest of these functions ARE NOT part of the Shell "class" (prototype, more accurately), 
// as they are not denoted in the constructor.  The idea is that you cannot execute them from
// elsewhere as shell.xxx .  In a better world, and a more perfect JavaScript, we'd be
// able to make then private.  (Actually, we can. have a look at Crockford's stuff and Resig's JavaScript Ninja cook.)
//

//
// An "interior" or "private" class (prototype) used only inside Shell() (we hope).
//
function ShellCommand()     
{
    // Properties
    this.command = "";
    this.description = "";
    this.function = "";
}

//
// Another "interior" or "private" class (prototype) used only inside Shell() (we hope).
//
function UserCommand()
{
    // Properties
    this.command = "";
    this.args = [];
}


//
// Shell Command Functions.  Again, not part of Shell() class per se', just called from there.
//
function shellInvalidCommand()
{
    _StdIn.putText("Invalid Command. ");
    if (_SarcasticMode)
    {
        _StdIn.putText("Duh. Go back to your Speak & Spell.");
    }
    else
    {
        _StdIn.putText("Type 'help' for, well... help.");
    }
}

function shellCurse()
{
    _StdIn.putText("Oh, so that's how it's going to be, eh? Fine.");
    _StdIn.advanceLine();
    _StdIn.putText("Bitch.");
    _SarcasticMode = true;
}

function shellApology()
{
   if (_SarcasticMode) {
      _StdIn.putText("Okay. I forgive you. This time.");
      _SarcasticMode = false;
   } else {
      _StdIn.putText("For what?");
   }
}

function shellVer(args)
{
	//_CommandHistory.push(_Console.buffer.trim());
    _StdIn.putText(APP_NAME + " version " + APP_VERSION);    
}

function shellHelp(args)
{
    _StdIn.putText("Commands:");
    for (var i in _OsShell.commandList)
    {
        _StdIn.advanceLine();
        _StdIn.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
    }    
}

function shellShutdown(args)
{
     _StdIn.putText("Shutting down...");
     // Call Kernel shutdown routine.
    krnShutdown();   
    // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
}

function shellCls(args)
{
    _StdIn.clearScreen();
    _StdIn.resetXY();
}

function shellMan(args)
{
    if (args.length > 0)
    {
        var topic = args[0];
        switch (topic)
        {
            case "help": 
                _StdIn.putText("Help displays a list of (hopefully) valid commands.");
                break;
            default:
                _StdIn.putText("No manual entry for " + args[0] + ".");
        }        
    }
    else
    {
        _StdIn.putText("Usage: man <topic>  Please supply a topic.");
    }
}

function shellTrace(args)
{
    if (args.length > 0)
    {
        var setting = args[0];
        switch (setting)
        {
            case "on": 
                if (_Trace && _SarcasticMode)
                {
                    _StdIn.putText("Trace is already on, dumbass.");
                }
                else
                {
                    _Trace = true;
                    _StdIn.putText("Trace ON");
                }
                
                break;
            case "off": 
                _Trace = false;
                _StdIn.putText("Trace OFF");                
                break;                
            default:
                _StdIn.putText("Invalid arguement.  Usage: trace <on | off>.");
        }        
    }
    else
    {
        _StdIn.putText("Usage: trace <on | off>");
    }
}

function shellRot13(args)
{
    if (args.length > 0)
    {
        _StdIn.putText(args[0] + " = '" + rot13(args[0]) +"'");     // Requires Utils.js for rot13() function.
    }
    else
    {
        _StdIn.putText("Usage: rot13 <string>  Please supply a string.");
    }
}

function shellPrompt(args)
{
    if (args.length > 0)
    {
        _OsShell.promptStr = args[0];
    }
    else
    {
        _StdIn.putText("Usage: prompt <string>  Please supply a string.");
    }
}

function shellDate(args){
	var currentdate = new Date();
	_StdIn.putText("The current date and time is... " + (currentdate.getMonth() + 1) + "/"+ currentdate.getDate()
					+ "/" + currentdate.getFullYear() + " " + currentdate.getHours() + ":" 
					+ currentdate.getMinutes() + ":" + currentdate.getSeconds());
}

function shellWhereami(args){
	var randomNumber = Math.floor(Math.random()*6)
	var message = "";
	switch(randomNumber)
	{
		case 0 :  _StdIn.putText("You are currently at the bottom of the ocean");
			break;
		case 1 :  _StdIn.putText("You are currently in the Kalahari desert.");
			break;
		case 2 :   _StdIn.putText("You are currently face to face with the three headed monster from Harry Potter.");
			break;
		case 3 :   _StdIn.putText("You are currently stuck in a comm. class at Marist.");
			break;
		case 4 :   _StdIn.putText("You are currently in the Rikers Island.");
			break;
		case 5 :   _StdIn.putText("You are currently stuck inside the blue screen of death.");
			break;
		default : _StdIn.putText("Sorry can't find your current location.");
	}
		
}

function shellTen(args){
	setTimeout(verAndDate, 10000);
}

function verAndDate()
{
	var currentdate = new Date();
	
	_StdIn.putText("You are accessing ");
	shellVer();
	_StdIn.putText(" on " + (currentdate.getMonth() + 1) + "/"+ currentdate.getDate()
					+ "/" + currentdate.getFullYear() + " at " + currentdate.getHours() + ":" 
					+ currentdate.getMinutes() + ":" + currentdate.getSeconds());
	
}

function shellStatus(args){
	if (args.length > 0)
    {
        status = args[0];
	}
	else{
		status = "Status is not set";
	}
	
}

function shellLoad(args){
	//var validate = true;
	var userInput = document.getElementById("taProgramInput").value.trim();
	var allInput = userInput.split(" ");

	if (validateProgram(allInput) == true){
		var pid = loadProgram(userInput);
		if (typeof pid != "undefined"){
		_StdIn.putText("Process loaded into memory with PID " + pid);
		}
		else {
			_StdIn.putText("Sorry there is no space open");
		}
	}
	else{
		_StdIn.putText("Sorry the input is not valid");
	}
	
	//Clear data before next load
	userInput = "";
	allInput.splice(0, allInput.length);
}

function validateProgram(programCode){
		var testHex = /[a-f|A-F|0-9]{1,2}\s?/mg;
		var i = 0;
		var result;
		while (i < programCode.length){
		//If progam is valid hex code all OS to load memory
		if(testHex.test(programCode[i]) == true){
			result = true;
		}
		else if (testHex.test(programCode[i]) == false){
			result = false;
			i = programCode.length;	
		}
		i++;
	}
	return result;
}

function shellRun(args){
	if (args.length > 0) 
	{
        var pid = args[0];
		if(typeof _ProgramsList[pid] == "undefined" || isNaN(pid)){
		_StdIn.putText("Invalid pid.");
		}
		else{
			_CurrentProcess = _ProgramsList[pid];
			//Clear CPU before executing
			clearCPU();
			//Begin executing
			_CPU.isExecuting = true;
			}
	}
	else{
		_StdIn.putText("Please enter a pid.");
	}
	
}

function shellKrnTrap(args){
	krnTrapError("TEST: Kernal trapped OS error.");
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

function shellRunAll(args){
	_StdIn.putText("Run all programs at once....eventually");
}

function shellQuantum(args){
	if (args.length > 0) 
	{
        var quantum = args[0];
		_StdIn.putText("Quantum = " + quantum);
	}
	else{
		_StdIn.putText("Please enter a quantum.");
	}
}

function shellActivePIDs(args){
	_StdIn.putText("displays all active PIDs....eventually");
}

function shellKill(args){
	if (args.length > 0)
	{
		var pid = args[0];
		_StdIn.putText("Kill process with PID = " + pid);
	}
	else{
		_StdIn.putText("Please enter a PID");
	}
}


