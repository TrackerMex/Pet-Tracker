import fs from 'node:fs';

import Jimp from 'jimp-compact';

const images = 'assets/images';
const icon = await Jimp.read(`${images}/pet-tracker-app-icon.png`);

await icon.clone().resize(1024, 1024, Jimp.RESIZE_BICUBIC)
  .writeAsync(`${images}/icon.png`);

await icon.clone().resize(48, 48, Jimp.RESIZE_BICUBIC)
  .writeAsync(`${images}/favicon.png`);

await new Jimp(1024, 1024, 0x00000000)
  .composite(icon.clone().resize(676, 676, Jimp.RESIZE_BICUBIC), 174, 174)
  .writeAsync(`${images}/android-icon-foreground.png`);

fs.copyFileSync(`${images}/android-icon-foreground.png`, `${images}/splash-icon.png`);

const silhouette = await Jimp.read(`${images}/pet-tracker-notification-monochrome-original.png`);
silhouette.scan(0, 0, silhouette.bitmap.width, silhouette.bitmap.height, (_x, _y, k) => {
  const data = silhouette.bitmap.data;
  data[k] = data[k + 1] = data[k + 2] = 255;
  data[k + 3] = data[k + 3] >= 128 ? 255 : 0;
});

await new Jimp(1024, 1024, 0x00000000)
  .composite(silhouette.clone().resize(676, 676, Jimp.RESIZE_BICUBIC), 174, 174)
  .writeAsync(`${images}/android-icon-monochrome.png`);
