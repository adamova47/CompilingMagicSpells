import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatInputModule } from '@angular/material/input'
import { MatCard, MatCardContent } from '@angular/material/card'
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-ai-seminar',
  standalone: true,
  imports: [MatTableModule, MatInputModule, MatCardContent, MatCard, MatButtonModule, FormsModule, CommonModule],
  templateUrl: './ai-seminar.component.html',
  styleUrl: './ai-seminar.component.css'
})
export class AiSeminarComponent {
  seminars: any[] = [];
  currentSeminar = { id: null, datetime: '', lecturer: '', lecturerfrom: '', url: '', title: '', abstract: '', note: '' };
  editing = false;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadSeminars();
  }

  loadSeminars(): void {
    this.adminService.getAiseminarsList().subscribe(data => {
      this.seminars = data;
    }, error => console.log(error));
  }

  editSeminar(seminar: any): void {
    this.currentSeminar = { ...seminar };
    this.editing = true;
  }

  resetForm(): void {
    this.currentSeminar = { id: null, datetime: '', lecturer: '', lecturerfrom: '', url: '', title: '', abstract: '', note: '' };
    this.editing = false;
  }

  deleteSeminar(id: number): void {
    this.adminService.deleteAiseminar(id).subscribe(() => {
      this.loadSeminars();
    });
  }
}
