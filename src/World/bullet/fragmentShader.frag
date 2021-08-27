uniform vec3 uColor;
uniform sampler2D uDiffuse;

in vec2 vUv;

void main(){
	vec4 texture=texture2D(uDiffuse,vUv);
	gl_FragColor=vec4(uColor,1.)*texture;
}