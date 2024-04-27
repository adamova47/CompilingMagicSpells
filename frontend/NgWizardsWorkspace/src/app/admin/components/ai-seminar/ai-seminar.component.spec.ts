import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiSeminarComponent } from './ai-seminar.component';

describe('AiSeminarComponent', () => {
  let component: AiSeminarComponent;
  let fixture: ComponentFixture<AiSeminarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiSeminarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AiSeminarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
