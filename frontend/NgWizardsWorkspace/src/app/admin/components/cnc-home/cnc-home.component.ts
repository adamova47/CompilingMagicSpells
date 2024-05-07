import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AdminService } from '../../services/admin.service';
import { AceEditorModule } from 'ngx-ace-editor-wrapper';

import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-cnc-home',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, RouterModule, CommonModule, AceEditorModule],
  templateUrl: './cnc-home.component.html',
  styleUrl: './cnc-home.component.css'
})
export class CncHomeComponent implements OnInit, OnDestroy{
  navbarHyperlinks: any[] = [];
  public text: string = '';
  private part: string = '';
  
  public options: any = {
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
    fontSize: "10pt",
    showLineNumbers: true,
    tabSize: 2,
  };

  private routeSubscription!: Subscription;

  constructor(
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.adminService.getHyperlinks('cnchome').subscribe(data => {
      this.navbarHyperlinks = data;
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.getText();
    });

    this.getText();
  }

  getText(): void {
    let childRoute = this.activatedRoute.firstChild?.firstChild;

    if (childRoute){
      this.routeSubscription?.unsubscribe(); // unsubscribe if any previous subscription exists
      this.routeSubscription = childRoute.paramMap.subscribe(paraMap => {
        this.part = paraMap.get('part') || 'home';
        this.adminService.getCncHomeText(this.part).subscribe(data => {  
          this.text = data.data.text;
        });
      });
    } else {
      this.part = 'home';
      this.adminService.getCncHomeText('home').subscribe(data => {
        this.text = data.data.text;
      });
    }
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  updateContent(): void {
    this.adminService.updateCncHomeText(this.part, this.text).subscribe({
      next: (response) => console.log('Update successful:', response),
      error: (error) => console.error('Error updating:', error)
    });
  }

}
