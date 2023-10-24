import { Color, DirectionalLight, Fog, HemisphereLight } from 'three';
import { Observable } from 'rxjs';
import { BACKGROUND_COLOR, BACKGROUND_COLOR_DIM, scene } from './scene';
import { WorkerMessageService } from '../../utils/message-service';
import { GridHelper, Mesh, MeshLambertMaterial, PlaneBufferGeometry, Vector3 } from 'three';

//背景をHDR
//import * as THREE from 'three';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

//// 金属の写実的な反射を設定
//let cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
//cubeRenderTarget.texture.type = THREE.HalfFloatType;
//let cubeCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget);
//let material = new THREE.MeshStandardMaterial({
//	envMap: cubeRenderTarget.texture,
//	roughness: 0.05,
//	metalness: 1,
//	color: 0xff9933
//});

function getTels(){
	let bk_0 = "/img/00.hdr";
	let bk_1 = "/img/01.hdr";
	let bk_2 = "/img/02.hdr"
	let bk_3 = "/img/03.hdr"
	let num = Math.floor(Math.random() * 10) + 1
	if (num == 1){
		var hdr = bk_0;
	} else if(num == 2){
		var hdr = bk_1;
	} else if(num == 3){
		var hdr = bk_2;
	} else {
		var hdr = bk_0;
	}

	new RGBELoader().load(hdr, function (texture) {
		texture.mapping = THREE.EquirectangularReflectionMapping;
		scene.background = texture;
		scene.environment = texture;
	});
}

const bgColor = new Color(0xcccccc);

function floor_default(){
	const floor = new Mesh(
		new PlaneBufferGeometry(100, 100),
		new MeshLambertMaterial({
			color: 0x999999,
			depthWrite: true,
		})
	);
	floor.position.y = -0.5;
	floor.rotation.x = -Math.PI / 2;
	//const { y } = floor.position;
	//floor.position.set(0, 0, 0);
	scene.add(floor);
	return floor;
}

function floor_grid(){
	const grid = new GridHelper(50, 100, 0xAAAAAA, 0xAAAAAA);
	scene.add(grid);
	grid.position.set(Math.round(0), 0, Math.round(0));
	return grid;
}



var targetIntensity = 1;
let card_time = 22;
let date = new Date();
var num_hh =	date.getHours();
if (num_hh > 19){
	var num_h =	0.3;
} else {
	var num_h =	date.getHours() * 0.1;
}

//var targetIntensity = num_h;

export let currentIntensity = 1;
const ambiantLight = new HemisphereLight(0xffffff, 0x444444);
ambiantLight.position.set(0, 20, 0);
scene.add(ambiantLight);

const light = new DirectionalLight(0xffffff);
light.position.set(1, 1, -1).normalize();
scene.add(light);

function floor_bg(){
	//scene.background = new Color(0xcccccc);
	scene.fog = new Fog(0xffffff, 3, 10);
	scene.fog?.color.set(0xffffff);
	currentIntensity += (targetIntensity - currentIntensity) * Math.min(1, 0.1 * 4);
	ambiantLight.intensity = currentIntensity;
	light.intensity = 0.25+ 0.75 * currentIntensity;
	bgColor.set(BACKGROUND_COLOR_DIM).lerp(BACKGROUND_COLOR, currentIntensity);
	//if (scene.background instanceof Color)
	//	scene.background.set(bgColor);
	//else
	//	scene.background = bgColor.clone();
}
export const fl_de = floor_default();
export const fl_gr = floor_grid();
export const fl_bg = floor_bg();
function floor_default_remove(int: number){
	if (int == 1){
		scene.remove(fl_de);
		scene.remove(fl_gr);
		getTels();
	}
}

floor_default_remove(0);


// 紙吹雪
import * as THREE from 'three';
//const scene = new THREE.Scene();

function star() {
	let s_rot = 0;
	let s_xp = 30;
	let s_yp = 15;
	let s_zp = 30;
	const s_length = 3000;
	const s_plane_scale = Math.floor(Math.random() * 0.01) + 0.009;
	const s_plane = [];
	for(let i=0; i<s_length; i++){
		var color = "0x" + Math.floor(Math.random() * 16777215).toString(16);
		let geometry = new THREE.PlaneGeometry( s_plane_scale, s_plane_scale );
		var material = new THREE.MeshBasicMaterial({
			color: 0xfff700,
			opacity: 0.8,
			transparent: true,
			side: THREE.DoubleSide
		});
		s_plane[i] = new THREE.Mesh( geometry, material );
		s_plane[i].rotation.x = Math.PI / 2 * Math.random();
		s_plane[i].position.x = s_xp * (Math.random() - 0.5);
		s_plane[i].position.y = s_yp * (Math.random() - 0.5);
		s_plane[i].position.z = s_zp * (Math.random() - 0.5);
		scene.add(s_plane[i]);
	}
	return s_plane;
}

function star_remove(){
		var s_length = 3000;
		var s_plane = star();
		setTimeout(() => {
			for(let i=0; i<s_length; i++){
				scene.remove(s_plane[i]);
			}
		}, 6000);
}

function tick() {
	let s_rot = 0;
	let s_xp = 15;
	let s_yp = 0;
	let s_zp = 15;
	const s_length = 500;
	const s_plane_scale = Math.floor(Math.random() * 0.01) + 0.009;
	const s_plane = [];
	for(let i=0; i<s_length; i++){
		var color = "0x" + Math.floor(Math.random() * 16777215).toString(16);
		let geometry = new THREE.PlaneGeometry( s_plane_scale, s_plane_scale );
		var material = new THREE.MeshBasicMaterial({
			color: Number(color),
			opacity: 0.8,
			transparent: true,
			side: THREE.DoubleSide
		});
		s_plane[i] = new THREE.Mesh( geometry, material );
		s_plane[i].rotation.x = Math.PI / 2 * Math.random();
		s_plane[i].position.x = s_xp * (Math.random() - 0.5);
		s_plane[i].position.y = s_yp * (Math.random() - 0.5);
		s_plane[i].position.z = s_zp * (Math.random() - 0.5);
		scene.add(s_plane[i]);
	}
	return s_plane;
}

function tick_remove(){
		var s_length = 500;
		var s_plane = tick();
		setTimeout(() => {
			for(let i=0; i<s_length; i++){
				scene.remove(s_plane[i]);
			}
		}, 6000);
}

function tick_t() {
	let s_rot = 0;
	let s_xp = 15;
	let s_yp = 0;
	let s_zp = 15;
	const s_length = 200;
	const s_plane_scale = Math.floor(Math.random() * 0.01) + 0.009;
	const s_plane = [];
	for(let i=0; i<s_length; i++){
		var color = "0x" + Math.floor(Math.random() * 16777215).toString(16);
		let geometry = new THREE.PlaneGeometry( s_plane_scale, s_plane_scale );
		var material = new THREE.MeshBasicMaterial({
			color: 0xfff700,
			opacity: 0.8,
			transparent: true,
			side: THREE.DoubleSide
		});
		s_plane[i] = new THREE.Mesh( geometry, material );
		s_plane[i].rotation.x = Math.PI / 2 * Math.random();
		s_plane[i].position.x = s_xp * (Math.random() - 0.5);
		s_plane[i].position.y = s_yp * (Math.random() - 0.5);
		s_plane[i].position.z = s_zp * (Math.random() - 0.5);
		scene.add(s_plane[i]);
	}
	return s_plane;
}

function tick_t_remove(){
		var s_length = 200;
		var s_plane = tick_t();
		setTimeout(() => {
			for(let i=0; i<s_length; i++){
				scene.remove(s_plane[i]);
			}
		}, 3000);
}

function tick_ten() {
	let s_rot = 0;
	let s_xp = 0.1;
	let s_yp = 2.4;
	let s_zp = 1;
	const s_length = 20;
	const s_plane_scale = 0.01;
	const s_plane = [];
	for(let i=0; i<s_length; i++){
		var color = "0x" + Math.floor(Math.random() * 16777215).toString(16);
		let geometry = new THREE.PlaneGeometry( Math.random(), s_plane_scale );
		var material = new THREE.MeshBasicMaterial({
			//color: Number(color),
			color: 0xfff700,
			opacity: 0.3,
			transparent: true,
			side: THREE.DoubleSide
		});
		s_plane[i] = new THREE.Mesh( geometry, material );
		s_plane[i].rotation.x = Math.PI / 2 * Math.random();
		s_plane[i].position.x = s_xp * (Math.random() - 0.5);
		s_plane[i].position.y = s_yp * (Math.random() - 0.5);
		s_plane[i].position.z = s_zp * (Math.random() - 0.5);
		scene.add(s_plane[i]);
	}
	return s_plane;
}

function tick_ten_remove(){
	const s_length = 200;
	var s_plane = tick_ten();
	setTimeout(() => {
		for(let i=0; i<s_length; i++){
			scene.remove(s_plane[i]);
		}
	}, 20);
}

function tick_sky() {
	let s_rot = 0;
	let s_xp = 10;
	let s_yp = 10;
	let s_zp = 10;
	const s_length = 5000;
	const s_plane_scale = Math.floor(Math.random() * 0.05) + 0.01;
	const s_plane = [];
	for(let i=0; i<s_length; i++){
		var color = "0x" + Math.floor(Math.random() * 16777215).toString(16);
		let geometry = new THREE.PlaneGeometry( s_plane_scale, s_plane_scale );
		var material = new THREE.MeshBasicMaterial({
			color: Number(color),
			opacity: 0.8,
			transparent: true,
			side: THREE.DoubleSide
		});
		s_plane[i] = new THREE.Mesh( geometry, material );
		s_plane[i].rotation.x = Math.PI / 2 * Math.random();
		s_plane[i].position.x = s_xp * (Math.random() - 0.5);
		s_plane[i].position.y = s_yp * (Math.random() - 0.5);
		s_plane[i].position.z = s_zp * (Math.random() - 0.5);
		scene.add(s_plane[i]);
	}
	return s_plane;
}

function tick_sky_remove(){
	const s_length = 5000;
	var s_plane = tick_sky();
	setTimeout(() => {
		for(let i=0; i<s_length; i++){
			scene.remove(s_plane[i]);
		}
	}, 7000);
}

function tick_sky_sword() {
	let s_rot = 0;
	let s_xp = 3;
	let s_yp = 1.6;
	let s_zp = 1.6;
	const s_length = 3;
	const s_plane_scale = 0.01;
	const s_plane = [];
	for(let i=0; i<s_length; i++){
		//var color = "0x" + Math.floor(Math.random() * 16777215).toString(16);
		let geometry = new THREE.PlaneGeometry( Math.random(), s_plane_scale );
		var material = new THREE.MeshBasicMaterial({
			color: 0xfff700,
			opacity: 0.8,
			transparent: true,
			side: THREE.DoubleSide
		});
		s_plane[i] = new THREE.Mesh( geometry, material );
		s_plane[i].rotation.x = Math.PI / 2 * Math.random();
		s_plane[i].position.x = s_xp * (Math.random() - 0.5);
		s_plane[i].position.y = s_yp * (Math.random() - 0.5);
		s_plane[i].position.z = s_zp * (Math.random() - 0.5);
		scene.add(s_plane[i]);
	}
	return s_plane;
}

function tick_sky_sword_remove(){
	const s_length = 5000;
	var s_plane = tick_sky_sword();
	setTimeout(() => {
		for(let i=0; i<s_length; i++){
			scene.remove(s_plane[i]);
		}
	}, 500);
}

export function toggleFloorY() {
	const floor = new Mesh(
		new PlaneBufferGeometry(100, 100),
		new MeshLambertMaterial({
			color: 0xfff700,
			depthWrite: false,
		})
	);
	floor.position.y = -0.5;
	floor.rotation.x = -Math.PI / 2;
	scene.add(floor);
	setTimeout(() => {
		scene.remove(floor);
	}, 7000);
}

export function toggleFloorGrid() {
	const grid = new GridHelper(50, 100, 0xfff700, 0xfff700);
	scene.add(grid);
	setTimeout(() => {
		scene.remove(grid);
	}, 7000);
}

export function init(updater: Observable<number>) {
  updater.subscribe(update);
}

export function update(deltaTime: number) {
  currentIntensity += (targetIntensity - currentIntensity) * Math.min(1, deltaTime * 4);
  ambiantLight.intensity = currentIntensity;
  light.intensity = 0.25+ 0.75 * currentIntensity;
  bgColor.set(BACKGROUND_COLOR_DIM).lerp(BACKGROUND_COLOR, currentIntensity);
  scene.fog?.color.set(bgColor);
		//HDRを設定する場合、コメント化
		//	if (scene.background instanceof Color)
		//		scene.background.set(bgColor);
		//	else
		//		scene.background = bgColor.clone();
}

export function toggleLights() {
  targetIntensity = targetIntensity > 0 ? 0 : 1;
}

export function setLights(intensity: number) {
	targetIntensity = intensity;
}

export function toggleTick() {
	if (!navigator.userAgent.match(/iPhone|iPod|iPad|Android.+Mobile/)) {
		const s = tick();
		const t = tick_t();
		const ss = star();
		tick_remove();
		tick_t_remove();
		star_remove();
		var num = Math.floor(Math.random() * 5990) + 4790;
		var num_star = Math.floor(Math.random() * 5990) + 4790;
		var num_t = Math.floor(Math.random() * 2990) + 2790;
		for(let i=0; i<100; i++){
			var num = Math.floor(Math.random() * 5990) + 4790;
			var num_star = Math.floor(Math.random() * 5990) + 4790;
			var num_t = Math.floor(Math.random() *2990) + 2790;
			//if (option == 1){
			//	const s_length = 2000;
			//	for(let i=0; i<s_length; i++){
			//		scene.remove(s[i]);
			//	}
			//	break;
			//}
			setTimeout(() => {
				tick_t_remove();
			}, num_t * i);
			setTimeout(() => {
				tick_remove();
				star_remove();
			}, num * i);
		}
	}
}

export function toggleTickSky() {
	if (!navigator.userAgent.match(/iPhone|iPod|iPad|Android.+Mobile/)) {
		tick_sky_remove();
	}
}

export function toggleTickSkySword() {
	if (!navigator.userAgent.match(/iPhone|iPod|iPad|Android.+Mobile/)) {
		tick_sky_sword_remove();
	}
}

export function toggleTickTen() {
	if (!navigator.userAgent.match(/iPhone|iPod|iPad|Android.+Mobile/)) {
		tick_ten_remove();
	}
}

export function toggleTel(int: number) {
	floor_default_remove(int)
}

WorkerMessageService.host.on({ setLights, toggleLights, toggleTick, toggleTickSky, toggleTickSkySword, toggleTickTen, toggleFloorY, toggleFloorGrid, toggleTel });
