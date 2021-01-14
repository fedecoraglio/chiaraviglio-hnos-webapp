import { IItemGrainModel } from './item-grain.model';

export interface IGrainCurrentAccountModel {
  limit: number;
  offset: number;
  total: number;
  items: IItemGrainModel[];
}
