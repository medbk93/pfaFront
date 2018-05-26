import {Locale} from './locale';
import {Chrenau} from '../../availability/models/chrenau';
import {Groupe} from './groupe';
import {Teacher} from '../../availability/models/teacher';

export class Test {
  id: number;
  nom: string;
  duree: number;
  local?: Locale;
  creneau: Chrenau;
  groupe: Groupe;
  surveillants: Teacher[];
}
