out vec2 vUv;
out vec3 vPos;

void main(){
  vUv = uv;
  vPos = position;
  gl_Position=projectionMatrix * modelViewMatrix * vec4(position,1.);
}