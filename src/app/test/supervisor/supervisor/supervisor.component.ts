import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {TeacherService} from '../../availability/services/teacher.service';
import {Teacher} from '../../availability/models/teacher';

@Component({
  selector: 'app-supervisor',
  templateUrl: './supervisor.component.html',
  styleUrls: ['./supervisor.component.scss']
})
export class SupervisorComponent implements OnInit, AfterViewInit {

  displayedColumns = ['nom', 'type', 'heures'];
  dataSource: MatTableDataSource<Teacher>;
  supervisors: Teacher[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private _supervisor: TeacherService) {}
  ngOnInit() {
    this._supervisor.getTeachers().subscribe(supervisor => {
      this.supervisors = supervisor;
      console.log(this.supervisors);
      this.dataSource = new MatTableDataSource(this.supervisors);
      this.dataSource.paginator = this.paginator;
    });
  }

  /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
  ngAfterViewInit() {

  }
}
