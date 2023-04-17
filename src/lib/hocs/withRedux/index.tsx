import React, { ComponentType } from 'react';
import { Provider } from 'react-redux';
import { createStore } from '../../redux/store/';
import { sign_in, updateProp } from '../../redux/actions/user';
import { initialState } from '../../redux/reducers/User';
import { I8, changeLanguage } from '../../loc/i18n';
import UI from '../../common/UI';
import { USER_TOKEN, USER_ID, Language } from 'nuudel-utils';

export const store = createStore();

export const initStore = async (lfs, user: any = undefined) => {
  const state = store.getState();
  if (typeof state.user === 'undefined' || !state.user.token) {
    const userId = await UI.getItem(USER_ID);
    const token = await UI.getItem(USER_TOKEN);
    if (userId !== null) {
      let usr: any = state.user || initialState;
      if (userId) {
        if (!user) {
          user = await lfs.itemById('User', userId, [], {
            fetchPolicy: 'network-only', // Used for first execution
            nextFetchPolicy: 'cache-first', // Used for subsequent executions
          });
        }
        usr = {
          ...usr,
          type: user?.type || usr?.type || 'Guest',
          currency:
            (!user?.settings ? usr?.currency : user.settings.currency) || 'MNT',
          locale:
            (!user?.settings ? usr?.locale : user.settings.locale) || 'mn-MN',
          status: user?._status || usr?.status || 'Active',
        };
      }
      const locale =
        (!usr?.locale
          ? undefined
          : usr?.locale.includes('-')
          ? usr.locale
          : Language[usr.locale]) || 'mn-MN';
      if (I8.language !== locale) {
        changeLanguage(locale);
      }
      store.dispatch(
        sign_in({
          userId: userId,
          currency: usr.currency,
          locale: locale,
          token: token,
          type: usr.type,
          status: usr.status,
        })
      );
    } else if (typeof state.user === 'undefined') {
      store.dispatch(
        sign_in({
          userId: userId,
          token: token,
        })
      );
    } else if (!state.user.token) {
      store.dispatch(updateProp('token', token));
    }
  }
};

export const withRedux = (WrappedComponent: ComponentType) => (props: any) =>
  (
    <Provider store={store}>
      <WrappedComponent {...props} />
    </Provider>
  );

export default withRedux;
