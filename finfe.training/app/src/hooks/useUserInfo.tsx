import { createContext, useContext } from 'react';
import { UserInfo } from '../apis';

export const UserInfoContext = createContext<UserInfo>(null);

export const useUserInfo = () => {
  const userInfo = useContext(UserInfoContext);
  if (!userInfo) throw new Error('UserInfo not found');
  return userInfo;
};

export const UserInfoProvider = ({ children, userInfo }: { children: React.ReactNode; userInfo: UserInfo }) => {
  return <UserInfoContext.Provider value={userInfo}>{children}</UserInfoContext.Provider>;
};
