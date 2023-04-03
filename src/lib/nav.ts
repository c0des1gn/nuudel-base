import { UI } from './common/UI';
import { Navigation } from 'react-native-navigation';
import { USER_ID, USER_KEY } from 'nuudel-utils';
import {
  SIGN_IN_SCREEN,
  HOME_SCREEN,
  NOTIFICATION_SCREEN,
  UNIVERSAL_SCREEN,
  PRODUCT_SCREEN,
  SEARCH_SCREEN,
} from './system_screens';
import { setRoot } from './services/navigation';

export const goToAuthScreen = async (
  guestlogin: boolean = false,
  autologin: boolean = false,
  SCREEN: any = SIGN_IN_SCREEN,
  options?: any
) => {
  if (options) {
    Navigation.setDefaultOptions(options);
  }
  let username = await UI.getItem(USER_KEY);
  if (!username) {
    username = '';
  }
  setRoot('stack', SCREEN.id, [
    {
      component: {
        name: SCREEN.name,
        passProps: { autologin, username, showGuestBtn: guestlogin },
      },
    },
  ]);
};

export const handleModal = async (componentId?: string) => {
  let username = await UI.getItem(USER_KEY);
  if (!username) {
    username = '';
  }
  NavigationShowModal({
    stack: {
      children: [
        {
          component: {
            id: SIGN_IN_SCREEN.id,
            name: SIGN_IN_SCREEN.name,
            passProps: {
              autologin: false,
              username,
              showGuestBtn: false,
              isModal: true,
              //componentId: componentId,
            },
          },
        },
      ],
    },
  });
};

var _debounce: any = undefined;
export const fastClick = (
  layout: any,
  componentId?: string,
  isStackRoot: boolean = false
) => {
  if (!_debounce) {
    if (isStackRoot && componentId) {
      Navigation.setStackRoot(componentId, layout).then(() => {
        if (layout?.component?.id) {
          UI.setRootComponentId(layout.component.id);
        }
      });
    } else if (componentId) {
      Navigation.push(componentId, layout);
    } else {
      Navigation.showModal(layout);
    }
  } else {
    clearTimeout(_debounce);
  }
  _debounce = setTimeout(() => {
    _debounce = undefined;
  }, 1200);
};

export const NavigationShowModal = (layout: any) => {
  fastClick(layout);
};

export const NavigationPush = async (
  componentId: string,
  layout: any,
  isStackRoot: boolean = false
) => {
  if (!(await UI.getItem(USER_ID))) {
    switch (layout.component.name) {
      case UNIVERSAL_SCREEN.name:
      case HOME_SCREEN.name:
      case SIGN_IN_SCREEN.name:
      case NOTIFICATION_SCREEN.name:
      case PRODUCT_SCREEN.name:
      case SEARCH_SCREEN.name:
        fastClick(layout, componentId, isStackRoot);
        break;
      default:
        handleModal(componentId);
        break;
    }
    return;
  }
  fastClick(layout, componentId, isStackRoot);
};
