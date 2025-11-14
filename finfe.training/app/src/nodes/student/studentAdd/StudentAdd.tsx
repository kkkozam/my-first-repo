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
} from '@finfe/beetle-ui';
import { Validator } from '@src/utils/index';
import React, { useState, useEffect } from 'react';
import { Student, ScoreRecord } from '../../../apis/common/student';
import { useNavigate } from 'react-router-dom';
import { StudentListRoute } from '../../../routes';

export default function StudentAdd() {
  const navigate = useNavigate();

  // 追踪表单是否有改动
  const [hasChanges, setHasChanges] = useState(false);
  const [periods, setPeriods] = useState<ScoreRecord[]>([]);

  // 创建表单实例
  const form = useForm<Student>({
    onSubmit: (values) => {
      if (!validateScores()) {
        return; // 校验失败，阻止提交
      }
      // 合并数据
      const submittedData = {
        // 展开表单收集的数据（姓名、性别、班级等）
        ...values,
        // 添加成绩数据（periods 是成绩状态）
        scores: periods,
      };
      console.log(submittedData);
      // 这里可以调用 API 保存数据到服务器
      // await updateStudent(submittedData);

      // 提示成功并返回列表页
      setHasChanges(false);
      alert('新增成功');
      navigate(StudentListRoute.path);
    },
  });

  // 监听表单和成绩数据变化
  useEffect(() => {
    const checkFormChanges = () => {
      const currentValues = form.getValues();

      // 检查表单是否有值
      const hasFormData = Object.values(currentValues).some((value) => {
        if (value === null || value === undefined) return false;
        if (typeof value === 'string') return value.trim() !== '';
        if (Array.isArray(value)) return value.length > 0;
        return true;
      });

      // 只要有任何数据，就标记为有改动
      setHasChanges(hasFormData || periods.length > 0);
    };

    checkFormChanges();
  }, [periods]);

  // 为表单字段添加 onChange 监听
  const handleFormChange = () => {
    const currentValues = form.getValues();

    const hasFormData = Object.values(currentValues).some((value) => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string') return value.trim() !== '';
      if (Array.isArray(value)) return value.length > 0;
      return true;
    });

    setHasChanges(hasFormData || periods.length > 0);
  };

  // 处理返回列表
  const handleBackToList = () => {
    if (hasChanges) {
      const confirmed = window.confirm('是否放弃新增？');
      if (confirmed) {
        setHasChanges(false);
        navigate(StudentListRoute.path);
      }
    } else {
      navigate(StudentListRoute.path);
    }
  };

  // 处理取消
  const handleCancel = () => {
    if (hasChanges) {
      const confirmed = window.confirm('是否放弃新增？');
      if (confirmed) {
        setHasChanges(false);
        navigate(StudentListRoute.path);
      }
    } else {
      navigate(StudentListRoute.path);
    }
  };

  // 手机号验证规则，使用 bv.string().custom()创建自定义验证规则
  const phoneValidation = bv.string().custom((value) => {
    if (!value) {
      return '请输入联系电话';
    }
    const error = Validator.phone(value);
    return error || true; // 返回 true 表示验证通过
  });

  //========== 成绩管理模块 ==========
  // 添加一期
  const addPeriod = () => {
    setPeriods((prev) => {
      // 创建一个 Set 存储已使用的期数，用于快速查找
      const used = new Set(prev.map((p) => p.period));
      // 遍历 1-6，找到第一个未使用的期数
      for (let i = 1; i <= 6; i++) {
        if (!used.has(i)) {
          // 返回新的 periods 数组，添加新期数
          return [...prev, { period: i, subjects: [] }];
        }
      }
      // 如果 1-6 都已使用，返回原数组（不做任何改变）
      return prev;
    });
  };

  // 删除学期
  const removePeriod = (index: number) => {
    setPeriods((prev) => prev.filter((_, i) => i !== index));
  };

  // 更新期数
  const updatePeriod = (index: number, newPeriod: number) => {
    setPeriods((prev) =>
      prev.map((p, idx) =>
        // 只更新指定索引的期数，其他保持不变
        idx === index ? { ...p, period: newPeriod } : p,
      ),
    );
  };

  // 添加一行成绩
  const addScoreRow = (periodIndex: number) => {
    setPeriods((prev) =>
      prev.map((p, idx) =>
        idx === periodIndex
          ? // 在该学期的 subjects 数组末尾添加新记录
            { ...p, subjects: [...p.subjects, { subject: '', score: undefined as any }] }
          : p,
      ),
    );
  };

  // 删除一行成绩记录
  const removeScoreRow = (periodIndex: number, scoreIndex: number) => {
    setPeriods((prev) =>
      prev.map((p, idx) => {
        if (idx !== periodIndex) return p;
        // 创建 subjects 数组的副本
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

  return (
    <>
      <div style={{ margin: '20px' }}>
        <BeMButton onClick={handleBackToList}>返回列表</BeMButton>
      </div>

      {/* ========== 第一部分：基本信息 ========== */}
      <div style={{ margin: '20px', padding: '20px', backgroundColor: '#f9fafb' }}>
        <h2>一、基本信息</h2>
        <BeForm form={form} labelWidth={100}>
          <BeForm.Grid columns={2} gap={24}>
            <BeFormItem fieldName="studentId" label="学号">
              <p>自动生成（提交后生效）</p>
            </BeFormItem>

            {/* 为每个输入框添加 onChange */}
            <BeFormItem fieldName="name" label="姓名" brules={bv.required('请输入姓名')}>
              <BeInput maxLength={20} onChange={handleFormChange} />
            </BeFormItem>

            <BeFormItem fieldName="gender" label="性别" brules={bv.required('请选择性别')}>
              <BeMRadioGroup
                onlyKeyValue={true}
                options={[
                  { label: '男', value: '男' },
                  { label: '女', value: '女' },
                ]}
                onChange={handleFormChange}
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
                onChange={handleFormChange}
              />
            </BeFormItem>

            <BeFormItem fieldName="birthDate" label="出生日期" brules={bv.required('请选择出生日期')}>
              <BeMDatePicker
                onChange={(timestamp: number | null) => {
                  // 明确接收时间戳或null
                  if (timestamp !== null) {
                    const birthDate = new Date(timestamp); // 将时间戳转为Date对象
                    const today = new Date();
                    let age = today.getFullYear() - birthDate.getFullYear();

                    // 处理月份和日期的边界情况
                    const monthDiff = today.getMonth() - birthDate.getMonth();
                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                      age -= 1;
                    }

                    form.setValue('age', age);
                  } else {
                    form.setValue('age', undefined); // 清空时重置年龄
                  }
                  handleFormChange();
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
                onChange={handleFormChange}
              />
            </BeFormItem>

            <BeFormItem fieldName="phone" label="联系电话" brules={phoneValidation}>
              <BeInput maxLength={11} onChange={handleFormChange} placeholder="请输入11位手机号" />
            </BeFormItem>
          </BeForm.Grid>

          <BeFormItem fieldName="address" label="家庭住址">
            <BeMTextArea maxLength={100} showCount onChange={handleFormChange} />
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
              onChange={handleFormChange}
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
              onChange={handleFormChange}
            />
          </BeFormItem>

          <BeFormItem fieldName="specialty" label="特长">
            <BeInput onChange={handleFormChange} />
          </BeFormItem>

          <BeForm.Grid columns={3} gap={24}>
            <BeFormItem fieldName="guardianName" label="监护人姓名" brules={bv.required('请输入监护人姓名')}>
              <BeInput onChange={handleFormChange} />
            </BeFormItem>

            <BeFormItem fieldName="guardianRelation" label="关系" brules={bv.required('请选择关系')}>
              <BeMSelect
                onlyKeyValue={true}
                options={[
                  { label: '父亲', value: '父亲' },
                  { label: '母亲', value: '母亲' },
                  { label: '其他', value: '其他' },
                ]}
                onChange={handleFormChange}
              />
            </BeFormItem>

            <BeFormItem fieldName="guardianPhone" label="监护人电话" brules={phoneValidation}>
              <BeInput maxLength={11} onChange={handleFormChange} placeholder="请输入11位手机号" />
            </BeFormItem>
          </BeForm.Grid>
        </BeForm>
      </div>

      {/* ========== 第三部分：成绩管理 ========== */}
      <div style={{ margin: '20px', padding: '20px', backgroundColor: '#f9fafb' }}>
        <h2>三、成绩管理</h2>
        <div style={{ marginBottom: '16px' }}>
          <BeMButton onClick={addPeriod} disabled={periods.length >= 6}>
            添加一期
          </BeMButton>
        </div>

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
            {/* 期数选择器 */}
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <label style={{ fontSize: '14px', color: '#333', minWidth: '100px' }}>选择期数</label>
              <BeSelect
                value={period.period}
                onChange={(value: number) => updatePeriod(periodIndex, value)}
                // 获取可选的期数选项
                options={getAvailablePeriods(periodIndex)}
                style={{ width: '200px' }}
              />
            </div>

            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}
            >
              <h3>第{period.period}期</h3>
              <BeMButton type="danger" onClick={() => removePeriod(periodIndex)}>
                删除此期
              </BeMButton>
            </div>

            {/* 成绩列表容器 */}
            <div style={{ marginBottom: '16px' }}>
              {/* 遍历该期的所有成绩记录，当前成绩记录+成绩索引 */}
              {period.subjects.map((item, scoreIndex) => (
                <BeForm form={form} labelWidth={100} key={`form_${periodIndex}_${scoreIndex}`}>
                  <BeForm.Grid columns={3} gap={16} style={{ marginBottom: '12px' }}>
                    {/* 动态生成唯一的字段名，防止多行数据混乱 */}
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
                        // 科目为空时禁用成绩输入
                        disabled={!item.subject || item.subject.trim() === ''}
                      />
                    </BeFormItem>
                    <BeFormItem label="操作">
                      <BeMButton type="danger" onClick={() => removeScoreRow(periodIndex, scoreIndex)}>
                        删除
                      </BeMButton>
                    </BeFormItem>
                  </BeForm.Grid>
                </BeForm>
              ))}
            </div>

            {/* ========== 提交按钮 ========== */}
            <BeMButton onClick={() => addScoreRow(periodIndex)}>添加成绩</BeMButton>
          </div>
        ))}
      </div>

      <div style={{ padding: '24px', display: 'flex', gap: '16px' }}>
        <BeMButton type="primary" onClick={() => form.submit()}>
          保存
        </BeMButton>
        <BeMButton onClick={handleCancel}>取消</BeMButton>
      </div>
    </>
  );
}
