import {Chrenau} from './chrenau';

export class Teacher {
  id: number;
  nom: string;
  type: string;
  nbrHeure: number;
  nbrHeureAffected: number;
  epreuves: any[];
  creneaux: Chrenau[];
}
