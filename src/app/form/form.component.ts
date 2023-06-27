import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.less'],
})
export class FormComponent {
  public src = '';

  @Output()
  addBlock = new EventEmitter<string>();

  handleSubmit() {
    if (this.src.length > 1) {
      this.addBlock.emit(this.src);

      this.src = '';
    }
  }
}
