import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { ContentComponent } from '../content/content.component';

@Component({
  selector: 'app-cnc',
  standalone: true,
  imports: [NavbarComponent, CommonModule, ContentComponent, FooterComponent],
  templateUrl: './cnc.component.html',
  styleUrl: './cnc.component.css'
})
export class CncComponent {
}
