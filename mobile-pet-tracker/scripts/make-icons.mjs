import Jimp from 'jimp-compact';

const images = 'assets/images';
const icon = await Jimp.read(`${images}/pet-tracker-app-icon.png`);

await icon.clone().resize(1024, 1024, Jimp.RESIZE_BICUBIC)
  .writeAsync(`${images}/icon.png`);
