import { DisplayType } from 'nuudel-utils';
import { t } from 'nuudel-utils';

const unionBy = (a, b) => {
  b.forEach((item) => {
    let index = a.findIndex((itm) => itm.field === item.field);
    if (index >= 0) {
      a[index] = item;
    } else {
      a.push(item);
    }
  });
  return a;
};

export const getRegex = (listname: string) => {
  let fields: any[] = [];

  if (listname === 'Address') {
    fields = unionBy(
      [],
      [
        {
          field: 'firstname',
          type: DisplayType.Requared,
          MaxLength: 60,
        },
        {
          field: 'lastname',
          type: DisplayType.Requared,
          MaxLength: 60,
        },
        {
          field: 'address1',
          type: DisplayType.Requared,
          MaxLength: 100,
        },
        {
          field: 'address2',
          type: DisplayType.Optional,
          MaxLength: 50,
        },
        {
          field: 'street',
          type: DisplayType.Optional,
          MaxLength: 30,
        },
        {
          field: 'district',
          type: DisplayType.Requared,
          MaxLength: 20,
        },
        {
          field: 'city',
          type: DisplayType.Requared,
          MaxLength: 20,
        },
        {
          field: 'zipcode',
          type: DisplayType.Requared,
          regex: /^\d{5}$/,
          prompt: t('number only'),
          MaxLength: 5,
        },
        {
          field: 'register',
          type: DisplayType.Requared,
          regex:
            /^(([a-zA-Z]{2,3}|[а-яА-ЯөӨүҮёЁ]{2})\d{8}\s{0,1})$|^\d{7}\s{0,4}$/u, // /^(([a-zA-Z]{2,3}|[а-яА-ЯөӨүҮёЁ]{2})\d{8})$|^\d{7}$/u,
          MaxLength: 11,
        },
        {
          field: 'phone',
          type: DisplayType.Requared,
          regex: /^[1-9]\d{7}$/,
          prompt: t('number only'),
          MaxLength: 8,
        },
        {
          field: 'mobile',
          type: DisplayType.Optional,
          regex: /^[1-9]\d{7}$|^$/,
          prompt: t('number only'),
          MaxLength: 8,
        },
        {
          field: 'country',
          type: DisplayType.Optional,
          DefaultValue: 'Mongolia',
        },
      ]
    );
  } else if (listname === 'Account') {
    fields = [
      {
        field: 'accountInfo.account',
        type: DisplayType.Requared,
        regex: /^[1-9]\d+$/,
        prompt: t('number only'),
        MaxLength: 20,
      },
    ];
  } else if (listname === 'User') {
    fields = [
      {
        field: 'firstname',
        type: DisplayType.Requared,
        MaxLength: 60,
      },
      {
        field: 'lastname',
        type: DisplayType.Requared,
        MaxLength: 60,
      },
      {
        field: 'phone',
        type: DisplayType.Optional,
        regex: /^[1-9]\d{7}$|^$/,
        prompt: t('number only'),
        MaxLength: 8,
      },
      {
        field: 'mobile',
        type: DisplayType.Optional,
        regex: /^[1-9]\d{7}$|^$/,
        prompt: t('number only'),
        MaxLength: 8,
      },
    ];
  }
  return fields;
};
