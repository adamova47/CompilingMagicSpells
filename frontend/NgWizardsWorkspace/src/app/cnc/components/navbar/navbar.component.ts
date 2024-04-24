import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CncService } from '../../services/cnc.service'; 

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
  navbarHyperlinksNames: any[] = [];

  constructor(private cncService: CncService) {}

  ngOnInit(): void {
    this.cncService.getHyperlinkNames().subscribe(data => {
      this.navbarHyperlinksNames = data;
    });
  }
}
