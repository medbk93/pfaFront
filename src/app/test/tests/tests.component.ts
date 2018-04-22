import {
  ChangeDetectorRef, Component, OnInit,
  ViewChild
} from '@angular/core';
import {
  MatTableDataSource, MatPaginator, MatCheckbox, MatSnackBar
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
  locaux: Locale[];
  selectionTests: Test[] = [];
  updatedTests: Test[] = [];
  @ViewChild(MatCheckbox) selectedTest: MatCheckbox;
  searchLocal = new FormControl();
  newLocalIsSelected = false;
  selection = new SelectionModel<Test>(true, []);
  sortBy = 'groupe';
  tests: Test[];
  filteredLocal: Observable<Locale[]>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private _test: TestService,
              private _local: LocalService,
              private snackBar: MatSnackBar,
              private changeDetectorRefs: ChangeDetectorRef) {}
  ngOnInit() {
    this._local.getAllLocaux().subscribe(local => {
      this.locaux = local;
      this.filteredLocal = this.searchLocal.valueChanges
        .pipe(
          startWith<string | Locale>(''),
          map(value => typeof value === 'string' ? value : value.nom),
          map(name => name ? this.filter(name) : this.locaux.slice())
        );
    });
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
  processUpdatingTests(): void {
    this._test.updateTests(this.updatedTests).subscribe(data => {
      this.snackBar.open('Les permutations ont bien été procéder', 'succées', {
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
  enablePermute(test: Test): boolean {
    let disabled = true;
    if (this.selectionTests.length === 2) {
      this.selectionTests.find(t => {
        if (t.id === test.id) {
          disabled = false;
          return disabled;
        }
      });
    }
    return disabled;
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
    // this.clearInput();
  }
  filter(filterBy: string): Locale[] {
    return this.locaux.filter(local =>
      local.nom.toLowerCase().indexOf(filterBy.toLowerCase()) === 0);
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
// function compareTo(a, b) {
//   if ((a.date > b.date) || (a.date === b.date && a.heure < b.heure)) {
//     return 1; // b comes first
//   } else if (a.date === b.date &&
//     (a.heure === b.heure)
//   ) {
//     return 0; // leave a and b unchanged
//   } else {
//     return -1; // a comes first
//   }
// }
