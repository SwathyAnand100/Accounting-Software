import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountUpdate } from './account-update';

describe('Accountupdate', () => {
  let component: AccountUpdate;
  let fixture: ComponentFixture<AccountUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
