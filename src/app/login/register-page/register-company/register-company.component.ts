import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import {DatabaseService} from '../../../shared/database/database.service';
import { AuthService } from '../../../core/auth.service';

import { Router } from '@angular/router';

type UserFields = 'email' | 'password' | 'company' | 'companyKey';
type FormErrors = { [u in UserFields]: string };

@Component({
  selector: 'app-register-company',
  templateUrl: './register-company.component.html',
  styleUrls: ['./register-company.component.css']
})
export class RegisterCompanyComponent implements OnInit {

  userForm: FormGroup;
  newUser = false; // to toggle login or signup form 
  passReset = false; // set to true when password reset is triggered
  formErrors: FormErrors = {
    'email': '',
    'password': '',
    'company': '',
    'companyKey': '',
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

  signupCompany() {
    let _this = this;
    this.auth.newCompanySignUp(this.userForm.value['email'], this.userForm.value['password'], this.userForm.value['company']).then(function() {
    _this.db.registerNewCompany(_this.userForm.value['email'], _this.userForm.value['company']);
  });

    // this.db.registerOwnerWithCompany(this.userForm.value['email']);
  }

  private afterSignIn() {
    // Do after login stuff here, such router redirects, toast messages, etc.
    console.log('after sign in..');
    this.router.navigate(['/schedule']);
  }

  // private registerNewCompany(user, company) {
  //   // Do after login stuff here, such router redirects, toast messages, etc.
  //   console.log('registering user '+user +' with company ' +company);
  //   console.log('!!!');
  //   this.db.registerNewCompany(user, company);
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
      if (Object.prototype.hasOwnProperty.call(this.formErrors, field) && (field === 'email' || field === 'password' || field === 'company')) {
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