out vec2 aUv;
out vec3 aPos;
void main(){
  aUv = uv;
  aPos = position;
  gl_Position=projectionMatrix * modelViewMatrix * vec4(position,1.);
}