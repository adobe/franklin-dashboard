import { readBlockConfig } from '../../scripts/lib-franklin.js';
import { getQueryInfo, queryRequest, getUrlBase } from '../../scripts/scripts.js';

export default function decorate(block) {
  let cfg = readBlockConfig(block);
  cfg = Object.fromEntries(Object.entries(cfg).map(([k, v]) => [k, typeof v === 'string' ? v.toLowerCase() : v]));
  const endpoint = cfg.data;

  cfg.block = block;
  const flag = `${endpoint}Flag`;

  // once we read config, clear the dom.
  block.querySelectorAll(':scope > div').forEach((row) => {
    row.style.display = 'none';
  });

  const getQuery = () => {
    if (!Object.hasOwn(window, 'gettingQueryInfo')) {
      getQueryInfo();
    }
    if (Object.hasOwn(window, 'gettingQueryInfo') && window.gettingQueryInfo === true) {
      window.setTimeout(getQuery, 1);
    } else if (Object.hasOwn(window, 'gettingQueryInfo') && window.gettingQueryInfo === false) {
      setTimeout(() => {
        queryRequest(cfg, getUrlBase(endpoint), { checkpoint: '404' });
      }, 3000);

      const loaderSpan = document.createElement('div');
      loaderSpan.className = 'loader';
      block.append(loaderSpan);
    }
  };

  const makeList = () => {
    if ((Object.hasOwn(window, flag) && window[flag] === true) || !Object.hasOwn(window, flag)) {
      window.setTimeout(makeList, 5);
    } else if (Object.hasOwn(window, flag) && window[flag] === false) {
      // query complete, hide loading graphic
      const { data } = window.dashboard[endpoint].results;
      document.querySelectorAll('div.loading').forEach((loading) => {
        loading.style.display = 'none';
      });
      const main = document.querySelector('main');
      const loader = main.querySelector('.loader');
      loader.remove();

      const listGridContainer = document.createElement('div');
      listGridContainer.classList.add('grid', 'list', 'container');

      const cols = ['topurl', 'source', 'views'];

      const listGridHeadingRow = document.createElement('div');
      listGridHeadingRow.classList.add('grid', 'list', 'row', 'heading');
      for (let j = 0; j < 3; j += 1) {
        const listGridHeadings = document.createElement('div');
        if (cols[j] === 'topurl') {
          listGridHeadings.textContent = '404 Path';
        } else if (cols[j] === 'source') {
          listGridHeadings.textContent = 'Referer(s)';
        } else if (cols[j] === 'views') {
          listGridHeadings.textContent = 'Estimated Views';
        }
        listGridHeadings.classList.add('grid', 'list', 'col', 'heading');
        listGridHeadingRow.appendChild(listGridHeadings);
      }
      listGridContainer.appendChild(listGridHeadingRow);

      const map404 = {};
      for (let i = 0; i < data.length; i += 1) {
        const {
          topurl, source, views,
        } = data[i];
        const sourceNew = source || 'empty';
        if (Object.hasOwn(map404, topurl)) {
          const sourceInfo = {
            sourceNew, views,
          };
          map404[topurl].push(sourceInfo);
        } else {
          const arr = [];
          const sourceInfo = {
            sourceNew, views,
          };
          arr.push(sourceInfo);
          map404[topurl] = arr;
        }
      }

      const entries = Object.entries(map404);
      let counter = 0;
      entries.forEach(([key, val]) => {
        const listGridRow = document.createElement('div');
        listGridRow.classList.add('grid', 'list', 'row');
        if ((counter % 2) === 1) {
          listGridRow.classList.add('odd');
        }

        const listGridColumn = document.createElement('div');
        listGridColumn.classList.add('grid', 'list', 'col', 'topurl');
        const link = document.createElement('a');
        link.href = key;
        link.textContent = key.replace(/^https?:\/\/[^/]+/i, '');
        listGridColumn.append(link);
        listGridRow.append(listGridColumn);

        const gridElementArray = [];
        for (let i = 0; i < 3; i += 1) {
          gridElementArray.push(document.createElement('div'));
          gridElementArray[i].classList.add('grid', 'list', 'col', cols[i + 1], 'flex');
        }

        for (let k = 0; k < val.length; k += 1) {
          const keys = Object.keys(val[k]);
          for (let l = 0; l < 3; l += 1) {
            const content = val[k][keys[l]];
            const innerDiv = document.createElement('div');
            innerDiv.classList.add('grid', 'list', 'col', keys[l], 'inner');
            // TODO the source field never shows a link, possible bug
            if (keys[l] === 'sourceNew' && val[k][keys[l]] !== 'empty') {
              const srcLink = document.createElement('a');
              srcLink.href = content;
              srcLink.textContent = content;
              innerDiv.append(srcLink);
            } else {
              innerDiv.textContent = content;
            }
            gridElementArray[l].append(innerDiv);
          }
        }
        for (let i = 0; i < 3; i += 1) {
          listGridRow.append(gridElementArray[i]);
        }
        listGridContainer.append(listGridRow);
        counter += 1;
      });
      block.append(listGridContainer);
    }
  };
  getQuery();
  makeList();
}
