export { changeTheme } from './lib/theme';

// Service
import { ListFormService } from './lib/services/ListFormService';
import { IListFormService } from './lib/services/IListFormService';
import { GetSchema } from './lib/services/graphqlSchema';
import DetailForm from './lib/forms/DetailForm/DetailForm';
import { UI } from './lib/common/UI';
import { coreComponent } from './lib/common/coreComponent';
import DataProvider from './lib/common/DataProvider';

// Core
import {
  withRedux,
  withApollo,
  withContext,
  Context,
  initStore,
} from './lib/hocs/index';

export {
  withRedux,
  withApollo,
  withContext,
  Context,
  initStore,
  ListFormService,
  GetSchema,
  DetailForm,
  UI,
  coreComponent,
  DataProvider,
};

/**
 * Types exported by 'components/base'
 */
export type { IListFormService };

//@Components
export * from './lib/components/index';

//system screens
export * from './lib/system_screens';
