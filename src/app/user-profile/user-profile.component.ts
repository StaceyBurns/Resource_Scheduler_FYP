import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  companyName: string;
  constructor(public auth: AuthService) { }

  ngOnInit() {
    this.companyName = localStorage.getItem('companyName'); //get the company name from local storage to display in view
  }

}
