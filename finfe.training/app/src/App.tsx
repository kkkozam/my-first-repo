import { Navigate, Route, Routes } from 'react-router-dom';
import { HomeRoute, StudentListRoute, StudentAddRoute,StudentEditRoute } from './routes';
import { BeLoadableSuspense } from '@finfe/beetle-ui';
import { lazy } from 'react';

const Home = lazy(() => import('./nodes/home'));
const StudentList = lazy(() => import('./nodes/student/studentList/StudentList'));
const StudentAdd = lazy(() => import('./nodes/student/studentAdd/StudentAdd'));
const StudentEdit = lazy(() => import('./nodes/student/studentEdit/StudentEdit'));


export function App() {
  return (
    <BeLoadableSuspense>
      <Routes>
        {/**
         * 将根路径 "/" 重定向到业务首页路由。
         * 这样当用户访问站点根时不会出现 "No routes matched location '/'"。
         */}
        <Route path="/" element={<Navigate to={HomeRoute.path} replace />} />
        <Route path={HomeRoute.path} element={<Home />} />
        {/* <Route path={StudentListRoute.path} element={<StudentList />} /> */}

        <Route path={StudentListRoute.path} element={<StudentList />} />
        <Route path={StudentAddRoute.path} element={<StudentAdd />} />
        <Route path={StudentEditRoute.path} element={<StudentEdit />} />

      </Routes>
    </BeLoadableSuspense>
  );
}
