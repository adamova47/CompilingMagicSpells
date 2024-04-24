import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CncService } from '../../services/cnc.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exportbibtex',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exportbibtex.component.html',
  styleUrl: './exportbibtex.component.css'
})
export class ExportbibtexComponent {
  public bibtex: string = '';

  constructor(
    private route: ActivatedRoute,
    private cncService: CncService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const pubId = +params['id'];
      this.cncService.getBibTex(pubId).subscribe({
        next: (data) => {
          this.bibtex = data.bibtex;
          this.changeDetectorRef.detectChanges();  // triggers change detection (find out why its needed here - whats the problem)
        },
        error: (error) => {
          console.error('Error fetching publication:', error);
        }
      });
    });
  }
}
