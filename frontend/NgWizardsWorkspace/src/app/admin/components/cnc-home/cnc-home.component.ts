import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { AdminService } from '../../services/admin.service';
import { AceEditorModule } from 'ngx-ace-editor-wrapper';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { Subscription, filter } from 'rxjs';

import { InsertDataComponent } from '../insert-data/insert-data.component';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-cnc-home',
  standalone: true,
  imports: [MatSnackBarModule, MatCardModule, MatToolbarModule, MatButtonModule, RouterModule, CommonModule, AceEditorModule, InsertDataComponent],
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

  isError: boolean = false;
  errorMessage: string = '';

  constructor(
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.adminService.getHyperlinks('cnchome').subscribe(data => {
      this.navbarHyperlinks = data;
    });

    this.routeSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.getText();
    });

    this.getText();
  }

  getText(): void {
    this.isError = false;
    let childRoute = this.activatedRoute.firstChild?.firstChild;

    if (childRoute){
      this.routeSubscription?.unsubscribe(); // unsubscribe if any previous subscription exists
      this.routeSubscription = childRoute.paramMap.subscribe(paraMap => {
        this.part = paraMap.get('part') || 'home';
        this.adminService.getCncHomeText(this.part).subscribe(data => {  
          this.text = data.text;
        }, error => {
          this.isError = true;
          this.errorMessage = error.error.message;
        });
      });
    } else {
      this.part = 'home';
      this.adminService.getCncHomeText('home').subscribe(data => {
        this.text = data.text;
      }, error => {
        this.isError = true;
        this.errorMessage = error.error.message;
      });
    }
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  updateContent(): void {
    this.adminService.updateCncHomeText(this.part, this.text).subscribe({
      next: (response) => {
        const successMessage = "Data updated successfully.";
        this.notify.showSuccess(successMessage);
      }, error: (error) => {
        const errorMessage = error.message;
        this.notify.showSuccess(errorMessage);
      }
    });
  }

}
