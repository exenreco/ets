import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalPagesComponent } from './global-pages.component';

describe('GlobalPagesComponent', () => {
  let component: GlobalPagesComponent;
  let fixture: ComponentFixture<GlobalPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalPagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
