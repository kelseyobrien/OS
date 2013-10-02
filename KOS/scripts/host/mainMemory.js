/*
 * mainMemory.js
 * Core memory prototype
 */
  
 function MainMemory()
 {
	var memArr = new Array();
	
	for (i = 0; i < _TotalMemory; i++){
	{
		memArr[i] = "00";
	}
	
	return memArr;
}
}