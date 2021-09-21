import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent implements OnInit {
  isCollapsed = false;

  constructor(private router: Router) {}

  ngOnInit() {}

  cerrarSesion() {
    this.router.navigate(['/']);
    localStorage.clear();
  }
}
