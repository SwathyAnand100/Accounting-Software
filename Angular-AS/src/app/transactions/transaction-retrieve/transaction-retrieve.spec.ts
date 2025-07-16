import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionRetrieve } from './transaction-retrieve';

describe('TransactionRetrieve', () => {
  let component: TransactionRetrieve;
  let fixture: ComponentFixture<TransactionRetrieve>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionRetrieve]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionRetrieve);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
