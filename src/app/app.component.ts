import { Component } from '@angular/core';
import * as dragAndDropsTypes from '../mixins/drag_and_drop/types';

type paramsType = {
  src: string;
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = 'app';

  public blocks: dragAndDropsTypes.Target[] = [];
  public params = [] as paramsType[];

  addBlock(src: string) {
    const block: Partial<dragAndDropsTypes.Target> = {
      id: this.blocks.length + 1,
      src,
    };

    if (/\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(src)) {
      block.type = 'img';
    } else if (/\.(mp4|3gp|ogg)$/.test(src)) {
      block.type = 'video';
    } else if (/youtube.com\/embed\/*/.test(src)) {
      block.type = 'iframe';
    } else {
      console.error(`Can't detect tag type from url ${src}`);
    }

    if (block.type) {
      this.blocks.push(block as dragAndDropsTypes.Target);
    }
  }

  changeState(obj: paramsType) {
    const index = this.params.findIndex(val => obj.id === val.id);

    if (index !== -1) {
      this.params[index] = { ...obj };
    } else {
      this.params.push(obj);
    }
  }

  remove(id: number) {
    this.blocks = [...this.blocks].filter(block => block.id !== id);
    this.params = [...this.params].filter(block => block.id !== id);
  }

  click() {
    console.log(this.params);
  }
}
