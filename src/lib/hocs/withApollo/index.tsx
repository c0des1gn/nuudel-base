import React, { ComponentType } from 'react';
import {
  ApolloClient,
  DefaultOptions,
  InMemoryCache,
  HttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ApolloProvider } from '@apollo/react-hooks';
import { UI, getURL } from '../../common/UI';
import { AppearanceProvider } from '../../common/AppearanceProvider';
import { ListFormService } from '../../services/ListFormService';
import { IListFormService } from '../../services/IListFormService';
import DataProvider from '../../common/DataProvider';
import IDataProvider from '../../common/IDataProvider';
import { Appearance, Platform } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import { GetSchema, URI } from '../../services/graphqlSchema';
import { setHost, URL } from 'nuudel-utils';
//import axios from 'axios';
//import { theme } from '../../theme';
//import {onErrors} from '../../common/helper';

const cache = new InMemoryCache({
  addTypename: false,
});

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
};

const customFetch = async (uri, options): Promise<Response> => {
  const res = await fetch(uri, options);
  //if (__DEV__) console.log('customFetch',options,  res);
  return res;
  /*
  return axios({
    url: uri,
    method: 'post',
    ...options,
    body: undefined,
    data: options.body,
  }); // */
};

var client: any = undefined;
export const createClient = (host?: string) => {
  let uri = getURL(),
    tmp_url = '';
  if (!!host) {
    tmp_url = uri;
    setHost(host);
    uri = URL;
  }
  if (uri === tmp_url && !!client) {
    return client;
  }
  let authLink = setContext(async (_, { headers }) => {
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        accept: 'application/json', // */*
        'content-type': 'application/json',
        ...(Platform.OS !== 'android'
          ? { 'Accept-Encoding': 'gzip, deflate, br' }
          : {}),
        ...headers,
        ...(await UI.headers()),
      },
    };
  });
  client = new ApolloClient({
    cache,
    link: authLink.concat(
      new HttpLink({
        uri: uri,
        //fetch: customFetch,
        //fetchOptions: {method: 'POST'},
        //headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        //credentials: 'include',
        //useGETForQueries: false,
        //includeExtensions: false,
      })
    ),
    defaultOptions: defaultOptions,
  });

  // reinit all provider
  if (uri !== URI || !ListFormService.schema) {
    GetSchema(uri)
      .then((sch) => {
        ListFormService.schema = sch;
      })
      .catch(() => {});
  }
  lfs = new ListFormService(client);
  _dataProvider = new DataProvider(lfs);

  return client;
};
//client = createClient();

export var lfs: IListFormService = null; //new ListFormService(client);
export var _dataProvider: IDataProvider = null; //new DataProvider(lfs);

const withApollo = (WrappedComponent: ComponentType | any) => (props: any) => {
  return (
    <AppearanceProvider>
      <ThemeProvider
        //theme={theme}
        useDark={Appearance.getColorScheme() === 'dark'}
      >
        <ApolloProvider client={client}>
          <WrappedComponent {...props} lfs={lfs} client={client} />
        </ApolloProvider>
      </ThemeProvider>
    </AppearanceProvider>
  );
};

export default withApollo;
