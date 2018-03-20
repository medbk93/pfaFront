import {Chrenau} from './chrenau';

export class Teacher {
  id: number;
  nom: string;
  type: string;
  epreuves: any[];
  creneaux: Chrenau[];
}
