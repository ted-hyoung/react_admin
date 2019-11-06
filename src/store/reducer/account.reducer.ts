// base
import { createReducer } from 'typesafe-actions';
import { produce } from 'immer';

// actions
import {
  AccountAction,
  GET_ACCOUNTS_SUCCESS,
  getAccountsAsync,
} from '../action/account.action';

// models
import {
  ResponseAccounts,
  PageWrapper,
  Indexable,
} from 'models';

export interface AccountState extends Indexable {
  accounts: PageWrapper<ResponseAccounts>;
}

const initialState: AccountState = {

  accounts: {
    content: [],
    first: false,
    last: false,
    totalElements: 0,
    totalPages: 0,
    page: 0,
    size: 0,
  }
};

export default createReducer<AccountState, AccountAction>(initialState, {
  [GET_ACCOUNTS_SUCCESS]: (state, action) =>
    produce(state, draft => {
     draft.accounts = action.payload;
    })
});
