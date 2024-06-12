import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { MatInputModule } from '@angular/material/input'
import { MatCard, MatCardContent } from '@angular/material/card'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

import { AdminService } from '../../services/admin.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-bib-tex-chars',
  standalone: true,
  imports: [MatTableModule, MatInputModule, MatCardContent, MatCard, MatButtonModule, 
    ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './bib-tex-chars.component.html',
  styleUrl: './bib-tex-chars.component.css'
})
export class BibTexCharsComponent implements OnInit {
  chars: any[] = [];
  currentChar = { id: null, char: '', bibcode: '{\\\\\\}' };
  editing = false;

  constructor(private adminService: AdminService, private notify: NotificationService) {}

  ngOnInit(): void {
    this.loadChars();
  }

  loadChars(): void {
    this.adminService.getBibtexChars().subscribe(data => {
      this.chars = data;
    });
  }

  addChar() {
    this.adminService.addBibtexChar(this.currentChar).subscribe(() => {
      this.notify.showSuccess('Bibchar added successfully.');
      this.loadChars();
      this.clearForm();
    }, error => {
      this.notify.showError('Failed to add bibchar: ' + (error.error.message || 'Unknown error'));
      console.error('Error adding bibchar', error);
    });
  }

  updateChar(){
    this.adminService.updateBibtexChar(this.currentChar.id!, this.currentChar).subscribe(() => {
      this.notify.showSuccess('Bibchar updated successfully.');
      this.loadChars();
      this.clearForm();
    }, error => {
      this.notify.showError('Failed to update bibchar: ' + (error.error.message || 'Unknown error'));
      console.error('Error updating bibchar', error);
    });
  }

  editEntry(char: any): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.currentChar = {...char};
    this.editing = true;
  }

  deleteEntry(id: number): void {
    this.adminService.deleteBibtexChar(id).subscribe(() => {
      this.notify.showSuccess('Bibchar deleted successfully.');
      this.loadChars();
    }, error => {
      this.notify.showError('Failed to delete bibchar: ' + (error.error.message || 'Unknown error'));
      console.error('Error deleting bibchar', error);
    });
  }

  clearForm(){
    this.currentChar = { id: null, char: '', bibcode: '{\\\\\\}' };
    this.editing = false;
  }

}
