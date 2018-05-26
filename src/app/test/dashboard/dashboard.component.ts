import {Component, Input, OnChanges, OnInit} from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnChanges {

  @Input() title: string;
  @Input() targetSupervisorsCount: number;
  @Input() targetTreatedSupervisorsCount: number;
  @Input() targetUntreatedSupervisorsCount: number;
  constructor() { }

  ngOnChanges() {
    console.log(this.targetTreatedSupervisorsCount);
    console.log(this.targetUntreatedSupervisorsCount);
  }

  ngOnInit() {
  }

}
