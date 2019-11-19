// base
import { createReducer } from 'typesafe-actions';
import { produce } from 'immer';

// actions
import {
  AccountAction,
  GET_ACCOUNTS_SUCCESS,
  GET_ACCOUNT_DETAIL_SUCCESS,
  GET_ACCOUNT_ORDERS_SUCCESS,
} from '../action/account.action';

// models
import {
  ResponseAccounts,
  ResponseDetailAccount,
  PageWrapper,
  Indexable,
  ResponseOrdersForAccount,
} from 'models';
import { SocialProviderCode } from '../../enums';

export interface AccountState extends Indexable {
  accounts: PageWrapper<ResponseAccounts>;
  accountDetail:ResponseDetailAccount;
  accountOrders:ResponseOrdersForAccount;
}

const initialState: AccountState = {

  accounts: {
    content: [],
    first: false,
    last: false,
    totalElements: 0,
    totalPages: 0,
    page: 0,
    size: 10,
  },
  accountDetail:{
    consumerId: '',
    created: '',
    loginId: '',
    username: '',
    phone: '',
    email: '',
    socialProvider: SocialProviderCode.미연동,
    marketingInfoAgree : false,
  },
  accountOrders:{
    totalOrderCompleteAmount: 0,
    username: '',
    loginId: '',
    orders: {
      content: [],
      first: false,
      last: false,
      totalElements: 0,
      totalPages: 0,
      page: 0,
      size: 10,
    },
  },
};

export default createReducer<AccountState, AccountAction>(initialState, {
  [GET_ACCOUNTS_SUCCESS]: (state, action) =>
    produce(state, draft => {
     draft.accounts = action.payload;
    }
  ),

  [GET_ACCOUNT_DETAIL_SUCCESS]: (state, action) =>
    produce(state, draft => {
      draft.accountDetail = action.payload;
    }
  ),

  [GET_ACCOUNT_ORDERS_SUCCESS]: (state, action) =>
    produce(state, draft => {
      draft.accountOrders = action.payload;
    }
  )
});


