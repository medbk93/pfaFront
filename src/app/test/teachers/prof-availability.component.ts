import {Component, Input, OnInit} from '@angular/core';
import 'rxjs/add/observable/of';
import {Teacher} from './models/teacher';
import {SessionService} from './services/session.service';
import {ChreneauService} from './services/chreneau.service';
import {Session} from './models/session';
import {MatTableDataSource} from '@angular/material';
import {Chrenau} from './models/chrenau';
import {SelectionModel} from '@angular/cdk/collections';
import {TeacherService} from "./services/teacher.service";

@Component({
  selector: 'app-prof-availability',
  templateUrl: './prof-availability.component.html',
  styleUrls: ['./prof-availability.component.scss']
})
export class ProfAvailabilityComponent implements OnInit {
  @Input() teacher: Teacher;
  indice = 0;
  // checkValue: boolean = false;
  lines: number;
  sessions: Session[];
  chreneaux: Chrenau[];
  sessionsTable: any = ['s1', 's2', 's3', 's4', 's5'];
  matrix: number[][] = [];
  displayedColumns = ['date', 'seance1', 'seance2', 'seance3', 'seance4', 'seance5'];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel<Chrenau>(true, []);
  constructor(private _session: SessionService,
              private _chreneau: ChreneauService,
              private _teacher: TeacherService) { }

  ngOnInit() {
    this._session.getSessions().subscribe(sessions => {
      this.sessions = sessions;
    });
    console.log(this.teacher);
    this._chreneau.getChreneaux().subscribe(chreneaux => {
      this.chreneaux = chreneaux;
      this.dataSource = new MatTableDataSource(this.chreneaux);
      this.lines = this.chreneaux.length * 2;
      this.instanciateMatrix();
      // this.showMatrix();
    });
  }
  // showMatrix() {
  //   for (let i = 0; i < this.chreneaux.length; i++) {
  //     for (let j = 0; j <= 5; j++) {
  //       console.log(this.matrix[i][j]);
  //     }
  //   }
  // }
  instanciateMatrix() {
    for (let i = 0; i <= this.chreneaux.length; i++) {
      this.matrix[i] = [];
      for (let j = 0; j < 5; j++) {
        this.matrix[i][j] = 0;
      }
    }
  }

  push(i: number, j: number) {
    if (this.matrix[i][j] === 1) {
      this.matrix[i][j] = 0;
    } else {
      this.matrix[i][j] = 1;
    }
  }

  saveAvailability() {
    const data = [];
    for (let i = 0; i <= this.chreneaux.length; i++) {
      for (let j = 0; j < 5; j++) {
        if (this.matrix[i][j] === 1) {
          const id = i * 5 + (j + 1);
          data.push(id);
        }
      }
    }
    this.teacher.creneaux = null;
    this.teacher.epreuves = [];
    this.teacher.type = null;
    this._teacher.saveTeacherAvailability(this.teacher, data).subscribe(t => {
      console.log('teacher' + t.nom + t.creneaux);
    });
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    console.log(numSelected, numRows);
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  rowToggle(id: number) {
    console.log(this.isAllSelected());
    console.log(this.dataSource);
    this.selection.select(this.dataSource.data[id]);
  }

}
