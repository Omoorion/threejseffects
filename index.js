import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
import Stats from 'https://unpkg.com/three@0.126.1/examples/jsm/libs/stats.module.js'
import {GUI} from 'https://unpkg.com/three@0.126.1/examples/jsm/libs/dat.gui.module'
import * as TWEENMAX from 'https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.3/TweenMax.min.js'


const gui = new GUI()
const world = {
    plane: {
        width: 400,
        height: 400,
        widthSegments: 50,
        heightSegments: 50
    }
}
gui.add(world.plane, "width", 1, 500).onChange(generatePlane)

gui.add(world.plane, "height", 1, 500).onChange(generatePlane)

gui.add(world.plane, "widthSegments", 1, 100).onChange(generatePlane)

gui.add(world.plane, "heightSegments", 1, 100).onChange(generatePlane)

function generatePlane(){
    planeMesh.geometry.dispose()
    planeMesh.geometry = new THREE.PlaneGeometry(
        world.plane.width,
        world.plane.height,
        world.plane.widthSegments,
        world.plane.heightSegments)
        const randomValues = []
        const {array} = planeMesh.geometry.attributes.position
        for(let i=0; i< array.length; i++){ //363 times
            if (i % 3 === 0) {
                const x = array[i]
                const y = array[i+1]
                const z = array[i+2]
            //randomally change the z of each point
                array[i + 2] = z + (Math.random() - 0.5) * 3
                array[i+1] = y + (Math.random() - 0.5) * 3
                array[i] = x + (Math.random() - 0.5) * 3
            }
        
            randomValues.push(Math.random() * Math.PI * 2)
        
        }
        
        planeMesh.geometry.attributes.position.randomValues = randomValues
        
        planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array 
        
    
    const colors = []
    for(let i=0; i<planeMesh.geometry.attributes.position.count; i++){
        colors.push(0,0.19,0.4)
    }


    planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))

}
const raycaster = new THREE.Raycaster()
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

camera.position.z = 50

const planeGeometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments)
//DoubleSide makes both sides visible and not just one
//FlatShading shows all the individual faces of the mesh, therefore when we change the z, each individual face changes too
//const planeMaterial = new THREE.MeshBasicMaterial({color: 0xFF0000, side: THREE.DoubleSide})
//Material which is reactive to light
const planeMaterial = new THREE.MeshPhongMaterial({
    //color:0xFF0000, when you assign vertex colors, do not use a regular one too
    side: THREE.DoubleSide,
    flatShading: THREE.FlatShading,
    vertexColors: true
})
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
generatePlane()
scene.add(planeMesh)

console.log(planeMesh.geometry.attributes.position.array) //the array of points on the plane, defining it's shape
const randomValues = []
const {array} = planeMesh.geometry.attributes.position
for(let i=0; i< array.length; i++){ //363 times
    if (i % 3 === 0) {
        const x = array[i]
        const y = array[i+1]
        const z = array[i+2]
    //randomally change the z of each point
        array[i + 2] = z + (Math.random() - 0.5) * 3
        array[i+1] = y + (Math.random() - 0.5) * 3
        array[i] = x + (Math.random() - 0.5) * 3
    }

    randomValues.push(Math.random() * Math.PI * 2)

}

planeMesh.geometry.attributes.position.randomValues = randomValues

planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array 

const colors = []
for(let i=0; i<planeMesh.geometry.attributes.position.count; i++){
    colors.push(0,0.19,0.4)
}


planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))


const light = new THREE.DirectionalLight(0xFFFFFF, 1)

light.position.set(0, -1, 1)

scene.add(light)

const backLight = new THREE.DirectionalLight(0xFFFFFF, 1)

backLight.position.set(0, 0, -1)

scene.add(backLight)


window.addEventListener('resize', function(event){
    renderer.setSize(innerWidth, innerHeight) //size of the renderer in the html
    renderer.setPixelRatio(devicePixelRatio)
  });

const mouse = {
    x: undefined,
    y:undefined
}
let frame = 0
function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    raycaster.setFromCamera(mouse, camera)
    frame+=0.01
    const {array, originalPosition, randomValues} = planeMesh.geometry.attributes.position
    for (let i = 0; i<array.length; i+=3){
        //x
        array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.01
        //y
        array[i + 1] = originalPosition[i + 1] + Math.sin(frame + randomValues[i + 1]) * 0.01
    }
    planeMesh.geometry.attributes.position.needsUpdate = true


    const intersects = raycaster.intersectObject(planeMesh)
    if(intersects.length>0) {
        const {color} = intersects[0].object.geometry.attributes
        //vertice 1
        color.setX(intersects[0].face.a,0.1)
        color.setY(intersects[0].face.a,0.5)
        color.setZ(intersects[0].face.a,1)

        //vertice 2
        color.setX(intersects[0].face.b,0.1)
        color.setY(intersects[0].face.b,0.5)
        color.setZ(intersects[0].face.b,1)

        //vertice 3
        color.setX(intersects[0].face.c,0.1)
        color.setY(intersects[0].face.c,0.5)
        color.setZ(intersects[0].face.c,1)

        intersects[0].object.geometry.attributes.color.needsUpdate = true
        
        const initialColor = {
            r:0,
            g:0.19,
            b:0.4
        }

        const hoverColor = {
            r:0.1,
            g:0.5,
            b:1
        }
        gsap.to(hoverColor, {
            r: initialColor.r,
            g: initialColor.g,
            b: initialColor.b,
            duration: 1,
            onUpdate:()=>{
                //vertice 1
                color.setX(intersects[0].face.a,hoverColor.r)
                color.setY(intersects[0].face.a,hoverColor.g)
                color.setZ(intersects[0].face.a,hoverColor.b)

                //vertice 2
                color.setX(intersects[0].face.b,hoverColor.r)
                color.setY(intersects[0].face.b,hoverColor.g)
                color.setZ(intersects[0].face.b,hoverColor.b)

                //vertice 3
                color.setX(intersects[0].face.c,hoverColor.r)
                color.setY(intersects[0].face.c,hoverColor.g)
                color.setZ(intersects[0].face.c,hoverColor.b)
                color.needsUpdate = true
            }
        })
    }
    // mesh.rotation.x += 0.01
    // mesh.rotation.y += 0.01
    // planeMesh.rotation.x += 0.01
}

animate()

addEventListener('mousemove', (event)=>{
    //x cords normalized from -1 to 1
    mouse.x = (event.clientX / innerWidth)*2-1
    //three.js reads upside down so we go 1 to -1
    mouse.y = -(event.clientY / innerHeight)*2+1
})