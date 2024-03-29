import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Dimensions,
  Platform,
  PlatformIOSStatic,
  DevSettings,
  BackHandler,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import {
  USER_TOKEN,
  USER_KEY,
  INIT_DATA,
  domainFixer,
  HOST,
  URL,
} from 'nuudel-utils';
//import PushNotification from 'react-native-push-notification';
//import CodePush from 'react-native-code-push';

const IDevices = {
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
  'iPhone14,2': 'iPhone 13 Pro',
  'iPhone14,3': 'iPhone 13 Pro Max',
  'iPhone14,4': 'iPhone 13 Mini',
  'iPhone14,5': 'iPhone 13',
  'iPhone14,6': 'iPhone SE 3rd Gen',
  'iPhone14,7': 'iPhone 14',
  'iPhone14,8': 'iPhone 14 Plus',
  'iPhone15,2': 'iPhone 14 Pro',
  'iPhone15,3': 'iPhone 14 Pro Max',
  'iPhone15,4': 'iPhone 15',
  'iPhone15,5': 'iPhone 15 Plus',
  'iPhone16,1': 'iPhone 15 Pro',
  'iPhone16,2': 'iPhone 15 Pro Max',
};

export var DeviceId = {
  uniqueId: '', //await DeviceInfo.getUniqueId()
  deviceId: DeviceInfo.getDeviceId(),
  brand: DeviceInfo.getBrand(),
  os: Platform.OS,
  osVersion: DeviceInfo.getSystemVersion(),
  isTablet: DeviceInfo.isTablet(),
  version: DeviceInfo.getVersion(),
  buildNumber: DeviceInfo.getBuildNumber(),
  device:
    Platform.OS === 'ios'
      ? IDevices.hasOwnProperty(DeviceInfo.getDeviceId())
        ? IDevices[DeviceInfo.getDeviceId()]
        : DeviceInfo.getDeviceId()
      : DeviceInfo.getDeviceId(),
};

DeviceInfo.getUniqueId().then((UID: string) => {
  DeviceId.uniqueId = UID;
});

export const isIpad =
  Platform.OS === 'ios' && (Platform as PlatformIOSStatic).isPad;
export const { width, height } = Dimensions.get('window');

export const getHost = async (): Promise<string> => {
  let host: string = undefined;
  const username = await UI.getItem(USER_KEY);
  if (__DEV__ || username?.includes('@')) {
    let domain = domainFixer(username?.split('@').pop());
    host = makeHost(domain);
    let data = await UI.getItem(INIT_DATA);
    let r: any = {};
    try {
      r = JSON.parse(data || '{}');
    } catch {}
    if (r?.getAllConfig && r.getAllConfig?.length > 0) {
      host =
        __DEV__ && Platform.OS === 'ios' ? r.getAllConfig[0].base_url : host;
    }
  }
  return host;
};

export const makeHost = (
  domain: string,
  protocol = 'https',
  port: string = ''
) => {
  if (!domain?.includes('.')) {
    return HOST;
  }
  return `${protocol}://${domain}${!port ? '' : port}`;
};

export const getURL = (): string => {
  return URL;
};

export class UI {
  public static ComponentId = (): Promise<string | null> => {
    return UI.getItem('componentId');
  };

  public static setComponentId = async (
    componentId: any,
    back: boolean = false
  ) => {
    const srcComponentId = await UI.ComponentId();
    if (srcComponentId) {
      if (!back) {
        const dstComponentId = await UI.srcComponentId();
        UI.setItem('srcComponentId', srcComponentId);
        UI.setItem('dstComponentId', dstComponentId);
      } else {
        UI.setItem('srcComponentId', await UI.dstComponentId());
        UI.removeItem('dstComponentId');
      }
    }
    UI.setItem('componentId', componentId);
  };

  public static setRootComponentId = async (componentId: any) => {
    //if ( ['Home', 'List', 'Notification', 'MyAccount', 'Universal', 'Camera'].includes( componentId ) ) {
    UI.setItem('rootComponentId', componentId);
    //}
  };

  public static rootComponentId = (): Promise<string | null> => {
    return UI.getItem('rootComponentId');
  };

  public static srcComponentId = (): Promise<string | null> => {
    return UI.getItem('srcComponentId');
  };

  public static dstComponentId = (): Promise<string | null> => {
    return UI.getItem('dstComponentId');
  };

  public static IsConnected = async (): Promise<boolean> => {
    return 'true' === (await UI.getItem('isConnected'));
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
    UI.setItem('isConnected', !connected ? 'false' : 'true');
  };

  public static getItem = (
    key: string,
    callback?: (error?: Error | null, result?: string | null) => void
  ): Promise<string | null> => {
    return AsyncStorage.getItem(key, callback);
  };

  public static setItem = (
    key: string,
    value: string | null,
    callback?: (error?: Error | null) => void
  ): Promise<void> => {
    if (!value) {
      return AsyncStorage.removeItem(key, callback);
    }
    return AsyncStorage.setItem(key, value, callback);
  };

  public static removeItem = (
    key: string,
    callback?: (error?: Error | null) => void
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
    const token: string | null = await UI.getItem(USER_TOKEN);
    // return the headers object
    return {
      ...(!token ? {} : { Authorization: `Bearer ${token}` }),
      ...(Platform.OS !== 'android'
        ? { 'Accept-Encoding': 'gzip, deflate, br' }
        : {}),
      deviceuniqid: DeviceId?.uniqueId + '|' + DeviceId?.device,
    };
  }
}

export { NetInfo };
export default UI;
