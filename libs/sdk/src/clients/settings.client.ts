import { Pagination } from '@rumsan/sdk/types';
import { formatResponse } from '@rumsan/sdk/utils';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  SettingInput,
  SettingList,
  SettingResponse,
} from '../settings/settings.types';
import { SettingClient } from '../types/settings.clients.types';

export const getSettingsClient = (client: AxiosInstance): SettingClient => {
  return {
    create: async (data: SettingInput, config?: AxiosRequestConfig) => {
      const response = await client.post('/settings', data, config);
      return formatResponse<SettingResponse>(response);
    },
    list: async (data?: Pagination, config?: AxiosRequestConfig) => {
      const response = await client.get('/app/settings', {
        params: data,
        ...config,
      });
      return formatResponse<SettingList>(response);
    },

    update: async (data: SettingInput, config?: AxiosRequestConfig) => {
      const response = await client.patch(
        `app/settings/update/${data?.name}`,
        data,
        config,
      );
      return formatResponse<SettingResponse>(response);
    },
  };
};
