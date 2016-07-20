function FindInOut (time,animationArray) {
	var tween = 0;
		var inPoint = outPoint = 0;
		for(var i = 1 ; i < animationArray.length ; i++){

			var b = animationArray[i][0];
			var bVal = animationArray[i][1];

			var a = animationArray[i-1][0];
			var aVal = animationArray[i-1][a];

			if(time<b && time>a){
				tween = 1-((b-time)/(b-a));
				inPoint = i-1;
				outPoint = i;
			}
		}
		return [tween,inPoint,outPoint];
}

function Remap (value,  from1,  to1,  from2,  to2) {
	return (value - from1) / (to1 - from1) * (to2 - from2) + from2;
}