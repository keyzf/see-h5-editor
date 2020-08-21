/**
 * 获取元素的offset
 * @param {element} el 
 */
export default function getOffset(el) {
  return el.offsetParent
    ? {
      left: el.offsetLeft + getOffset(el.offsetParent).left,
      top: el.offsetTop + getOffset(el.offsetParent).top
    }
    : {
      left: el.offsetLeft,
      top: el.offsetTop
    };
}