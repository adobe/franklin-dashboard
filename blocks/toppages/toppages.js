import { readBlockConfig } from '../../scripts/lib-franklin.js';
import { drawList } from '../datalist/datalist.js';

/**
 * loads and decorates the toppages block
 * which uses styles and functionality from the datalist block
 * @param {Element} block The toppages block element
 */
export default async function decorate(block) {
  // use datalist block styles
  block.classList.add('datalist');

  // read block params which are configurable
  const cfg = readBlockConfig(block);

  // add additional block params before passing to datalist to decorate
  // the intent is to build a "pre-configured" datalist and therefore
  // not require the content author to configure certain params
  cfg.runquery = 'https://helix-pages.anywhere.run/helix-services/run-query@ci5366/dash@top-pages';
  cfg.col1name = 'URL';
  cfg.col1value = 'url';
  cfg.col2name = 'Estimated Count';
  cfg.col2value = 'estimated_pv';

  // use function from datalist block to draw list
  // empty content and wait 3 seconds to ensure 100 LHS
  block.innerHTML = '<div class="container-2col"><div class="title wide">...Loading, please wait...</div></div>';
  setTimeout(() => {
    drawList(block, cfg);
  }, 3000);
}
