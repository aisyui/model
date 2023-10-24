import { WebGLRenderer } from 'three';
import * as THREE from 'three';
export let renderer: WebGLRenderer | undefined;

export function init(canvas: HTMLCanvasElement | OffscreenCanvas) {
  if (!renderer) renderer = new WebGLRenderer({
			alpha: true,
			antialias: true,
			//logarithmicDepthBuffer: true,
			canvas,
  });
		renderer.shadowMap.enabled = true;
		renderer.xr.enabled = true;
		let num_rend = Math.floor(Math.random() * 7) + 1
		if (num_rend == 1) {
			renderer.outputEncoding = THREE.sRGBEncoding;
		}
		return renderer;
}


