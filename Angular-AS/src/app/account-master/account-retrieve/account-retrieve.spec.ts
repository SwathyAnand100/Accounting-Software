import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountRetrieve } from './account-retrieve';

describe('AccountRetrieve', () => {
  let component: AccountRetrieve;
  let fixture: ComponentFixture<AccountRetrieve>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountRetrieve]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountRetrieve);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
