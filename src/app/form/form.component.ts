import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.less'],
})
export class FormComponent {
  public src: string = '';

  @Output()
  onSubmit = new EventEmitter<string>();

  handleSubmit(): void {
    if (this.src.length > 1) {
      this.onSubmit.emit(this.src);

      this.src = '';
    }
  }
}
