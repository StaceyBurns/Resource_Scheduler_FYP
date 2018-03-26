import { Component, OnInit, EventEmitter, Output } from '@angular/core';
//import { EventEmitter } from 'selenium-webdriver';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

 
  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
  }

   logout() {
    this.authService.signOut();
    this.router.navigate(['/login']);
  }

}
