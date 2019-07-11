enum CsrPayment {
  CONFIRM = '결제 확인',
  CANCEL = '결제 취소',
  ERROR = '오류',
  DOCUMENT = '현금영수증 & 세금계산서 & 거래명세서',
  REMITTANCE = '무통장 입금',

  '결제 확인' = 'CONFIRM',
  '결제 취소' = 'CANCEL',
  '오류' = 'ERROR',
  '현금영수증 & 세금계산서 & 거래명세서' = 'DOCUMENT',
  '무통장 입금' = 'REMITTANCE',
}

enum CsrShipping {
  SCHEDULE = '배송 일정',
  EDIT_INFO = '배송 정보 수정',
  NOT_RECEIVED = '제품 미수령',
  DAMAGE_DURING = '배송 중 파손',

  '배송 일정' = 'SCHEDULE',
  '배송 정보 수정' = 'EDIT_INFO',
  '제품 미수령' = 'NOT_RECEIVED',
  '배송 중 파손' = 'DAMAGE_DURING',
}

enum CsrProduct {
  NORMAL = '일반',
  AFTER_SERVICE = 'A/S',

  '일반' = 'NORMAL',
  'A/S' = 'AFTER_SERVICE',
}

enum CsrExchange {
  EXCHANGE = '교환',
  EXCHANGE_PROGRESS = '교환 진행 상태',

  '교환' = 'EXCHANGE',
  '교환 진행 상태' = 'EXCHANGE_PROGRESS',
}

enum CsrRefund {
  REFUND = '반품 문의',
  REFUND_PROGRESS = '반품 진행 상황',

  '반품 문의' = 'REFUND',
  '반품 진행 상황' = 'REFUND_PROGRESS',
}

enum CsrEtc {
  ETC = '기타',

  '기타' = 'ETC',
}

export enum CsrCategory {
  PAYMENT = '주문 & 결제 문의',
  SHIPPING = '배송 문의',
  PRODUCT = '상품 문의',
  EXCHANGE = '교환 문의',
  REFUND = '반품 문의',
  ETC = '기타 문의',

  '주문 & 결제 문의' = 'PAYMENT',
  '배송 문의' = 'SHIPPING',
  '상품 문의' = 'PRODUCT',
  '교환 문의' = 'EXCHANGE',
  '반품 문의' = 'REFUND',
  '기타 문의' = 'ETC',
}
