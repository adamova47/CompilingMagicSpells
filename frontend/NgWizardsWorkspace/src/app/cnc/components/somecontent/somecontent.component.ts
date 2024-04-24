import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CncService } from '../../services/cnc.service';

@Component({
  selector: 'app-somecontent',
  standalone: true,
  imports: [],
  templateUrl: './somecontent.component.html',
  styleUrl: './somecontent.component.css'
})
export class SomecontentComponent implements OnInit, OnChanges {
  @Input() view!: string;
  htmlContent!: SafeHtml;

  constructor(private cncService: CncService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.loadContent();
  }

  // this method is triggered whenever an input property changes
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['view'] && !changes['view'].firstChange) {
      this.loadContent();
    }
  }

  private loadContent(): void {
    this.cncService.getContentsByName(this.view).subscribe({
      next: (response) => {
        // sanitize the HTML content before binding it to the template
        this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(response.text);
      },
      error: (error) => {
        console.error('Failed to load content', error);
      }
    });
  }
}
