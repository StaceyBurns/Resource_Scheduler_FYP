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
  registeredCompanies:any;
  registeredEmails: any;
  userForm: FormGroup;
  newUser = false; // to toggle login or signup form 
  passReset = false; // set to true when password reset is triggered
  formErrors: FormErrors = { //errors when form requirements aren't met
    'email': '',
    'password': '',
    'company': '',
  };
  validationMessages = {
    'email': {
      'required': 'Email is required.',
      'email': 'Email must be a valid email',
      'company': 'Invalid company key',
      'invalid': 'Email already in use'
    },
    'password': {
      'required': 'Password is required.',
      'pattern': 'Password must be include at one letter and one number.',
      'minlength': 'Password must be at least 6 characters long, including one digit.',
      'maxlength': 'Password cannot be more than 40 characters long.',
    },
    'company': {
      'required': 'Company key is required.',
      'invalid': 'Invalid company key',
    },
  };

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private db: DatabaseService) { }

  ngOnInit() {
    this.buildForm(); //set up form
    this.db.getAllCompanies(); //get a list of registered companies from db
    this.registeredCompanies = this.db.registeredCompanies; //set local array to list of companues
    this.registeredEmails = this.db.registeredEmails; //set local array to list of registered emails
  }

  toggleForm() {
    this.newUser = !this.newUser;
  }

  signup() { //let user sign up if email is unique
    let _this = this;
    this.db.getRegisteredEmails().then(function(){ //check for email in emails array, if exists, abort, if doesn't exist, call allowSugnup function
      if(_this.registeredEmails.includes(_this.userForm.value['email'])){
        _this.formErrors.email = "Email already in use";
        _this.userForm.controls['email'].setErrors({'invalid': true});
        } else {
        _this.allowSignup();
        }

      })

  }

  allowSignup(){ //check if company key exists, if it does, sign the user up and reset arrays, if it doesn't abort and tell user
    if(this.registeredCompanies.includes(this.userForm.value['company'])){
      this.auth.emailSignUp(this.userForm.value['email'], this.userForm.value['password'], this.userForm.value['company']);
      this.registerUserWithCompany(this.userForm.value['email'], this.userForm.value['company']);
      this.registeredEmails =[];
      this.db.registeredEmails = [];
      } else {
        this.formErrors.company = "invalid company key";
        this.userForm.controls['company'].setErrors({'invalid': true});
      }

  }

  private registerUserWithCompany(user, companyKey) { // call db function to register the user with the company
    this.db.registerUserWithCompany(user, companyKey);
  }

  buildForm() { //set form requirements
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