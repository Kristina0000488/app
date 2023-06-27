import {
  Component,
  Input,
  ElementRef,
  Output,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  EventEmitter,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import {
  DragAndDrop,
  types as dragAndDropsTypes,
} from '../../mixins/drag_and_drop';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.less'],
})
export class BlockComponent implements AfterViewInit, OnDestroy {
  constructor(public sanitizer: DomSanitizer) {}

  _value = {} as dragAndDropsTypes.Target;
  urlSafe: SafeResourceUrl = '';
  typeLink: 'video' | 'img' | 'iframe';
  target?: DragAndDrop;

  @ViewChild('blockDiv', { static: false, read: ElementRef })
  public blockDiv: ElementRef;

  @Input()
  set value(value: dragAndDropsTypes.Target) {
    console.log(value);
    this._value = value;
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
      this._value.src
    );
    this.typeLink = value.type;
  }

  @Output()
  changeState = new EventEmitter<{ obj: dragAndDropsTypes.BlockProps }>();

  @Output()
  remove = new EventEmitter<number>();

  onDelete() {
    this.remove.emit(this._value.id);
  }

  ngAfterViewInit() {
    this.target = new DragAndDrop(
      this.blockDiv,
      (obj: dragAndDropsTypes.DivProps) =>
        this.changeState.emit({ obj: { ...this._value, ...obj } })
    );

    this.target.init();
  }

  ngOnDestroy() {
    this.target?.destroy();
  }
}
