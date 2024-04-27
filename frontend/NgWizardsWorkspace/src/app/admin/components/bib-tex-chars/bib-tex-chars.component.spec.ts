import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BibTexCharsComponent } from './bib-tex-chars.component';

describe('BibTexCharsComponent', () => {
  let component: BibTexCharsComponent;
  let fixture: ComponentFixture<BibTexCharsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BibTexCharsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BibTexCharsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
