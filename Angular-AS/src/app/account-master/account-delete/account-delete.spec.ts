import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDelete } from './account-delete';

describe('AccountDelete', () => {
  let component: AccountDelete;
  let fixture: ComponentFixture<AccountDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountDelete]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountDelete);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
