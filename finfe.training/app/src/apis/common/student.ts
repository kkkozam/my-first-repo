import { post, get } from '@finfe/beetle-axios';

// 学生信息接口类型定义
export interface Student {
  studentId: string;
  name: string;
  gender: '男' | '女';
  age: number;
  birthDate: string;
  className: string;
  enrollmentYear: number;
  phone: string;
  address?: string;
  isBoarding: boolean;
  dormitory?: string;
  hobbies: string[];
  customHobbies?: string[];
  specialty?: string;
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  scores?: ScoreRecord[];
}

export interface ScoreRecord {
  period: number; // 1-6期
  subjects: {
    subject: string;
    score: number;
  }[];
}

export interface StudentListParams {
  page: number;
  pageSize: number;
  gender?: string;
  className?: string;
  enrollmentYear?: number;
  hobbies?: string[];
  keyword?: string; // 姓名或学号搜索
}

export interface StudentListResponse {
  total: number;
  pageSize: number;
  currentPage: number;
  list: Omit<Student, 'scores'>[];
}

// 获取学生列表
export const getStudentList = async (params: StudentListParams) => {
  const [data] = await post<{ data: StudentListResponse }>('/api/student/list', params);
  return data.data;
};

// 获取学生详情
export const getStudentDetail = async (studentId: string) => {
  const [data] = await post<{ data: Student }>('/api/student/detail', { studentId });
  return data.data;
};

// 新增学生
export const createStudent = async (student: Omit<Student, 'studentId'>) => {
  const [data] = await post<{ data: { studentId: string } }>('/api/student/create', student);
  return data.data;
};

// 更新学生信息
export const updateStudent = async (student: Student) => {
  const [data] = await post<{ data: boolean }>('/api/student/update', student);
  return data.data;
};

// 删除学生
export const deleteStudent = async (studentIds: string[]) => {
  const [data] = await post<{ data: boolean }>('/api/student/delete', { studentIds });
  return data.data;
};

// 获取班级字典
export const getClassDict = async () => {
  const [data] = await get<{ data: string[] }>('/api/student/classDict');
  return data.data;
};

// 获取兴趣爱好选项
export const getHobbyOptions = async () => {
  const [data] = await get<{ data: string[] }>('/api/student/hobbyOptions');
  return data.data;
};

// 获取监护人关系选项
export const getGuardianRelationOptions = async () => {
  const [data] = await get<{ data: string[] }>('/api/student/guardianRelationOptions');
  return data.data;
};
