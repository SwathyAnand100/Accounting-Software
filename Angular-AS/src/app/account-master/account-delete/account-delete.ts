import { Component } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

interface Account{
  AccName:string;
  AccDesc:string;
  CategoryType:string;
  tableName: string;
}

@Component({
  selector: 'app-account-delete',
  imports: [FormsModule, CommonModule],
  templateUrl: './account-delete.html',
  styleUrl: './account-delete.css',
  animations:[
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
export class AccountDelete{
  Accnt: Account = {
    AccName: '',
    AccDesc: '',
    CategoryType: '0',
    tableName: 'AccountMaster'
  }

  accountList:string[] = [];
  message = '';
  messageType = '';
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

  ngOnInit():void{
    this.http.get<string[]>('http://localhost:8004/getdata').subscribe({
      next:(data) => {
        this.accountList = data;
      },
      error:() => {
        console.log("There is an error - check backend code");
        this.message = 'Error communicating with backend!';
        this.messageType = 'error';
      }
    });
  }

  OnSubmit(){
    if(!this.validation()){
      return;
    }

    const inputdata = this.Accnt;

    this.http.post<any>('http://localhost:8003/delete', inputdata).subscribe({
      next:(response) => {
        this.message = response.message

        if(this.message.includes("failed")||this.message.includes("not")){
            this.messageType = "error"
            alert(this.message)
          }
        else {
            this.messageType = "success"
        }
        this.resetForm();
        this.ngOnInit();
      },
      error: () => {
        console.log("There is an error - check backend code")
        this.message = 'Error communicating with backend!';
        this.messageType = 'error'
      }
    });
    console.log(this.messageType)
    setTimeout(() => {
      this.messageType = '';
      this.message = '';
      }, 2500);
    }
  }