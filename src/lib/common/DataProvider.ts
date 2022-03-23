import {
  IListBaseState,
  IProviderBase,
  IProviderItems,
} from './IListBaseState';
import IDataProvider from './IDataProvider';
import gql from 'graphql-tag';
import { IListFormService } from '../services/IListFormService';
import { getPlural } from 'nuudel-utils';
import { clientError } from '../common/helper';
import { t } from '../loc/i18n';
import { FetchPolicy } from '@apollo/client';

export default class DataProvider implements IDataProvider {
  private _lfs: IListFormService;
  private _query: string = '';
  private _listname: string = 'Product';
  private _category: any = [];
  private readonly _fetchPolicy: FetchPolicy = 'no-cache'; //'network-only',
  private readonly columns: string = `
  _id,
  title,
  _createdby,
  _rating{averageRating, reviewCount, ratingHistograms{count,rating}},
  shortDesc,desc,SKU,image,images,
  _parentGroup,
  productinfo{categoryId,brand,manufacturer{partNumber,model,vendor},
  _seller},attributes{Name,Value,DisplayName},
  shipping{ServiceCode,quantityEstimate,ShippingCost{currency,value}},
  condition,dimensions{Length,Width,Height},Weight,
  _locale,color,Size,availability,quantity,UnitCount,barcode,
  oldPrice,price{currency,value},expired,
  returnTerms{returnsAccepted,returnPeriod,returnInstructions}`;
  constructor(lfs: IListFormService, query?: string) {
    this._lfs = lfs;
    if (query) {
      this._query = query;
    } else {
      this.getQuery(this._listname).then((query) => {
        this._query = query;
      });
    }

    //this.initCategory();
  }

  initCategory() {
    this.GetBrowseNodes({ ID: '', resources: 'cid, name', depth: 1 }).then(
      (r) => {
        if (r) {
          this._category = r;
        }
      }
    );
  }

  public get category() {
    if (this._category && this._category.length === 0) {
      this.initCategory();
    }
    return this._category;
  }

  public get lfs() {
    return this._lfs;
  }

  public Sorting() {
    return [
      { label: t('CreatedAsc'), value: '' }, //{"createdAt": 1}
      { label: t('CreatedDesc'), value: '{"createdAt": -1}' },
      { label: t('StartDesc'), value: '{"startDate": -1}' },
      { label: t('StartAsc'), value: '{"startDate": 1}' },
      { label: t('Distance'), value: '{"distance": 1}' },
    ];
  }

  public defaultFilters() {
    return {
      availability: 'IN_STOCK',
    };
  }

  public filterOptions() {
    return [
      {
        name: 'categories',
        type: 'multiselect',
        text: t('Categories'),
        choices: this._category.map((item) => ({
          value: item.cid,
          label: item.name,
        })),
        default: [''],
      },
      {
        name: 'condition',
        type: 'multiselect',
        text: t('Conditions'),
        choices: [
          { value: 'New', label: t('New') },
          { value: 'Used', label: t('Used') },
          { value: 'OpenBox', label: t('OpenBox') },
          { value: 'Refurbished', label: t('Refurbished') },
          { value: 'Parts', label: t('Parts') },
        ],
        default: [],
      },
      {
        name: 'MinPrice',
        type: 'number',
        text: t('MinPrice'),
      },
      {
        name: 'MaxPrice',
        type: 'number',
        text: t('MaxPrice'),
      },
    ];
  }

  private async getQuery(listname) {
    let query = '';
    try {
      const fieldsSchema = await this._lfs.getFieldSchemasForForm(listname);
      query = this._lfs.listQuery(listname, fieldsSchema);
    } catch {}
    return query;
  }

  public validateSettings(): boolean {
    if (!this._query) {
      return false;
    }
    return true;
  }

  public async GetItem(param: IProviderBase): Promise<any> {
    let { ID, resources, listname } = param;
    listname = listname || this._listname;
    let r: any = false;

    //r = await this._lfs.itemById(listname, ID);
    try {
      r = await this._lfs.client.query({
        query: gql`query Get${listname}($_id: ObjectId!){
        get${listname}(_id: $_id) {
          ${resources ? resources : this.columns}
        }
      }`,
        variables: { _id: ID },
        fetchPolicy: this._fetchPolicy,
      });
    } catch (e) {
      this.onError(e);
    }

    if (r) {
      if (r.data) return Promise.resolve(r.data[`get${listname}`]);
      else return Promise.resolve(r);
    } else {
      return Promise.resolve({});
    }
  }

  public async GetItems(param: IProviderItems, options?: string): Promise<any> {
    let { Ids, resources, listname } = param;
    listname = listname || this._listname;
    let r: any = false;
    if (typeof Ids === 'undefined') {
      return Promise.resolve([]);
    }

    //r = await this._lfs.viewItems(listname, {filter: `{"_id": {"$in": ["${Ids.join('","')}"]} }`});
    try {
      r = await this._lfs.client.query({
        query: gql`query GetAll${listname}($filter: String, $sort: String, $limit: Int) {
        getAll${listname}(filter: $filter, sort: $sort, limit: $limit) {
          ${
            resources
              ? resources
              : `_id, title, image, condition, color, Size, availability, quantity, price {value, currency},
               oldPrice, shortDesc, shipping {ServiceCode, quantityEstimate, ShippingCost{currency,value}`
          }
      }}`,
        variables: {
          filter: `{"_id": {"$in": ["${Ids.join('","')}"]} }`,
        },
        fetchPolicy: this._fetchPolicy,
      });
    } catch (e) {
      this.onError(e);
    }

    if (r) {
      if (r.data) return Promise.resolve(r.data[`getAll${listname}`]);
      else return Promise.resolve(r);
    } else {
      return Promise.resolve([]);
    }
  }

  public async GetBrowseNodes(param: IProviderBase): Promise<any> {
    let { ID, resources, depth } = param;
    const listname = 'Category';
    let r: any = false;
    try {
      r = await this._lfs.client.query({
        query: gql`
      query GetChild${listname}($id: String, $depth: Int) {
        getChild${listname}(id: $id, depth: $depth) {
          ${!resources ? 'cid, name, slug, parent_id, img' : resources}
        }
      }
    `,
        variables: {
          id: !ID ? null : ID,
          depth: depth,
        },
        fetchPolicy: this._fetchPolicy,
      });
    } catch (e) {
      this.onError(e);
    }
    if (r && r.data) {
      return Promise.resolve(r.data[`getChild${listname}`]);
    } else {
      return Promise.resolve([]);
    }
  }

  public async GetVariations(param: IProviderBase): Promise<any> {
    let { ID, resources } = param;
    const listname = 'Itemgroup';
    let r: any = false;

    //r = await this._lfs.itemById(listname, ID);

    try {
      r = await this._lfs.client.query({
        query: gql`query Get${listname}($_id: ObjectId!){
        get${listname}(_id: $_id) {
          ${
            resources
              ? resources
              : `_id,
            article,
            items {${this.columns}},
            itemIds,
            attributeValues { Name, Value }`
          }
        }
      }
      `,
        variables: {
          _id: ID,
        },
        fetchPolicy: this._fetchPolicy,
      });
    } catch (e) {
      this.onError(e);
    }

    if (r) {
      if (r.data) return Promise.resolve(r.data[`get${listname}`]);
      else return Promise.resolve(r);
    } else {
      return Promise.resolve({
        items: [],
      });
    }
  }

  public async readListData(state: IListBaseState): Promise<any> {
    let {
      sorting,
      pageSize,
      currentPage,
      total,
      search,
      listname = this._listname,
      fetchPolicy = this._fetchPolicy,
    } = state;
    let filter =
      typeof state.filter === 'object' ? { ...state.filter } : state.filter;

    const emptyResult = {
      itemSummaries: [],
      total: 0,
      next: false,
      offset: 0,
      limit: 0,
    };

    if (
      listname === 'Product' &&
      typeof search !== 'undefined' &&
      search.trim() === ''
    ) {
      return Promise.resolve(emptyResult);
    }

    filter = !filter
      ? '{}'
      : typeof filter === 'object'
      ? JSON.stringify(filter)
      : filter;
    if (!!state.search) {
      const sort = '{ "score": { "$meta": "textScore" } }';
      filter = `{ "$and" : [ ${filter} , { "$text": { "$search": "${search}" } }] }`;
      sorting =
        !!sorting && sorting.trim().startsWith('{')
          ? `{ "$and": [${sort},${sorting.trim()}]}` // '{' + sort + ',' + sorting.trim().substring(1)
          : sort;
    }
    sorting = !sorting ? '{}' : sorting;

    const query =
      listname === this._listname && !!this._query
        ? this._query
        : await this.getQuery(listname);
    if (!this._query && listname === 'Product') {
      this._query = query;
    }

    if (!query) {
      return Promise.resolve(emptyResult);
    }
    let r: any = false;
    try {
      r = await this._lfs.client.query({
        query: gql`
          ${query}
        `,
        variables: {
          filter: filter,
          sort: sorting,
          total: total,
          skip: pageSize * (currentPage > 0 ? currentPage - 1 : 0),
          take: pageSize,
        },
        fetchPolicy: fetchPolicy as FetchPolicy,
        //errorPolicy: 'all',
      });
    } catch (err) {
      if (__DEV__) {
        console.warn(err);
      }
      return Promise.resolve(emptyResult);
    }

    if (r && r.data) {
      return Promise.resolve(r.data[`get${getPlural(listname)}s`]);
    } else {
      this.onError(r);
      await clientError(r);
      return Promise.resolve(emptyResult);
    }
  }

  protected onError(e) {
    if (__DEV__) {
      console.warn(e);
    }
  }
}
