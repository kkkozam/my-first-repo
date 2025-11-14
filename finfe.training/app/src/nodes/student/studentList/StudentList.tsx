// 搜索表格相关组件
import {
  BatchOperationType,
  BeFilter,
  BeSearchTable,
  useSearchTable,
  useTableSelection,
  createColumnHelper,
  BeFormItem,
  BeMInput,
  BeMSelect,
  TableAction,
  TableActionType,
} from '@finfe/beetle-ui';
import { Button } from '@ss/mtd-react3';
import React, { useMemo } from 'react';
import { mockStudents } from '../../../apis/mockData';
import { Student } from '../../../apis/common/student';
import { useNavigate } from 'react-router-dom';
import { StudentAddRoute, StudentEditRoute } from '../../../routes';

// 创建表格列辅助工具，用于定义表格列的类型
const columnHelper = createColumnHelper<Student>();

export default function StudentSearchTable() {
  const { Operation } = BeSearchTable;

  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate(StudentAddRoute.path);
  };

  // 1、表格选择配置
  const selectionProps = useTableSelection<Student>({
    // 指定每行的唯一标识符为 studentId，用于批量操作时识别选中的行
    getRowId: (row) => row.studentId,
  });

  // 2、表格行操作配置
  const tableActions = {
    [TableActionType.VIEW]: ({ row }) => {
      // 查看按钮：跳转到查看模式
      navigate(`${StudentEditRoute.path}?id=${row.studentId}&mode=view`);
    },
    [TableActionType.EDIT]: ({ row }) => {
      // 编辑按钮：跳转到编辑模式
      navigate(`${StudentEditRoute.path}?id=${row.studentId}&mode=edit`);
    },
    [TableActionType.DELETE]: async ({ row, commands }) => {
      const confirmed = window.confirm(`确定要删除学生 "${row.name}" 吗？`);
      if (confirmed) {
        // 实际项目中这里应该调用 API 删除数据

        commands.search(); // 刷新表格
      }
    },
  };

  // 3、搜索表格配置
  const { config } = useSearchTable({
    // 启用表格行选择功能
    selection: selectionProps,
    // 启用行操作（查看、编辑、删除）
    tableActions,
    // 批量删除配置
    batchActions: {
      [BatchOperationType.DELETE]: ({ selectedRows, commands }) => {
        const confirmed = window.confirm(`确定要删除这 ${selectedRows.length} 名学生吗？`);
        if (confirmed) {
        // 实际项目中这里应该调用 API 删除数据
        
        commands.search(); // 刷新表格
        }
      },
    },

    // 搜索/过滤处理函数
    onSearch: async (params) => {
      // 模拟 API 请求延迟（实际项目应调用真实 API）
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { filters, pagination } = params;
      const { pageNo, pageSize } = pagination;

      // BeMSelect 组件返回值的格式不一致
      const extractValue = (val: any) => {
        // 1. 处理 null/undefined
        if (val == null) return undefined;
        // 2. 处理对象格式 { label: xxx, value: yyy }
        if (typeof val === 'object' && !Array.isArray(val) && 'value' in val) {
          return val.value;
        }
        // 3. 处理数组格式，递归提取第一个元素
        if (Array.isArray(val)) {
          return val.length > 0 ? extractValue(val[0]) : undefined;
        }
        // 4. 其他情况直接返回原值
        return val;
      };

      // 规范化所有 filter 值，确保格式一致
      const nameVal = extractValue(filters?.name);
      const genderVal = extractValue(filters?.gender);
      const classVal = extractValue(filters?.className);
      const yearVal = extractValue(filters?.enrollmentYear);

      // 执行数据过滤，复制数据副本
      let filteredData = [...mockStudents];
      // 按姓名模糊搜索
      if (nameVal) {
        filteredData = filteredData.filter(s => s.name.includes(String(nameVal)));
      }
      // 按性别精确匹配
      if (genderVal) {
        filteredData = filteredData.filter(s => s.gender === String(genderVal));
      }
      // 按班级精确匹配
      if (classVal) {
        filteredData = filteredData.filter(s => s.className === String(classVal));
      }
      // 按入学年份精确匹配
      if (yearVal) {
        filteredData = filteredData.filter(s => s.enrollmentYear === Number(yearVal));
      }

      // 分页处理，根据当前页码和分页大小，从过滤后的数据中截取对应的数据段
      const start = (pageNo - 1) * pageSize;
      const end = start + pageSize;
      const pageData = filteredData.slice(start, end);

      return {
        // 当前页的数据
        data: pageData,
        // 分页信息
        pagination: {
          total: filteredData.length,  // 过滤后的总数据条数
          pageNo,                       // 当前页码
          pageSize,                     // 每页显示数量
        },
      };
    },
  });

  // 4、表格列定义
  const columns = useMemo(
    () => [
      columnHelper.accessor('studentId', {
        header: '学号',
        size: 120,
      }),
      columnHelper.accessor('name', {
        header: '姓名',
        size: 100,
      }),
      columnHelper.accessor('gender', {
        header: '性别',
        size: 80,
      }),
      columnHelper.accessor('age', {
        header: '年龄',
        size: 80,
      }),
      columnHelper.accessor('className', {
        header: '班级',
        size: 120,
      }),
      columnHelper.accessor('enrollmentYear', {
        header: '入学年份',
        size: 100,
        // 自定义渲染：添加"年"字后缀
        cell: (info) => `${info.getValue()}年`,
      }),
      columnHelper.accessor('hobbies', {
        header: '兴趣标签',
        size: 150,
      }),
      columnHelper.accessor('scores.subjects.score', {
        header: '平均分',
        size: 100,
        cell: ({ row }) => {
        // 获取当前学生的成绩数据
        const student = row.original;
        // 检查学生是否有成绩数据
        if (!student.scores || student.scores.length === 0) {
          return '-'; // 没有成绩时显示 "-"
        }
        // 第1步：找到最近一期（期数最大的）
        const latestPeriod = student.scores.reduce((max, current) => 
          current.period > max.period ? current : max
        );
        // 第2步：检查最近一期是否有科目
        if (!latestPeriod.subjects || latestPeriod.subjects.length === 0) {
          return '-'; // 没有科目时显示 "-"
        }
        // 第3步：计算平均分
        const totalScore = latestPeriod.subjects.reduce((sum, subject) => 
          sum + (subject.score || 0), 0
        );
        const averageScore = totalScore / latestPeriod.subjects.length;
        // 第4步：返回格式化的平均分（保留一位小数）
        return averageScore.toFixed(1);
  },
        
      }),
      // 操作列：包含查看、编辑、删除按钮
      columnHelper.display({
        id: 'actions',
        header: '操作',
        size: 200,
        cell: ({ row }) => (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <TableAction.View row={row.original} />
            <TableAction.Edit row={row.original} />
            <TableAction.Delete row={row.original} />
          </div>
        ),
      }),
    ],
    []
  );

  // 5、搜索表单下拉选项生成
  const genderOptions = [
    { label: '男', value: '男' },
    { label: '女', value: '女' },
  ];

  const classOptions = Array.from(
    // 使用 Set 去重
    new Set(mockStudents.map(s => s.className))
  ).map(className => ({
    label: className,
    value: className,
  }));

  // 倒序排列，最新年份在前面
  const yearOptions = Array.from(
    new Set(mockStudents.map(s => s.enrollmentYear))
  ).sort((a, b) => b - a).map(year => ({
    label: `${year}年`,
    value: String(year),
  }));

  // 6、搜索表单字段配置
  const formItems = useMemo(
    () => [
      <BeFormItem key="name" fieldName="name" label="姓名">
        <BeMInput placeholder="输入姓名搜索" />
      </BeFormItem>,
      <BeFormItem key="gender" fieldName="gender" label="性别">
        <BeMSelect options={genderOptions} placeholder="选择性别" />
      </BeFormItem>,
      <BeFormItem key="className" fieldName="className" label="班级">
        <BeMSelect options={classOptions} placeholder="选择班级" />
      </BeFormItem>,
      <BeFormItem key="enrollmentYear" fieldName="enrollmentYear" label="入学年份">
        <BeMSelect options={yearOptions} placeholder="选择年份" />
      </BeFormItem>,
    ],
    []
  );

  return (
    <div style={{ padding: '20px' }}>
    <div style={{ marginBottom: '16px' }}>
      <Button type="primary" onClick={handleAddClick}>
        新增学生
      </Button>
    </div>
    <BeSearchTable config={config}>
      {/* 搜索过滤区 */}
      <BeFilter.Root>
        {/* 过滤条件面板 */}
        <BeFilter.Panel>
          {/* 表单字段 */}
          {formItems}
          {/* 操作按钮（搜索、重置等） */}
          <BeFilter.ButtonArea />
        </BeFilter.Panel>
      </BeFilter.Root>
      
      {/* 表格展示区 */}
      <BeSearchTable.Table columns={columns} >
        <Operation>
          <Operation.Delete />
        </Operation>
      </BeSearchTable.Table>
    </BeSearchTable>
    </div>
  );
}
