import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatCard } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

import { TruncatePipe } from '../../services/truncate.pipe';
import { AdminService } from '../../services/admin.service';

interface Project {
  id: number | null;
  tag: string;
  projectname: string;
  description: string;
  vis: boolean;
  users: { id: number, username: string }[];
}

@Component({
  selector: 'app-cnc-projects',
  standalone: true,
  imports: [MatSortModule, MatTableModule, MatInputModule, MatCheckboxModule, MatSelectModule, 
    MatCard, MatButtonModule, ReactiveFormsModule, FormsModule, CommonModule, TruncatePipe],
  templateUrl: './cnc-projects.component.html',
  styleUrl: './cnc-projects.component.css'
})
export class CncProjectsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'vis', 'tag', 'projectname', 'description', 'users', 'actions'];
  projects: MatTableDataSource<Project> = new MatTableDataSource();
  currentProject = this.getEmptyProject();
  editing = false;

  constructor (private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.adminService.getProjectsList().subscribe((data: Project[]) => {
      this.projects.data = data;
    });
  }

  updateProject(): void {

  }

  editProject(project: any): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.currentProject = { ...project };
    this.editing = true;
  }

  clearForm(): void {
    this.currentProject = this.getEmptyProject();
    this.editing = false;
  }

  addProject(): void {

  }

  deleteProject(id: number): void {

  }

  private getEmptyProject(): Project {
    return { id: null, tag: '', projectname: '', description: '', vis: false, users: []};
  }
}
