import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import {DatabaseService} from '../../shared/database/database.service';
import { AuthService } from '../../core/auth.service';

type UserFields = 'email' | 'password' | 'company';
type FormErrors = { [u in UserFields]: string };

@Component({
  selector: 'register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
})
export class RegisterPageComponent implements OnInit {

  userForm: FormGroup;
  newUser = false; // to toggle login or signup form 
  passReset = false; // set to true when password reset is triggered
  formErrors: FormErrors = {
    'email': '',
    'password': '',
    'company': '',
  };
  validationMessages = {
    'email': {
      'required': 'Email is required.',
      'email': 'Email must be a valid email',
    },
    'password': {
      'required': 'Password is required.',
      'pattern': 'Password must be include at one letter and one number.',
      'minlength': 'Password must be at least 4 characters long.',
      'maxlength': 'Password cannot be more than 40 characters long.',
    },
  };

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private db: DatabaseService) { }

  ngOnInit() {
    this.buildForm();
  }

  toggleForm() {
    this.newUser = !this.newUser;
  }

  signup() {
    this.auth.emailSignUp(this.userForm.value['email'], this.userForm.value['password'], this.userForm.value['company']);
    this.registerUserWithCompany(this.userForm.value['email'], this.userForm.value['company']);
  }

  // login() {
  //   this.auth.emailLogin(this.userForm.value['email'], this.userForm.value['password'])
  //   .then(() => this.afterSignIn());
  // }

  private afterSignIn() {
    // Do after login stuff here, such router redirects, toast messages, etc.
    console.log('after sign in..');
    this.router.navigate(['/schedule']);
  }

  private registerUserWithCompany(user, companyKey) {
    // Do after login stuff here, such router redirects, toast messages, etc.
    console.log('registering user '+user +' with company ' +companyKey);
    console.log('!!!');
    this.db.registerUserWithCompany(user, companyKey);
  }

  // resetPassword() {
  //   this.auth.resetPassword(this.userForm.value['email'])
  //     .then(() => this.passReset = true);
  // }

  buildForm() {
    this.userForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email,
      ]],
      'password': ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25),
      ]],
      'company': ['', [
        Validators.required,
      ]],
    });

    this.userForm.valueChanges.subscribe((data) => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages
  }

  // Updates validation state on form changes.
  onValueChanged(data?: any) {
    if (!this.userForm) { return; }
    const form = this.userForm;
    for (const field in this.formErrors) {
      if (Object.prototype.hasOwnProperty.call(this.formErrors, field) && (field === 'email' || field === 'password' || field === 'company' )) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          if (control.errors) {
            for (const key in control.errors) {
              if (Object.prototype.hasOwnProperty.call(control.errors, key) ) {
                this.formErrors[field] += `${(messages as {[key: string]: string})[key]} `;
              }
            }
          }
        }
      }
    }
  }
}