import {
  BeForm,
  BeFormItem,
  BeInput,
  bv,
  BeMSelect,
  useForm,
  BeMDatePicker,
  BeMRadioGroup,
  BeMTextArea,
  BeMCheckboxGroup,
  BeMButton,
  BeSelect,
  FormPatternTypes,
} from '@finfe/beetle-ui';
import { Validator } from '@src/utils/index';
import React, { useState, useEffect } from 'react';
import { Student, ScoreRecord } from '../../../apis/common/student';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { mockStudents } from '../../../apis/mockData';
import { StudentListRoute, StudentEditRoute } from '../../../routes';

export default function StudentEdit() {
  const navigate = useNavigate();
  // 使用 useSearchParams 获取查询参数
  const [searchParams] = useSearchParams();
  // 从查询参数获取 id
  const studentId = searchParams.get('id');

  // ..获取模式参数，默认为编辑模式
  const mode = searchParams.get('mode') || 'edit';
  //  ..判断是否是查看模式
  const isViewMode = mode === 'view';

  // 当前编辑的学生数据
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  // 成绩数据
  const [periods, setPeriods] = useState<ScoreRecord[]>([]);
  // 加载状态
  const [loading, setLoading] = useState(true);

  // ..根据模式设置 pattern
  const [pattern, setPattern] = useState<FormPatternTypes>(isViewMode ? 'readPretty' : 'editable');

  // 根据模式设置表单实例
  const form = useForm<Student>({
    pattern, // pattern需要传递给form
    onSubmit: isViewMode
      ? undefined
      : (values) => {
          if (!validateScores()) {
            return; // 校验失败，阻止提交
          }
          // 合并数据
          const submittedData = {
            ...values,
            scores: periods,
          };
          console.log('编辑提交数据:', submittedData);

          // 这里应该调用 API 更新数据
          // await updateStudent(submittedData);

          // 提示成功并返回列表页
          alert('修改成功');
          navigate(StudentListRoute.path);
        },
  });

  // 初始化：加载学生数据
  useEffect(() => {
    // 根据ID获取学生数据
    const student = mockStudents.find((s) => s.studentId === studentId);

    if (student) {
      // 设置当前学生数据
      setCurrentStudent(student);
      // 填充表单字段
      form.setValues({
        studentId: student.studentId,
        name: student.name,
        gender: student.gender,
        age: student.age,
        className: student.className,
        enrollmentYear: student.enrollmentYear,
        phone: student.phone,
        address: student.address,
        isBoarding: student.isBoarding,
        hobbies: student.hobbies,
        specialty: student.specialty,
        guardianName: student.guardianName,
        guardianRelation: student.guardianRelation,
        guardianPhone: student.guardianPhone,
        birthDate: student.birthDate,
      });
      // 初始化成绩字段
      if (student.scores && student.scores.length > 0) {
        const scoreValues: any = {};

        student.scores.forEach((period, periodIndex) => {
          period.subjects.forEach((subject, scoreIndex) => {
            scoreValues[`subject_${periodIndex}_${scoreIndex}`] = subject.subject;
            scoreValues[`score_${periodIndex}_${scoreIndex}`] = subject.score;
          });
        });

        form.setValues(scoreValues);
      }
      // 加载成绩数据
      if (student.scores && student.scores.length > 0) {
        setPeriods(student.scores);
      }
      setLoading(false);
    } else {
      alert('学生不存在');
      navigate(StudentListRoute.path);
    }
  }, [studentId]);

  // 当 mode 改变时，更新 pattern
  useEffect(() => {
    setPattern(isViewMode ? 'readPretty' : 'editable');
  }, [isViewMode]);

  // 手机号验证规则
  const phoneValidation = bv.string().custom((value) => {
    if (!value) {
      return '请输入联系电话';
    }
    const error = Validator.phone(value);
    return error || true;
  });

  // ========== 成绩管理模块 ==========
  // 添加一期
  const addPeriod = () => {
    setPeriods((prev) => {
      const used = new Set(prev.map((p) => p.period));
      for (let i = 1; i <= 6; i++) {
        if (!used.has(i)) {
          return [...prev, { period: i, subjects: [] }];
        }
      }
      return prev;
    });
  };

  // 删除学期
  const removePeriod = (index: number) => {
    setPeriods((prev) => prev.filter((_, i) => i !== index));
  };

  // 更新期数
  const updatePeriod = (index: number, newPeriod: number) => {
    setPeriods((prev) => prev.map((p, idx) => (idx === index ? { ...p, period: newPeriod } : p)));
  };

  // 添加一行成绩
  const addScoreRow = (periodIndex: number) => {
    setPeriods((prev) =>
      prev.map((p, idx) =>
        idx === periodIndex ? { ...p, subjects: [...p.subjects, { subject: '', score: undefined as any }] } : p,
      ),
    );
  };

  // 删除一行成绩记录
  const removeScoreRow = (periodIndex: number, scoreIndex: number) => {
    setPeriods((prev) =>
      prev.map((p, idx) => {
        if (idx !== periodIndex) return p;
        const newSubjects = p.subjects.slice();
        newSubjects.splice(scoreIndex, 1);
        return { ...p, subjects: newSubjects };
      }),
    );
  };

  // 更新指定学期中指定成绩记录的字段值
  const updateScoreRow = (
    periodIndex: number,
    scoreIndex: number,
    field: 'subject' | 'score',
    value: string | number | undefined,
  ) => {
    setPeriods((prev) =>
      prev.map((p, idx) => {
        if (idx !== periodIndex) return p;
        const subjects = p.subjects.slice();
        const row = { ...subjects[scoreIndex] } as any;
        if (field === 'subject') {
          row.subject = String(value ?? '');
        } else {
          row.score = (value === undefined ? (undefined as any) : Number(value)) as any;
        }
        subjects[scoreIndex] = row;
        return { ...p, subjects };
      }),
    );
  };

  // 获取可用的期数选项
  const getAvailablePeriods = (currentIndex: number) => {
    const used = new Set(periods.map((p, idx) => (idx !== currentIndex ? p.period : null)));
    const options = [];
    for (let i = 1; i <= 6; i++) {
      if (!used.has(i)) {
        options.push({ label: `第${i}期`, value: i });
      }
    }
    return options;
  };

  // 表单提交前的校验
  const validateScores = (): boolean => {
    // 校验1：每一期至少有1条记录
    if (periods.some((p) => p.subjects.length === 0)) {
      alert('每一期至少需要添加1条成绩记录');
      return false;
    }

    // 校验2：每一期内科目不重复
    for (let i = 0; i < periods.length; i++) {
      const subjects = periods[i].subjects.map((s) => s.subject);
      if (new Set(subjects).size !== subjects.length) {
        alert(`第${periods[i].period}期内有重复的科目`);
        return false;
      }
    }

    // 校验3：成绩在0-100之间 + 需要先输入科目再输入成绩
    for (let i = 0; i < periods.length; i++) {
      for (let j = 0; j < periods[i].subjects.length; j++) {
        const { subject, score } = periods[i].subjects[j];
        if (!subject) {
          alert(`第${periods[i].period}期第${j + 1}行：请先输入科目`);
          return false;
        }
        if (score === undefined || score === null) {
          alert(`第${periods[i].period}期第${j + 1}行：请输入成绩`);
          return false;
        }
        if (score < 0 || score > 100) {
          alert(`第${periods[i].period}期第${j + 1}行:成绩必须在0-100之间`);
          return false;
        }
      }
    }

    return true;
  };

  // 加载中显示
  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>加载中...</div>;
  }

  return (
    <>
      {/* ========== 第一部分：基本信息 ========== */}
      <div style={{ margin: '20px', padding: '20px', backgroundColor: '#f9fafb' }}>
        <h2>一、基本信息</h2>
        <BeForm form={form} labelWidth={100}>
          <BeForm.Grid columns={2} gap={24}>
            {/* 标识符——学号：显示具体值 */}
            <BeFormItem fieldName="studentId" label="学号">
              {/* 使用 readPretty 模式显示，不可编辑 */}
              <BeInput readOnly value={currentStudent?.studentId} />
            </BeFormItem>

            <BeFormItem fieldName="name" label="姓名" brules={bv.required('请输入姓名')}>
              <BeInput maxLength={20} />
            </BeFormItem>

            <BeFormItem fieldName="gender" label="性别" brules={bv.required('请选择性别')}>
              <BeMRadioGroup
                onlyKeyValue={true}
                options={[
                  { label: '男', value: '男' },
                  { label: '女', value: '女' },
                ]}
              />
            </BeFormItem>

            <BeFormItem fieldName="enrollmentYear" label="入学年份" brules={bv.required('请选择入学年份')}>
              <BeMSelect
                onlyKeyValue={true}
                options={[
                  { label: '2025', value: '2025' },
                  { label: '2024', value: '2024' },
                  { label: '2023', value: '2023' },
                  { label: '2022', value: '2022' },
                  { label: '2021', value: '2021' },
                ]}
              />
            </BeFormItem>

            <BeFormItem fieldName="birthDate" label="出生日期" brules={bv.required('请选择出生日期')}>
              <BeMDatePicker
                onChange={(timestamp: number | null) => {
                  if (timestamp !== null) {
                    const birthDate = new Date(timestamp);
                    const today = new Date();
                    let age = today.getFullYear() - birthDate.getFullYear();

                    const monthDiff = today.getMonth() - birthDate.getMonth();
                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                      age -= 1;
                    }

                    form.setValue('age', age);
                  } else {
                    form.setValue('age', undefined);
                  }
                }}
              />
            </BeFormItem>

            {/* 根据出生日期自动推算年龄 */}
            <BeFormItem fieldName="age" label="年龄" pattern="readPretty">
              <BeInput />
            </BeFormItem>

            <BeFormItem fieldName="className" label="班级" brules={bv.required('请选择班级')}>
              <BeMSelect
                onlyKeyValue={true}
                options={[
                  { label: '初一(1)班', value: '初一(1)班' },
                  { label: '初一(2)班', value: '初一(2)班' },
                  { label: '初一(3)班', value: '初一(3)班' },
                  { label: '初二(1)班', value: '初二(1)班' },
                  { label: '初二(2)班', value: '初二(2)班' },
                  { label: '初二(3)班', value: '初二(3)班' },
                  { label: '初三(1)班', value: '初三(1)班' },
                  { label: '初三(2)班', value: '初三(2)班' },
                  { label: '初三(3)班', value: '初三(3)班' },
                ]}
              />
            </BeFormItem>

            <BeFormItem fieldName="phone" label="联系电话" brules={phoneValidation}>
              <BeInput maxLength={11} placeholder="请输入11位手机号" />
            </BeFormItem>
          </BeForm.Grid>

          <BeFormItem fieldName="address" label="家庭住址">
            <BeMTextArea maxLength={100} showCount />
          </BeFormItem>
        </BeForm>
      </div>

      {/* ========== 第二部分：额外信息 ========== */}
      <div style={{ margin: '20px', padding: '20px', backgroundColor: '#f9fafb' }}>
        <h2>二、额外信息</h2>
        <BeForm form={form} labelWidth={100}>
          <BeFormItem fieldName="isBoarding" label="是否住校" brules={bv.required('请选择是否住校')}>
            <BeMSelect
              onlyKeyValue={true}
              options={[
                { label: '是', value: true },
                { label: '否', value: false },
              ]}
            />
          </BeFormItem>

          <BeFormItem fieldName="hobbies" label="兴趣爱好">
            <BeMCheckboxGroup
              onlyKeyValue={true}
              options={[
                { label: '篮球', value: '篮球' },
                { label: '足球', value: '足球' },
                { label: '音乐', value: '音乐' },
                { label: '绘画', value: '绘画' },
                { label: '阅读', value: '阅读' },
                { label: '舞蹈', value: '舞蹈' },
                { label: '编程', value: '编程' },
              ]}
            />
          </BeFormItem>

          <BeFormItem fieldName="specialty" label="特长">
            <BeInput />
          </BeFormItem>

          <BeForm.Grid columns={3} gap={24}>
            <BeFormItem fieldName="guardianName" label="监护人姓名" brules={bv.required('请输入监护人姓名')}>
              <BeInput />
            </BeFormItem>

            <BeFormItem fieldName="guardianRelation" label="关系" brules={bv.required('请选择关系')}>
              <BeMSelect
                onlyKeyValue={true}
                options={[
                  { label: '父亲', value: '父亲' },
                  { label: '母亲', value: '母亲' },
                  { label: '其他', value: '其他' },
                ]}
              />
            </BeFormItem>

            <BeFormItem fieldName="guardianPhone" label="监护人电话" brules={phoneValidation}>
              <BeInput maxLength={11} placeholder="请输入11位手机号" />
            </BeFormItem>
          </BeForm.Grid>
        </BeForm>
      </div>

      {/* ========== 第三部分：成绩管理 ========== */}
      <div style={{ margin: '20px', padding: '20px', backgroundColor: '#f9fafb' }}>
        <h2>三、成绩管理</h2>
        {/* 编辑模式才显示添加按钮 */}
        {!isViewMode && (
          <div style={{ marginBottom: '16px' }}>
            <BeMButton onClick={addPeriod} disabled={periods.length >= 6}>
              添加一期
            </BeMButton>
          </div>
        )}

        {/* 遍历每一期 */}
        {periods.map((period, periodIndex) => (
          <div
            key={`period_${period.period}_${periodIndex}`}
            style={{
              marginBottom: '24px',
              padding: '16px',
              borderRadius: '10px',
              backgroundColor: '#f3f4f6',
            }}
          >
            {/* 编辑模式显示期数选择器 */}
            {!isViewMode && (
              <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <label style={{ fontSize: '14px', color: '#333', minWidth: '100px' }}>选择期数</label>
                <BeSelect
                  value={period.period}
                  onChange={(value: number) => updatePeriod(periodIndex, value)}
                  options={getAvailablePeriods(periodIndex)}
                  style={{ width: '200px' }}
                />
              </div>
            )}

            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}
            >
              <h3>第{period.period}期</h3>
              {/* 编辑模式才显示删除按钮 */}
              {!isViewMode && (
                <BeMButton type="danger" onClick={() => removePeriod(periodIndex)}>
                  删除此期
                </BeMButton>
              )}
            </div>

            {/* 成绩列表容器 */}
            <div style={{ marginBottom: '16px' }}>
              {period.subjects.map((item, scoreIndex) => (
                <BeForm form={form} labelWidth={100} key={`form_${periodIndex}_${scoreIndex}`}>
                  <BeForm.Grid columns={3} gap={16} style={{ marginBottom: '12px' }}>
                    <BeFormItem fieldName={`subject_${periodIndex}_${scoreIndex}`} label="科目">
                      <BeInput
                        value={item.subject}
                        onChange={(e: any) => updateScoreRow(periodIndex, scoreIndex, 'subject', e.target.value)}
                        placeholder="例如：数学、语文"
                        maxLength={20}
                      />
                    </BeFormItem>

                    <BeFormItem fieldName={`score_${periodIndex}_${scoreIndex}`} label="成绩">
                      <BeInput
                        type="number"
                        value={item.score === undefined ? '' : String(item.score)}
                        onChange={(e: any) => {
                          const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                          updateScoreRow(periodIndex, scoreIndex, 'score', value);
                        }}
                        placeholder="0-100"
                        min={0}
                        max={100}
                        disabled={!item.subject || item.subject.trim() === ''}
                      />
                    </BeFormItem>

                    {!isViewMode && (
                      <BeFormItem label="操作">
                        <BeMButton type="danger" onClick={() => removeScoreRow(periodIndex, scoreIndex)}>
                          删除
                        </BeMButton>
                      </BeFormItem>
                    )}
                  </BeForm.Grid>
                </BeForm>
              ))}
            </div>
            {!isViewMode && <BeMButton onClick={() => addScoreRow(periodIndex)}>添加成绩</BeMButton>}
          </div>
        ))}
      </div>

      {/* ========== 操作按钮 ========== */}
      <div style={{ padding: '24px', display: 'flex', gap: '16px' }}>
        {isViewMode ? (
          <>
            <BeMButton type="primary" onClick={() => navigate(`${StudentEditRoute.path}?id=${studentId}`)}>
              编辑
            </BeMButton>
            <BeMButton onClick={() => navigate(StudentListRoute.path)}>返回</BeMButton>
          </>
        ) : (
          <>
            <BeMButton type="primary" onClick={() => form.submit()}>
              保存
            </BeMButton>
            <BeMButton onClick={() => navigate(StudentListRoute.path)}>取消</BeMButton>
          </>
        )}
      </div>
    </>
  );
}
