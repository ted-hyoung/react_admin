import { PageWrapper, ResponseContact } from 'types';

export interface ContactState {
  contacts: PageWrapper<ResponseContact>;
}
