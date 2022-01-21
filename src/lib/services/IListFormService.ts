import { ControlMode, QueryType } from 'nuudel-utils';
import { IFieldSchema } from './datatypes/RenderListData';
import { ApolloClient } from '@apollo/client';

export interface IListFormService {
  getFieldSchemasForForm: (
    listname: string,
    formType?: ControlMode
  ) => Promise<IFieldSchema[]>;
  itemById: (
    listname: string,
    itemId: number | string,
    fieldsSchema?: IFieldSchema[]
  ) => Promise<any>;
  createItem: (
    listname: string,
    data: any,
    fieldsSchema?: IFieldSchema[]
  ) => Promise<any>;
  updateItem: (
    listname: string,
    itemId: number | string,
    data: any,
    originalData?: any,
    fieldsSchema?: IFieldSchema[]
  ) => Promise<any>;
  deleteItem: (listname: string, itemId: number | string) => Promise<any>;
  viewItems: (
    listname: string,
    variables?: any,
    fieldsSchema?: IFieldSchema[]
  ) => Promise<any>;
  listQuery: (listname: string, fieldsSchema: IFieldSchema[]) => string;
  executeQuery: (
    query: string,
    listname: string,
    type: QueryType | string,
    variables?: any
  ) => Promise<any>;
  client: ApolloClient<any>;
  manyResources: (
    listnames: string[],
    filter: string,
    sort: string,
    limit: number,
    userId: string | null
  ) => Promise<any>;
}
