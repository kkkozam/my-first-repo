// 工具函数集合

// 验证工具类 - 提供常用的验证方法
export class Validator {
  // 验证手机号
  static phone(value: string, message?: string): string | undefined {
    if (!value) return undefined;
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(value) ? undefined : (message || '请输入正确的手机号');
  }

  // 验证成绩（0-100）
  static score(value: number | null, message?: string): string | undefined {
    if (value === null || value === undefined) return undefined;
    if (value < 0 || value > 100) {
      return message || '成绩必须在0-100之间';
    }
    return undefined;
  }

  // 验证必填
  static required(value: any, message?: string): string | undefined {
    if (value === null || value === undefined || value === '') {
      return message || '此项为必填项';
    }
    return undefined;
  }

  // 验证最小长度
  static minLength(value: string, min: number, message?: string): string | undefined {
    if (!value) return undefined;
    return value.length < min ? (message || `最少需要${min}个字符`) : undefined;
  }

  // 验证最大长度
  static maxLength(value: string, max: number, message?: string): string | undefined {
    if (!value) return undefined;
    return value.length > max ? (message || `最多只能${max}个字符`) : undefined;
  }

  // 验证数字范围
  static numberRange(
    value: number,
    min: number,
    max: number,
    message?: string
  ): string | undefined {
    if (value === null || value === undefined) return undefined;
    if (value < min || value > max) {
      return message || `请输入${min}到${max}之间的数字`;
    }
    return undefined;
  }
}