import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Teacher} from './teachers/models/teacher';
import {TeacherService} from './teachers/services/teacher.service';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-test-app',
  templateUrl: 'test-app.component.html',
  styleUrls: ['test-app.component.scss']
})
export class TestAppComponent implements OnInit {

  @Output() optionSelected = new EventEmitter();
  teacherSearch = new FormControl();
  treatedTeachers: Teacher[];
  untreatedTeachers: Teacher[];
  teacher: Teacher;

  filteredTreatedTeachers: Teacher[];
  filteredNoTreatedTeachers: Teacher[];

  _listFilterUntreatedTeacher: string|Teacher;
  _listFilterTreatedTeacher: string|Teacher;
  get listFilterUntreatedTeacher(): string|Teacher {
    return this._listFilterUntreatedTeacher;
  }
  set listFilterUntreatedTeacher(value: string|Teacher) {
    this._listFilterUntreatedTeacher = value;
    this.filteredNoTreatedTeachers = this.listFilterUntreatedTeacher ?
      this.filter(typeof this.listFilterUntreatedTeacher === 'object' ? this.listFilterUntreatedTeacher.nom : this.listFilterUntreatedTeacher, this.untreatedTeachers) : this.untreatedTeachers;
  }
  get listFilterTreatedTeacher(): string|Teacher {
    return this._listFilterTreatedTeacher;
  }
  set listFilterTreatedTeacher(value: string|Teacher) {
    this._listFilterTreatedTeacher = value;
    this.filteredTreatedTeachers = this.listFilterTreatedTeacher ?
      this.filter(typeof this.listFilterTreatedTeacher === 'object' ? this.listFilterTreatedTeacher.nom : this.listFilterTreatedTeacher, this.treatedTeachers) : this.treatedTeachers;
  }

  constructor (private teacherService: TeacherService, private router: Router) {}

  ngOnInit() {
    this.teacherService.getNoTreatedTeachers().subscribe(data => {
      this.untreatedTeachers = data;
      this.filteredNoTreatedTeachers = data;
    });
    this.teacherService.getTreatedTeachers().subscribe(data => {
      this.treatedTeachers = data;
      this.filteredTreatedTeachers = data;
    });
  }
  testClick() {
    this.teacherSearch.setValue('');
  }

  test() {
    console.log('test');
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

  onSavingAvailabilityClicked(value: boolean) {
    this.ngOnInit();
  }

}
