const canvas = document.getElementById('c')

const gl = canvas.getContext('webgl')
if (!gl) {
  console.error('[ webGL Error ]')
}

const vertexShaderSource = document.getElementById('vertex-shader-2d').text
const fragmentShaderSource = document.getElementById('fragment-shader-2d').text

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

const program = createProgram(gl, vertexShader, fragmentShader)
const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
let translationLocation = gl.getUniformLocation(program, 'u_translation')
let colorLocation = gl.getUniformLocation(program, "u_color")

let positions = [
  120, 270,
  180, 330, 
  180, 270,//ears 
  120, 270,
  60, 270,
  60, 210,
  60, 210,
  120, 210,
  120, 270, //head
  120, 240,
  120, 120,
  240, 120, //body tr1
  180, 180,
  300, 180,
  300, 60, //body tr2
  300, 180,
  360, 180,
  360, 240, //tail
  300, 120,
  300, 0,
  360, 60, //legs
  180, 120,
  150, 90,
  60, 90,
  60, 90, 
  90, 120,
  180, 120 //hands*/
]

let stroke = [
  120, 270,
  180, 330,
  180, 270,
  120, 270,
  60, 270,
  60, 210,
  120, 210,
  120, 270,
  120, 240,
  180, 180,
  300, 180,
  360, 240,
  360, 180,
  300, 180,
  300, 0,
  360, 60,
  300, 120,
  300, 60,
  120, 240,
  120, 120,
  90, 120,
  60, 90,
  150, 90,
  180, 120,
  240, 120,
  120, 120,
  120, 240,
  180, 180
]

stroke = parseCoords(stroke)
positions = parseCoords(positions)


gl.clearColor(1, 0.7, 0.8, 1)
gl.clear(gl.COLOR_BUFFER_BIT)
let color = [0.6, 0.8, 0.2, 1] //green
gl.useProgram(program)
gl.uniform4fv(colorLocation, color);
gl.enableVertexAttribArray(positionAttributeLocation)
const triangleBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer)
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)

const translation = [-0.2, 0.1]
gl.uniform2fv(translationLocation, translation);

drawTriangles()
strokeTriangles()

document.onkeydown = handleButtonClick

function createShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (success) {
    return shader
  }

  console.log(gl.getShaderInfoLog(shader))
  gl.deleteShader(shader)
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  const success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (success) {
    return program
  }

  console.log(gl.getProgramInfoLog(program))
  gl.deleteProgram(program)
}

function handleButtonClick(e) {
  let changed = false
  switch (e.code) {
    case 'KeyW': 
      translation[0] += 0.1
      changed = true
      break
    case 'KeyS':
      translation[0] -= 0.1
      changed = true
      break
    case 'KeyA':
      translation[0] -=0.1
      changed = true
      break
    case 'KeyD':
      translation[0] += 0.1
      changed = true
      break
  }
    
    if (changed) {
      drawTriangles()
      strokeTriangles()
  }
}

function drawTriangles() {
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
  let color = [0.6, 0.8, 0.2, 1] //green
  gl.uniform4fv(colorLocation, color);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniform2fv(translationLocation, translation);
  
  const count = positions.length
  gl.drawArrays(gl.TRIANGLES, 0, count)
}

function strokeTriangles() {
  const strokeBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, strokeBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(stroke), gl.STATIC_DRAW)
  const size = 2          
  const type = gl.FLOAT  
  const normalize = true 
  const stride = 0        
  const offset = 0      
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)
  let color = [0.3, 0.4, 0.1, 1] //dark-green
  gl.uniform4fv(colorLocation, color)

  const count = positions.length
  gl.drawArrays(gl.LINE_STRIP, 0, count)
}

function parseCoords(array) {
  array = array.map(el => (( el + 30 - gl.canvas.width/2 ) / gl.canvas.width/2))
  const max = Math.max(...array)
  array = array.map(el => (el*(0.9/max)).toFixed(2))
  return array
}
