import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzRadioModule } from 'ng-zorro-antd/radio';

export interface FormField {
  key: string;
  label: string;
  type: 'input' | 'textarea' | 'select' | 'date' | 'checkbox' | 'radio';
  required?: boolean;
  options?: { label: string; value: any }[];
  placeholder?: string;
  validators?: ((control: AbstractControl) => { [key: string]: any } | null)[];
}

@Component({
  selector: 'app-modal-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzDatePickerModule,
    NzCheckboxModule,
    NzRadioModule
  ],
  template: `
    <nz-modal
      [(nzVisible)]="isVisible"
      [nzTitle]="title"
      [nzWidth]="width"
      [nzOkLoading]="loading"
      (nzOnCancel)="handleCancel()"
      (nzOnOk)="handleOk()"
      [nzOkText]="okText"
      [nzCancelText]="cancelText"
    >
      <form nz-form [formGroup]="form" nzLayout="vertical">
        <nz-form-item *ngFor="let field of fields">
          <nz-form-label [nzRequired]="field.required">{{ field.label }}</nz-form-label>
          <nz-form-control [nzErrorTip]="getErrorTip(field.key)">
            <ng-container [ngSwitch]="field.type">
              <input
                *ngSwitchCase="'input'"
                nz-input
                [formControlName]="field.key"
                [placeholder]="field.placeholder"
              />
              <textarea
                *ngSwitchCase="'textarea'"
                nz-input
                [formControlName]="field.key"
                [placeholder]="field.placeholder"
                rows="4"
              ></textarea>
              <nz-select
                *ngSwitchCase="'select'"
                [formControlName]="field.key"
                [nzPlaceHolder]="field.placeholder || ''"
              >
                <nz-option
                  *ngFor="let option of field.options"
                  [nzLabel]="option.label"
                  [nzValue]="option.value"
                ></nz-option>
              </nz-select>
              <nz-date-picker
                *ngSwitchCase="'date'"
                [formControlName]="field.key"
                [nzPlaceHolder]="field.placeholder || ''"
              ></nz-date-picker>
              <nz-checkbox-group
                *ngSwitchCase="'checkbox'"
                [formControlName]="field.key"
              >
                <label nz-checkbox *ngFor="let option of field.options" [nzValue]="option.value">
                  {{ option.label }}
                </label>
              </nz-checkbox-group>
              <nz-radio-group
                *ngSwitchCase="'radio'"
                [formControlName]="field.key"
              >
                <label nz-radio *ngFor="let option of field.options" [nzValue]="option.value">
                  {{ option.label }}
                </label>
              </nz-radio-group>
            </ng-container>
          </nz-form-control>
        </nz-form-item>
      </form>
    </nz-modal>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalFormComponent implements OnInit, OnChanges {
  @Input() isVisible = false;
  @Input() title = 'Form';
  @Input() width = 520;
  @Input() loading = false;
  @Input() fields: FormField[] = [];
  @Input() initialData: any = {};
  @Input() okText = 'OK';
  @Input() cancelText = 'Cancel';

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['fields'] || changes['initialData']) {
      this.buildForm();
    }
  }

  buildForm() {
    const controls: { [key: string]: any } = {};
    this.fields.forEach(field => {
      const validators = field.required ? [Validators.required] : [];
      if (field.validators) {
        validators.push(...field.validators);
      }
      controls[field.key] = [this.initialData[field.key] || '', validators];
    });
    this.form = this.fb.group(controls);
  }

  handleOk() {
    if (this.form.valid) {
      this.submit.emit(this.form.value);
    } else {
      this.markFormGroupTouched();
    }
  }

  handleCancel() {
    this.visibleChange.emit(false);
    this.cancel.emit();
  }

  private markFormGroupTouched() {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
      control?.updateValueAndValidity();
    });
  }

  getErrorTip(key: string): string {
    const control = this.form.get(key);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    // Add more error messages as needed
    return '';
  }
}