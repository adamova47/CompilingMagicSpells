import { Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { HeaderComponent } from '../header/header.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { CncHomeComponent } from '../cnc-home/cnc-home.component';
import { CncProjectsComponent } from '../cnc-projects/cnc-projects.component';
import { MyHomeComponent } from '../my-home/my-home.component';
import { PublicationsComponent } from '../publications/publications.component';
import { BibTexCharsComponent } from '../bib-tex-chars/bib-tex-chars.component';
import { CogSciHomeComponent } from '../cog-sci-home/cog-sci-home.component';
import { AiSeminarComponent } from '../ai-seminar/ai-seminar.component';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, HeaderComponent, NavbarComponent, MyHomeComponent, CncHomeComponent, CncProjectsComponent, PublicationsComponent, BibTexCharsComponent, CogSciHomeComponent, AiSeminarComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements OnInit, OnDestroy{
  currentView: string = 'myhome';
  private routeSubscription: Subscription = new Subscription; // subscribtion holder to manage cleanup

  constructor (private activatedRoute: ActivatedRoute) {} // ActivatedRoute is used to access route information

  ngOnInit(): void {
    // this subscribes to the `url` observable of the ActivatedRoute to ensure 
    // that the function updateView is called every time the route changes
    this.routeSubscription = this.activatedRoute.url.subscribe(() => {
      this.updateView();
    });
  }

  updateView(): void {
    this.activatedRoute.firstChild?.params.subscribe(params => {
      this.currentView = params['section'];
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

}
