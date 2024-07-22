import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GalleryService {
  private readonly uploadPath = path.join(__dirname, '../../..', 'uploads');

  async getAllImages(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      fs.readdir(this.uploadPath, (err, files) => {
        if (err) {
          return reject(err);
        }
        const images = files.filter((file) => {
          const ext = path.extname(file).toLowerCase();
          return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
        });
        resolve(images);
      });
    });
  }
}
