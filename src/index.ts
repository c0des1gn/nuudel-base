export { changeTheme, setColors, setSizes } from './lib/theme';

// Service
import { ListFormService } from './lib/services/ListFormService';
import { IListFormService } from './lib/services/IListFormService';
import { GetSchema } from './lib/services/graphqlSchema';
import DetailForm from './lib/forms/DetailForm/DetailForm';
import { IBaseProps, ICoreProps } from './lib/common/ICoreProps';
import DataProvider from './lib/common/DataProvider';
import IDataProvider from './lib/common/IDataProvider';
import { AppearanceProvider } from './lib/common/AppearanceProvider';
import ntc from './lib/common/ntc';
import { versionCompare } from './lib/common/version';

import {
  IBaseState,
  ICoreState,
  IDisplayType,
  coreComponent,
} from './lib/common/coreComponent';
import {
  IListBaseState,
  IProviderBase,
  IProviderItems,
  IProviderCore,
} from './lib/common/IListBaseState';

// Core
import {
  withRedux,
  withApollo,
  withContext,
  withReducer,
  Context,
  initStore,
  store,
} from './lib/hocs/index';

import { createClient, _dataProvider, lfs } from './lib/hocs/withApollo';

export {
  withRedux,
  withApollo,
  withContext,
  withReducer,
  Context,
  initStore,
  store,
  ListFormService,
  GetSchema,
  DetailForm,
  coreComponent,
  DataProvider,
  createClient,
  _dataProvider,
  lfs,
  AppearanceProvider,
  ntc,
  versionCompare,
};

/**
 * Types exported by 'components/base'
 */
export type {
  IListFormService,
  IDataProvider,
  IBaseState,
  ICoreState,
  IDisplayType,
  IBaseProps,
  ICoreProps,
  IListBaseState,
  IProviderBase,
  IProviderItems,
  IProviderCore,
};

// Components
export * from './lib/components/index';

// system screens
export * from './lib/system_screens';

// navigation
export * from './lib/nav';

// heplers
export * from './lib/common/helper';

// UI
export * from './lib/common/UI';

// graphql schema
export * from './lib/services/graphqlSchema';

// redux store
export * from './lib/redux/store';
export * from './lib/redux/reduxCore';
export * from './lib/redux/actions/user';
export * from './lib/redux/reducers/User';

export { connect } from 'react-redux';
export { compose } from 'redux';
export type { Dispatch } from 'redux';
