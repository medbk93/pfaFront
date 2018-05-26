import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Teacher} from './availability/models/teacher';
import {TeacherService} from './availability/services/teacher.service';
import {FormControl} from '@angular/forms';
import {MatList} from '@angular/material';

@Component({
  selector: 'app-test-app',
  templateUrl: 'test-app.component.html',
  styleUrls: ['test-app.component.scss']
})
export class TestAppComponent implements OnInit {

  @Output() optionSelected = new EventEmitter();
  @ViewChild(MatList) treatedList: MatList;
  teacherSearch = new FormControl();
  permanentTeachers: Teacher[];
  vacataireTeachers: Teacher[];
  permanentTreatedTeacher: Teacher[] = [];
  permanentUntreatedTeacher: Teacher[] = [];
  vacataireTreatedTeacher: Teacher[] = [];
  vacataireUntreatedTeacher: Teacher[] = [];
  teacher: Teacher;

  filteredTreatedTeachers: Teacher[];
  filteredNoTreatedTeachers: Teacher[];
  _listFilterUntreatedTeacher: string|Teacher;
  _listFilterTreatedTeacher: string|Teacher;
  _teacherType = 'permanent';
  get teacherType(): string {
    return this._teacherType;
  }
  set teacherType(value: string) {
    this._teacherType = value;
    this.processNoTreatedTeachers(value);
  }
  get listFilterUntreatedTeacher(): string|Teacher {
    return this._listFilterUntreatedTeacher;
  }
  set listFilterUntreatedTeacher(value: string|Teacher) {
    this._listFilterUntreatedTeacher = value;
    if (this.teacherType === 'permanent') {
      this.filteredNoTreatedTeachers = this.listFilterUntreatedTeacher ?
        this.filter(typeof this.listFilterUntreatedTeacher === 'object'
          ? this.listFilterUntreatedTeacher.nom :
          this.listFilterUntreatedTeacher, this.permanentUntreatedTeacher) : this.permanentUntreatedTeacher;
    } else {
      this.filteredNoTreatedTeachers = this.listFilterUntreatedTeacher ?
        this.filter(typeof this.listFilterUntreatedTeacher === 'object'
          ? this.listFilterUntreatedTeacher.nom :
          this.listFilterUntreatedTeacher, this.vacataireUntreatedTeacher) : this.vacataireUntreatedTeacher;
    }
  }
  get listFilterTreatedTeacher(): string|Teacher {
    return this._listFilterTreatedTeacher;
  }
  set listFilterTreatedTeacher(value: string|Teacher) {
    this._listFilterTreatedTeacher = value;
    this.processRightFilterForTreatedTeachers();
  }

  constructor (private teacherService: TeacherService) {}

  ngOnInit() {
    this.teacherService.getPermanentTeachers().subscribe(data => {
      console.log(data);
      this.permanentTeachers = data;
      this.processPermanentTeacher();
    });
    this.teacherService.getVacataireTeachers().subscribe(data => {
      this.vacataireTeachers = data;
      this.processVacataireTeacher();
    });

  }
  testClick() {
    this.teacherSearch.setValue('');
    // console.log(this.filteredNoTreatedTeachers[0]);
  }

  test(teacher: Teacher) {
    console.log(teacher);
  }

  filter(filterBy: string,  targetTeachers: Teacher[]): Teacher[] {
    filterBy = filterBy.toLocaleLowerCase();
    return targetTeachers.filter((teacher: Teacher) =>
      teacher.nom.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  loadUserData(id: number) {
    this.teacherService.getTeacher(id).subscribe(teacher => {
      console.log(teacher);
      this.teacher = teacher;
    });
  }

  displayFn(teacher?: Teacher): string | undefined {
    return teacher ? teacher.nom : undefined;
  }

  onSavingAvailabilityClicked(teacher: Teacher) {
    if (teacher) {
      if (teacher.type === 'EPI') {
        const dispo = teacher.creneaux.length * 90;
        if (dispo >= ((teacher.nbrHeure) * 60)) {
          let index;
          index = this.permanentTreatedTeacher.findIndex(t => {
            return teacher.id === t.id;
          });
          if (index === -1) {
            this.permanentTreatedTeacher.push(teacher);
          }
          console.log(this.permanentTreatedTeacher.length);
          index = this.permanentUntreatedTeacher.findIndex(t => {
            return teacher.id === t.id;
          });
          console.log(index);
          // the supervisor already exist, process remove
          if (index !== -1) {
            this.permanentUntreatedTeacher.splice(index, 1);
          }
        } else {
          const index = this.permanentTreatedTeacher.findIndex(t => {
            return teacher.id === t.id;
          });
          if (index !== -1) {
            this.permanentUntreatedTeacher.push(teacher);
            this.permanentTreatedTeacher.splice(index, 1);
          }
        }
      } else if (teacher.type !== 'EPI') {
        if (teacher.creneaux.length > 0) {
          let index;
          index = this.vacataireTreatedTeacher.findIndex(t => {
            return teacher.id === t.id;
          });
          if (index === -1) {
            this.vacataireTreatedTeacher.push(teacher);
          }
          index = this.vacataireUntreatedTeacher.findIndex(t => {
            return teacher.id === t.id;
          });
          // the test already exist, process remove
          if (index !== -1) {
            this.vacataireUntreatedTeacher.splice(index, 1);
          }
        } else {
          const index = this.vacataireTreatedTeacher.findIndex(t => {
            return teacher.id === t.id;
          });
          // the test already exist, process remove
          if (index !== -1) {
            this.vacataireUntreatedTeacher.push(teacher);
            this.vacataireTreatedTeacher.splice(index, 1);
          }
        }
      }
    }
  }

  processPermanentTeacher(): void {
    this.permanentTeachers.forEach(teacher => {
      const dispo = teacher.creneaux.length * 90;
      if (dispo >= ((teacher.nbrHeure) * 60)) {
       this.permanentTreatedTeacher.push(teacher);
      } else {
        this.permanentUntreatedTeacher.push(teacher);
      }
    });
  }
  processVacataireTeacher(): void {
    this.vacataireTeachers.forEach(teacher => {
      if (teacher.creneaux.length > 0) {
        this.vacataireTreatedTeacher.push(teacher);
      } else {
        this.vacataireUntreatedTeacher.push(teacher);
      }
    });
  }
  processNoTreatedTeachers(value: string): void {
    if (value === 'permanent') {
      this.filteredNoTreatedTeachers = this.permanentUntreatedTeacher;
      this.filteredTreatedTeachers = this.permanentTreatedTeacher;
    } else if (value === 'vacataire') {
      this.filteredNoTreatedTeachers = this.vacataireUntreatedTeacher;
      this.filteredTreatedTeachers = this.vacataireTreatedTeacher;
    }
  }

  processRightFilterForTreatedTeachers(): void {
    console.log(this.permanentTreatedTeacher);
    if (this.teacherType === 'permanent') {
      this.filteredTreatedTeachers = this.listFilterTreatedTeacher ?
        this.filter(typeof this.listFilterTreatedTeacher === 'object' ?
          this.listFilterTreatedTeacher.nom :
          this.listFilterTreatedTeacher, this.permanentTreatedTeacher) : this.permanentTreatedTeacher;
    } else {
      this.filteredTreatedTeachers = this.listFilterTreatedTeacher ?
        this.filter(typeof this.listFilterTreatedTeacher === 'object' ?
          this.listFilterTreatedTeacher.nom :
          this.listFilterTreatedTeacher, this.vacataireTreatedTeacher) : this.vacataireTreatedTeacher;
    }
  }



}
