import {Component, ElementRef, forwardRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Subject} from "rxjs";
import {ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl} from "@angular/forms";
import {coerceBooleanProperty} from "@angular/cdk/coercion";
import {FocusMonitor} from "@angular/cdk/a11y";
import {MatFormFieldControl} from "@angular/material/form-field";

@Component({
  selector: 'nuclear-input',
  templateUrl: './nuclear-input.component.html',
  styleUrls: ['./nuclear-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NuclearInputComponent),
      multi: true
    },
    {
      provide: MatFormFieldControl,
      useExisting: NuclearInputComponent
    },
  ]
})
export class NuclearInputComponent implements ControlValueAccessor,OnChanges, MatFormFieldControl<any> {
  static nextId = 0;
  stateChanges: Subject<void> = new Subject<void>();
  id: string = `nuclear-input-${NuclearInputComponent.nextId++}`;
  ngControl: NgControl = null;
  focused: boolean = false;
  empty: boolean;
  shouldLabelFloat: boolean;
  disabled: boolean = false;
  errorState: boolean = false;
  controlType?: string = 'text-box';
  autofilled?: boolean;
  describedBy: string = '';

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  private _placeholder: string;

  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _required = false;

  @Input() name: string;

  onChange: any = () => {};
  onTouched: any = () => {};

  isDisabled: boolean = false;

  @Input('value') val: string;
  get value(): any {
    return this.val;
  }
  set value(val: any) {
    this.val = val;
    this.errorState = !val;
    this.onChange(val);
    this.onTouched();
    this.stateChanges.next();
  }

  constructor(private fm: FocusMonitor, private elRef: ElementRef<HTMLElement>) {
    fm.monitor(elRef, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  writeValue(value: any): void {
    if (value) {
      this.value = value;
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }
  onContainerClick(event: MouseEvent): void {
    if ((event.target as Element).tagName.toLowerCase() != 'input') {
      this.elRef.nativeElement.querySelector('input')!.focus();
    }
  }
  @Input() errorText = null;
  @Input() public label: string = '';
  @Input() public hint: string = '';
  @Input() public type: 'text' | 'number' | 'email' | 'password' | 'date' = 'text';
  @Input() public appearance: 'legacy' | 'fill' | 'standard' | 'outline' = 'outline';
  @Input() public textArea: boolean = false;
  @Input() public needCapitalize?: boolean = false
  ngOnChanges(changes: SimpleChanges): void {
    this.errorText = changes['errorText']?.currentValue;
    this.label = changes['label']?.currentValue;
  }

}
