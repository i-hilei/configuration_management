import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-basic-input-field',
  templateUrl: './basic-input-field.component.html',
  styleUrls: ['./basic-input-field.component.css']
})
export class BasicInputFieldComponent {
  @Input() form: FormGroup;
  @Input() id: string;
  @Input() placeholder: string;
  @Input() submitted: boolean;
  @Input() validationErrorMessage: string;
  @Input() inputType = 'text';
}
