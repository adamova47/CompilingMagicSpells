import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { AceEditorModule } from 'ngx-ace-editor-wrapper';

import { AdminService } from '../../services/admin.service';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-cog-sci-home',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, RouterModule, CommonModule, AceEditorModule],
  templateUrl: './cog-sci-home.component.html',
  styleUrl: './cog-sci-home.component.css'
})
export class CogSciHomeComponent implements OnInit, OnDestroy{
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
    this.adminService.getHyperlinks('cogscihome').subscribe(data => {
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
      this.routeSubscription?.unsubscribe();
      this.routeSubscription = childRoute.paramMap.subscribe(paraMap => {
        this.part = paraMap.get('part') || 'intro';
        this.adminService.getCogSciText(this.part).subscribe(data => {  
          this.text = data.data.text;
        });
      });
    } else {
      this.part = 'intro';
      this.adminService.getCogSciText('intro').subscribe(data => {
        this.text = data.data.text;
      });
    }
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  updateContent(): void {
    this.adminService.updateCogSciText(this.part, this.text).subscribe({
      next: (response) => console.log('Update successful:', response),
      error: (error) => console.error('Error updating:', error)
    });
  }
}
