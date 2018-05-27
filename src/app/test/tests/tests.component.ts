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
import {Local} from "protractor/built/driverProviders";

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
  filteredTests: Test[] = [];
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
      this.filteredTests = this.tests;
      this.tests = this.sortBy === 'groupe' ? this.tests.sort(sortByClasseGroupe) : this.tests.sort(sortByCreneaux);
      this.dataSource = new MatTableDataSource(this.tests);
      this.dataSource.paginator = this.paginator;
      // this.changeDetectorRefs.detectChanges();
    });
  }
  allTests() {
    this.dataSource.data = this.tests;
    this.filteredTests = this.tests;
  }

  testWithoutSupervisor() {
    console.log(this.tests);
    this.filteredTests = this.tests.filter(test => {
      return test.surveillants.length === 0 || test.surveillants === null;
    });
    this.dataSource.data = this.filteredTests;
  }

  testWithoutLocal() {
    this.filteredTests = this.tests.filter(test => {
      return test.local === null;
    });
    this.dataSource.data = this.filteredTests;
  }

  testWithoutSupAndLocal() {
    this.filteredTests = this.tests.filter(test => {
      return test.local === null && (test.surveillants.length === 0 || test.surveillants === null);
    });
    this.dataSource.data = this.filteredTests;
  }

  processUpdatingTests(): void {
    this._test.updateTests(this.updatedTests).subscribe(data => {
      this.updatedTests = [];
      console.log(this.updatedTests);
      this.snackBar.open('Les modifications ont bien été procéder', 'succées', {
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
      this.snackBar.open('le ou les épreuves sélectionnées ont bien été généré', 'succées', {
        duration: 2000,
      });
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
    let index;
    const testLocal = Object.assign({}, test.local);
    index = this.availableLocaux.findIndex(l => {
      return l.id === local.id;
    });
    if (index !== -1) {
      this.availableLocaux.splice(index, 1);
    }
    this.availableLocaux.forEach(lo => console.log(lo));
    this.availableLocaux.push(testLocal);
    this.newLocalIsSelected = true;
    test.local = local;
    // add the updated test to updatedTest array
    index = this.updatedTests.findIndex(t => {
      return t.id === test.id;
    });
    if (index !== -1) {
      // test exist, process remove and add the new test
      this.updatedTests.splice(index, 1);
      this.updatedTests.push(test);
    } else {
      // test does not exist
      this.updatedTests.push(test);
    }
    console.log(this.updatedTests);
  }
  applyFilter(filterValue: string) {
    const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    // this.dataSource.filter;
    this.dataSource.data = this.filteredTests.filter(t => {
      if (t.nom.toLocaleLowerCase().trim().indexOf(filterValue) !== -1) {
        return true;
      } else if (t.groupe.nom.toLocaleLowerCase().trim().indexOf(filterValue) !== -1) {
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
        hasBackdrop: true,
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
      this.dataSource.data.forEach(row => this.selection.select(row));
    } else {
      this.selectionTests = [];
      this.updatedTests = [];
      this.selection.clear();
    }
  }
  clearDataTable() {}
  selectAndPushDatatable() {}
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
