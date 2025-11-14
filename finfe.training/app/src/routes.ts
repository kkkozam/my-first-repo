import { route, number, string } from 'react-router-typesafe-routes/dom';
// 在你的路由配置文件中（通常是 router.js 或 App.js）


export const HomeRoute = route('home', {
  searchParams: {
    id: number(),
  },
});

export const DetailRoute = route('detail/:id', {
  params: {
    id: string(),
  },
});

export const StudentListRoute = route('student/list', {
  searchParams: {
    name: string(),           // 姓名搜索
    gender: string(),         // 性别过滤
    className: string(),      // 班级过滤
    page: number(),           // 页码
    pageSize: number(),       // 每页数量
  },
});

// 无需参数
export const StudentAddRoute = route('student/add', {
  searchParams: {
    id: number(),
  },
});

// 编辑/查看学生页（同一个页面，通过 mode 参数区分）
export const StudentEditRoute = route('student/detail', {
  searchParams: {
    id: number(),      // 学生 ID
    mode: string(),    // 模式：'edit' 或 'view'
  },
});