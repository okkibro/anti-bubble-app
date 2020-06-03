import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BubbleVisualisationComponent } from './bubble-visualisation.component';

describe('BubbleVisualisationComponent', () => {
  let component: BubbleVisualisationComponent;
  let fixture: ComponentFixture<BubbleVisualisationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BubbleVisualisationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BubbleVisualisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
