uniform float size;
in vec2 aUv;
in vec3 aPos;

const vec3 blue=vec3(.3,.7,1.);

void main(){
	float dist=length(aPos);
	if(dist>size){
		discard;
	}
	float alpha=pow(dist/size,10.);
	gl_FragColor=vec4(blue,alpha);
}