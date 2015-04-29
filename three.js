$.getScript("three.js-master/build/three.js",function() {
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  var geometry = new THREE.CubeGeometry(2,2,2);
  var material = new THREE.MeshBasicMaterial({color: 0xffffff});
  var cube = new THREE.Mesh(geometry, material); scene.add(cube);
  var t=0;
  camera.position.z = 5;
function render() {
  requestAnimationFrame(render);
  t++;
    camera.position.set( 0, 0,50*Math.cos(t/50));
    cube.rotation.x += 0.1;
    cube.rotation.y += 0.1;
    renderer.render(scene, camera);
}
render();
});
