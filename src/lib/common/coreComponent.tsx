import React from 'react';
import { IFieldConfiguration } from '../controls/IFieldConfiguration';
import { IFieldSchema } from '../services/datatypes/RenderListData';
import { IBaseProps } from './ICoreProps';
import { Store } from 'redux';
import { createStore, IRootState } from '../redux/store';
import { IRNFormFieldProps } from '../controls/formFields/RNFormField';
import { changeProp } from '../redux/actions/fields';
import { Linking } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { ControlMode, DisplayType } from 'nuudel-utils';
import { t } from '../loc/i18n';
import { EDITFORM_SCREEN } from '../system_screens';
import { NavigationPush } from '../nav';

export interface IBaseState {
  title: string;
  isLoadingSchema: boolean;
  isLoadingData: boolean;
  isSaving: boolean;
  fieldsSchema: IFieldSchema[];
  data: any;
  originalData: any;
  fieldErrors: { [fieldName: string]: string };
}

export interface ICoreState extends IBaseState {
  showUnsupportedFields?: boolean;
}

export interface IDisplayType {
  field: string;
  type: DisplayType;
  prompt?: string;
  regex?: any;
  DefaultValue?: any;
  MaxLength?: number;
}

export abstract class coreComponent<
  P = {},
  S = {},
  SS = any
> extends React.Component<P, S, SS> {
  // Заавал бөглөх, заавал байх талбар                          ------------------- 1
  // Заавал байх, автоматаар бөглөгдөх талбар, эсвэл засахгүй   ------------------- 2
  // Заавал харагдах, гэхдээ бөглөхгүй байж болох талбар        ------------------- 3
  // Тухайн формын хувьд харагдахгүй байх талбар                ------------------- 4
  protected defaultFields: IDisplayType[] = [];
  protected _store: Store<IRootState>;
  private _props: any = null;
  protected _saveButtonClicked = false;
  protected _mounted: boolean = false;
  public constructor(props: P, state?: any) {
    super(props, state);
    this._props = { ...props };
    this._store = createStore();
  }

  componentDidMount() {
    this._mounted = true;
  }

  public componentWillUnmount(): void {
    this._mounted = false;
    //this._store.dispatch(setFields({}));
    //this.defaultFields = [];
    //this._props = null;
  }

  protected unionBy(a, b) {
    b.forEach((item) => {
      let index = a.findIndex((itm) => itm.field === item.field);
      if (index >= 0) {
        a[index] = item;
      } else {
        a.push(item);
      }
    });
    return a;
  }

  protected handlePopPress = () => {
    if (this._props.componentId) {
      Navigation.popToRoot(this._props.componentId);
    }
  };

  protected handleEditFormScreen = async () => {
    if (this._props.componentId) {
      NavigationPush(this._props.componentId, {
        component: {
          name: EDITFORM_SCREEN.name,
          passProps: {
            ...this._props,
            listname: this._props.listname,
          },
        },
      });
    }
  };

  protected customInit(fieldName: string, fldProps: IRNFormFieldProps) {
    let it: IDisplayType[] = this.defaultFields.filter(
      (fld) => fld.field === fieldName
    );
    if (it.length > 0) {
      if (
        this._props.formType === ControlMode.New &&
        it[0].hasOwnProperty('DefaultValue') &&
        it[0].DefaultValue
      ) {
        fldProps.fieldSchema.DefaultValue = it[0].DefaultValue;
      }
      if (it[0].hasOwnProperty('MaxLength') && it[0].MaxLength) {
        fldProps.fieldSchema.MaxLength = it[0].MaxLength;
      }
    }
    return fldProps;
  }

  protected abstract readData(
    listname: string,
    formType: ControlMode,
    id?: number
  ): Promise<void>;
  protected abstract getFields(): IFieldConfiguration[];
  protected abstract onUpdateFields(newFields: IFieldConfiguration[]): void;
  protected abstract valueChanged(fieldName: string, newValue: any): void;
  protected customActions(fieldName: string, newValue: any) {
    switch (fieldName) {
      case 'title':
        break;
      default:
        break;
      // code block
    }
  }

  protected appendField(fieldName: string) {
    const newFields = this.getFields();
    let fieldKey = fieldName;
    let indexer = 0;
    while (newFields.some((fld) => fld.key === fieldKey)) {
      indexer++;
      fieldKey = fieldName + '_' + indexer;
    }
    newFields.push({ key: fieldKey, fieldName: fieldName });
    this.onUpdateFields(newFields);
  }

  protected moveField(fieldKey, toIndex) {
    const fields = this.getFields();
    const dragField = fields.filter((fld) => fld.key === fieldKey)[0];
    const dragIndex = fields.indexOf(dragField);
    const newFields = fields.splice(0); // clone
    newFields.splice(dragIndex, 1);
    newFields.splice(toIndex, 0, dragField);
    this.onUpdateFields(newFields);
  }

  protected removeField(index: number) {
    const newFields = this.getFields().splice(0); // clone
    newFields.splice(index, 1);
    this.onUpdateFields(newFields);
  }

  protected abstract childState(state: any): void;
  protected abstract getChildState(name: string): any;

  protected initialStore(
    defaultFields: IDisplayType[],
    fields: IFieldConfiguration[],
    data: any,
    props: IBaseProps
  ): any {
    let fld: any = {};
    fields.forEach((field) => {
      const dt = defaultFields.filter((f) => f.field === field.fieldName);
      fld[field.fieldName] =
        dt.length > 0
          ? {
              ...{ prompt: '', regex: '', DefaultValue: null },
              ...dt[0],
            }
          : {
              field: field.fieldName,
              type: DisplayType.Optional,
              prompt: '',
              regex: '',
              DefaultValue: null,
            };
      if (props.formType !== ControlMode.New) {
        fld[field.fieldName].value = data[field.fieldName];
      }
    });
    return fld;
  }

  protected setStoreDis(key: string, type: DisplayType) {
    this._store.dispatch(changeProp(key, 'type', type));
    for (let i: number = 0; i < this.defaultFields.length; i++) {
      if (this.defaultFields[i].field === key) {
        this.defaultFields[i].type = type;
        break;
      }
    }
  }

  protected GenerateNumber(id: number): string {
    return (
      new Date().getFullYear().toString().substring(2) +
      '-' +
      id.toString().padStart(4, '0')
    );
  }

  protected DoRegex(Required: boolean, val: string, fieldName: string): string {
    if (Required && !val) {
      return t('RequiredValueMessage');
    }
    const dt: any[] = this.defaultFields.filter((f) => f.field === fieldName);
    if (dt.length > 0) {
      if (dt[0].type === DisplayType.Requared && !val) {
        return t('RequiredValueMessage');
      }
      let pattern: RegExp | string = dt[0].regex;
      if (pattern) {
        if (typeof pattern === 'string') {
          pattern = new RegExp(pattern);
        }
        // regex
        if (pattern instanceof RegExp && !pattern.test(val)) {
          return dt[0].prompt;
        }
      }
    }
    return '';
  }

  protected async PreSaveAction(
    data: any,
    fieldsSchema: IFieldSchema[],
    id: number | string
  ): Promise<any> {
    let r: any[] = [];

    fieldsSchema.forEach((field) => {
      if (!!field.Required && data.hasOwnProperty(field.InternalName)) {
        const val: any = data[field.InternalName];
        if ((val instanceof Array && val.length === 0) || !val) {
          r.push({
            ErrorMessage: t('RequiredValueMessage'),
            FieldName: field.InternalName,
            FieldValue: val,
            HasException: true,
            ItemId: id,
          });
        }
      }
    });

    this.defaultFields.forEach((fld) => {
      if (
        data.hasOwnProperty(fld.field) &&
        (fld.type === DisplayType.Requared || fld.type === DisplayType.Optional)
      ) {
        const val: any = data[fld.field];
        if (
          fld.type === DisplayType.Requared &&
          ((val instanceof Array && val.length === 0) || !val)
        ) {
          r.push({
            ErrorMessage: fld.prompt || t('RequiredValueMessage'),
            FieldName: fld.field,
            FieldValue: val,
            HasException: true,
            ItemId: id,
          });
        } else if (fld.regex) {
          let pattern: RegExp | string = fld.regex;
          if (typeof pattern === 'string') {
            pattern = new RegExp(pattern);
          }
          if (pattern instanceof RegExp && !pattern.test(val)) {
            r.push({
              ErrorMessage: fld.prompt ? fld.prompt : t('Error'),
              FieldName: fld.field,
              FieldValue: val,
              HasException: true,
              ItemId: id,
            });
          }
        }
      }
    });
    return r;
  }

  protected convertFromHierarchy = (obj: object, parent: string = '') => {
    let fields = {};
    let flds: string[] = Object.keys(obj);
    for (let i = 0; i < flds.length; i++) {
      const fieldname = !parent ? flds[i] : parent + '.' + flds[i];
      if (
        typeof obj[flds[i]] === 'object' &&
        obj[flds[i]] !== null &&
        !(obj[flds[i]] instanceof Array) &&
        !(
          obj[flds[i]].hasOwnProperty('uri') &&
          Object.keys(obj[flds[i]]).length <= 3
        )
      ) {
        fields = {
          ...fields,
          [fieldname]: '',
          ...this.convertFromHierarchy(obj[flds[i]], fieldname),
        };
      } else {
        fields[fieldname] = obj[flds[i]];
      }
    }
    return fields;
  };

  protected async saveBefore(
    id: string | number,
    updatedValues: any[],
    originalData: any
  ): Promise<void> {
    return;
  }

  protected _onClick = (url: string) => {
    Linking.openURL(`${url}`);
    return;
  };
}
