import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {Subject} from '../models/subject';
import {SubjectService} from '../services/subject.service';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit {
  displayedColumns = ['matiere', 'departement', 'specialite', 'niveau', 'ecole'];
  dataSource: MatTableDataSource<Subject>;
  subjects: Subject[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private _subject: SubjectService) {}
  ngOnInit() {
    this._subject.getAllSubject().subscribe(subject => {
      this.subjects = subject;
      console.log(this.subjects);
      this.dataSource = new MatTableDataSource(this.subjects);
      this.dataSource.paginator = this.paginator;
    });
  }

}
