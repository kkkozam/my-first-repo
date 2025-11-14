# 学生管理 API 接口文档

## 接口列表

### 1. 获取学生列表

**接口地址：** `POST /api/student/list`

**接口描述：** 分页获取学生列表，支持多条件筛选

**请求参数：** `StudentListParams`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 是 | 页码 |
| pageSize | number | 是 | 每页数量 |
| gender | string | 否 | 性别筛选 |
| className | string | 否 | 班级筛选 |
| enrollmentYear | number | 否 | 入学年份筛选 |
| hobbies | string[] | 否 | 兴趣爱好筛选 |
| keyword | string | 否 | 姓名或学号搜索 |

**返回值：** `StudentListResponse`

```typescript
{
  total: number;           // 总记录数
  pageSize: number;        // 每页数量
  currentPage: number;     // 当前页码
  list: Student[];         // 学生列表（不包含成绩信息）
}
```

---

### 2. 获取学生详情

**接口地址：** `POST /api/student/detail`

**接口描述：** 根据学生ID获取学生详细信息（包含成绩信息）

**请求参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| studentId | string | 是 | 学生ID |

**返回值：** `Student`

```typescript
{
  studentId: string;              // 学生ID
  name: string;                   // 姓名
  gender: '男' | '女';            // 性别
  age: number;                    // 年龄
  birthDate: string;              // 出生日期
  className: string;              // 班级
  enrollmentYear: number;         // 入学年份
  phone: string;                  // 联系电话
  address?: string;               // 地址（可选）
  isBoarding: boolean;            // 是否住宿
  dormitory?: string;             // 宿舍号（可选）
  hobbies: string[];              // 兴趣爱好
  customHobbies?: string[];       // 自定义兴趣爱好（可选）
  specialty?: string;             // 特长（可选）
  guardianName: string;           // 监护人姓名
  guardianRelation: string;       // 监护人关系
  guardianPhone: string;          // 监护人电话
  scores?: ScoreRecord[];         // 成绩记录（可选）
}
```

**成绩记录结构：** `ScoreRecord`

```typescript
{
  period: number;                 // 期次（1-6期）
  subjects: {
    subject: string;              // 科目名称
    score: number;                // 分数
  }[];
}
```

---

### 3. 新增学生

**接口地址：** `POST /api/student/create`

**接口描述：** 创建新学生信息

**请求参数：** `Omit<Student, 'studentId'>`（学生信息，不包含 studentId）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | string | 是 | 姓名 |
| gender | '男' \| '女' | 是 | 性别 |
| age | number | 是 | 年龄 |
| birthDate | string | 是 | 出生日期 |
| className | string | 是 | 班级 |
| enrollmentYear | number | 是 | 入学年份 |
| phone | string | 是 | 联系电话 |
| address | string | 否 | 地址 |
| isBoarding | boolean | 是 | 是否住宿 |
| dormitory | string | 否 | 宿舍号 |
| hobbies | string[] | 是 | 兴趣爱好 |
| customHobbies | string[] | 否 | 自定义兴趣爱好 |
| specialty | string | 否 | 特长 |
| guardianName | string | 是 | 监护人姓名 |
| guardianRelation | string | 是 | 监护人关系 |
| guardianPhone | string | 是 | 监护人电话 |

**返回值：**

```typescript
{
  studentId: string;  // 新创建的学生ID
}
```

---

### 4. 更新学生信息

**接口地址：** `POST /api/student/update`

**接口描述：** 更新学生信息

**请求参数：** `Student`（完整的学生信息，包含 studentId）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| studentId | string | 是 | 学生ID |
| ... | ... | ... | （其他字段同新增学生接口） |

**返回值：**

```typescript
boolean  // 更新是否成功
```

---

### 5. 删除学生

**接口地址：** `POST /api/student/delete`

**接口描述：** 批量删除学生

**请求参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| studentIds | string[] | 是 | 学生ID数组 |

**返回值：**

```typescript
boolean  // 删除是否成功
```

---

### 6. 获取班级字典

**接口地址：** `GET /api/student/classDict`

**接口描述：** 获取所有班级列表

**请求参数：** 无

**返回值：**

```typescript
string[]  // 班级名称数组
```

---

### 7. 获取兴趣爱好选项

**接口地址：** `GET /api/student/hobbyOptions`

**接口描述：** 获取兴趣爱好选项列表

**请求参数：** 无

**返回值：**

```typescript
string[]  // 兴趣爱好选项数组
```

---

### 8. 获取监护人关系选项

**接口地址：** `GET /api/student/guardianRelationOptions`

**接口描述：** 获取监护人关系选项列表

**请求参数：** 无

**返回值：**

```typescript
string[]  // 监护人关系选项数组
```

---

## 数据类型定义

### Student（学生信息）

```typescript
interface Student {
  studentId: string;              // 学生ID
  name: string;                   // 姓名
  gender: '男' | '女';            // 性别
  age: number;                    // 年龄
  birthDate: string;              // 出生日期
  className: string;              // 班级
  enrollmentYear: number;         // 入学年份
  phone: string;                  // 联系电话
  address?: string;               // 地址（可选）
  isBoarding: boolean;            // 是否住宿
  dormitory?: string;             // 宿舍号（可选）
  hobbies: string[];              // 兴趣爱好
  customHobbies?: string[];       // 自定义兴趣爱好（可选）
  specialty?: string;             // 特长（可选）
  guardianName: string;           // 监护人姓名
  guardianRelation: string;       // 监护人关系
  guardianPhone: string;          // 监护人电话
  scores?: ScoreRecord[];         // 成绩记录（可选）
}
```

### ScoreRecord（成绩记录）

```typescript
interface ScoreRecord {
  period: number;                 // 期次（1-6期）
  subjects: {
    subject: string;              // 科目名称
    score: number;                // 分数
  }[];
}
```

### StudentListParams（学生列表查询参数）

```typescript
interface StudentListParams {
  page: number;                   // 页码
  pageSize: number;               // 每页数量
  gender?: string;                // 性别筛选
  className?: string;             // 班级筛选
  enrollmentYear?: number;        // 入学年份筛选
  hobbies?: string[];             // 兴趣爱好筛选
  keyword?: string;               // 姓名或学号搜索
}
```

### StudentListResponse（学生列表响应）

```typescript
interface StudentListResponse {
  total: number;                  // 总记录数
  pageSize: number;               // 每页数量
  currentPage: number;            // 当前页码
  list: Omit<Student, 'scores'>[]; // 学生列表（不包含成绩信息）
}
```

