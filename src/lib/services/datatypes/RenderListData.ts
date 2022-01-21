export interface IChoice {
  LookupId: number;
  LookupValue: string;
}

export interface IFieldSchema {
  InternalName: string;
  Title: string;
  DisplayName: string;
  Type: string;
  FieldType: string;
  Required: boolean;
  DefaultValue: any;
  Choices: any[];
  ChoiceCount?: number;
  ReadOnlyField: boolean;
  Description: string;
  MaxLength: number;
  ListName: string;
  Disable?: boolean;
  Hidden: boolean;
  keyboardType: string;
  JsonOption?: any;
  ParentObject: string;
  IsArray: boolean;
  _Children: any[];
  regex?: string;
  /*
  Id: string;
  Name: string;
  StaticName: string;
  Direction: string;
  //*/
}

export interface IFormSchema {
  Item: IFieldSchema[];
}
