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

  registeredEmails: any;
  userForm: FormGroup;
  newUser = false; // to toggle login or signup form 
  passReset = false; // set to true when password reset is triggered
  formErrors: FormErrors = { //errors when form requirements arent met
    'email': '',
    'password': '',
    'company': '',
    'companyKey': '',
  };
  validationMessages = {
    'email': {
      'required': 'Email is required.',
      'email': 'Email must be a valid email',
      'invalid': 'Email already in use'
    },
    'password': {
      'required': 'Password is required.',
      'pattern': 'Password must be include at one letter and one number.',
      'minlength': 'Password must be at least 6 characters long, including one digit.',
      'maxlength': 'Password cannot be more than 40 characters long.',
    },
  };

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private db: DatabaseService) { }

  ngOnInit() {
    this.buildForm(); //set up the form
    this.registeredEmails = this.db.registeredEmails; 
  }

  toggleForm() {
    this.newUser = !this.newUser;
  }

  signupCompany() {
    let _this = this;
    this.db.getRegisteredEmails().then(function(){ //get a list of registeres emails from db
      if(_this.registeredEmails.includes(_this.userForm.value['email'])){ //if email already exists, abord sign up, give user error
        _this.formErrors.email = "Email already in use";
        _this.userForm.controls['email'].setErrors({'invalid': true});
        } else { //if email doesn't exist, continue with sign up process
          _this.auth.newCompanySignUp(_this.userForm.value['email'], _this.userForm.value['password'], _this.userForm.value['company']).then(function() {
          _this.db.registerNewCompany(_this.userForm.value['email'], _this.userForm.value['company']);
          this.registeredEmails =[]; //empty the registered emails arrays 
          this.db.registeredEmails = [];
        })
        }
  });

  }

  buildForm() { //set the form requirements
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