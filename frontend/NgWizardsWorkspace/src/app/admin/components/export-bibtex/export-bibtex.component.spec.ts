import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportBibtexComponent } from './export-bibtex.component';

describe('ExportBibtexComponent', () => {
  let component: ExportBibtexComponent;
  let fixture: ComponentFixture<ExportBibtexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportBibtexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExportBibtexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
