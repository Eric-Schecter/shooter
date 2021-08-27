uniform float uLife;
uniform sampler2D uDiffuse;

in vec2 vUv;
in vec3 vPos;

vec3 blue=vec3(.3,.5,.7);

void main(){
	vec4 texture=texture2D(uDiffuse,vUv);
	gl_FragColor=vec4(blue,uLife)*texture;
}