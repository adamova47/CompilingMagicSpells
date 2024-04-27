import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { ActivatedRoute } from '@angular/router';
import { MyHomeComponent } from '../my-home/my-home.component';
import { CncHomeComponent } from '../cnc-home/cnc-home.component';
import { CncProjectsComponent } from '../cnc-projects/cnc-projects.component';
import { PublicationsComponent } from '../publications/publications.component';
import { BibTexCharsComponent } from '../bib-tex-chars/bib-tex-chars.component';
import { CogSciHomeComponent } from '../cog-sci-home/cog-sci-home.component';
import { AiSeminarComponent } from '../ai-seminar/ai-seminar.component';
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

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [HeaderComponent, NavbarComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements OnInit, OnDestroy{
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
  }

}
