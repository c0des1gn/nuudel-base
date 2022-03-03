import {
  ACTION_EMPTY_CART_ITEM,
  ACTION_ADD_CART_ITEM,
  ACTION_REMOVE_CART_ITEM,
  ACTION_RELOAD_CART_ITEMS,
  ACTION_UPDATE_CART_ITEM_QTY,
  ACTION_INSERT_CART_ITEM_COMMENT,
} from '../constants';

interface ICart {
  items: ICartItem[];
  userId: string;
}

interface ICartItem {
  _id?: string;
  comments?: string;
  _userId?: string;
  _condition: string;
  _attributes: string[];
  _max: number;
  _min: number;
  _seller: string;
  _available: boolean;
  _taxincluded: boolean;
  _shippingtaxed?: boolean;
  _itemlink: string;
  _estimate: number;
  item: any; // product
}

const DEFAULT_CART: ICart = {
  items: [],
  userId: '',
};

const cart = (state = DEFAULT_CART, action) => {
  switch (action.type) {
    case ACTION_EMPTY_CART_ITEM:
      return {
        ...state,
        items: [],
        userId: action.payload,
      };
    case ACTION_RELOAD_CART_ITEMS:
      return {
        items: action.payload.items,
        userId: action.payload.userId,
      };
    case ACTION_ADD_CART_ITEM:
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case ACTION_UPDATE_CART_ITEM_QTY:
      return {
        ...state,
        items: state.items.map((item: ICartItem) => {
          if (item._id === action.payload.id) {
            item.item.qty = action.payload.qty;
          }
          return item;
        }),
      };

    case ACTION_INSERT_CART_ITEM_COMMENT:
      return {
        ...state,
        items: state.items.map((item: ICartItem) => {
          if (item._id === action.payload.id) {
            item.comments = action.payload.comment;
          }
          return item;
        }),
      };
    case ACTION_REMOVE_CART_ITEM:
      return {
        ...state,
        items: state.items.filter(
          (item: any) => item._id !== action.payload._id
        ),
      };
    default:
      return state;
  }
};

export default cart;
