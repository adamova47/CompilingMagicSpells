import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { MatInputModule } from '@angular/material/input'
import { MatCard, MatCardContent } from '@angular/material/card'
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-bib-tex-chars',
  standalone: true,
  imports: [MatTableModule, MatInputModule, MatCardContent, MatCard, MatButtonModule, FormsModule, CommonModule],
  templateUrl: './bib-tex-chars.component.html',
  styleUrl: './bib-tex-chars.component.css'
})
export class BibTexCharsComponent implements OnInit {
  chars: any[] = [];
  currentChar = { id: null, char: '', bibcode: '{\\\\\\}' };
  editing = false;

  constructor(private adminService: AdminService) {}

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
      this.loadChars();
      this.clearForm();
    });
  }

  updateChar(){
    this.adminService.updateBibtexChar(this.currentChar.id!, this.currentChar).subscribe(() => {
      this.loadChars();
      this.clearForm();
    });
  }

  editEntry(char: any): void {
    this.currentChar = {...char};
    this.editing = true;
  }

  deleteEntry(id: number): void {
    this.adminService.deleteBibtexChar(id).subscribe(() => {
      this.loadChars();
    });
  }

  clearForm(){
    this.currentChar = { id: null, char: '', bibcode: '{\\\\\\}' };
    this.editing = false;
  }

}
