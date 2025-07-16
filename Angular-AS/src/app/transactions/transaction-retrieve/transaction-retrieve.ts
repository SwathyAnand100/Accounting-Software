import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { trigger, transition, style, animate } from '@angular/animations';

interface Transaction{
  TranName: string,
  TranDesc: string,
  TranDate: string,
  Amount: number,
  AccName: string,
  tableName: string
};

@Component({
  selector: 'app-transaction-retrieve',
  imports: [FormsModule, CommonModule],
  templateUrl: './transaction-retrieve.html',
  styleUrl: './transaction-retrieve.css',
  animations : [
    trigger('slideInOut', [
    transition(':enter', [
      style({ transform: 'translateY(100%)', opacity: 0 }),
      animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
    ]), 
    transition(':leave', [
      animate('300ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class TransactionRetrieve {
  //today: string = new Date().toISOString().split('T')[0];
  tran: Transaction={
    TranName: '',
    TranDesc: '',
    TranDate: new Date().toISOString().split('T')[0],
    Amount: 0,
    AccName: '',
    tableName: 'Transactions'
  };

  message = '';
  messageType = '';

  constructor(private http: HttpClient){}

  validateForm():boolean{
    if (this.tran.TranDate == ''){
      alert("Please enter Transaction Date.")
      return false;
    }
    return true;
  }

  OnSubmit():void{
    const inputdata = this.tran;
    if(!this.validateForm()){
      return;
    }
    this.http.post<any>('http://localhost:8001/retrieve', inputdata).subscribe({
      next:(response) => {
        this.message = response.message;
        if (this.message.includes("No")){
          this.messageType = 'error';
          alert(this.message);
        }
      },
      error:() => {
      this.message = 'Error communicating with backend!';
      this.messageType = 'error'
      }
    });
    setTimeout(() => {
      this.messageType = '';
      this.message = '';
    }, 2500)}

}
