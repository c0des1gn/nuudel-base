import { IRootState } from './store';
import { updateProp, updateProps, sign_out, sign_in } from './actions/user';
import * as CONST from './constants';
import { getFieldByName } from './selector';

export const mapStateToProps: any = (state: any) => {
  return { store: state };
};

export const mapDispatchToProps: any = (dispatch) => ({
  updateProp: (prop: string, value) => {
    updateProp(prop, value, dispatch);
  },
  updateProps: (obj: any) => {
    updateProps(obj, dispatch);
  },
  sign_in: (obj) => {
    sign_in(obj, dispatch);
  },
  sign_out: () => {
    sign_out(dispatch);
  },
});
