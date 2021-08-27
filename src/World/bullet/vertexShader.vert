out vec2 vUv;
void main(){
  vUv = uv;
  vec3 pos = position;
  pos.x *= 10.;
  gl_Position=projectionMatrix * modelViewMatrix * vec4(pos,1.);
}