import { Alert, Linking, Platform } from 'react-native';
import { fromPromise } from '@apollo/client';
import { store } from '../hocs/withRedux';
import { sign_out } from '../redux/actions/user';
import { USER_TOKEN, USER_ID } from 'nuudel-utils';
import { ApolloError } from '@apollo/client';
import { goToAuthScreen } from '../nav';
import gql from 'graphql-tag';
import UI from '../common/UI';
import { t } from 'nuudel-utils';

var debounce: any = null;
const signOut = async (client?: any) => {
  try {
    const token = await UI.getItem(USER_TOKEN);
    if (token) {
      await UI.removeItem(USER_TOKEN);
      await UI.removeItem(USER_ID);
      store.dispatch(sign_out());
      if (client) {
        client.resetStore();
        client.stop();
      }
      debounce = setTimeout(() => {
        clearTimeout(debounce);
        goToAuthScreen();
      }, 100);
    }
  } catch {}
};

const GET_TOKEN_QUERY = gql`
  query Refresh($refresh_token: String!) {
    refresh(refresh_token: $refresh_token) {
      _id
      token
      currency
      locale
      type
      status
      refreshToken
    }
  }
`;

export const getNewToken = async (client?: any) => {
  // need to replace refresh token
  const refresh_token = await UI.getItem(USER_TOKEN);
  return !client
    ? null
    : client.query({
        query: GET_TOKEN_QUERY,
        variables: { refresh_token },
      });
};

export const onErrors = ({
  graphQLErrors,
  networkError,
  operation,
  forward,
}): void | any => {
  if (graphQLErrors) {
    if (networkError.statusCode === 401) {
      signOut();
      return;
    }
    for (let e of graphQLErrors) {
      // handle errors differently based on its error code
      switch (e.extensions.code) {
        case 'UNAUTHENTICATED':
          signOut();
          return;
          // old token has expired throwing AuthenticationError,
          // one way to handle is to obtain a new token and
          // add it to the operation context
          return fromPromise(
            getNewToken()
              .then((response) => {
                // extract your accessToken from your response data and return it
                const { data } = response;
                if (data && data.refresh) {
                  return data.refresh.token;
                }
                return;
              })
              .catch((error) => {
                // Handle token refresh errors e.g clear stored tokens, redirect to login
                signOut();
                return;
              })
          )
            .filter((value) => Boolean(value))
            .flatMap((accessToken) => {
              const headers = operation.getContext().headers;
              // modify the operation context with a new token
              operation.setContext({
                headers: {
                  ...headers,
                  authorization: `Bearer ${accessToken}`,
                },
              });
              // retry the request, returning the new observable
              return forward(operation);
            });
          break;
        // handle other errors
        case 'INTERNAL_SERVER_ERROR':
          if (
            !!e.message &&
            e.message.toLowerCase().indexOf('access denied') >= 0
          ) {
            signOut();
            return;
          }
          break;
      }
    }
  }
};

export const clientError = async ({ errors }) => {
  if (
    typeof errors !== 'undefined' &&
    errors.length > 0 &&
    errors.filter(
      (e) =>
        (!!e.extensions &&
          e.extensions.code.toUpperCase() === 'UNAUTHENTICATED') ||
        (!!e.message && e.message.toLowerCase().indexOf('access denied') >= 0)
    ).length > 0
  ) {
    signOut();
  }
};

export const onError = (error: any) => {
  if (error instanceof ApolloError) {
    //graphQLErrors, networkError, message, extraInfo
    error =
      error.graphQLErrors.length > 0
        ? error.graphQLErrors[0].message
        : error.message;
  }
  return error;
};

let _debounce: any = undefined;
export const dialCall = (phone: string) => {
  if (__DEV__) {
    Alert.alert('number: ' + phone, '', [
      {
        text: t('Ok'),
        onPress: () => {},
      },
    ]);
  }
  if (!phone) {
    return;
  }
  let phoneNumber = phone;
  if (Platform.OS !== 'android') {
    phoneNumber = `telprompt:${phone}`;
  } else {
    phoneNumber = `tel:${phone}`;
  }
  if (!_debounce) {
    _debounce = setTimeout(() => {
      Linking.canOpenURL(phoneNumber)
        .then((supported) => {
          _debounce = undefined;
          if (!supported) {
            console.log('Phone number is not available');
          } else {
            Linking.openURL(phoneNumber);
          }
        })
        .catch((err) => {
          _debounce = undefined;
          console.log(err);
        });
    }, 100);
  }
  return _debounce;
};
