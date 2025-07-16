import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation',
  imports: [CommonModule],
  templateUrl: './navigation.html',
  styleUrl: './navigation.css'
})
export class Navigation {
  openMenu: string = '';         // tracks open section
  activePath: string = '';       // tracks clicked submenu

  constructor(private router: Router) {
    this.activePath = this.router.url;
  }

  toggleMenu(section: string) {
    this.openMenu = this.openMenu === section ? '' : section;
  }

  navigateTo(path: string) {
    this.activePath = path;
    this.router.navigate([path]);
  }
}


