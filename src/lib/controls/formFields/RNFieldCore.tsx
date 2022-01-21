import { IRootState } from '../../redux/store';
import { IRNFormFieldProps } from './RNFormField';
import { getValue, addField, changeProp } from '../../redux/actions/fields';
import { getFieldByName } from '../../redux/selector';
import { ControlMode, DisplayType } from 'nuudel-utils';

export const storeProps = (props: IRNFormFieldProps | any) => {
  return {
    disabled:
      getFieldByName(props.store, props.fieldSchema.InternalName).type ===
      DisplayType.Disabled,
  };
};

export const mapStateToProps = (state: IRootState) => {
  const fields = state.fields;
  return { store: { fields } };
};

export const mapDispatchToProps: any = (dispatch) => ({
  getValue,
  addField,
});
