// utils/random.ts

/**
 * 生成指定范围内的随机整数 [min, max]
 */
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 生成指定范围内的随机浮点数 [min, max)
 */
export const randomFloat = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

/**
 * 从数组中随机选取一个元素
 */
export const randomItem = <T>(arr: T[]): T => {
  return arr[randomInt(0, arr.length - 1)]
}