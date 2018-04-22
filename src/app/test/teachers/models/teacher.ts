import {Chrenau} from './chrenau';

export class Teacher {
  id: number;
  nom: string;
  type: string;
  heures: number;
  epreuves: any[];
  creneaux: Chrenau[];
}
