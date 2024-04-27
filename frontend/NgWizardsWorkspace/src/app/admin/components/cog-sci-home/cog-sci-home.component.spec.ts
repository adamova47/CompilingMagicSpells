import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CogSciHomeComponent } from './cog-sci-home.component';

describe('CogSciHomeComponent', () => {
  let component: CogSciHomeComponent;
  let fixture: ComponentFixture<CogSciHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CogSciHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CogSciHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
