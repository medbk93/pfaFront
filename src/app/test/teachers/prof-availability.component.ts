import {
  ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output,
  SimpleChanges
} from '@angular/core';
import 'rxjs/add/observable/of';
import {Teacher} from './models/teacher';
import {SessionService} from './services/session.service';
import {ChreneauService} from './services/chreneau.service';
import {Session} from './models/session';
import {MatTableDataSource, MatSnackBar} from '@angular/material';
import {Chrenau} from './models/chrenau';
import {SelectionModel} from '@angular/cdk/collections';
import {TeacherService} from './services/teacher.service';

@Component({
  selector: 'app-prof-availability',
  templateUrl: './prof-availability.component.html',
  styleUrls: ['./prof-availability.component.scss']
})
export class ProfAvailabilityComponent implements OnInit, OnChanges {
  @Input() teacher: Teacher;
  chreneaux: Chrenau[];
  sessionsTable: any = ['s1', 's2', 's3', 's4', 's5'];
  matrix: number[][] = [];
  displayedColumns = ['date', 'seance1', 'seance2', 'seance3', 'seance4', 'seance5'];
  dataSource: MatTableDataSource<any>;
  teacherCrIds: number[] = [];
  lengthOfArrayIds = 0;
  enableOrDisableButton = true;
  toggleAllChecked = false;
  @Output() saveAvailabilityExecuted: EventEmitter<boolean> = new EventEmitter();
  selection = new SelectionModel<Chrenau>(true, []);
  constructor(private _chreneau: ChreneauService,
              private _teacher: TeacherService,
              private snackBar: MatSnackBar) { }


  ngOnChanges(changes: SimpleChanges): void {
    this.teacherCrIds = [];
    this.toggleAllChecked = false;
    this.ngOnInit();
  }

  ngOnInit() {
    if (this.teacher != null) {
      if (this.teacher.creneaux.length > 0) {
        this.teacher.creneaux.forEach(c => {
          this.teacherCrIds.push(c.id);
        });
      }
    }
    this._chreneau.getChreneaux().subscribe(chreneaux => {
      this.chreneaux = chreneaux;
      this.dataSource = new MatTableDataSource(this.chreneaux);
      this.instanciateMatrix();
      this.lengthOfArrayIds = this.teacherCrIds.length;
      this.enableOrDisableButton = this.lengthOfArrayIds === 0;
    });


  }
  //
  // clearMatrix() {
  //   for (let i = 0; i < this.chreneaux.length; i++) {
  //     this.matrix[i] = [];
  //     for (let j = 0; j <= 5; j++) {
  //       this.matrix[i][j] = 0;
  //     }
  //   }
  // }
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
    if (this.teacher != null) {
      this.insertCreneauxIfExist();
    }
  }
  insertCreneauxIfExist() {
    if (this.teacher.creneaux.length !== 0) {
      this.teacherCrIds.forEach(id => {
        let first;
        let second;
        if (id % 5 === 0) {
          first = (id / 5) - 1;
          second = 4;
        } else {
          first = Math.floor(id / 5);
          second = Math.floor(id % 5) - 1;
        }
        this.matrix[first][second] = 1;
      });
    }
  }
  fun(i: number, j: number): boolean {
    if (this.matrix[i][j] === 1) {
      return true;
    }
    return false;
  }

  push(i: number, j: number) {
    if (this.matrix[i][j] === 1) {
      this.matrix[i][j] = 0;
      this.lengthOfArrayIds--;
    } else {
      this.matrix[i][j] = 1;
      this.lengthOfArrayIds++;
    }
    this.enableOrDisableButton = this.lengthOfArrayIds === 0;
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
      this.snackBar.open('Disponibilté à bien été procéder', 'succées', {
        duration: 2000,
      });
    });
    this.saveAvailabilityExecuted.emit(true);
  }
  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.dataSource.data.length;
  //   console.log(numSelected, numRows);
  //   return numSelected === numRows;
  // }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  rowToggle(id: number, event) {
    console.log(event);
    console.log(id);
    for (let i = 0; i < 5; i++) {
      if (event.checked === true) {
        this.matrix[id][i] = 1;
        this.lengthOfArrayIds++;
      } else {
        this.matrix[id][i] = 0;
        this.lengthOfArrayIds--;
      }
    }
    this.enableOrDisableButton = this.lengthOfArrayIds === 0;
  }
  toggleAll(event): void {
    for (let i = 0; i <= this.chreneaux.length; i++) {
      for (let j = 0; j < 5; j++) {
        if ( event.checked === true) {
          this.matrix[i][j] = 1;
          this.lengthOfArrayIds++;
          this.toggleAllChecked = true;
        } else {
          this.matrix[i][j] = 0;
          this.lengthOfArrayIds--;
          this.toggleAllChecked = false;
        }
      }
    }
    this.enableOrDisableButton = this.lengthOfArrayIds === 0;
  }

}
