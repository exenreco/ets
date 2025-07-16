import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodMorningComponent } from './good-morning.component';

describe('GoodMorningComponent', () => {
  let component: GoodMorningComponent;
  let fixture: ComponentFixture<GoodMorningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoodMorningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoodMorningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
