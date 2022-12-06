import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  //  to hold username
  user: string = "";

  // to hold account to be deleted
  acno: any


  depositForm = this.fb.group({
    acno: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    pswd: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]*')]],
    amount: ['', [Validators.required, Validators.pattern('[0-9]*')]]


  })

  withdrawForm = this.fb.group({
    acno: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    pswd: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]*')]],
    amount: ['', [Validators.required, Validators.pattern('[0-9]*')]]


  })

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) { }

  ngOnInit(): void {
    if (localStorage.getItem("username")) {
      this.user = localStorage.getItem("username") || ''
    }

    if (!localStorage.getItem("token")) {
      alert("please login")
      // we have to redirect to login page
      this.router.navigateByUrl('')

    }

  }
  deposit() {
    var acno = this.depositForm.value.acno
    var pswd = this.depositForm.value.pswd
    var amount = this.depositForm.value.amount
    if (this.depositForm.valid) {
      // asynchronous
      this.api.deposit(acno, pswd, amount)
        .subscribe((result: any) => {
          alert(result.message)


        },

          (result: any) => {
            alert(result.error.message)
          })
    }
    else {
      alert("invalid form")
    }

  }
  withdraw() {
    var acno = this.withdrawForm.value.acno
    var pswd = this.withdrawForm.value.pswd
    var amount = this.withdrawForm.value.amount
    if (this.withdrawForm.valid) {
      // asynchronous
      this.api.withdraw(acno, pswd, amount) 
        .subscribe((result: any) => {
          alert(result.message)
        },

          // if client error
          (result: any) => {
            alert(result.error.message)
          })
    }
    else {
      alert("invalid form")
    }

  }
  // log out
  logout() {
    // we have to remove existing user details from local storage
    localStorage.removeItem("username")
    localStorage.removeItem("token")
    localStorage.removeItem("currentAcno")

    // we have to redirect to login page
    this.router.navigateByUrl('')

  }

  // delete to display  confirm
  delete() {
    this.acno = localStorage.getItem("currentAcno")
  }

  // cancel delete
  cancel() {
    this.acno = ""
  }

  // delete account
  onDelete(event: any) {
    // alert('from parent:'+event)
    // make an call to service to delete the particular acno
    this.api.deleteAcc(event)
      .subscribe((result: any) => {
        alert(result.message)
        this.logout()
      },
      result=>{
        alert(result.error.message)
      }
      )
  }
}
