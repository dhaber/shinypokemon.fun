import { AppModel, IAppModel } from './base.model';

interface ICompetition extends IAppModel {
  readonly description: string;
  readonly endDate: Date;
  readonly selectedByID: string | null;
  readonly startDate: Date;
  readonly theme: string;
  readonly isTrophyCompetition: boolean;
  readonly validPokemonIDs: string[];
  readonly yearID: string | null;
}

export class Competition extends AppModel implements ICompetition {
  readonly description: string;
  readonly endDate: Date;
  readonly selectedByID: string | null;
  readonly startDate: Date;
  readonly theme: string;
  readonly isTrophyCompetition: boolean;
  readonly validPokemonIDs: string[];
  readonly yearID: string;

  constructor(data: any) {
    super(data);
    this.description = this.attribute('description');
    this.endDate = new Date(this.attribute('endDate') + 'T23:59:59');
    this.selectedByID = this.relationshipID('selectedBy');
    this.startDate = new Date(this.attribute('startDate'));
    this.theme = this.attribute('theme');
    this.isTrophyCompetition = this.attribute('isTrophyCompetition') || false;
    this.validPokemonIDs = this.relationshipIDs('validPokemon');
    this.yearID = this.relationshipID('year')!;
  }

  get link(): string {
    return this.isTrophyCompetition
      ? `/trophy-competitions/${this.id}`
      : `/competitions/${this.id}`;
  }
}
