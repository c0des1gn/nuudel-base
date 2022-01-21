import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Dimensions,
  Platform,
  PlatformIOSStatic,
  DevSettings,
  BackHandler,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { NetInfoState } from '@react-native-community/netinfo';
import CONF, {
  USER_TOKEN,
  USER_KEY,
  INIT_DATA,
  setHost,
  domainFixer,
  pathname,
} from 'nuudel-utils';
//import PushNotification from 'react-native-push-notification';
//import CodePush from 'react-native-code-push';

const IDevices = {
  'iPhone5,1': 'iPhone5',
  'iPhone5,2': 'iPhone5',
  'iPhone5,3': 'iPhone5C',
  'iPhone5,4': 'iPhone5C',
  'iPhone6,1': 'iPhone5S',
  'iPhone6,2': 'iPhone5S',
  'iPhone7,1': 'iPhone6 Plus',
  'iPhone7,2': 'iPhone6',
  'iPhone8,1': 'iPhone6s',
  'iPhone8,2': 'iPhone6s Plus',
  'iPhone8,4': 'iPhoneSE',
  'iPhone9,1': 'iPhone7',
  'iPhone9,2': 'iPhone7 Plus',
  'iPhone9,3': 'iPhone7',
  'iPhone9,4': 'iPhone7 Plus',
  'iPhone10,1': 'iPhone8',
  'iPhone10,2': 'iPhone8 Plus',
  'iPhone10,3': 'iPhoneX',
  'iPhone10,4': 'iPhone8',
  'iPhone10,5': 'iPhone8 Plus',
  'iPhone10,6': 'iPhoneX',
  'iPhone11,2': 'iPhoneXS',
  'iPhone11,4': 'iPhoneXS Max',
  'iPhone11,6': 'iPhoneXS Max',
  'iPhone11,8': 'iPhoneXR',
  'iPhone12,1': 'iPhone11',
  'iPhone12,3': 'iPhone11 Pro',
  'iPhone12,5': 'iPhone11 Pro Max',
  'iPhone12,8': 'iPhoneSE 2nd Gen',
  'iPhone13,1': 'iPhone 12 Mini',
  'iPhone13,2': 'iPhone 12',
  'iPhone13,3': 'iPhone 12 Pro',
  'iPhone13,4': 'iPhone 12 Pro Max',
};

export const DeviceId = {
  uniqueId: DeviceInfo.getUniqueId(),
  deviceId: DeviceInfo.getDeviceId(),
  brand: DeviceInfo.getBrand(),
  os: Platform.OS,
  osVersion: DeviceInfo.getSystemVersion(),
  isTablet: DeviceInfo.isTablet(),
  //version: DeviceInfo.getVersion(),
  device:
    Platform.OS === 'ios'
      ? IDevices.hasOwnProperty(DeviceInfo.getDeviceId())
        ? IDevices[DeviceInfo.getDeviceId()]
        : DeviceInfo.getDeviceId()
      : DeviceInfo.getDeviceId(),
};

export const isIpad =
  Platform.OS === 'ios' && (Platform as PlatformIOSStatic).isPad;
export const { width, height } = Dimensions.get('window');

export const getHost = async (): Promise<string> => {
  let domain = '';
  const username = await UI.getItem(USER_KEY);
  if (__DEV__ || username?.includes('@')) {
    domain = domainFixer(username?.split('@').pop());
    let data = await UI.getItem(INIT_DATA);
    let r = JSON.parse(data || '{}');
    if (r?.getAllConfig && r.getAllConfig?.length > 0) {
      const _conf = {
        ...CONF,
        minVersion: r.getAllConfig[0].minVersion || '1.0.0',
        active: r.getAllConfig[0].active,
        site_title: r.getAllConfig[0].site_title,
        site_description: r.getAllConfig[0].site_description,
        site_keywords: r.getAllConfig[0].site_keywords,
        posts_per_page: r.getAllConfig[0].posts_per_page,
        logo: r.getAllConfig[0].logo,
        location: r.getAllConfig[0].location,
        web: r.getAllConfig[0].web,
        phone: r.getAllConfig[0].phone,
        base_url: __DEV__ ? r.getAllConfig[0].base_url : `https://${domain}`,
      };
      setHost(_conf.base_url);
    }
  }
  return domain;
};

export const makeUrl = (
  domain?: string,
  URL = '',
  protocol = 'https',
  port?: number
) => {
  if (!domain?.includes('.')) {
    return URL;
  }
  return `${protocol}://${domain}${!port ? '' : ':' + port}/${pathname}`;
};

export class UI {
  public static ComponentId = (): Promise<string | null> => {
    return AsyncStorage.getItem('componentId');
  };

  public static setComponentId = async (componentId: any) => {
    const srcComponentId = await UI.ComponentId();
    if (srcComponentId) {
      AsyncStorage.setItem('srcComponentId', srcComponentId);
      AsyncStorage.setItem('dstComponentId', componentId);
    }
    AsyncStorage.setItem('componentId', componentId);
  };

  public static setRootComponentId = async (componentId: any) => {
    //if ( ['Home', 'List', 'Notification', 'MyAccount', 'Universal', 'Camera'].includes( componentId ) ) {
    AsyncStorage.setItem('rootComponentId', componentId);
    //}
  };

  public static rootComponentId = (): Promise<string | null> => {
    return AsyncStorage.getItem('rootComponentId');
  };

  public static srcComponentId = (): Promise<string | null> => {
    return AsyncStorage.getItem('srcComponentId');
  };

  public static dstComponentId = (): Promise<string | null> => {
    return AsyncStorage.getItem('dstComponentId');
  };

  public static IsConnected = async (): Promise<boolean> => {
    return 'true' === (await AsyncStorage.getItem('isConnected'));
  };

  public static setConnected = (state: boolean | NetInfoState) => {
    let connected: boolean;
    if (typeof state === 'boolean') {
      connected = state;
    } else {
      connected =
        state.isInternetReachable === null
          ? state.isConnected
            ? ['none', 'unknown'].indexOf(state.type) < 0
            : false
          : state.isInternetReachable;
    }
    AsyncStorage.setItem('isConnected', !connected ? 'false' : 'true');
  };

  public static getItem = (
    key: string,
    callback?: (error?: Error, result?: string) => void
  ): Promise<string | null> => {
    return AsyncStorage.getItem(key, callback);
  };

  public static setItem = (
    key: string,
    value: string,
    callback?: (error?: Error) => void
  ): Promise<void> => {
    return AsyncStorage.setItem(key, value, callback);
  };

  public static removeItem = (
    key: string,
    callback?: (error?: Error) => void
  ): Promise<void> => {
    return AsyncStorage.removeItem(key, callback);
  };

  public static restartApp(onlyIfUpdateIsPending = false) {
    //Unregister for all remote notifications received via Apple Push Notification service.
    //PushNotification.abandonPermissions();
    if (__DEV__) {
      DevSettings.reload();
    } else {
      //CodePush.restartApp();
      BackHandler.exitApp();
    }
  }

  public static async headers() {
    // get the authentication token from local storage if it exists
    const token = await UI.getItem(USER_TOKEN);
    // return the headers object
    return {
      Authorization: token ? `Bearer ${token}` : '',
      deviceuniqid: DeviceId.uniqueId + '|' + DeviceId.device,
    };
  }
}

export default UI;
