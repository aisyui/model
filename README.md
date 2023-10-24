## support three-vrm v0.6

When using three-vrm `v1.0` or higher, the model does not display well.

- npm : v16

- vrm : v0.6

```sh
$ git clone https://github.com/aisyui/model
$ cd model
$ git checkout deploy
$ nvm use 16
$ yarn install
$ yarn dev
```

### fix t-pose

Fixed setting to lower hands from T-pose. This affects the pose when loading the model.

> src/worker/vrm-idle-helper.ts

```js
function updateIdlePose(model: VRM, deltaTime: number) {
  if (!model.humanoid) return;
  const totalTime = (totalTimes.get(model) || 0) + deltaTime;
  totalTimes.set(model, totalTime);
  for (const [bone, rotation] of idlePose) {
    const node = model.humanoid.getBoneNode(bone);
    let finalRotation = rotation;
    const breathRotation = breathPose.get(bone);
    if (breathRotation)
      finalRotation = rotation2
      .copy(rotation)
      .slerp(breathRotation, MathUtils.pingpong(totalTime, BREATH_CYCLE));
    if (node) node.setRotationFromQuaternion(
      rotation3
      .setFromRotationMatrix(node.matrix)
      //.slerp(finalRotation, Math.min(deltaTime * LERP_SCALE, 1)),
    );
  }
}
```

### remove blink

`updateEyeBlink` : If the position of the face changes, the entire face will be out of alignment.

```js
// model.blendShapeProxy.setValue('blink', 1);
```
