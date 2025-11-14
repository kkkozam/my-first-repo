import {
  beetleAxiosInstall,
  AxiosTimeHeaders,
  AxiosOwl,
  AxiosResponseData,
  beetleAxiosInstance,
} from '@finfe/beetle-axios';
import { AxiosErrorNoticeMTD } from '@finfe/beetle-axios/es/plugins/AxiosErrorNoticeMTD';
import { AxiosSSOMTD } from '@finfe/beetle-axios/es/plugins/AxiosSSOMTD';

import { initMockAdapter } from './mock';

initMockAdapter(beetleAxiosInstance);

// 修改全局超时时间
// beetleAxiosInstance.default.timeout = 10 * 1000; // 默认10s

beetleAxiosInstall([
  // 1. 业务状态码判断, 2. 获取业务错误信息
  new AxiosErrorNoticeMTD({
    isError: (response) => {
      return response.data?.status !== 1;
    },
    getErrorMessage: (response) => response.data?.data?.message,
  }),
  // 3. SSO 登录失效,弹窗提示登录
  new AxiosSSOMTD(),
  // 4. 增加财务i18n 时区header
  new AxiosTimeHeaders(),
  // 5. 打印owl和logan日志
  new AxiosOwl(),
  // 6. 对业务屏蔽axios对象,返回后端data
  new AxiosResponseData({
    getResponseData(response) {
      return response.data;
    },
  }),
]);
