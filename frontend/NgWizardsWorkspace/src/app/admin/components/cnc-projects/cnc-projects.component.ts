import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatCard } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { TruncatePipe } from '../../services/truncate.pipe';
import { AdminService } from '../../services/admin.service';
import { InsertDataComponent } from '../insert-data/insert-data.component';
import { NotificationService } from '../../services/notification.service';

interface Project {
  id: number | null;
  tag: string;
  projectname: string;
  description: string;
  vis: boolean;
  users: { id: number, first_name: string, last_name: string }[] | number[];
}

@Component({
  selector: 'app-cnc-projects',
  standalone: true,
  imports: [MatSortModule, MatTableModule, MatInputModule, MatCheckboxModule, MatSelectModule, 
    MatCard, MatButtonModule, ReactiveFormsModule, FormsModule, CommonModule, TruncatePipe, 
    InsertDataComponent],
  templateUrl: './cnc-projects.component.html',
  styleUrl: './cnc-projects.component.css'
})
export class CncProjectsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'vis', 'tag', 'projectname', 'description', 'users', 'actions'];

  projects: MatTableDataSource<Project> = new MatTableDataSource();
  currentProject = this.getEmptyProject();
  editing = false;

  users: any[] = [];

  @ViewChild(MatSort) sort: MatSort = new MatSort();

  constructor (private adminService: AdminService, private notify: NotificationService) {}

  ngOnInit(): void {
    this.loadProjects();
    this.adminService.getUsers().subscribe(data => {
      this.users = data;
    });
  }

  loadProjects(): void {
    this.adminService.getProjectsList().subscribe((data: Project[]) => {
      this.projects.data = data;
      this.projects.sort = this.sort;
    });
  }

  updateProject(): void {
    this.adminService.updateProject(this.currentProject.id!, this.currentProject).subscribe({
      next: () => {
        this.notify.showSuccess('Project updated successfully.');
        this.loadProjects();
        this.clearForm();
      },
      error: (error) => {
        this.notify.showError('Failed to update project: ' + (error.error.message || 'Unknown error'));
      }
    });
  }

  editProject(project: any): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.currentProject = { ...project, users: project.users.map((user: any) => user.id) };
    this.editing = true;
  }

  toggleVisibility(project: any): void {
    let projectToChange = this.getEmptyProject();
    projectToChange = {...project, users: project.users.map((user: any) => user.id), vis: project.vis = !project.vis}

    this.adminService.updateProject(projectToChange.id!, projectToChange).subscribe({
      next: () => {
        if (this.currentProject.id === projectToChange.id) {
          this.currentProject.vis = !this.currentProject.vis;
        }
        this.notify.showSuccess('Project visibility toggled.');
        this.loadProjects();
      },
      error: (error) => {
        this.notify.showError('Failed to toggle project visibility: ' + (error.error.message || 'Unknown error'));
      }
    });
  }

  clearForm(): void {
    this.currentProject = this.getEmptyProject();
    this.editing = false;
  }

  addProject(): void {
    this.adminService.addProject(this.currentProject).subscribe({
      next: () => {
        this.notify.showSuccess('Project updated successfully.');
        this.loadProjects();
        this.clearForm();
      },
      error: (error) => {
        this.notify.showError('Failed to update project: ' + (error.error.message || 'Unknown error'));
      }
    });
  }

  deleteProject(id: number): void {
    if (this.currentProject.id === id) {
      this.clearForm();
    }
    this.adminService.deleteProject(id).subscribe({
      next: () => {
        this.notify.showSuccess('Project deleted successfully.');
        this.loadProjects();
      },
      error: (error) => {
        this.notify.showError('Failed to delete project: ' + (error.error.message || 'Unknown error'));
      }
    });
  }

  private getEmptyProject(): Project {
    return { id: null, tag: '', projectname: '', description: '', vis: false, users: []};
  }

  formatUserNames(users: any[]): string {
    return users.map(user => `${user.first_name} ${user.last_name}`).join(', ');
  }

  compareWithFn(userId1: number, userId2: number): boolean {
    return userId2 ? userId1 === userId2 : false;
  }

  handleTextInsert(newText: string) {
    this.currentProject.description = newText;
  }
  
}
