import {Locale} from './locale';
import {Chrenau} from '../../teachers/models/chrenau';
import {Groupe} from './groupe';

export class Test {
  id: number;
  nom: string;
  duree: number;
  local?: Locale;
  creneau: Chrenau;
  groupe: Groupe;
}
