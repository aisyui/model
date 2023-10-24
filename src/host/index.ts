import h from 'hyperscript';
import { RemoteCanvasHost } from '../utils/remote-canvas';
import { blob2ArrayBuffer, interceptEvent } from '../utils/helper-functions';
import { observeVisibilty } from '../utils/rx-helpers';
import workerService from './worker-service';
import { isSupported as isVRSupported } from '../utils/xr-detect';

export const canvas = document.body.appendChild(h('canvas', { tabIndex: 0 }));
canvas.addEventListener('contextmenu', interceptEvent);
canvas.tabIndex = 0;

const remoteCanvasHost = new RemoteCanvasHost(workerService, canvas);
remoteCanvasHost.eventFilters.set(PointerEvent, {
  type: true,
  pointerType: true,
  ctrlKey: true,
  altKey: true,
  metaKey: true,
  shiftKey: true,
  button: true,
  clientX: true,
  clientY: true,
  pageX: true,
  pageY: true,
}).set(KeyboardEvent, {
  type: true,
  ctrlKey: true,
  altKey: true,
  metaKey: true,
  shiftKey: true,
  keyCode: true,
}).set(WheelEvent, {
  type: true,
  deltaX: true,
  deltaY: true,
}).set(TouchEvent, {
  type: true,
  touches: [{
    pageX: true,
    pageY: true,
  }],
});
remoteCanvasHost.resizeObservable.subscribe(({ contentRect: { width, height } }) =>
  workerService.trigger('handleResize', width * devicePixelRatio, height * devicePixelRatio),
);

remoteCanvasHost.interceptEvent = function(e: Event) {
  console.log(e.type);
  switch (e.type) {
    case 'pointerdown': case 'pointerup':
    case 'touchstart': case 'touchend':
      break;
    default:
      interceptEvent(e);
  }
};

export async function loadModel(file: Blob | ArrayBuffer) {
  if (file instanceof Blob)
    file = await blob2ArrayBuffer(file);
  return workerService.callAndTransfer('loadModel', [file], [file]);
}

export async function loadAnimation(file: Blob | ArrayBuffer, type: string) {
  if (file instanceof Blob)
    file = await blob2ArrayBuffer(file);
  return workerService.callAndTransfer('loadAnimation', [file, type], [file]);
}

export function toggleLights() {
  return void workerService.trigger('toggleLights');
}

export function toggleAutoRotate() {
  return void workerService.trigger('toggleRotate');
}

export function toggleBloom() {
  return void workerService.trigger('toggleBloom');
}

export function toggleTick() {
  return void workerService.trigger('toggleTick');
}

export function toggleTickSky() {
  return void workerService.trigger('toggleTickSky');
}
export function toggleTickSkySword() {
  return void workerService.trigger('toggleTickSkySword');
}
export function toggleTickTen() {
  return void workerService.trigger('toggleTickTen');
}
export function toggleFloorGrid() {
  return void workerService.trigger('toggleFloorGrid');
}
export function toggleFloorY() {
  return void workerService.trigger('toggleFloorY');
}
export function toggleTel(int: number) {
  return void workerService.trigger('toggleTel', [int]);
}

observeVisibilty.subscribe(
  state => workerService.trigger('enable', state === 'visible'),
);

(async () => {
  if (await isVRSupported)
    document.querySelector('.menu.controls')?.appendChild(
      h('a.item', {
        onclick: () => workerService.trigger('enableXR'),
        'data-tooltip': 'VR Mode',
      }, h('i.cube.icon')),
    );
})();

workerService.on({ warn: alert.bind(window) });
