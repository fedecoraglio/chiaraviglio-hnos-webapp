import { IItemGrainStoreModel } from './item-grain-store.model';

export interface IGrainStoreModel {
  limit: number;
  offset: number;
  total: number;
  items: IItemGrainStoreModel[];
}
