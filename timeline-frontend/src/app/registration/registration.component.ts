import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { SimpleValidations } from '../shared/validators/simple.validations';
import { markFormTouched } from '../shared/util/utilities';
import {Router} from '@angular/router';
import {UserService} from '../shared/services/user.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  title = 'Registration Form';

  public formContact: FormGroup;

  constructor(
    private userService: UserService,
    private http: HttpClient,
    private router: Router,
    private readonly formBuilder: FormBuilder
  ) {
    this.createForm();
  }

  goToComponentB(event): void {
    this.router.navigate(['/timeline']);
  }

  createForm() {
    const formFields = {
      username: ['', [Validators.required/*, SimpleValidations.valdiateUsername*/]],
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('')
    };

    this.formContact = this.formBuilder.group(formFields);
    this.formContact.controls["password"].setValidators([Validators.required]);
    this.formContact.controls["confirmPassword"].setValidators([SimpleValidations.confirmPassword]);

    this.formContact.controls['password']
      .valueChanges
      .subscribe((value) => {
        this.formContact.controls['confirmPassword'].updateValueAndValidity();
      });

    /*this.formContact.setValue({
      'username': 'dannnyvanLaar',
      'password': 'abbbc',
      'confirmPassword': 'abbbc',
    });*/

  }

  onSubmit() {
    markFormTouched(this.formContact);

    if (this.formContact.valid) {
      console.log(this.formContact.value);
      /*this.userService.addUser({
        id: this.formContact.value.username,
        password: this.formContact.value.password
      });*/

      this.createNewUser().subscribe(
        (response) => {
          console.log('user created!');
          this.router.navigate(['/login'])
        },
        (error) => {
          console.log('failed to create user!', error);
        });
    } else {
      console.log('Please correct the form before you submit it');
    }
  }

  createNewUser() {
    const url = 'http://localhost:4201/api/v1';
    const payload = {
      name: this.formContact.value.username,
      password: this.formContact.value.password
    };
    return this.http.post<any>(`${url}/users`, payload);
  }
}
