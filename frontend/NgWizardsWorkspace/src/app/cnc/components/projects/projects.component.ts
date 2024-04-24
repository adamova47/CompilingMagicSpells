import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CncService } from '../../services/cnc.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
  projects: any[] = [];

  constructor(
    private cncService: CncService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.cncService.getContentsByName('research').subscribe(data => {
      this.projects = data.projects;
      // initialize each project with a property to control visibility of publications
      this.projects.forEach(project => {
        // incorporates the sanitization process for HTML content to ensure everything received from backend is safe
        project.formatted_publications = project.formatted_publications.map((publication: any) =>
          this.sanitizer.bypassSecurityTrustHtml(publication)
        )
        project.showAllPublications = false; // start with only 3 shown
      });
    });
  }

  togglePublications(project: any) {
    project.showAllPublications = !project.showAllPublications;
  }
}
