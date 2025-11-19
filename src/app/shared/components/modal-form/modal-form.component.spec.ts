import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalFormComponent, FormField } from './modal-form.component';

describe('ModalFormComponent', () => {
  let component: ModalFormComponent;
  let fixture: ComponentFixture<ModalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFormComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form building', () => {
    it('should build form with fields', () => {
      const fields: FormField[] = [
        { key: 'name', label: 'Name', type: 'input', required: true },
        { key: 'email', label: 'Email', type: 'input' }
      ];
      component.fields = fields;
      component.ngOnChanges({ fields: { currentValue: fields, previousValue: [], firstChange: true, isFirstChange: () => true } });

      expect(component.form.contains('name')).toBeTruthy();
      expect(component.form.contains('email')).toBeTruthy();
      expect(component.form.get('name')?.validator).toBeTruthy(); // Required validator
      expect(component.form.get('email')?.validator).toBeFalsy(); // No validator
    });

    it('should set initial data', () => {
      const fields: FormField[] = [
        { key: 'name', label: 'Name', type: 'input' }
      ];
      const initialData = { name: 'John Doe' };
      component.fields = fields;
      component.initialData = initialData;
      component.ngOnChanges({
        fields: { currentValue: fields, previousValue: [], firstChange: true, isFirstChange: () => true },
        initialData: { currentValue: initialData, previousValue: {}, firstChange: true, isFirstChange: () => true }
      });

      expect(component.form.get('name')?.value).toBe('John Doe');
    });
  });

  describe('Form submission', () => {
    beforeEach(() => {
      component.fields = [
        { key: 'name', label: 'Name', type: 'input', required: true }
      ];
      component.ngOnChanges({ fields: { currentValue: component.fields, previousValue: [], firstChange: true, isFirstChange: () => true } });
    });

    it('should emit submit when form is valid', () => {
      spyOn(component.submit, 'emit');
      component.form.get('name')?.setValue('John Doe');
      component.handleOk();
      expect(component.submit.emit).toHaveBeenCalledWith({ name: 'John Doe' });
    });

    it('should not emit submit when form is invalid', () => {
      spyOn(component.submit, 'emit');
      component.handleOk();
      expect(component.submit.emit).not.toHaveBeenCalled();
    });

    it('should mark form group touched when invalid', () => {
      spyOn(component.form.get('name')!, 'markAsTouched');
      component.handleOk();
      expect(component.form.get('name')?.markAsTouched).toHaveBeenCalled();
    });
  });

  describe('Cancel handling', () => {
    it('should emit visibleChange and cancel on handleCancel', () => {
      spyOn(component.visibleChange, 'emit');
      spyOn(component.cancel, 'emit');
      component.handleCancel();
      expect(component.visibleChange.emit).toHaveBeenCalledWith(false);
      expect(component.cancel.emit).toHaveBeenCalled();
    });
  });

  describe('Error handling', () => {
    it('should return error tip for required field', () => {
      component.fields = [
        { key: 'name', label: 'Name', type: 'input', required: true }
      ];
      component.ngOnChanges({ fields: { currentValue: component.fields, previousValue: [], firstChange: true, isFirstChange: () => true } });

      component.form.get('name')?.setErrors({ required: true });
      expect(component.getErrorTip('name')).toBe('This field is required');
    });

    it('should return empty string for no error', () => {
      component.fields = [
        { key: 'name', label: 'Name', type: 'input' }
      ];
      component.ngOnChanges({ fields: { currentValue: component.fields, previousValue: [], firstChange: true, isFirstChange: () => true } });

      expect(component.getErrorTip('name')).toBe('');
    });
  });

  describe('Input properties', () => {
    it('should accept isVisible input', () => {
      component.isVisible = true;
      expect(component.isVisible).toBe(true);
    });

    it('should accept title input', () => {
      component.title = 'Test Form';
      expect(component.title).toBe('Test Form');
    });

    it('should accept width input', () => {
      component.width = 800;
      expect(component.width).toBe(800);
    });

    it('should accept loading input', () => {
      component.loading = true;
      expect(component.loading).toBe(true);
    });

    it('should accept okText and cancelText inputs', () => {
      component.okText = 'Save';
      component.cancelText = 'Close';
      expect(component.okText).toBe('Save');
      expect(component.cancelText).toBe('Close');
    });
  });

  describe('Template rendering', () => {
    it('should render modal with title', () => {
      component.title = 'Test Modal';
      component.fields = [
        { key: 'name', label: 'Name', type: 'input' }
      ];
      component.ngOnChanges({ fields: { currentValue: component.fields, previousValue: [], firstChange: true, isFirstChange: () => true } });
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const modal = compiled.querySelector('nz-modal');
      expect(modal).toBeTruthy();
    });

    it('should render form fields', () => {
      component.fields = [
        { key: 'name', label: 'Name', type: 'input', required: true }
      ];
      component.ngOnChanges({ fields: { currentValue: component.fields, previousValue: [], firstChange: true, isFirstChange: () => true } });
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const formItem = compiled.querySelector('nz-form-item');
      expect(formItem).toBeTruthy();
      const input = compiled.querySelector('input[nz-input]');
      expect(input).toBeTruthy();
    });
  });
});