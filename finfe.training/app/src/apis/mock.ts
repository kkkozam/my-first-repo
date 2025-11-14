import MockAdapter from 'axios-mock-adapter';
import type { Student, StudentListParams, StudentListResponse } from './common/student';
import { mockStudents as initialMockStudents } from './mockData';

// 由于 @finfe/beetle-axios 内部使用了 axios，我们需要获取实际的 axios 实例
let mockAdapter: MockAdapter | null = null;

// 延迟初始化 mock adapter，确保在 axios 配置完成后执行
export function initMockAdapter(axiosInstance: any) {
  if (!mockAdapter) {
    mockAdapter = new MockAdapter(axiosInstance, { delayResponse: 300, onNoMatch: 'passthrough' });
    setupMockHandlers();
  }
  return mockAdapter;
}

// Mock 数据（使用深拷贝，以便在运行时修改）
let mockStudents: Student[] = JSON.parse(JSON.stringify(initialMockStudents));

// 班级字典
const classDict = ['初一(1)班', '初一(2)班', '初一(3)班', '初二(1)班', '初二(2)班', '初三(1)班'];

// 兴趣爱好选项
const hobbyOptions = ['篮球', '足球', '音乐', '绘画', '阅读', '编程', '舞蹈'];

// 监护人关系选项
const guardianRelationOptions = ['父亲', '母亲', '爷爷', '奶奶', '外公', '外婆', '其他'];

function setupMockHandlers() {
  if (!mockAdapter) return;

  // 获取学生列表
  mockAdapter.onPost('/api/student/list').reply((config) => {
    const params: StudentListParams = JSON.parse(config.data || '{}');
    const { page = 1, pageSize = 10, gender, className, enrollmentYear, hobbies, keyword } = params;
    console.log('params', params);
    let filtered = [...mockStudents];

    // 性别筛选
    if (gender) {
      filtered = filtered.filter((s) => s.gender === gender);
    }

    // 班级筛选
    if (className) {
      filtered = filtered.filter((s) => s.className === className);
    }

    // 入学年份筛选
    if (enrollmentYear) {
      filtered = filtered.filter((s) => s.enrollmentYear === enrollmentYear);
    }

    // 兴趣爱好筛选
    if (hobbies && hobbies.length > 0) {
      filtered = filtered.filter((s) => {
        const allHobbies = [...(s.hobbies || []), ...(s.customHobbies || [])];
        return hobbies?.some((h) => allHobbies.includes(h));
      });
    }

    // 关键词搜索（姓名或学号）
    if (keyword) {
      const keywordLower = keyword.toLowerCase();
      filtered = filtered.filter(
        (s) => s.name.toLowerCase().includes(keywordLower) || s.studentId.toLowerCase().includes(keywordLower),
      );
    }

    // 计算平均分
    const processed = filtered.map((s) => {
      const latestScore = s.scores?.[s.scores.length - 1];
      const avgScore =
        latestScore && latestScore.subjects.length > 0
          ? latestScore.subjects.reduce((sum, sub) => sum + sub.score, 0) / latestScore.subjects.length
          : undefined;
      const hobbyTags = [...(s.hobbies || []), ...(s.customHobbies || [])].join('、');

      const { scores, ...studentWithoutScores } = s;
      return {
        ...studentWithoutScores,
        hobbyTags,
        latestAvgScore: avgScore,
      } as Omit<Student, 'scores'> & { hobbyTags: string; latestAvgScore?: number };
    });

    // 分页
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginated = processed.slice(start, end);

    const response: StudentListResponse = {
      total: processed.length,
      pageSize,
      currentPage: page,
      list: paginated,
    };

    return [200, { status: 1, data: response }];
  });

  // 获取学生详情
  mockAdapter.onPost('/api/student/detail').reply((config) => {
    const params = JSON.parse(config.data || '{}');
    const { studentId } = params;

    const student = mockStudents.find((s) => s.studentId === studentId);
    if (!student) {
      return [404, { status: 0, data: { message: '学生不存在' } }];
    }

    return [200, { status: 1, data: student }];
  });

  // 新增学生
  mockAdapter.onPost('/api/student/create').reply((config) => {
    const studentData: Omit<Student, 'studentId'> = JSON.parse(config.data || '{}');

    // 生成学号
    const currentYear = new Date().getFullYear();
    const yearStr = currentYear.toString().slice(-2);
    const maxId = mockStudents
      .filter((s) => s.studentId.startsWith(`S${yearStr}`))
      .map((s) => parseInt(s.studentId.slice(-3), 10))
      .reduce((max, id) => Math.max(max, id), 0);

    const newStudentId = `S${yearStr}${String(maxId + 1).padStart(3, '0')}`;

    const newStudent: Student = {
      ...studentData,
      studentId: newStudentId,
    };

    mockStudents.push(newStudent);

    return [200, { status: 1, data: { studentId: newStudentId } }];
  });

  // 更新学生信息
  mockAdapter.onPost('/api/student/update').reply((config) => {
    const studentData: Student = JSON.parse(config.data || '{}');
    const { studentId } = studentData;

    const index = mockStudents.findIndex((s) => s.studentId === studentId);
    if (index === -1) {
      return [404, { status: 0, data: { message: '学生不存在' } }];
    }

    mockStudents[index] = studentData;

    return [200, { status: 1, data: true }];
  });

  // 删除学生
  mockAdapter.onPost('/api/student/delete').reply((config) => {
    const params = JSON.parse(config.data || '{}');
    const { studentIds } = params;

    if (!Array.isArray(studentIds)) {
      return [400, { status: 0, data: { message: '参数错误' } }];
    }

    mockStudents = mockStudents.filter((s) => !studentIds.includes(s.studentId));

    return [200, { status: 1, data: true }];
  });

  // 获取班级字典
  mockAdapter.onGet('/api/student/classDict').reply(() => {
    return [200, { status: 1, data: classDict }];
  });

  // 获取兴趣爱好选项
  mockAdapter.onGet('/api/student/hobbyOptions').reply(() => {
    return [200, { status: 1, data: hobbyOptions }];
  });

  // 获取监护人关系选项
  mockAdapter.onGet('/api/student/guardianRelationOptions').reply(() => {
    return [200, { status: 1, data: guardianRelationOptions }];
  });
}
