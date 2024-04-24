import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CncComponent } from './cnc.component';

describe('CncComponent', () => {
  let component: CncComponent;
  let fixture: ComponentFixture<CncComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CncComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
