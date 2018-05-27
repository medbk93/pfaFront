import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Classe} from '../tests/models/classe';
import {MatDialog, MatPaginator, MatTableDataSource} from '@angular/material';
import {ClasseService} from '../services/classe.service';
import {ClasseEditComponent} from './classe-edit/classe-edit.component';

@Component({
  selector: 'app-classe',
  templateUrl: './classe.component.html',
  styleUrls: ['./classe.component.scss']
})
export class ClasseComponent implements OnInit {

  displayedColumns = ['classe', 'capacite', 'nbGroupe',
    'niveau', 'specialite', 'departement', 'actions'];
  dataSource: MatTableDataSource<Classe>;
  classes: Classe[];
  classe: Classe;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private _classe: ClasseService, private dialog: MatDialog) {}
  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this._classe.getAllClass().subscribe(data => {
      this.classes = data;
      console.log(this.classes);
      this.dataSource = new MatTableDataSource(this.classes);
      setTimeout(() => this.dataSource.paginator = this.paginator);
    });
  }
  addClasse() {
    this.classe = new Classe();
    const dialogRef = this.dialog.open(ClasseEditComponent, {
      width: '750px',
      hasBackdrop: true,
      data: { flag: 0 }
    });
    dialogRef.afterClosed().subscribe(res => {
      this.refresh();
    });
  }
  editClasse(classe: Classe) {
    const dialogRef = this.dialog.open(ClasseEditComponent, {
      width: '750px',
      data: { classe: classe, flag: 1 },
      hasBackdrop: false,
    });
    dialogRef.afterClosed().subscribe(res => {
      console.log('dialog closed ' + res);
    });
  }

  deleteClasse(classe: Classe) {
    console.log(classe);
    if (classe.id) {
      if (confirm(`Vous etes sur de vouloir supprimer la classe: ${classe.nom}?`)) {
        this._classe.deleteClasse(classe.id)
          .subscribe(result => {
            console.log('result', result);
            this.refresh();
          });
      }
    } else {
      // Don't delete, it was never saved.
    }
  }
  applyFilter(filter: string) {
    filter = filter.trim(); // Remove whitespace
    filter = filter.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.data = this.classes.filter(classe => {
      if (classe.nom.toLocaleLowerCase().trim().indexOf(filter) !== -1) {
        return true;
      } else if (classe.nivSpecialite.specialite.nom.toLocaleLowerCase().trim().indexOf(filter) !== -1) {
        return true;
      }
    });
  }
}
