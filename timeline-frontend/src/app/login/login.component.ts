import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../shared/services/auth.service';
import {UserService} from '../shared/services/user.service';

@Component({
  selector: 'app-login',
  template: `
<form [formGroup]="form">
    <fieldset>
        <legend>Login</legend>
        <div class="form-field">
            <label>Username:</label>
            <input name="email" formControlName="email">
        </div>
        <div class="form-field">
            <label>Password:</label>
            <input name="password" 
                   formControlName="password" 
                   type="password"
                   autocomplete="on">
        </div>
    </fieldset>
    <div class="form-buttons">
        <button class="btn btn-primary" 
                (click)="login()">Login</button>
    </div>
</form>`})
export class LoginComponent {
  form: FormGroup;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {

    this.form = this.fb.group({
      email: ['',Validators.required],
      password: ['',Validators.required]
    });
  }

  login() {
    const {email, password} = this.form.value;
    if (email && password) {
      /*const userExists = this.userService.findUser(val.email, val.password);
      if (userExists) {
        console.log('we got ya, give us a minute!');
        this.authService.setToken('user logged in at: ' + new Date());
        this.router.navigateByUrl('/timeline');
      } else {
        console.log('sorry we could not authenticate you.');
      }*/

      this.authService.login(email, password)
        .subscribe(
          response => {
            this.authService.setUsername(email);
            this.authService.setToken(response.token);
            this.router.navigateByUrl('/timeline');
          },
          error => {
            console.log("Failed to login");
          });
    }
  }
}

