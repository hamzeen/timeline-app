import {async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RegistrationComponent } from './registration.component';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';

fdescribe('Registration Component', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let compiled;
  let formBuilder: FormBuilder;
  let de;

  beforeEach(async(() => {
    formBuilder = new FormBuilder();

    TestBed.configureTestingModule({
      declarations: [
        RegistrationComponent
      ],
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    // router = TestBed.get(RouterService);

    compiled = fixture.nativeElement;
    de = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should create the app', (() => {
    expect(component).toBeTruthy();
  }));


  it('test valid username happy scenario', () => {
    expect(component.formContact.valid).toBeFalsy();

    component.formContact.controls['username'].setValue("addda");

    component.formContact.controls['password'].setValue("test123");
    component.formContact.controls['confirmPassword'].setValue("test123");

    expect(component.formContact.valid).toBeTruthy();
  });

  it('test invalid username', () => {
    expect(component.formContact.valid).toBeFalsy();

    component.formContact.controls['username'].setValue("ABCD");

    component.formContact.controls['password'].setValue("test123");
    component.formContact.controls['confirmPassword'].setValue("test123");

    // invalid username
    expect(component.formContact.valid).toBeFalsy();
  });

  it('test password are matched & form state is invalid in such events', () => {
    expect(component.formContact.valid).toBeFalsy();

    component.formContact.controls['username'].setValue("addda");

    component.formContact.controls['password'].setValue("test123");
    component.formContact.controls['confirmPassword'].setValue("ABC@123");

    // passwords dont match!
    expect(component.formContact.valid).toBeFalsy();
  });
});
