
// @ts-ignore
export const getKeyByValue = (obj, value) => {
  return Object.keys(obj).find((item)=> obj[item] === value)
}