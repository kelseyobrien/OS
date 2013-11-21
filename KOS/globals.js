/* ------------  
   Globals.js

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)
   
   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

//
// Global CONSTANTS
//
var APP_NAME = "KOS";  // 'cause I was at a loss for a better name.
var APP_VERSION = "1.0";   // What did you expect?

var CPU_CLOCK_INTERVAL = 100;   // This is in ms, or milliseconds, so 1000 = 1 second.

var TIMER_IRQ = 0;  // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
                    // NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
var KEYBOARD_IRQ = 1;
var MEMACCESS_IRQ = 2;  
var INVALIDOP_IRQ = 3;
var CONTEXT_SWITCH = 4;


//
// Global Variables
//
var _CPU = null;

var _OSclock = 0;       // Page 23.

var _Canvas = null;               // Initialized in hostInit().
var _DrawingContext = null;       // Initialized in hostInit().
var _DefaultFontFamily = "sans";  // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize = 13;
var _FontHeightMargin = 4;        // Additional space added to font size when advancing a line.

var _MainMemory;
var _TotalMemory = 768;		// Total memory space (will be 768 in the future)
var _PartitionSize = 256;
var _PID = 0; 			// To keep track of which PIDs are already in use
var _CurrentProcess = null;
var _ProgramsList = null;
var _PCBUpToDate = null;
var _ReadyQueue = null;

var _Scheduler = null;
var ROUND_QUANTUM = 6;	//Default quantum
var _Cycles = 1;		//To keep track of how many cycles have passed.

//Process states
var P_NEW 	= 0; // Process new
var P_LOAD   	= 1; // Process loaded in memory
var P_RUN 	= 2; // Process currently executing
var P_READY	= 3; // Process ready but waiting (will need this eventually)
var P_TERM 	= 4; // Process finished executing

//Constants for Scheduling Algorithms
var ROUNDR 	 = 0;
var FCFS	 = 1;
var PRIORITY = 2;

// Default the OS trace to be on.
var _Trace = true;

// OS queues
var _KernelInterruptQueue = null;
var _KernelBuffers = null;
var _KernelInputQueue = null;

// Standard input and output
var _StdIn  = null;
var _StdOut = null;

// UI
var _Console = null;
var _OsShell = null;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode = false;

// Global Device Driver Objects - page 12
var krnKeyboardDriver = null;

// For testing...
var _GLaDOS = null;

//Status to be used in OS and host
var status = "OS is running";

//To keep track of the user command history
var _CommandHistory = [];
var _IndexOfCurrentCommand = -1;
