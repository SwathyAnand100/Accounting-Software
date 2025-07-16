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
  selector: 'app-account-retrieve',
  imports: [FormsModule, CommonModule],
  templateUrl: './account-retrieve.html',
  styleUrl: './account-retrieve.css',
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
export class AccountRetrieve {
  Accnt: Account = {
    AccName: '',
    AccDesc: '',
    CategoryType: '',
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
      console.log("There is an error - check backend code")
      this.message = 'Error communicating with backend!';
      this.messageType = 'error'
      }
    });
  }

  OnSubmit(){
    if(!this.validation()){
      return;
    }

    const inputdata = this.Accnt;

    this.http.post<any>('http://localhost:8001/retrieve', inputdata).subscribe({
      next:(response) => {
        this.message = response.message

        if(this.message.includes("No")){
            this.messageType = "error"
            alert(this.message)
          }
        this.resetForm();
        this.ngOnInit();
        if(response.AccName){
          this.Accnt.AccName = response.AccName;
          this.Accnt.AccDesc = response.AccDesc;
          this.Accnt.CategoryType = response.CategoryType;
          this.messageType = '';
          }
          else{
            this.Accnt.AccName = '';
            this.Accnt.AccDesc = '';
            this.Accnt.CategoryType = '';
          }
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