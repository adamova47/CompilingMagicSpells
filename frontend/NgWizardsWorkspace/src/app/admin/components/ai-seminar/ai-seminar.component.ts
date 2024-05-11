import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MatInputModule } from '@angular/material/input'
import { MatCard, MatCardContent } from '@angular/material/card'
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { OwlDateTimeModule, OwlNativeDateTimeModule, DateTimeAdapter } from '@danielmoncada/angular-datetime-picker';

import { AdminService } from '../../services/admin.service';
import { TruncatePipe } from '../../services/truncate.pipe';


@Component({
  selector: 'app-ai-seminar',
  standalone: true,
  imports: [OwlDateTimeModule, OwlNativeDateTimeModule, MatTableModule, MatInputModule, MatCardContent, MatCard, MatButtonModule, FormsModule, CommonModule, TruncatePipe],
  templateUrl: './ai-seminar.component.html',
  styleUrl: './ai-seminar.component.css',
  providers: [DatePipe],
})
export class AiSeminarComponent {
  seminars: any[] = [];
  currentSeminar = { id: null, date: '', time: '', lecturer: '', lecturerfrom: '', url: '', title: '', abstract: '', note: '' };
  editing = false;

  constructor(private adminService: AdminService, dateTimeAdapter: DateTimeAdapter<any>, private datePipe: DatePipe) {
    dateTimeAdapter.setLocale('en-UK')
  }

  ngOnInit(): void {
    this.loadSeminars();
  }

  loadSeminars(): void {
    this.adminService.getAiseminarsList().subscribe(data => {
      this.seminars = data;
    }, error => console.log(error));
  }

  addSeminar(): void {
    this.formatDateForBackend();
    this.formatTimeForBackend();
    this.adminService.addAiseminar(this.currentSeminar).subscribe(() => {
      this.loadSeminars();
      this.clearForm();
    });
  }

  formatDateForBackend(): void {
    this.currentSeminar.date = this.datePipe.transform(this.currentSeminar.date, 'yyyy-MM-dd') || '';
  }

  formatTimeForBackend(): void {
    this.currentSeminar.time = this.datePipe.transform(this.currentSeminar.time, 'HH:mm') || '';
  } 

  updateSeminar(): void {
    this.formatDateForBackend();
    this.formatTimeForBackend();
    this.adminService.updateAiseminar(this.currentSeminar.id!, this.currentSeminar).subscribe(() => {
      this.loadSeminars();
      this.clearForm();
    });
  }

  editSeminar(seminar: any): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.currentSeminar = { ...seminar, time: seminar.time ? this.convertTimeStringToDate(seminar.time) : null };
    this.editing = true;
  }

  convertTimeStringToDate(time: string): Date {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds || 0);
    return date;
  }

  clearForm(): void {
    this.currentSeminar = { id: null, date: '', time: '', lecturer: '', lecturerfrom: '', url: '', title: '', abstract: '', note: '' };
    this.editing = false;
  }

  deleteSeminar(id: number): void {
    this.adminService.deleteAiseminar(id).subscribe(() => {
      this.loadSeminars();
    });
  }
}
