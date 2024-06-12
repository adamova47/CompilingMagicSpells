import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MatInputModule } from '@angular/material/input'
import { MatCard } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { OwlDateTimeModule, OwlNativeDateTimeModule, DateTimeAdapter } from '@danielmoncada/angular-datetime-picker';

import { AdminService } from '../../services/admin.service';
import { TruncatePipe } from '../../services/truncate.pipe';
import { NotificationService } from '../../services/notification.service';

interface Seminar {
  id: number | null;
  date: string;
  time: string;
  lecturer: string;
  lecturerfrom: string;
  url: string;
  title: string;
  abstract: string;
  note: string;
}

@Component({
  selector: 'app-ai-seminar',
  standalone: true,
  imports: [OwlDateTimeModule, OwlNativeDateTimeModule, MatSortModule, MatTableModule, MatInputModule, MatCard, MatButtonModule, ReactiveFormsModule, FormsModule, CommonModule, TruncatePipe],
  templateUrl: './ai-seminar.component.html',
  styleUrl: './ai-seminar.component.css',
  providers: [DatePipe],
})
export class AiSeminarComponent implements OnInit{
  displayedColumns: string[] = ['id', 'datetime', 'lecturer', 'lecturerfrom', 'url', 'title', 'abstract', 'note', 'actions'];
  seminars: MatTableDataSource<Seminar> = new MatTableDataSource();
  currentSeminar = this.getEmptySeminar();
  editing = false;
  
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  constructor(
    private adminService: AdminService, 
    dateTimeAdapter: DateTimeAdapter<any>, 
    private datePipe: DatePipe,
    private notify: NotificationService
  ){
    dateTimeAdapter.setLocale('en-UK')
  }

  ngOnInit(): void {
    this.loadSeminars();
  }

  loadSeminars(): void {
    this.adminService.getAiseminarsList().subscribe(data => {
      this.seminars.data = data;
      this.seminars.sort = this.sort;
      this.seminars.sortingDataAccessor = (item: Seminar, property: string) => {
        switch (property) {
          case 'datetime':
            return this.getCombinedDateTime(item.date, item.time);
          case 'id':
            return item.id ?? 0;
          default:
            return item[property as keyof Seminar] ?? "";
        }
      }
    }, error => console.log(error));
  }

  private getCombinedDateTime(date: string, time: string): number {
    const dateTimeString = time ? `${date}T${time}` : date;
    return new Date(dateTimeString).getTime();
  }

  addSeminar(): void {
    this.formatDateTimeForBackend();
    this.adminService.addAiseminar(this.currentSeminar).subscribe({
      next: () => {
        this.notify.showSuccess('Seminar added successfully.');
        this.loadSeminars();
        this.clearForm();
      },
      error: (error) => {
        this.notify.showError('Failed to add seminar: ' + (error.error.message || 'Unknown error'));
        console.error('Error adding seminar', error);
      }
    });
  }

  updateSeminar(): void {
    this.formatDateTimeForBackend();
    this.adminService.updateAiseminar(this.currentSeminar.id!, this.currentSeminar).subscribe({
      next: () => {
        this.notify.showSuccess('Seminar updated successfully.');
        this.loadSeminars();
        this.clearForm();
      },
      error: (error) => {
        this.notify.showError('Failed to update seminar: ' + (error.error.message || 'Unknown error'));
        console.error('Error updating seminar', error);
      }
    });
  }

  formatDateTimeForBackend(): void {
    this.currentSeminar.date = this.datePipe.transform(this.currentSeminar.date, 'yyyy-MM-dd') || '';
    this.currentSeminar.time = this.datePipe.transform(this.currentSeminar.time, 'HH:mm') || '';
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
    this.currentSeminar = this.getEmptySeminar();
    this.editing = false;
  }

  deleteSeminar(id: number): void {
    if (this.currentSeminar.id === id) {
      this.clearForm();
    }
    this.adminService.deleteAiseminar(id).subscribe({
      next: () => {
        this.notify.showSuccess('Seminar deleted successfully.');
        this.loadSeminars();
      },
      error: (error) => {
        this.notify.showError('Failed to delete seminar: ' + (error.error.message || 'Unknown error'));
        console.error('Error deleting seminar', error);
      }
    });
  }

  private getEmptySeminar(): Seminar {
    return { id: null, date: '', time: '', lecturer: '', lecturerfrom: '', url: '', title: '', abstract: '', note: '' };
  }
}
