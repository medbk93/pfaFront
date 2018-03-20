import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Teacher} from './teachers/models/teacher';
import {TeacherService} from './teachers/services/teacher.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-test-app',
  templateUrl: 'test-app.component.html',
  styleUrls: ['test-app.component.scss']
})
export class TestAppComponent implements OnInit {

  @Output() optionSelected = new EventEmitter();

  teachers: Teacher[];
  teacher: Teacher;

  filteredTeachers: Teacher[];

  _listFilter: string|Teacher;
  get listFilter(): string|Teacher {
    return this._listFilter;
  }
  set listFilter(value: string|Teacher) {
    this._listFilter = value;
    this.filteredTeachers = this.listFilter ?
      this.filter(typeof this.listFilter === 'object' ? this.listFilter.nom : this.listFilter) : this.teachers;
  }

  constructor (private teacherService: TeacherService, private router: Router) {}

  ngOnInit() {
    this.teacherService.getTeachers().subscribe(data => {
      this.teachers = data;
      this.filteredTeachers = data;
      console.log(this.teachers);
    });
  }

  filter(filterBy: string): Teacher[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.teachers.filter((teacher: Teacher) =>
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

}
