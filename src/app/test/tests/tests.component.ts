import {
  AfterViewInit,
  ChangeDetectorRef, Component, OnInit,
  ViewChild
} from '@angular/core';
import {
  MatTableDataSource, MatPaginator, MatCheckbox, MatSnackBar, MatDialog, MatTooltip, MatCheckboxChange
} from '@angular/material';
import {TestService} from './services/test.service';
import {Test} from './models/test';
import {Locale} from './models/locale';
import {LocalService} from './services/local.service';
import {FormControl} from '@angular/forms';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import {Observable} from 'rxjs/Observable';
import {SelectionModel} from '@angular/cdk/collections';
import {UpdateSupervisorDialogComponent} from "../supervisor/update-supervisor-dialog/update-supervisor-dialog.component";
import {TeacherService} from "../availability/services/teacher.service";
import {Teacher} from "../availability/models/teacher";

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.scss']
})
export class TestsComponent implements OnInit {

  displayedColumns = [
    'select', 'tests.creneau.date', 'tests.creneau.seance.heureDebut',
    'tests.nom', 'tests.duree', 'tests.groupe.nom', 'tests.groupe.capacite',
    'tests.local.nom', 'tests.local.capacite', 'tests.local.etage'];
  dataSource: MatTableDataSource<Test>;
  availableLocaux: Locale[];
  selectionTests: Test[] = [];
  updatedTests: Test[] = [];
  @ViewChild(MatCheckbox) selectedTest: MatCheckbox;
  searchLocal = new FormControl();
  newLocalIsSelected = false;
  selection = new SelectionModel<Test>(true, []);
  sortBy = 'groupe';
  tests: Test[];
  cachedTestId: number;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private _test: TestService,
              private _local: LocalService,
              private _teacher: TeacherService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              private changeDetectorRefs: ChangeDetectorRef) {}
  ngOnInit() {
    this.refresh();
  }
  test(sortedBy: string): void {
    this.sortBy = sortedBy;
    this.ngOnInit();
  }
  displayFn(local?: Locale): string | undefined {
    return local ? local.nom : undefined;
  }
  clearInput() {
    this.searchLocal.setValue('');
  }
  refresh() {
    this._test.getAllTests().subscribe(test => {
      this.tests = test;
      this.tests = this.sortBy === 'groupe' ? this.tests.sort(sortByClasseGroupe) : this.tests.sort(sortByCreneaux);
      this.dataSource = new MatTableDataSource(this.tests);
      this.dataSource.paginator = this.paginator;
      this.changeDetectorRefs.detectChanges();
    });
  }
  allTests() {
    this.dataSource.data = this.tests;
  }

  testWithoutSupervisor() {
    console.log(this.tests);
    this.dataSource.data = this.tests.filter(test => {
      return test.surveillants.length === 0 || test.surveillants === null;
    });
  }

  testWithoutLocal() {
    this.dataSource.data = this.tests.filter(test => {
      return test.local === null;
    });
    console.log(this.tests);
  }

  testWithoutSupAndLocal() {
    this.dataSource.data = this.tests.filter(test => {
      return test.local === null && (test.surveillants.length === 0 || test.surveillants === null);
    });
  }

  processUpdatingTests(): void {
    this._test.updateTests(this.updatedTests).subscribe(data => {
      this.updatedTests = [];
      console.log(this.updatedTests);
      this.snackBar.open('Les permutations ont bien été procéder', 'succées', {
        duration: 2000,
      });
    });
  }
  processUpdateTest(test: Test) {
    this._test.updateTest(test).subscribe(data => {
      console.log(data);
      this.snackBar.open('Epreuve a bien été modifié', 'succées', {
        duration: 2000,
      });
    });
  }
  pushSelectedTest(test: Test): void {
    this.selection.toggle(test);
    if (this.selectionTests.length === 0) {
      this.selectionTests.push(test);
    } else {
      const index = this.selectionTests.indexOf(test);
      // the test already exist, process remove
      if (index !== -1) {
        this.selectionTests.splice(index, 1);
      } else {
        this.selectionTests.push(test);
      }
    }
  }

  printPDFProcess() {
    this._test.printPDFProcess(this.selectionTests).subscribe(data => {
      console.log(data);
    });
  }
  executePermute() {
    if (this.selectionTests.length === 2) {
      const firstLocal = this.selectionTests[0].local;
      this.selectionTests[0].local = this.selectionTests[1].local;
      this.selectionTests[1].local = firstLocal;
      this.selectionTests.forEach(t => {
        this.updatedTests.push(t);
      });
      this.selectionTests = [];
    }
    this.selection = new SelectionModel<Test>(true, []);
  }
  localSelection(test: Test, local: Locale) {
    this.newLocalIsSelected = true;
    test.local.nom = local.nom;
    test.local.capacite = local.capacite;
    test.local.etage = local.etage;
  }
  applyFilter(filterValue: string) {
    const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    // this.dataSource.filter;
    this.dataSource.data = this.tests.filter(t => {
      if (t.nom.toLocaleLowerCase().trim().indexOf(filterValue) !== -1) {
        return true;
      } else if (t.groupe.classe.nom.toLocaleLowerCase().trim().indexOf(filterValue) !== -1) {
        return true;
      } else if (days[new Date(t.creneau.date).getDay()]) {
        // getDate() return the number of the days for exp monday ==> 0
        if (days[(new Date(t.creneau.date).getDay()) - 1].toLocaleLowerCase().indexOf(filterValue) !== -1) {
          return true;
        }
      }
    });
  }

  getAvailableLocaux(test: Test) {
    if (this.cachedTestId !== test.id) {
      this.cachedTestId = test.id;
      this._local.getAvailableLocauxForTest(test.id).subscribe(local => {
        this.availableLocaux = local;
        console.log(this.availableLocaux);
      });
    }
  }

  openUpdateSupervisorDialog() {
    let teachers: Teacher[];
    const test: Test = this.selectionTests[0];
    console.log(test);
    this._teacher.getAvailableTeacherInThatTest(test.id).subscribe(result => {
      teachers = result;
      const dialogRef = this.dialog.open(UpdateSupervisorDialogComponent, {
        width: '800px',
        hasBackdrop: false,
        data: { 'test': test, 'supervisors': teachers}
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res != null) {
          if (res.test) {
            this.processUpdateTest(res.test);
          }
        }
      });
    });
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(event) {
    if (event.checked === true) {
      this.tests.forEach(test => {
        // check if the test does not exist
        this.selectionTests.push(test);
      });
    } else {
      this.selectionTests = [];
      this.updatedTests = [];
    }
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  clearDataTable() {}
  selectAllDatatable() {}
}
function sortByClasseGroupe(test1: Test, test2: Test) {
  if (test1.groupe.nom > test2.groupe.nom) {
    return 1;
  } else if (test1.groupe.nom === test2.groupe.nom) {
    return 0;
  } else {
    return -1;
  }
}

function sortByCreneaux(test1: Test, test2: Test) {
  if (test1.creneau.date > test2.creneau.date ||
    (test1.creneau.date === test2.creneau.date) &&
    test1.creneau.seance.heureDebut < test2.creneau.seance.heureDebut) {
    return 1; // test2 comes first
  } else if (test1.creneau.date === test2.creneau.date &&
    (test1.creneau.seance.heureDebut === test2.creneau.seance.heureDebut)
  ) {
    return 0; // leave test1 and test2 unchanged
  } else {
    return -1; // test1 comes first
  }
}
