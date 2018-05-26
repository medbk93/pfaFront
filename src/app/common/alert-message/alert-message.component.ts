import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.scss']
})
export class AlertMessageComponent implements OnInit {
  title = '';
  body = '';
  color = '';
  constructor(
    private dialogRef: MatDialogRef<AlertMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(this.data.data.title);
    this.title = this.data.data.title;
    this.body = this.data.data.body;
    this.color = this.data.data.type;
  }
  ngOnInit() {}

  dismiss() {
    this.dialogRef.close({flag: false});
  }

  accepted() {
    this.dialogRef.close({flag: true});
  }
}
