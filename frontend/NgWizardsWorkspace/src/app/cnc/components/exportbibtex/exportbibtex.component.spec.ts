import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportbibtexComponent } from './exportbibtex.component';

describe('ExportbibtexComponent', () => {
  let component: ExportbibtexComponent;
  let fixture: ComponentFixture<ExportbibtexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportbibtexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExportbibtexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
