import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SomecontentComponent } from '../somecontent/somecontent.component';
import { PublicationsComponent } from '../publications/publications.component';
import { ProjectsComponent } from '../projects/projects.component';
@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule, SomecontentComponent, PublicationsComponent, ProjectsComponent],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent implements OnInit, OnDestroy {
  // stores the current view, initialized to 'home' as a default
  currentView: string = 'home';

  // subscription to hold the route observable parameters
  // ! tells TypeScript that this property will definitely be initialized before use
  private routeSubscription: Subscription = new Subscription;

  constructor (private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.routeSubscription = this.activatedRoute.url.subscribe(() => {
      this.updateView();
    });
  }

  updateView(): void {
    this.activatedRoute.firstChild?.params.subscribe(params => {
      this.currentView = params['getname'] ? params['getname'] : 'home';
    });
  }

  ngOnDestroy(): void {
    // unsubscribes from the route parameters to prevent memory leaks
    this.routeSubscription.unsubscribe();
  }
}
