import { GridHelper, Mesh, MeshLambertMaterial, PlaneBufferGeometry, Vector3 } from 'three';
import { scene } from './scene';

//床
//const floor = new Mesh(
//  new PlaneBufferGeometry(100, 100),
//  new MeshLambertMaterial({
//    color: 0x999999,
//    depthWrite: true,
//  })
//);
//floor.position.y = -0.5;
//floor.rotation.x = -Math.PI / 2;
//scene.add(floor);

//床のタイル
//const grid = new GridHelper(0, 0, 0xfff700, 0xfff700);
//const grid = new GridHelper(50, 100, 0xAAAAAA, 0xAAAAAA);
//scene.add(grid);

export function setCenter({ x, z }: Vector3) {
  //const { y } = floor.position;
  //floor.position.set(x, y, z);
  //grid.position.set(Math.round(x), 0, Math.round(z));
}
