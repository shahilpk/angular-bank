import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TransactionComponent } from '../transaction/transaction.component';

const options = {
  headers: new HttpHeaders()
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private api: HttpClient) { }

  // login api
  login(acno: any, pswd: any) {
    const body = {
      acno,
      pswd
    }
    return this.api.post('http://localhost:3000/login', body)
  }
  register(acno: any, pswd: any, uname: any) {
    const body = {
      acno,
      pswd,
      uname
    }
    return this.api.post('http://localhost:3000/register', body)
  }

  // to insert token in a http header
  getToken() {
    // 1. get token from local storage
    const token = localStorage.getItem("token")

    // 2. create htpp header 
    let headers = new HttpHeaders()

    // 3.to insert token inside header 
    if (token) {

      headers = headers.append("access-token", token)
      options.headers = headers

    }
    return options
  }

  deposit(acno: any, pswd: any, amount: any) {
    const body = {
      acno,
      pswd,
      amount,
    }
    return this.api.post('http://localhost:3000/deposit', body, this.getToken())
  }

  // withdraw
  withdraw(acno: any, pswd: any, amount: any) {
    const body = {
      acno,
      pswd,
      amount,
    }
    return this.api.post('http://localhost:3000/withdraw', body, this.getToken())
  }
  // transaction
  transaction(acno:any){
    return this.api.get('http://localhost:3000/transaction/'+acno, this.getToken())
  
  }

  // to delete account-asynchronous
  deleteAcc(acno:any){
    return this.api.delete('http://localhost:3000/deleteAcno/'+acno,this.getToken())
  }
}


