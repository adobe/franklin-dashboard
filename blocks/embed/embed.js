import { readBlockConfig } from '../../scripts/lib-franklin.js';

/**
 * loads and decorates the top pages block
 * @param {Element} block The top pages block element
 */
export default async function decorate(block) {
  // read block params
  const cfg = readBlockConfig(block);
  const { code } = cfg;

  // TODO permission check
  // const currentpage = new URL(window.location.href);
  // const params = currentpage.searchParams;
  // const domainkey = params.get('domainkey') || '';

  block.innerHTML = code;
}
