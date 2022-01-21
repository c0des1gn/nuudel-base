import React, { ComponentType, useState } from 'react';
import {
  ApolloClient,
  DefaultOptions,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ApolloProvider } from '@apollo/react-hooks';
import UI from '../../common/UI';
import { URL, setHost } from 'nuudel-utils';
import { AppearanceProvider } from '../../common/AppearanceProvider';
import { ListFormService } from '../../services/ListFormService';
import { IListFormService } from '../../services/IListFormService';
import DataProvider from '../../common/DataProvider';
import IDataProvider from '../../common/IDataProvider';
import { Appearance } from 'react-native';
//import {onErrors} from '../../common/helper';
import { ThemeProvider } from 'react-native-elements';
import { theme } from '../../theme';
import { GetSchema, URI } from '../../services/graphqlSchema';

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

var client: any = undefined;
export const createClient = (domain?: string) => {
  let uri = URL;
  if (domain?.includes('.') && client) {
    client = undefined;
    uri = setHost(`https://${domain}`);
  } else {
    uri = setHost();
    // for no login with token user
    if (typeof domain === 'string') {
      client = undefined;
    }
  }

  if (client) {
    return client;
  }
  let authLink = setContext(async (_, { headers }) => {
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        'Accept-Encoding': 'gzip, deflate, br',
        ...(await UI.headers()),
      },
    };
  });
  client = new ApolloClient({
    cache,
    link: authLink.concat(
      new HttpLink({
        uri: uri,
      })
    ),
    defaultOptions: defaultOptions,
  });

  // reinit all provider
  if (typeof domain === 'string') {
    if (URI !== URL) {
      GetSchema(uri)
        .then((sch) => {
          ListFormService.schema = sch;
        })
        .catch(() => {});
    }
    lfs = new ListFormService(client);
    _dataProvider = new DataProvider(lfs);
  }
  return client;
};
client = createClient();

export var lfs: IListFormService = new ListFormService(client);
export var _dataProvider: IDataProvider = new DataProvider(lfs);

const withApollo = (WrappedComponent: ComponentType | any) => (props: any) => {
  /*
  const [iclient, setClient] = useState(createClient());
  const handleNewClient = () => {
    if (iclient) {
      iclient.clearStore();
    }
    client = createClient();
    setClient(client);
  }; // */
  return (
    <AppearanceProvider>
      <ThemeProvider
        theme={theme}
        useDark={Appearance.getColorScheme() === 'dark'}
      >
        <ApolloProvider client={client}>
          <WrappedComponent {...props} lfs={lfs} client={client} />
        </ApolloProvider>
      </ThemeProvider>
    </AppearanceProvider>
  );
};

//withApollo.reInit = (uri: string) => createClient(uri);

export default withApollo;
