import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormControl, Validators, ReactiveFormsModule, FormArray, FormsModule, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatCard } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { AdminService } from '../../services/admin.service';
import { ExportBibtexComponent } from '../export-bibtex/export-bibtex.component';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { TruncatePipe } from '../../services/truncate.pipe';

export function bibtexValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    
    // regular expression for when there is exactly two newlines between bibtexs
    const regex = /}\r?\n\r?\n@/g;
    // count bibtexs and separators that match the pattern
    const entries = value.split('@').length - 1;
    const separators = (value.match(regex) || []).length;
    const isValid = entries === separators + 1;  // there should be one more entry than separators

    return isValid ? null : { bibtexFormat: 'Each BibTeX entry must be separated by exactly two newlines from the next.' };
  };
}

@Component({
  selector: 'app-publications',
  standalone: true,
  imports: [MatPaginator, MatSortModule, MatTableModule, MatInputModule, MatCheckboxModule, MatSelectModule, 
    MatCard, MatButtonModule, ReactiveFormsModule, FormsModule, CommonModule, ExportBibtexComponent, TruncatePipe],
  templateUrl: './publications.component.html',
  styleUrl: './publications.component.css'
})
export class PublicationsComponent implements OnInit {
  // publications: any[] = [];
  displayedColumns: string[] = ['id', 'ptype', 'name', 'author', 'year', 'title', 'url', 'actions'];
  publications: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatSort, {static: true}) sort = new MatSort();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  editing = false;
  latexMode = false;

  page = 1;
  pageSize = 9;
  pageSizeOptions: number[] = [9, 12, 15, 18, 21, 24, 27, 30];
  
  currentSortField: string = '';
  currentSortOrder: string = '';

  bibtexForm!: FormGroup;
  publicationForm!: FormGroup;
  projectControl = new FormControl();
  userControl = new FormControl();

  types = [
    { value: 'book', viewValue: 'Book' },
    { value: 'article', viewValue: 'Article' },
    { value: 'conference', viewValue: 'Conference' },
    { value: 'inbook', viewValue: 'In Book' },
    { value: 'incollection', viewValue: 'In Collection' },
    { value: 'inproceedings', viewValue: 'In Proceedings' },
    { value: 'techreport', viewValue: 'Tech Report' },
    { value: 'mastersthesis', viewValue: 'Masters Thesis' },
    { value: 'misc', viewValue: 'Misc' },
    { value: 'phdthesis', viewValue: 'PhD Thesis' },
    { value: 'unpublished', viewValue: 'Unpublished' }
  ];
  allUsers: any[] = [];
  allProjects: any[] = [];
  
  constructor (private adminService: AdminService, private fb: FormBuilder) {
    this.initBibtexForm();
    this.initPublicationForm();
  }

  initBibtexForm() {
    this.bibtexForm = this.fb.group({
      bibtexContent: ['', [Validators.required, Validators.required, bibtexValidator()]]
    });
  }

  initPublicationForm() {
    this.publicationForm = this.fb.group({
      id: [null],
      vis: [false],
      ptype: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.maxLength(300)]],
      address: [''],
      author: ['', [Validators.required]],
      booktitle: [''],
      edition: [''],
      editor: [''],
      institution: [''],
      journal: [''],
      month: ['', [Validators.maxLength(50)]],
      note: [''],
      number: ['', [Validators.maxLength(30)]],
      organization: [''],
      pages: ['', [Validators.maxLength(50)]],
      publisher: [''],
      school: [''],
      series: [''],
      title: ['', [Validators.required]],
      volume: [''],
      year: ['', [Validators.required, Validators.maxLength(5)]],
      url: [''],
      users: this.fb.array([]),
      projects: this.fb.array([])
    });

    // initializes the contron for selects
    this.projectControl = new FormControl([]);
    this.userControl = new FormControl([]);

    // subscribes to changes and updates the form arrays
    this.projectControl.valueChanges.subscribe(values => this.updateFormArray(this.publicationForm.get('projects') as FormArray, values));
    this.userControl.valueChanges.subscribe(values => this.updateFormArray(this.publicationForm.get('users') as FormArray, values));
  }

  updateFormArray(formArray: FormArray, ids: any[]) {
    formArray.clear();
    ids.forEach(id => formArray.push(new FormControl(id)));
  }

  ngOnInit(): void {
    this.adminService.getUsers().subscribe(
      data => {
        this.allUsers = data;
      }, error => {
        console.error('Error fetching users!', error);
      }
    );
    
    this.adminService.getProjects().subscribe(
      data => {
        this.allProjects = data;
      }, error => {
        console.error('Error fetching projects!', error);
      }
    );

    this.loadPublications();
    this.setupConditionalValidators();
  }

  loadPublications(): void {
    this.adminService.getPublicationsList().subscribe(
      data => {
        this.publications.data = data;
        this.publications.sort = this.sort;
        this.publications.paginator = this.paginator;
      },
      error => {
        console.error('Error loading publications!', error);
      }
    );
  }

  editPublication(publication: any): void {
    if (!this.latexMode) {
      this.publicationForm.patchValue({
        id: publication.id,
        vis: publication.vis,
        ptype: publication.ptype,
        name: publication.name,
        address: publication.address,
        author: publication.author,
        booktitle: publication.booktitle,
        edition: publication.edition,
        editor: publication.editor,
        institution: publication.institution,
        journal: publication.journal,
        month: publication.month,
        note: publication.note,
        number: publication.number,
        organization: publication.organization,
        pages: publication.pages,
        publisher: publication.publisher,
        school: publication.school,
        series: publication.series,
        title: publication.title,
        volume: publication.volume,
        year: publication.year,
        url: publication.url
      });
    
      // extracting only the IDs for users and projects
      const userIDs = publication.users ? publication.users.map((user: { id: any, username: any }) => user.id) : [];
      const projectIDs = publication.projects ? publication.projects.map((project: { id: any, tag: any }) => project.id) : [];
  
      this.updateFormArray(this.publicationForm.get('users') as FormArray, userIDs);
      this.updateFormArray(this.publicationForm.get('projects') as FormArray, projectIDs);
  
      this.projectControl.setValue(projectIDs);
      this.userControl.setValue(userIDs);
  
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.editing = true;
    } else {
      const currentValue = this.bibtexForm.get('bibtexContent')?.value || '';

      this.adminService.getBibTex(publication.id).subscribe(
        data => {
          const text = data.bibtex;
          const newValue = currentValue ? `${currentValue}\n\n${text}` : text;
          this.bibtexForm.patchValue({
            bibtexContent: newValue
          });
        },
        error => {
          console.error('Error loading publications!', error);
        }
      );
    }
  }

  addPublication(): void {
    this.adminService.addPublication(this.publicationForm.value).subscribe({
      next: (response) => {
        console.log('Publication added successfully!', response);
        this.loadPublications();
        this.clearForm();
      }, error: (error) => {
        console.error('Error adding publication:', error);
      }
    });
  }

  updatePublication(): void {
    this.adminService.updatePublication(this.publicationForm.get('id')!.value, this.publicationForm.value).subscribe({
      next: (response) => {
        console.log('Publication updated successfully!', response);
        this.loadPublications();
        this.clearForm();
      }, error: (error) => {
        console.error('Error updating publication:', error);
      }
    });
  }

  toggleVisibility(publication: any): void {
    const publicationToChange = {
      ...publication,
      users: publication.users.map((user: any) => user.id),
      projects: publication.projects.map((project: any) => project.id),
      vis: !publication.vis
    };
  
    this.adminService.updatePublication(publicationToChange.id, publicationToChange).subscribe({
      next: (response) => {
        console.log('Publication updated successfully!', response);
        this.loadPublications();
      },
      error: (error) => console.error('Error updating publication:', error)
    });
  }

  clearForm(): void {
    this.initPublicationForm();
    this.editing = false;
  }

  deletePublication(id: number): void {
    this.adminService.deletePublication(id).subscribe(() => {
      this.loadPublications();
    });
  }

  setupConditionalValidators(): void {
    const ptypeControl = this.publicationForm.get('ptype');
    ptypeControl?.valueChanges.subscribe(ptype => {
      const controls = {
        journal: this.publicationForm.get('journal'),
        editor: this.publicationForm.get('editor'),
        publisher: this.publicationForm.get('publisher'),
        booktitle: this.publicationForm.get('booktitle'),
        school: this.publicationForm.get('school'),
        institution: this.publicationForm.get('institution')
      };

      Object.values(controls).forEach(control => control?.setValidators(null));

      switch(ptype) {
        case 'article':
          controls.journal?.setValidators([Validators.required]);
          break;
        case 'book':
        case 'inbook':
          controls.editor?.setValidators([Validators.required]);
          controls.publisher?.setValidators([Validators.required]);
          break;
        case 'conference':
        case 'incollection':
        case 'inproceedings':
          controls.booktitle?.setValidators([Validators.required]);
          break;
        case 'mastersthesis':
        case 'phdthesis':
          controls.school?.setValidators([Validators.required]);
          break;
        case 'techreport':
          controls.institution?.setValidators([Validators.required]);
          break;
      }

      Object.values(controls).forEach(control => control?.updateValueAndValidity());
    });
  }

  formatUserNames(users: any[]): string {
    return users.map(user => `${user.username}`).join(', ');
  }

  formatProjectTags(projects: any[]): string {
    return projects.map(project => `${project.tag}`).join(', ');
  }

  // pagination
  changePage(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
  }

  // bibtex textarea
  onDragOver(event: Event) {
    event.preventDefault();
  }

  onDragLeave(event: Event) {
    event.preventDefault();
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.readFile(file);
    }
  }
  
  private readFile(file: File) {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.bibtexForm.patchValue({ bibtexContent: fileReader.result });
      this.bibtexForm.get('bibtexContent')?.markAsDirty();
    };
    fileReader.readAsText(file);
  }

  importBibtex() {
    if (this.bibtexForm.valid) {
      this.adminService.sendBibtexData(this.bibtexForm.value.bibtexContent).subscribe({
        next: (response) => {
          this.loadPublications();
        },
        error: (error) => {
          this.bibtexForm.get('bibtexContent')?.setErrors({ 'backend': error.message });
        }
      });
    }
  }

  changeMode(): void {
    this.latexMode = !this.latexMode;
  }
}
