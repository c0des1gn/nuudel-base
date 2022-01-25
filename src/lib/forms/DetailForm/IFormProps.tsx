import { ICoreProps } from '../../common/ICoreProps';
import { Permission } from 'nuudel-utils';

export interface IFormProps extends ICoreProps {
  componentId: string;
  permission: Permission;
}
