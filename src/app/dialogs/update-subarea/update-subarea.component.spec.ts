import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSubareaComponent } from './update-subarea.component';

describe('UpdateSubareaComponent', () => {
  let component: UpdateSubareaComponent;
  let fixture: ComponentFixture<UpdateSubareaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateSubareaComponent]
    });
    fixture = TestBed.createComponent(UpdateSubareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
