import { FormattedResponse } from '@rumsan/sdk/utils';
import { AxiosRequestConfig } from 'axios';
import {
  SettingInput,
  SettingList,
  SettingResponse,
} from '../settings/settings.types';
import { Pagination } from '@rumsan/sdk/types';

export type SettingClient = {
  create: (
    data: SettingInput,
    config?: AxiosRequestConfig,
  ) => Promise<FormattedResponse<SettingResponse>>;

  list: (
    data?: Pagination,
    config?: AxiosRequestConfig,
  ) => Promise<FormattedResponse<SettingList>>;

  update: (
    data: SettingInput,
    config?: AxiosRequestConfig,
  ) => Promise<FormattedResponse<SettingResponse>>;
};
