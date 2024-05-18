import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, filter } from 'rxjs';
import { AceEditorComponent, AceEditorModule } from 'ngx-ace-editor-wrapper';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCard } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';

import { AdminService } from '../../services/admin.service';
import { FormsModule } from '@angular/forms';

import { InsertDataComponent } from '../insert-data/insert-data.component';

interface Data {
  text: string;
  leftpanel: boolean;
}

@Component({
  selector: 'app-my-home',
  standalone: true,
  imports: [MatCheckboxModule, MatInputModule, MatToolbarModule, MatButtonModule, MatCard, FormsModule, RouterModule, CommonModule, AceEditorModule, InsertDataComponent],
  templateUrl: './my-home.component.html',
  styleUrl: './my-home.component.css'
})
export class MyHomeComponent implements OnInit, OnDestroy {
  private username = localStorage.getItem('username');
  
  navbarHyperlinks: any[] = [];

  private routeSubscription!: Subscription;
  private part: string = '';

  data = {text: '', leftpanel: false};
  public options: any = {
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
    fontSize: "10pt",
    showLineNumbers: true,
    tabSize: 2,
  };

  constructor(
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ){}

  ngOnInit(): void {
    this.adminService.getMyHomeHyperlinks(this.username!).subscribe(data => {
      this.navbarHyperlinks = data.data;
    }, error => {
      console.error('Error fetching navbar hyperlinks', error);
    });

    this.routeSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.getData();
    });

    this.getData();
  }

  getData(): void {
    let childRoute = this.activatedRoute.firstChild?.firstChild;
    if (childRoute){
      this.routeSubscription?.unsubscribe();
      this.routeSubscription = childRoute.paramMap.subscribe(paraMap => {
        this.part = paraMap.get('part') || 'home';
        this.adminService.getMyHomeData(this.username!, this.part).subscribe(data => {
          this.data.text = data.data.text;
          this.data.leftpanel = data.data.has_left;
        });
      });
    } else {
      this.part = 'home';
      this.adminService.getMyHomeData(this.username!, this.part).subscribe(data => {
        this.data.text = data.data.text;
        this.data.leftpanel = data.data.has_left;
      });
    }
  }

  updateMyHomeData(): void {
    this.adminService.updateMyHomeData(this.username!, this.part, this.data).subscribe(response => {
      console.log('Data updated successfully', response);
    }, error => {
      console.error('Error updating data', error);
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }
}
