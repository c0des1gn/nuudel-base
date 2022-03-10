import I8 from 'i18next';
import en from './en-US.json';
import mn from './mn-MN.json';

const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  'en-US': () => en,
  'mn-MN': () => mn,
};
const defaultLocale = 'mn-MN';

const changeLanguage = (languageTag: string = defaultLocale) => {
  return I8.changeLanguage(languageTag);
};

if (!I8.isInitialized) {
  I8.init({
    compatibilityJSON: 'v3',
    lng: defaultLocale,
    debug: __DEV__,
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
  }).then(() => {
    I8.isInitialized = false;
  });
}

const t = (key: string, options?: any): string => {
  return I8.t(key, options);
};

export { I8, t, changeLanguage };
