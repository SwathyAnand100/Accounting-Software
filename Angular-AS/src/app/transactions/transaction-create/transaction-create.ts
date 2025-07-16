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
  selector: 'app-transaction-create',
  imports: [FormsModule, CommonModule],
  templateUrl: './transaction-create.html',
  styleUrl: './transaction-create.css',
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
export class TransactionCreate {
  today: string = new Date().toISOString().split('T')[0]
  tran: Transaction={
    TranName: '',
    TranDesc: '',
    TranDate: this.today,
    Amount: 0,
    AccName: '',
    tableName: 'Transactions'
  };

  message = '';
  //messageType = '';
  accountList:string[] = [];

constructor(private http: HttpClient){}

resetForm():void{
  this.tran.TranName = '';
  this.tran.TranDesc = '';
  this.tran.TranDate = this.today;
  this.tran.Amount= 0;
  this.tran.AccName= '';
  this.tran.tableName= 'Transactions';
}

validateForm(): boolean { 
  if (this.tran.TranName == '' || this.tran.AccName == '' || this.tran.Amount == null){
      alert("Please enter all fields");
      return false;
  }
  else if(!this.accountList.includes(this.tran.AccName)){
      alert("Account does not exist.Please enter valid account")
      return false;
  }
  
  if (this.tran.TranDate > this.today){
    let confirmation = confirm("You’ve entered a future date. Confirm to proceed - ");
    if (!confirmation){
      this.message = "Try again with a valid date.";
      setTimeout(()=>{
        this.message = '';
      },2000)
    }
    return confirmation;
  }
  return true;
}

ngOnInit():void {
  this.http.get<string[]>('http://localhost:8004/getdata').subscribe({
    next:(data) => {
      this.accountList = data;
    },
    error:() => {
      this.message = "Error fetching accounts from backend"
    }
  })
}

OnSubmit():void{
  const inputdata = this.tran;
  console.log(this.tran.TranDate)
  if (!this.validateForm()){
    return;
  }
  this.http.post<any>('http://localhost:8000/create',inputdata).subscribe({
    next:(response) => {
      this.message = response.message
      if(this.message.includes("exists")){
        alert(this.message)
      }
      this.resetForm();
    },
    error:() => {
      this.message = 'Error communicating with backend!';
      this.resetForm();
    }
  });
  setTimeout(() => {
    this.message = '';
  }, 2500)}
} 
