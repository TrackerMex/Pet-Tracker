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
