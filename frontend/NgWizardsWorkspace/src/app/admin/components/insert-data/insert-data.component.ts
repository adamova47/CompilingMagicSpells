import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCard } from '@angular/material/card';

import { AdminService } from '../../services/admin.service';

interface Data {
  usersPublications: {id: number, name: string}[];
  usersProjects: {id: number, tag: string}[];
  allProjects: {id: number, tag: string}[];
  allUsers: {id: number, first_name: string, last_name: string}[];
}

@Component({
  selector: 'app-insert-data',
  standalone: true,
  imports: [MatInputModule, MatSelectModule, MatButtonModule, MatCard, FormsModule, CommonModule],
  templateUrl: './insert-data.component.html',
  styleUrl: './insert-data.component.css'
})
export class InsertDataComponent implements OnInit{
  @Input() target: any;
  @Output() textInserted: EventEmitter<string> = new EventEmitter<string>();
  
  username: string | null = localStorage.getItem('username');
  selectorData: Data = {
    usersPublications: [],
    usersProjects: [],
    allProjects: [],
    allUsers: []
  };

  selectedPublicationId: number | null = null;

  selectedProjectId: number | null = null;

  selectedProjects: number[] = [];
  selectedUsers: number[] = [];
  visibleEntries: number = 2;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.adminService.getUserInsertData(this.username!).subscribe(
      data => {
        this.selectorData = {
          usersPublications: data.users_publications,
          usersProjects: data.users_projects,
          allProjects: data.all_projects,
          allUsers: data.all_users
        };
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );
  }

  linkPublication(): void {
    if (this.selectedPublicationId) {
      const publication = this.selectorData.usersPublications.find(pub => pub.id === this.selectedPublicationId);
      const text = `<a href="?action=publications#pub${publication?.id}">${publication?.name} (id ${publication?.id})</a>`;
      this.insertText(text);
    }
  }

  linkProject(): void {
    if (this.selectedProjectId) {
      const project = this.selectorData.usersProjects.find(proj => proj.id === this.selectedProjectId);
      const text = `<a href="?action=projects#proj${project?.id}">${project?.tag}</a>`;
      this.insertText(text);
    }
  }

  listPublications(): void {
    let formattedPublications: string[] = [];
    this.adminService.getPublicationsByProjectsAndUsers(this.selectedProjects, this.selectedUsers).subscribe(
      data => { 
        formattedPublications = data;
        this.createPublicationsList(formattedPublications);
      },
      error => console.error('Error fetching publications', error)
    );
  }

  createPublicationsList(formattedPublications: any): void {
    const formattedPubsLength = formattedPublications.length;
    let visiblePart = '<ul>\n';
    let collapsiblePart = '   <ul>\n';
    for (let i = 0; i < formattedPubsLength; i++) {
      if (i < this.visibleEntries) {
        visiblePart += `    <li>${formattedPublications[i]}</li>\n`;
      } else {
        collapsiblePart += `      <li>${formattedPublications[i]}</li>\n`;
      }
    }
    visiblePart += '  </ul>';
    collapsiblePart += '    </ul>';
    let text = `<div class="publications">\n  ${visiblePart}`;

    if (formattedPubsLength > this.visibleEntries) {
      text += `\n  <div class="collapse" id="invisproj0" style="display:none;">\n ${collapsiblePart}\n  </div>
  <button onclick="document.getElementById('invisproj0').style.display = document.getElementById('invisproj0').style.display === 'block' ? 'none' : 'block';" class="btn btn-link">
    <i class="bi bi-caret-down-fill"></i>
  </button>`;
    }

    text += `\n</div>`;

    this.insertText(text);
  }

  insertText(text: string) {
    if (this.target.getEditor) {
      const editor = this.target.getEditor();
      const session = editor.getSession();
      const cursorPosition = editor.getCursorPosition();
      session.insert(cursorPosition, text);
      editor.focus();
    } else {
      const start = this.target.selectionStart;
      const end = this.target.selectionEnd;
      const textBefore = this.target.value.substring(0, start);
      const textAfter = this.target.value.substring(end, this.target.value.length);
      this.target.value = textBefore + text + textAfter;
      this.target.focus();
      this.target.setSelectionRange(start + text.length, start + text.length);

      // if we are manipulating a DOM element we should emit an event from the InsertDataComponent 
      // whenever text is inserted, and then handle that event in the parent component to update 
      // the ngModel binding
      this.textInserted.emit(this.target.value);
    }
  }
}
