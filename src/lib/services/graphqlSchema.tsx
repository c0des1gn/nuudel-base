import {
  getIntrospectionQuery,
  printSchema,
  buildSchema,
  buildClientSchema,
  GraphQLSchema,
} from 'graphql';
import { UI } from '../common/UI';
import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { HttpClient, USER_KEY, USER_TOKEN } from 'nuudel-utils';
import { t } from '../loc/i18n';

var alertPresent: boolean = false;
var debounce: any = undefined;
const checkSchema = () => {
  NetInfo.fetch().then(async (state) => {
    let msg: string = '';
    //const wasConnected: boolean = await UI.IsConnected();
    const connected =
      state.isInternetReachable === null
        ? state.isConnected
          ? ['none', 'unknown'].indexOf(state.type) < 0
          : false
        : state.isInternetReachable;
    UI.setConnected(connected);
    if (!connected) {
      msg = t('NoInternet');
    } else {
      msg = t('NoConnection');
      const username = await UI.getItem(USER_KEY);
      const token = await UI.getItem(USER_TOKEN);
      if (!token || !username) {
        alertPresent = true;
      }
    }
    if (!alertPresent) {
      alertPresent = true;
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        try {
          Alert.alert(
            '',
            msg,
            [
              {
                text: t('Okay'),
                onPress: () => {
                  alertPresent = false;
                  //if (!schema)
                  UI.restartApp();
                },
              },
            ],
            { cancelable: false }
          );
          debounce = undefined;
        } catch {}
      }, 1000);
    }
  });
};

export var URI: string = '';
export const GetSchema = async (url: string): Promise<GraphQLSchema | null> => {
  let clientSchema: GraphQLSchema | null = null;
  URI = url;
  try {
    const json = await HttpClient(url, {
      method: 'POST',
      //mode: 'no-cors',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate, br',
        'Content-Type': 'application/json',
        ...(await UI.headers()),
      },
      body: JSON.stringify({ query: getIntrospectionQuery() }),
    });
    clientSchema = buildClientSchema(json.data);
  } catch (error) {
    checkSchema();
    return Promise.reject(error); // end server untarsan ued ajillah zuils hiine
  } finally {
    URI = '';
  }
  return clientSchema;
};

export const printschema = (SchemaObj: any) => {
  return printSchema(SchemaObj);
};

export const buildschema = (sdlSchema: any) => {
  return buildSchema(sdlSchema);
};

export default GetSchema;
