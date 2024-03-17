import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAreaComponent } from './sub-area.component';

describe('SubAreaComponent', () => {
  let component: SubAreaComponent;
  let fixture: ComponentFixture<SubAreaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubAreaComponent]
    });
    fixture = TestBed.createComponent(SubAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
