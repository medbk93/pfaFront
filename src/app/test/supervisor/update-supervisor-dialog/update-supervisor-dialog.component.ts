import {
  Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatListOptionChange} from '@angular/material';
import {Test} from '../../tests/models/test';
import {Teacher} from '../../availability/models/teacher';
import {transition, trigger, state, style, animate} from '@angular/animations';
import {AlertMessageComponent} from '../../../common/alert-message/alert-message.component';

@Component({
  selector: 'app-update-supervisor-dialog',
  templateUrl: './update-supervisor-dialog.component.html',
  styleUrls: ['./update-supervisor-dialog.component.scss'],
  animations: [
    trigger('supervisor-enter', [
      state('in', style({ transform: 'translateY(0)' })),
      transition('void => *', [
        style({ transform: 'translateY(-100%)', opacity: '0' }),
        animate('500ms ease-out')
      ]),
      transition('* => void', [
        animate('500ms ease-out', style({transform: 'scaleY(0) translateY(200px)'}))
      ])
    ])
  ]
})
export class UpdateSupervisorDialogComponent implements OnInit {

  test: Test;
  copyTestSupervisors: Teacher[];
  availableSupervisors: Teacher[];
  supervisors: Teacher[] = [];
  constructor(
    private dialogRef: MatDialogRef<UpdateSupervisorDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.test = this.data.test;
    this.copyTestSupervisors = Object.assign([], this.test.surveillants);
    this.availableSupervisors = this.data.supervisors;
  }
  save() {
    console.log(this.test);
    const supervisorAffectedNumber = this.test.surveillants.length + this.supervisors.length;
    const expectedSupervisorNumber = Math.round(this.test.groupe.capacite / 15);
    let data;
    if (supervisorAffectedNumber === 0) {
      data = {
        title: 'Surveillances',
        body:  'epreuve ne peut pas étre sans aucun surveillants',
        type: '#ff0000'
      };
      const dialogRef = this.openDialog(data);
      dialogRef.afterClosed().subscribe(res => {});
    } else if (supervisorAffectedNumber < expectedSupervisorNumber) {
       data = {
        title: 'Surveillances',
        body: 'Le nombre de surveillant est inférieur au nombre requis' +
        '        , Epreuve nécéssite' + expectedSupervisorNumber + ' surveillants',
        type: '#ff7600'
      };
      const dialogRef = this.openDialog(data);
      dialogRef.afterClosed().subscribe(res => {
        if (res.flag) {
          this.dialogRef.close({test: this.test});
        }
      });
    } else {
      this.dialogRef.close({test: this.test});
    }
  }
  dismiss() {
    console.log(this.copyTestSupervisors);
    this.test.surveillants = this.copyTestSupervisors;
    this.dialogRef.close(null);
  }
  openDialog(data: any) {
    return this.dialog.open(AlertMessageComponent, {
      width: '300px',
      data: { data },
      hasBackdrop: false,
    });
  }

  removeSupervisor(supervisor: Teacher, index: number) {
    this.test.surveillants.splice(index, 1);
    this.availableSupervisors.push(supervisor);
  }

  pushUserData(supervisor: Teacher, event: MatListOptionChange, i: number) {
    console.log(event.selected);
    if (event.selected === true) {
      this.supervisors.push(supervisor);
    } else {
      const index = this.supervisors.findIndex(sup => {
        return sup === supervisor;
      });
      if (index !== -1) {
        this.supervisors.splice(index, 1);
      }
    }
  }

  saveNewSupervisor() {
    if (this.supervisors) {
      const supervisorAffectedNumber = this.test.surveillants.length + this.supervisors.length;
      const expectedSupervisorNumber = Math.round(this.test.groupe.capacite / 15);
      if (supervisorAffectedNumber > expectedSupervisorNumber) {
        const data = { title: 'Surveillances',
          body: 'Le nombre de surveillants est suppérieur au nombre requis',
          type: '#ff7600'
        };
        const dialogRef = this.openDialog(data);
        dialogRef.afterClosed().subscribe(res => {
          if (res.flag) {
            this.processSupervisorPush();
          }
        });
      } else {
        this.processSupervisorPush();
      }
    }
  }
  processSupervisorPush() {
    this.supervisors.forEach((supervisor) => {
      this.test.surveillants.push(supervisor);
      const index = this.availableSupervisors.findIndex(sup => {
        return sup === supervisor;
      });
      this.availableSupervisors.splice(index, 1);
    });
    this.supervisors = [];
  }
}
