import { Component } from '@angular/core';
import { trigger,transition, style, animate } from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Account{
  AccName: string;
  AccDesc: string;
  CategoryType: string;
  tableName:string;
}

@Component({
  selector: 'app-accountcreate',
  imports: [FormsModule, CommonModule],
  templateUrl: './account-create.html',
  styleUrl: './account-create.css',
  animations: [
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

export class AccountCreate {
  Accnt: Account = {
    AccName: '',
    AccDesc: '',
    CategoryType: '0',
    tableName: 'AccountMaster'
  };

  message = '';
  messageType = '';
  ActionPreferred:string = 'create';

  constructor(private http: HttpClient){}

  resetForm(){
    this.Accnt.AccName = '';
    this.Accnt.AccDesc = '';
  }

  validation():boolean{
    if(this.Accnt.AccName == ''){
      alert("Please enter Account Name")
      return false;
    }
    return true;
  }

  OnSubmit(){
    if(!this.validation()){
      return;
    }

    const inputdata = this.Accnt;
    this.http.post<any>('http://localhost:8000/create', inputdata).subscribe({
      next:(response) => {
        this.message = response.message

        if(this.message.includes("exists")){
            this.messageType = "error"
            alert(this.message)
          }
        else {
            this.messageType = "success"
        }
        this.resetForm();
      },
      error: () => {
        console.log("There is an error - check backend code")
        this.message = 'Error communicating with backend!';
        this.messageType = 'error'
      }
    });
    console.log(this.messageType)
    setTimeout(() => {
      this.messageType = ''; //to trigger the notification slide out action.
      this.message = '';
      }, 2500);
    }
  }