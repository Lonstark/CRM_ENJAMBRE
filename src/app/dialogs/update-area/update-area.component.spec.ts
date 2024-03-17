import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAreaComponent } from './update-area.component';

describe('UpdateAreaComponent', () => {
  let component: UpdateAreaComponent;
  let fixture: ComponentFixture<UpdateAreaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateAreaComponent]
    });
    fixture = TestBed.createComponent(UpdateAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
