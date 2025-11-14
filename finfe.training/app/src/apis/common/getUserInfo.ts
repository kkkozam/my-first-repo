import { post } from '@finfe/beetle-axios';

export interface UserInfo {
  uid: string | null;
  id: string;
  mis: string;
  name: string;
  empId: string;
  avatar: string;
  orgNamePath: string;
  orgCodePath: string;
}

export const getUserInfo = async () => {
  const [data] = await post<{ data: UserInfo }>('/portal/api/common/user');

  return data.data;
};
