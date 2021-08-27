uniform sampler2D uDiffuse;
uniform float uOpacity;

in vec2 vUv;

void main(){
	vec4 texture=texture2D(uDiffuse,gl_PointCoord);
	vec3 color=vec3(1.,1.,0.);
	gl_FragColor=texture*vec4(color,uOpacity);
}