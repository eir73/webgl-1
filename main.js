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
const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

const positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer) 

let positions = [
  60, 270,
  120, 270,
  120, 210,
  120, 210,
  60, 210,
  60, 270, //head 
  120, 270,
  180, 270,
  180, 330, //ears 
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
  180, 120 //hands
];

positions = verticalMove(1, positions)

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
gl.clearColor(1, 0.7, 0.8, 1)
gl.clear(gl.COLOR_BUFFER_BIT)
gl.useProgram(program)
gl.enableVertexAttribArray(positionAttributeLocation)
gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)
// Указываем атрибуту, как получать данные от positionBuffer (ARRAY_BUFFER)
const size = 2          // 2 компоненты на итерацию
const type = gl.FLOAT   // наши данные - 32-битные числа с плавающей точкой
const normalize = false // не нормализовать данные
const stride = 0        // 0 = перемещаться на size * sizeof(type) каждую итерацию для получения следующего положения
const offset = 0       // начинать с начала буфера
gl.vertexAttribPointer(
    positionAttributeLocation, size, type, normalize, stride, offset)

const primitiveType = gl.TRIANGLES
const count = positions.length
gl.drawArrays(primitiveType, offset, count)

function createShader(gl, type, source) {
  const shader = gl.createShader(type)  // создание шейдера
  gl.shaderSource(shader, source)      // устанавливаем шейдеру его программный код
  gl.compileShader(shader)           // компилируем шейдер
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (success) {                        // если компиляция прошла успешно - возвращаем шейдер
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

function verticalMove(dir, buffer) {
  return buffer.map((el, i) => {
    if(i % 2) {
      return el + dir * 30
    } 
    return el
  })
}

function horizontalMove(dir, buffer) {
  return buffer.map((el, i) => {
    if(i % 2) {
      return el
    } 
    return el + dir * 30
  })
}

document.onkeydown = handleButtonClick

function handleButtonClick(e) {
  switch (e.key) {
    case 'ArrowUp': 
      positions = verticalMove(1, positions)
      break
    case 'ArrowDown':
      positions = verticalMove(-1, positions)
      break
    case 'ArrowLeft':
      positions = horizontalMove(-1, positions)
      break
    case 'ArrowRight':
      positions = horizontalMove(1, positions)
      break
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
  gl.clearColor(1, 0.7, 0.8, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)
  const primitiveType = gl.TRIANGLES
  const count = positions.length
  gl.drawArrays(primitiveType, offset, count)
}