import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CncService } from '../../services/cnc.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit{
  footerContent: SafeHtml = '';

  constructor (
    private cncService: CncService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.cncService.getFooter().subscribe({
      next: (data) => {
        if (data.text) {
          this.footerContent = this.sanitizer.bypassSecurityTrustHtml(data.text)
        }
      },
      error: () => {
        this.footerContent = 'Footer content is not available at the moment.';
      }
    });
  }
}
