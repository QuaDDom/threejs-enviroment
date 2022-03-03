let 
scene, 
camera, 
renderer, 
controls, 
materialArray=[], 
skyBoxGeo, 
skybox, 
sphereGeo,
sphereMaterial,
sphereCamera,
sphere,
cubeRenderTarget,
cubeCamera,
ambientLight
;

function init(){
    //Loaders
    let textureLoader = new THREE.TextureLoader(),
        texture_ft = textureLoader.load('img/bluecloud_ft.jpg'),
        texture_bk = textureLoader.load('img/bluecloud_bk.jpg'),
        texture_up = textureLoader.load('img/bluecloud_up.jpg'),
        texture_dn = textureLoader.load('img/bluecloud_dn.jpg'),
        texture_rt = textureLoader.load('img/bluecloud_rt.jpg'),
        texture_lf = textureLoader.load('img/bluecloud_lf.jpg'),
        ambientOcclusion = textureLoader.load('textures/ambientOcclusion.jpg'),
        texture = textureLoader.load('textures/basecolor.jpg'),
        height = textureLoader.load('textures/height.jpg'),
        metalnessMap = textureLoader.load('textures/metalness.jpg'),
        roughnessMap = textureLoader.load('textures/roughness.jpg'),
        normalTexture = textureLoader.load('textures/normalMap.jpg'),
        opacity = textureLoader.load('textures/opacity.jpg');
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.1, 30000);
    camera.position.set(-900,-200,-900);

    cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 128, {
        format: THREE.RGBFormat,
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter,
        encoding: THREE.sRGBEncoding
    } );
    
    cubeCamera = new THREE.CubeCamera( 1, 10000, cubeRenderTarget );

    skyBoxGeo = new THREE.BoxGeometry(10000,10000,10000);
    sphereGeo = new THREE.SphereGeometry(350,64,64);

    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));

    sphereMaterial = new THREE.MeshStandardMaterial({
        envMap: cubeRenderTarget.texture
    })

    skybox = new THREE.Mesh(skyBoxGeo, materialArray);
    sphere = new THREE.Mesh(sphereGeo, sphereMaterial);
    sphere.geometry.attributes.uv2 = sphere.geometry.attributes.uv
    sphere.add(cubeCamera);
    sphere.position.set(0,100,0)
    scene.add(skybox);

    for(let i=0; i<6; i++) materialArray[i].side = THREE.BackSide;

    scene.add(ambientLight);

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: document.querySelector('.webgl')
    });
    renderer.setSize(window.innerWidth,window.innerHeight);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    tick();
}

function tick(){
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
}   

init()