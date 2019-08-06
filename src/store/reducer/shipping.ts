// base
import produce from 'immer';

// actions
import * as Actions from 'store/action/shippingAction';
import { createAsyncAction } from 'typesafe-actions';

// types
import { ResponseAsyncAction, PageWrapper, RequestAsyncAction, ErrorAsyncAction } from 'types';
import { ResponseShipping } from 'types/Shipping';
import { ShippingStatus } from 'enums';

// types
export interface ShippingState {
  shipping: PageWrapper<ResponseShipping>;
  shippingExcel: ResponseShipping[];
}

export const getShippingAsync = createAsyncAction(
  Actions.GET_SHIPPING_REQUEST,
  Actions.GET_SHIPPING_SUCCESS,
  Actions.GET_SHIPPING_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

export const updateShippingAsync = createAsyncAction(
  Actions.UPDATE_SHIPPING_REQUEST,
  Actions.UPDATE_SHIPPING_SUCCESS,
  Actions.UPDATE_SHIPPING_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

export const updateShippingStatusAsync = createAsyncAction(
  Actions.UPDATE_SHIPPING_STATUS_REQUEST,
  Actions.UPDATE_SHIPPING_STATUS_SUCCESS,
  Actions.UPDATE_SHIPPING_STATUS_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

export const getShippingExcelAsync = createAsyncAction(
  Actions.GET_SHIPPING_EXCEL_REQUEST,
  Actions.GET_SHIPPING_EXCEL_SUCCESS,
  Actions.GET_SHIPPING_EXCEL_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

export const updateExcelInvoiceAsync = createAsyncAction(
  Actions.UPDATE_EXCEL_INVOICE_REQUEST,
  Actions.UPDATE_EXCEL_INVOICE_SUCCESS,
  Actions.UPDATE_EXCEL_INVOICE_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

const initialState: ShippingState = {
  shipping: {
    content: [],
    first: false,
    last: false,
    totalElements: 0,
    totalPages: 0,
    page: 0,
    size: 10,
  },
  shippingExcel: [],
};

const shipping = (state = initialState, action: ResponseAsyncAction) => {
  switch (action.type) {
    case Actions.GET_SHIPPING_SUCCESS: {
      return produce(state, draft => {
        // const { page, content, last, totalElements } = action.payload;
        draft.shipping = action.payload;
      });
    }
    case Actions.GET_SHIPPING_EXCEL_SUCCESS: {
      return produce(state, draft => {
        draft.shippingExcel = action.payload;
      });
    }
    case Actions.UPDATE_SHIPPING_SUCCESS: {
      return produce(state, draft => {
        const { shippingId, invoice } = action.payload;
        const item = draft.shipping.content.find(item => item.shippingId === shippingId);

        if (item) {
          item.invoice = invoice;
          item.shippingStatus = invoice
            ? ShippingStatus[ShippingStatus.IN_PROGRESS]
            : ShippingStatus[ShippingStatus.READY];
        }
      });
    }
    case Actions.UPDATE_EXCEL_INVOICE_SUCCESS: {
      return produce(state, draft => {
        const { invoice, orderNo } = action.payload;
        const item = draft.shipping.content.find(item => item.order.orderNo === orderNo);

        if (item) {
          item.invoice = invoice;
          item.order.orderNo = orderNo;
          item.shippingStatus =
            invoice !== undefined ? ShippingStatus[ShippingStatus.IN_PROGRESS] : ShippingStatus[ShippingStatus.READY];
        }
      });
    }
    default:
      return state;
  }
};

export default shipping;
