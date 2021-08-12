out vec2 aUv;

void main(){
  aUv = uv;
  gl_Position=projectionMatrix * modelViewMatrix * vec4(position,1.);
}