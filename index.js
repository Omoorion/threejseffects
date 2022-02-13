import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
import Stats from 'https://unpkg.com/three@0.126.1/examples/jsm/libs/stats.module.js'
import {GUI} from 'https://unpkg.com/three@0.126.1/examples/jsm/libs/dat.gui.module'
import * as TWEENMAX from 'https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.3/TweenMax.min.js'


const gui = new GUI()
const world = {
    plane: {
        width: 10,
        height: 10,
        widthSegments: 10,
        heightSegments: 10
    }
}
gui.add(world.plane, "width", 1, 20).onChange(generatePlane)

gui.add(world.plane, "height", 1, 20).onChange(generatePlane)

gui.add(world.plane, "widthSegments", 1, 20).onChange(generatePlane)

gui.add(world.plane, "heightSegments", 1, 20).onChange(generatePlane)

function generatePlane(){
    planeMesh.geometry.dispose()
    planeMesh.geometry = new THREE.PlaneGeometry(
        world.plane.width,
        world.plane.height,
        world.plane.widthSegments,
        world.plane.heightSegments)
    const {array} = planeMesh.geometry.attributes.position
    for(let i=0; i< array.length; i+=3){ //363 times
    const x = array[i]
    const y = array[i+1]
    const z = array[i+2]
    //randomally change the z of each point
    array[i + 2] = z + Math.random()
    }   
}

const scene = new THREE.Scene()
//takes FOV(75),
//Aspect Ratio of our scene (TO TAKE UP THE WHOLE SCREEN DIVIDE WIDTH BY HEIGHT),
// Near Cliping plain - how close an object needs to be to the camera
// before it gets clipped out of the scene (doesn't show on the scene),
// Far Cliping Plain - Same but opposite
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000)
//Renders scene
const renderer = new THREE.WebGLRenderer()

renderer.setSize(innerWidth, innerHeight) //size of the renderer in the html
renderer.setPixelRatio(devicePixelRatio)

document.body.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement) //ROTATES CAMERA, NOT OBJECT, NOT LIGHT
//THEREFORE MUST LIGHT THE BACK OF THE OBJECT TOO IF YOU WANT IT VISIBLE

// const boxGeometry = new THREE.BoxGeometry(1,1,1)
// //How hexa colors work: 0xREDGREENBLUE so this here says 00 red, 255 green(highestpossible), 00 blue
// const material = new THREE.MeshBasicMaterial({color: 0x00FF00})

// const mesh = new THREE.Mesh(boxGeometry, material)

// scene.add(mesh)

camera.position.z = 5

const planeGeometry = new THREE.PlaneGeometry(10,10,10,10)
//DoubleSide makes both sides visible and not just one
//FlatShading shows all the individual faces of the mesh, therefore when we change the z, each individual face changes too
//const planeMaterial = new THREE.MeshBasicMaterial({color: 0xFF0000, side: THREE.DoubleSide})
//Material which is reactive to light
const planeMaterial = new THREE.MeshPhongMaterial({
    color:0xFF0000,
    side: THREE.DoubleSide,
    flatShading: THREE.FlatShading
})
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)

scene.add(planeMesh)

console.log(planeMesh.geometry.attributes.position.array) //the array of points on the plane, defining it's shape
const {array} = planeMesh.geometry.attributes.position
for(let i=0; i< array.length; i+=3){ //363 times
    const x = array[i]
    const y = array[i+1]
    const z = array[i+2]
    //randomally change the z of each point
    array[i + 2] = z + Math.random()
}

const light = new THREE.DirectionalLight(0xFFFFFF, 1)

light.position.set(0, 0, 1)

scene.add(light)


function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    // mesh.rotation.x += 0.01
    // mesh.rotation.y += 0.01
    // planeMesh.rotation.x += 0.01
}

animate()