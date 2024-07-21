// eslint-disable-next-line @typescript-eslint/no-var-requires
const sharp = require('sharp');

export async function compessImg(
  inputPath: string,
  width: number = 300,
  quality?: number,
  type?: string
) {
  if (type == 'png') {
    await sharp(inputPath)
      .resize({
        fit: sharp.fit.contain,
        width: width
      })
      .png({ compressionLevel: 9 })
      .toFile(inputPath.split('.')[0] + '-cp.png');
    return inputPath.split('.')[0] + '-cp.png';
  } else {
    await sharp(inputPath)
      .resize({
        fit: sharp.fit.contain,
        width: width
      })
      .jpeg()
      .toFile(inputPath.split('.')[0] + '-cp.jpg');
    return inputPath.split('.')[0] + '-cp.jpg';
  }
}
