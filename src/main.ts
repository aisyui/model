import './main.css';
import './i18n';
import { ajax } from 'rxjs/ajax';
import { canvas, loadAnimation, loadModel, toggleAutoRotate, toggleBloom, toggleLights, toggleTick, toggleTickSky, toggleTickSkySword, toggleTickTen, toggleFloorGrid, toggleFloorY, toggleTel } from './host';
import { setAutoShown, showMoreInfo } from './host/meta-display';
import registerStats from './host/status';
import { registerDropZone } from './utils/drag-drop';
import { showSnack } from './utils/tocas-helpers';
import { observeMediaQuery } from './utils/rx-helpers';
import { interceptEvent, isInFrame } from './utils/helper-functions';
import workerService from './host/worker-service';

const loadingPromises: Promise<any>[] = [];
let isLoading = false;
let hasLoadModel = false;

function onFileSelected(files: FileList) {
  let animFile: File | undefined;
  let animType = '';
  let modelFile: File | undefined;
  for (const file of files) {
    if (animFile && modelFile) return;
    const name = file.name.toLowerCase();
    if (name.endsWith('.vrm')) {
      if (modelFile) continue;
      modelFile = file;
    } else if (name.endsWith('.vmd')) {
      if (animFile) continue;
      animFile = file;
      animType = 'vmd';
    } else if (name.endsWith('.bvh')) {
      if (animFile) continue;
      animFile = file;
      animType = 'bvh';
    }
  }
  if (modelFile) {
    loadingPromises.push(loadModel(modelFile));
    hasLoadModel = true;
  }
  if (animFile) loadingPromises.push(loadAnimation(animFile, animType));
  if (hasLoadModel) triggerLoading();
}

async function triggerLoading() {
  if (isLoading || !loadingPromises.length) return;
  isLoading = true;
  document.querySelector('#loading')?.classList.add('active');
  while (loadingPromises.length) {
    const wait = Array.from(loadingPromises, interceptLoadingError);
    loadingPromises.length = 0;
    await Promise.all(wait);
  }
  isLoading = false;
  document.querySelector('#loading')?.classList.remove('active');
}

function interceptLoadingError<T>(promise: Promise<T>) {
  return promise.catch(errorToSnackBar);
}

function errorToSnackBar(error?: any) {
  let message: string | undefined;
  if (typeof error?.message === 'string')
    message = error.message;
  if (message) showSnack(message);
}

const searchParams = new URLSearchParams(location.search);

const vrmUrl = searchParams.get('vrm');
if (vrmUrl)
  loadingPromises.push((async () => {
    const { response } = await ajax({
      url: vrmUrl,
      responseType: 'blob',
    }).toPromise();
    return loadModel(response);
  })());

const animUrl = searchParams.get('anim');
if (animUrl)
  loadingPromises.push((async () => {
    const { response } = await ajax({
      url: animUrl,
      responseType: 'blob',
    }).toPromise();
    let animType = searchParams.get('animtype');
    if (!animType) {
      if (animUrl.endsWith('.vmd'))
        animType = 'vmd';
      else if (animUrl.endsWith('.bvh'))
        animType = 'bvh';
      else if (animUrl.endsWith('.vrma'))
        animType = 'vrma';
      else
        animType = 'vmd';
    }
    return loadAnimation(response, animType);
  })());

const camX = searchParams.get('x');
if (camX) workerService.trigger('setCameraX', Number(camX));
const camY = searchParams.get('y');
if (camY) workerService.trigger('setCameraY', Number(camY));
const camZ = searchParams.get('z');
if (camZ) workerService.trigger('setCameraZ', Number(camZ));
const targetX = searchParams.get('tx');
if (targetX) workerService.trigger('setTargetX', Number(targetX));
const targetY = searchParams.get('ty');
if (targetY) workerService.trigger('setTargetY', Number(targetY));
const targetZ = searchParams.get('tz');
if (targetZ) workerService.trigger('setTargetZ', Number(targetZ));

let api_url_local = "https://api.syui.ai/users/"
let url = new URL(window.location.href);
const params = new URLSearchParams(window.location.search);

let date = new Date();
var num_h =	date.getHours();
var model_url = "https://vrm.syui.ai/vrma/model/ai.vrm"

import axios, {isCancel, AxiosError} from 'axios';
function model_load(){
	axios.get(model_url, {
		responseType: "blob"
	})
	.then(response => {
		loadingPromises.push(loadModel(response.data));
		hasLoadModel = true;
  triggerLoading();
		const blob = new Blob([response.data], {
			type: response.data.type
		});
	})
}
if (model_url !== null) {
	model_load();
}

import * as THREE from 'three';
export const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const listener = new THREE.AudioListener();
camera.add( listener );
const sound = new THREE.Audio( listener );
const audioLoader = new THREE.AudioLoader();

function getModels(a?:string){
	axios.get(model_url, {
		responseType: "blob"
	})
	.then(response => {
		loadingPromises.push(loadModel(response.data));
		hasLoadModel = true;
		triggerLoading();
		const blob = new Blob([response.data], {
			type: response.data.type
		});
	})
}

function getMenus() {
		var x = document.querySelector('#menu') as HTMLInputElement | null;
		if (x != null) {
			if (x.style.display === "none") {
				x.style.display = "block";
			} else {
				x.style.display = "none";
			}
		}
}

//背景のキラキラ(モバイルでは重い)
//toggleTick();

if (loadingPromises.length) triggerLoading();
