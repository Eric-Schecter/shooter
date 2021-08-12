uniform vec3 resolution;
uniform vec2 point;
uniform float lineWidth;
uniform float size;
in vec2 aUv;

void main(){
	vec2 offset = vec2(lineWidth/size/2.);
	vec2 grid=step(lineWidth,fract((aUv+offset)*size));
	float rowID=floor(aUv.x*size);
	float columnID=floor(aUv.y*size);
	
	float b=grid.x*grid.y;
	vec3 color=vec3(1.);
	
	//	color=vec3(.5,.7,.9)  * floor(distance(point,vec2(rowID,columnID)))/size;
	if(rowID==point.x&&columnID==point.y){

	}
	gl_FragColor=vec4(b*color,1.);
}