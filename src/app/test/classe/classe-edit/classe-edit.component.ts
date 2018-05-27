import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {Classe} from '../../tests/models/classe';
import {Level} from '../../models/level';
import {Speciality} from '../../models/speciality';
import {Department} from '../../models/department';
import {SpecialityService} from '../../services/speciality.service';
import {DepartmentService} from '../../services/department.service';
import {LevelService} from '../../services/level.service';
import {ClasseService} from "../../services/classe.service";
import {AlertMessageComponent} from "../../../common/alert-message/alert-message.component";

@Component({
  selector: 'app-classe-edit',
  templateUrl: './classe-edit.component.html',
  styleUrls: ['./classe-edit.component.scss']
})
export class ClasseEditComponent implements OnInit {
  classe: Classe;
  specialities: Speciality[];
  levels: Level[];
  flag: number;
  mouseoverclasse;
  constructor(
    private dialogRef: MatDialogRef<ClasseEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _speciality: SpecialityService,
    private _level: LevelService,
    private _classe: ClasseService,
    private dialog: MatDialog) {

  }

  ngOnInit() {
    this.flag = this.data.flag;
    this._speciality.getAll().subscribe(result => {
      this.specialities = result;
    });
    this._level.getAllLevel().subscribe(result => {
      this.levels = result;
    });
    if (this.data.flag === 0) {
      this.classe = this.initializeClass();
    } else {
      this.classe = this.data.classe;
    }
    console.log(this.classe);
  }

  test(loginValue) {
    console.log(loginValue);
  }
  save(classValue) {
    console.log(classValue);
    // Copy the form values over the product object values
    const levelId = this.classe.nivSpecialite.niveau.niveau;
    const specName = this.classe.nivSpecialite.specialite.nom;
    // this.specialities.
    console.log(specName);
    this._classe.getLevelSpecialityId(specName, levelId).subscribe(nivSpec => {
      console.log(nivSpec);
      if (nivSpec.id === null) {
        const data = {
          title: 'Avertissement',
          body: this.classe.nivSpecialite.specialite.nom +
          ' ne posséde pas le niveau séléctionné ' + this.classe.nivSpecialite.niveau.niveau,
          type: '#ff7600'
        };
        const dialogRef = this.dialog.open(AlertMessageComponent, {
          width: '250px',
          data: { data },
          hasBackdrop: false,
        });
        dialogRef.afterClosed().subscribe(res => {
          console.log('dialog closed ' + res);
        });
      } else {
        this.classe.nivSpecialite = nivSpec;
        this._classe.saveClasse(this.classe).subscribe(c => {
          this.dialogRef.close({classe: c});
        });
      }
    });
  }
  dismiss() {
    this.dialogRef.close(null);
  }

  private initializeClass(): Classe {
    return {
      id: 0,
      nom: '',
      capacite: null,
      nbrGroupe: null,
      nivSpecialite: {
        id: 0,
        niveau: {
          niveau: null
        },
        specialite: {
          id: 0,
          nom: '',
          departement: {
            id: 0,
            ecole: {
              id: 0,
              nom: ''
            },
            nom: ''
          }
        }
      }
    };
  }
}
