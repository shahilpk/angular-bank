import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {
  user: string = "";


  @Input() item: undefined

  @Output() onCancel = new EventEmitter()

  @Output() onDelete = new EventEmitter()
  constructor() { }

  ngOnInit(): void {
    if (localStorage.getItem("username")) {
      this.user = localStorage.getItem("username") || ''
    }

  }
  cancel() {
    this.onCancel.emit()
  }

  delete() {
    this.onDelete.emit(this.item)
  }

}
