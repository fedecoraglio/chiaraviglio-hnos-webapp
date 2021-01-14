import {IItemAccountModel} from './item-account.model';

export interface ICurrentAccountModel {
  limit: number;
  offset: number;
  total: number;
  items: IItemAccountModel[];
}
