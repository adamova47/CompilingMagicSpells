import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SomecontentComponent } from './somecontent.component';

describe('SomecontentComponent', () => {
  let component: SomecontentComponent;
  let fixture: ComponentFixture<SomecontentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SomecontentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SomecontentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
