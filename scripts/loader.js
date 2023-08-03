/**
 * draw a loading graphic in the specified DOM element
 * @param {Element} domObj The target DOM element
 */
export function drawLoader(domObj) {
  const loaderSpan = document.createElement('div');
  loaderSpan.className = 'loader';
  domObj.append(loaderSpan);
}

/**
 * hide the loading graphic in the specified DOM element
 * @param {Element} domObj The target DOM element
 */
export function hideLoader(domObj) {
  const loader = domObj.querySelector('.loader');
  loader.remove();
}
