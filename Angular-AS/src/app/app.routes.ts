import { Routes } from '@angular/router';
import { Transactions } from './transactions/transactions';
import { AccountCreate } from './account-master/account-create/account-create';
import { AccountUpdate } from './account-master/account-update/account-update';
import { AccountRetrieve } from './account-master/account-retrieve/account-retrieve';
import { AccountDelete } from './account-master/account-delete/account-delete';
import { TransactionCreate } from './transactions/transaction-create/transaction-create';
import { TransactionRetrieve } from './transactions/transaction-retrieve/transaction-retrieve';

export const routes: Routes = [
    {path: 'transactions', component: Transactions},
    {path: 'account/create', component: AccountCreate},
    {path: 'account/retrieve', component: AccountRetrieve},
    {path: 'account/update', component: AccountUpdate},
    {path: 'account/delete', component: AccountDelete},
    {path: 'transaction/create', component: TransactionCreate},
    {path: 'transaction/retrieve', component: TransactionRetrieve},
    {path: '', redirectTo: 'account/create', pathMatch: 'full'}

];
 