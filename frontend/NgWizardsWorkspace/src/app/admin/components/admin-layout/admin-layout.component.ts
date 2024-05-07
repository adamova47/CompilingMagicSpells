<<<<<<< HEAD
import { Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { HeaderComponent } from '../header/header.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { CncHomeComponent } from '../cnc-home/cnc-home.component';
import { CncProjectsComponent } from '../cnc-projects/cnc-projects.component';
import { MyHomeComponent } from '../my-home/my-home.component';
=======
import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { ActivatedRoute } from '@angular/router';
import { MyHomeComponent } from '../my-home/my-home.component';
import { CncHomeComponent } from '../cnc-home/cnc-home.component';
import { CncProjectsComponent } from '../cnc-projects/cnc-projects.component';
>>>>>>> b65a10d6c40067eecc3b2656e60d2f892547e78f
import { PublicationsComponent } from '../publications/publications.component';
import { BibTexCharsComponent } from '../bib-tex-chars/bib-tex-chars.component';
import { CogSciHomeComponent } from '../cog-sci-home/cog-sci-home.component';
import { AiSeminarComponent } from '../ai-seminar/ai-seminar.component';
<<<<<<< HEAD
import { CommonModule } from '@angular/common';
=======
import { Type } from '@angular/core';

interface ComponentMap {
  [key: string]: Type<any>;
}

const components: ComponentMap = {
  'MyHomeComponent': MyHomeComponent,
  'CncHomeComponent': CncHomeComponent,
  'CncProjectsComponent': CncProjectsComponent,
  'PublicationsComponent': PublicationsComponent,
  'BibTexCharsComponent': BibTexCharsComponent,
  'CogSciHomeComponent': CogSciHomeComponent,
  'AiSeminarComponent': AiSeminarComponent
};
>>>>>>> b65a10d6c40067eecc3b2656e60d2f892547e78f

@Component({
  selector: 'app-admin-layout',
  standalone: true,
<<<<<<< HEAD
  imports: [CommonModule, HeaderComponent, NavbarComponent, MyHomeComponent, CncHomeComponent, CncProjectsComponent, PublicationsComponent, BibTexCharsComponent, CogSciHomeComponent, AiSeminarComponent],
=======
  imports: [HeaderComponent, NavbarComponent],
>>>>>>> b65a10d6c40067eecc3b2656e60d2f892547e78f
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements OnInit, OnDestroy{
<<<<<<< HEAD
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
      this.currentView = params['section'] || 'myhome';
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
=======
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) viewContainerRef: ViewContainerRef;

  private componentRef: any;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.firstChild?.data.subscribe(data => {
      this.loadComponent(data['component']);
    });
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  loadComponent(componentName: string) {
    if (!this.viewContainerRef) {
      console.error('ViewContainerRef is not initialized.');
      return;
    }

    const componentClass = components[componentName];

    if (componentClass) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentClass);
      this.viewContainerRef.clear();
      this.componentRef = this.viewContainerRef.createComponent(componentFactory);
    } else {
      console.error('Component not found:', componentName);
    }
>>>>>>> b65a10d6c40067eecc3b2656e60d2f892547e78f
  }

}
