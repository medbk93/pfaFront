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
  sessionsTable: any = ['S1', 'S2', 'S3', 'S4', 'S5'];
  matrix: number[][] = [];
  displayedColumns = ['date', 'seance1', 'seance2', 'seance3', 'seance4', 'seance5'];
  dataSource: MatTableDataSource<any>;
  teacherCrIds: number[] = [];
  lengthOfArrayIds = 0;
  enableOrDisableButton = true;
  toggleAllChecked = false;
  isSaved = false;
  @Output() saveAvailabilityExecuted: EventEmitter<Teacher> = new EventEmitter();
  constructor(private _chreneau: ChreneauService,
              private _teacher: TeacherService,
              private snackBar: MatSnackBar) { }


  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes.teacher.previousValue === undefined || this.isSaved) {
        this.teacherCrIds = [];
        this.toggleAllChecked = false;
        this.ngOnInit();
    } else if (changes.teacher.previousValue !== undefined && (changes.teacher.currentValue.id !== changes.teacher.previousValue.id)
      && !this.isSaved) {
      if (confirm(`Vous n'avez pas valider vos modifications: ${changes.teacher.previousValue.nom}?`)) {
        this.teacherCrIds = [];
        this.toggleAllChecked = false;
        this.ngOnInit();
      }
    }
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
    this.isSaved = false;
  }
  // showMatrix() {
  //   for (let i = 0; i < this.chreneaux.length; i++) {
  //     console.log('i' + i);
  //     for (let j = 0; j <= 5; j++) {
  //       console.log('j ' + j);
  //       console.log(this.matrix[i][j]);
  //     }
  //   }
  // }
  instanciateMatrix() {
    const index = this.chreneaux.findIndex(c => {
      return new Date(c.date).getDay() === 6;
    });
    for (let i = 0; i <= this.chreneaux.length; i++) {
      this.matrix[i] = [];
      if (this.chreneaux[i] === this.chreneaux[index]) {
        for (let j = 0; j < 2; j++) {
          this.matrix[i][j] = 0;
        }
      } else {
        for (let j = 0; j < 5; j++) {
          this.matrix[i][j] = 0;
        }
      }
    }
    if (this.teacher != null) {
      this.insertCreneauxIfExist(this.teacher.creneaux);
    }
  }
  getSaturdayId(cr: Chrenau[]): number {
    const index = cr.findIndex(c => new Date(c.date).getDay() === 6);
    return index;
  }
  insertCreneauxIfExist(creneaux: Chrenau[]) {
    const index = this.getSaturdayId(this.chreneaux);
    if (creneaux.length !== 0) {
      this.teacherCrIds.sort((a, b) => a - b);
      let flag = false;
      console.log(this.teacherCrIds);
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
        // currently in saturday
        if (this.matrix[first][second] === undefined) {
          first = first + 1;
          second = (second + 3) - 5;
          flag = true;
        } else {
          // test about i is greater than the i of saturday
          if (this.matrix[first][second] === 1) {
            second = second + 3;
            if (second >= 5) {
              first++;
              second = second - 5;
            }
          } else {
            if (first > index) {
              second = second + 3;
              if (second >= 5) {
                first++;
                second = second - 5;
              }
            }
          }
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
    const index = this.chreneaux.findIndex(c => {
      return new Date(c.date).getDay() === 6;
    });
    let flag = false;
    for (let i = 0; i <= this.chreneaux.length; i++) {
        for (let j = 0; j < 5; j++) {
          if (this.matrix[i][j] === 1) {
            let id;
            if (flag) {
              id = (i * 5 + (j + 1)) - 3;
            } else {
              id = i * 5 + (j + 1);
            }
            data.push(id);
          }
        }
      if (flag === false) {
        flag = this.chreneaux[i] === this.chreneaux[index];
      }
      console.log(data);
    }

    this._teacher.saveTeacherAvailability(this.teacher, data).subscribe(teacher => {
      this.isSaved = true;
      this.snackBar.open('Disponibilté à bien été procéder', 'succées', {
        duration: 2000,
      });
      this.saveAvailabilityExecuted.emit(teacher);
    });
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  rowToggle(id: number, event) {
    for (let i = 0; i < 5; i++) {
      if (this.matrix[id][i] === undefined) {
        return;
      }
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
        if (this.matrix[i][j] === undefined) {
        } else {
          if (event.checked === true) {
            this.matrix[i][j] = 1;
            this.lengthOfArrayIds++;
            this.toggleAllChecked = true;
          } else {
            this.matrix[i][j] = 0;
            if (this.teacher != null) {
              this.insertCreneauxIfExist(this.teacher.creneaux);
            }
            this.lengthOfArrayIds--;
            this.toggleAllChecked = false;
          }
        }
      }
    }
    this.enableOrDisableButton = this.lengthOfArrayIds === 0;
  }

}
