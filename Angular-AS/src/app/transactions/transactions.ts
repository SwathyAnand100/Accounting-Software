import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';

type ActionType = 'create'|'retrieve'|'update'|'delete';
type messageType_Type = 'success'|'error'|'';

interface Transaction{
  TranName: string,
  TranDesc: string,
  TranDate: string,
  Amount: number,
  AccName: string,
  tableName: string
};

interface Response{
  message: string,
  messageType: messageType_Type,
};

@Component({
  selector: 'app-transactions',
  imports: [FormsModule, CommonModule],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
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


export class Transactions {
  //today: string = new Date().toISOString().replace('T', ' ')
  today: string = new Date().toISOString().split('T')[0]
  tran: Transaction={
    TranName: '',
    TranDesc: '',
    TranDate: this.today,
    //TranDate: new Date(),
    Amount: 0,
    AccName: '',
    tableName: 'Transactions'
  };

  resp: Response = {
    message: '',
    messageType : ''
  };

ActionPreferred:ActionType = 'create';

accountList:string[] = [];

private baseURLS:Record<ActionType, string> = {
    'create': 'http://localhost:8000/create',
    'retrieve': 'http://localhost:8001/retrieve',
    'update': 'http://localhost:8002/update',
    'delete': 'http://localhost:8003/delete'
  }

constructor(private http: HttpClient){}

validateForm(): boolean {
  if (this.ActionPreferred == "create"){ 
    if (this.tran.TranName == '' || this.tran.AccName == '' || this.tran.Amount == null){
      alert("Please enter all fields");
      return false;
    }
    else if(!this.accountList.includes(this.tran.AccName)){
      alert("Account does not exist.Please enter valid account")
      return false;
    }
  }
  if(this.ActionPreferred == 'retrieve' && this.tran.TranDate == ''){
    alert("Please enter Transaction date to retrieve");
    return false;
  }
  if (this.tran.TranDate > this.today){
    let confirmation = confirm("Date greater than current date. Do you want to proceed?");
    if (!confirmation){
      this.resp.message = "Record NOT created. Enter a valid date.";
      this.resp.messageType = 'error';
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
      this.resp.message = "Error fetching accounts from backend"
      this.resp.messageType = "error"
    }
  })
}

OnSubmit():void{
  console.log(this.today)
  const inputdata = this.tran;
  console.log(this.tran.TranDate)
  if (!this.validateForm()){
    return;
  }
  this.http.post<any>(this.baseURLS[this.ActionPreferred],inputdata).subscribe({
    next:(response) => {
      this.resp.message = response.message
      if(this.resp.message.includes("Not") || this.resp.message.includes("Exists")){
        this.resp.messageType = "error"
        alert(this.resp.message)
      }
      else{
        this.resp.messageType = "success"
      }
      if (this.ActionPreferred == 'retrieve'){
        if (response.AccName){
          this.tran.TranName = response.TranName;
          this.tran.TranDesc = response.TranDesc;
          this.tran.Amount = response.Amount;
          this.tran.AccName = response.AccName;
          this.resp.messageType = '';
        }
        else{
          this.tran.TranName = '';
          this.tran.TranDesc = '';
          this.tran.TranDate = new Date().toISOString().split('T')[0];
          //this.tran.TranDate = new Date();
          this.tran.Amount = 0;
          this.tran.AccName = '';
        }
      }
    },
    error:() => {
      this.resp.message = 'Error communicating with backend!';
      this.resp.messageType = 'error'
    }
  });
  console.log(this.resp.messageType)
  setTimeout(() => {
    this.resp.messageType = '';
    this.resp.message = '';
  }, 2500)}
} 
