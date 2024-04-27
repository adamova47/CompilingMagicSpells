import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CncHomeComponent } from './cnc-home.component';

describe('CncHomeComponent', () => {
  let component: CncHomeComponent;
  let fixture: ComponentFixture<CncHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CncHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CncHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
