import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CncProjectsComponent } from './cnc-projects.component';

describe('CncProjectsComponent', () => {
  let component: CncProjectsComponent;
  let fixture: ComponentFixture<CncProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CncProjectsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CncProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
