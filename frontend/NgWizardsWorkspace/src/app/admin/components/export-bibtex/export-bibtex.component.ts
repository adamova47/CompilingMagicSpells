import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { AdminService } from '../../services/admin.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-export-bibtex',
  standalone: true,
  imports: [MatFormFieldModule, MatButtonModule, MatSelectModule, CommonModule],
  templateUrl: './export-bibtex.component.html',
  styleUrl: './export-bibtex.component.css'
})
export class ExportBibtexComponent implements OnInit{
  allUsers: any[] = [];
  allProjects: any[] = [];
  selectedUsers: any[] = [];
  selectedProjects: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadProjects();
  }

  loadUsers() {
    this.adminService.getUsers().subscribe(data => {
      this.allUsers = data;
    });
  }

  loadProjects() {
    this.adminService.getProjects().subscribe(data => {
      this.allProjects = data;
    });
  }

  exportBibtex(): void {
    this.adminService.exportBibtex(this.selectedUsers, this.selectedProjects).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'export.bib';
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }
  
}
