import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransitCard } from './transit-card';

describe('TransitCard', () => {
  let component: TransitCard;
  let fixture: ComponentFixture<TransitCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransitCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransitCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
