import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoImComponent } from './who-im.component';

describe('WhoImComponent', () => {
  let component: WhoImComponent;
  let fixture: ComponentFixture<WhoImComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoImComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoImComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
