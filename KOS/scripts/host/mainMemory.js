/*
 * mainMemory.js
 * Core memory prototype
 */
  
 function MainMemory()
 {
	var memArr = new Array();
	
	for (i = 0; i < 256; i++){
	{
		memArr[i] = "00";
	}
	
	return memArr;
}
}