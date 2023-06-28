import { DivProps } from './types';
import { ElementRef } from '@angular/core';

export class DragAndDrop {
  blockDiv: ElementRef;
  isMoved = false;
  observer: ResizeObserver;
  divOptions = {} as DivProps;
  mousePosition: { x: number; y: number } = { x: 0, y: 0 };
  isDown = false;
  offset: number[] = [0, 0];
  callback: (obj: DivProps) => void;

  constructor(blockDiv: ElementRef, callback: (obj: DivProps) => void) {
    this.blockDiv = blockDiv;
    this.callback = callback;
  }

  init() {
    this.blockDiv?.nativeElement.addEventListener(
      'mousedown',
      this.startMove.bind(this)
    );
    document.addEventListener('mousemove', this.move.bind(this));
    this.blockDiv?.nativeElement.addEventListener(
      'mouseup',
      this.endMove.bind(this)
    );

    this.observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;

      this.divOptions = {
        ...this.divOptions,
        width,
        height,
        ...this.GetXY(this.blockDiv),
      };

      this.callback({ ...this.divOptions });
    });

    this.observer.observe(this.blockDiv.nativeElement);
  }

  private startMove(event: MouseEvent) {
    const div = this.blockDiv.nativeElement;

    this.isDown = true;

    if (div) {
      this.offset = [
        div.offsetLeft - event.clientX,
        div.offsetTop - event.clientY,
      ];

      const rectX = div?.getBoundingClientRect().left || 0;
      const rectY = div?.getBoundingClientRect().top || 0;

      const width = div?.offsetWidth || 0;
      const height = div?.offsetHeight || 0;

      const x = event.clientX - rectX;
      const y = event.clientY - rectY;

      const step = 15;

      const blockedX = [width - step, width];
      const blockedY = [height - step, height];

      if (
        x > blockedX[0] &&
        x < blockedX[1] &&
        y > blockedY[0] &&
        y < blockedY[1]
      ) {
        if (this.isMoved) {
          this.isMoved = false;
        }
      } else {
        if (!this.isMoved) {
          this.isMoved = true;
        }
      }
    }
  }

  private move(event: MouseEvent) {
    event.preventDefault();

    const div = this.blockDiv.nativeElement;
    const appContainer = document.getElementsByClassName(
      'app-container'
    )[0] as HTMLElement;

    if (this.isDown && div && this.isMoved) {
      this.mousePosition = {
        x: event.clientX,
        y: event.clientY,
      };

      const x = this.mousePosition.x + this.offset[0];
      const y = this.mousePosition.y + this.offset[1];

      const x_screen = appContainer?.offsetWidth;
      const y_screen = appContainer?.offsetHeight;

      const right = x_screen - div.offsetWidth;
      const bottom = y_screen - div.offsetHeight;

      div.style.left =
        x < 0 || x === 0
          ? '0'
          : x > right || x === right
          ? right + 'px'
          : x + 'px';
      div.style.top =
        y < 0 || y === 0
          ? '0'
          : y > bottom || y === bottom
          ? bottom + 'px'
          : y + 'px';
      div.style.zIndex = '2';

      this.divOptions = {
        ...this.divOptions,
        ...this.GetXY(this.blockDiv),
      };

      this.callback({ ...this.divOptions });
    }
  }

  private endMove() {
    this.isDown = false;
  }

  private GetXY(elem: ElementRef): { x: number; y: number } {
    const { top, left } = elem.nativeElement.getBoundingClientRect();

    return { x: left, y: top };
  }

  destroy() {
    this.observer.unobserve(this.blockDiv.nativeElement);

    this.blockDiv?.nativeElement.removeEventListener(
      'mousedown',
      this.startMove.bind(this)
    );
    document.removeEventListener('mousemove', this.move.bind(this));
    this.blockDiv?.nativeElement.removeEventListener(
      'mouseup',
      this.endMove.bind(this)
    );
  }
}

export * as types from './types';
