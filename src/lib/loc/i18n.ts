import I8 from 'i18next';
import { initReactI18next } from 'react-i18next';
import { USER_LANG } from 'nuudel-utils';
import memoize from 'lodash.memoize';
import en from './en-US.json';
import mn from './mn-MN.json';

const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  'en-US': () => en,
  'mn-MN': () => mn,
};
const defaultLocale = 'mn-MN';

const translate = memoize(
  (key, config) => I8.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key)
);

const changeLanguage = (
  languageTag: string = defaultLocale,
  refresh: boolean = true,
  cb?: Function
) => {
  // clear translation cache
  translate.cache.clear();
  //UI.setItem(USER_LANG, languageTag);
  if (cb) {
    cb(USER_LANG, languageTag);
  }

  I8.changeLanguage(languageTag).then((t) => {
    if (refresh) {
    }
  });
};

if (!I8.isInitialized) {
  I8.use(initReactI18next).init({
    lng: defaultLocale,
    //debug: true,
    keySeparator: '.',
    fallbackLng: 'mn-MN',
    ns: ['translations'],
    defaultNS: 'translations',
    resources: {
      ['mn-MN']: { translations: translationGetters['mn-MN']() },
      ['en-US']: { translations: translationGetters['en-US']() },
    },
    interpolation: {
      escapeValue: false,
      formatSeparator: ',',
    },
    //updateMissing: false,
    //missingKeyNoValueFallbackToKey: true,
    parseMissingKeyHandler: function (key) {
      return !key || typeof key !== 'string' ? '' : key.split('.').pop() + '';
    },
    //react: { wait: true },
  });
}

const setTranslate = (translate: Function) => {
  reTranslate = translate;
};

let reTranslate: Function = undefined;
const t = (key: string, options?: any): string => {
  if (reTranslate && typeof reTranslate === 'function') {
    return reTranslate(key, options);
  }
  return translate(key, options);
};

export { I8, t, setTranslate, defaultLocale, changeLanguage };
//export default I8;
