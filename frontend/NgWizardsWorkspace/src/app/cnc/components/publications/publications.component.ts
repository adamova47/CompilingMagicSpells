import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CncService } from '../../services/cnc.service';

@Component({
  selector: 'app-publications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './publications.component.html',
  styleUrl: './publications.component.css'
})
export class PublicationsComponent implements OnInit {
  publications: SafeHtml[] = [];

  constructor(
    private cncService: CncService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.cncService.getContentsByName('publications').subscribe({
      next: (data) => {
        this.publications = data.publications.map((publication: any) =>
          this.sanitizer.bypassSecurityTrustHtml(publication)
        );
      },
      error: (error) => console.error('Failed to fetch publications', error)
    });
  }
}
