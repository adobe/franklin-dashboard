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
      queryRequest(cfg, getUrlBase(endpoint));
      let loaderSpan = document.createElement('div');
      loaderSpan.className = 'loader';
      block.append(loaderSpan);
    }
  };

  const makeList = () => {
    if ((Object.hasOwn(window, flag) && window[flag] === true) || !Object.hasOwn(window, flag)) {
      window.setTimeout(makeList, 5);
    } else if (Object.hasOwn(window, flag) && window[flag] === false) {
      // query complete, hide loading graphic
      let data = window.dashboard[endpoint].results.data;
      document.querySelectorAll('div.loading').forEach((loading) => {
        loading.style.display = 'none';
      });
      let main = document.querySelector('main');
      let loader = main.querySelector('.loader');
      loader.remove();

      let listGridContainer = document.createElement('div');
      listGridContainer.classList.add('grid', 'list', 'container')

      let cols = ['topurl', 'source', 'actions', 'views', 'actions_per_view', 'pages'];

      let listGridHeadingRow = document.createElement('div');
      listGridHeadingRow.classList.add('grid', 'list', 'row', 'heading');
      for(let j = 0; j < 6; j++){
        let listGridHeadings = document.createElement('div');
        listGridHeadings.textContent = cols[j];
        listGridHeadings.classList.add('grid', 'list', 'col', 'heading');
        listGridHeadingRow.appendChild(listGridHeadings);
      }
      listGridContainer.appendChild(listGridHeadingRow);

      const map404 = {};
      for(let i = 0; i < data.length; i++){
        let { topurl, source, actions, views, actions_per_view, pages } = data[i];
        source = source ? source : 'empty';
        if(Object.hasOwn(map404, topurl)){
            let sourceInfo = {source, actions, views, actions_per_view, pages};
            map404[topurl].push(sourceInfo);
        }
        else{
            let arr = [];
            let sourceInfo = {source, actions, views, actions_per_view, pages};
            arr.push(sourceInfo);
            map404[topurl] = arr;
        }
      }


      let entries = Object.entries(map404);
      entries.forEach(([key, val]) => {
        let listGridRow = document.createElement('div');
        listGridRow.classList.add('grid', 'list', 'row');

        let listGridColumn = document.createElement('div');
        listGridColumn.classList.add('grid', 'list', 'col', 'topurl');
        const link = document.createElement('a');
        link.href = key;
        link.textContent = key;
        listGridColumn.append(link);
        listGridRow.append(listGridColumn);

        let gridElementArray = [];
        for(let i = 0; i < 5; i++){
            gridElementArray.push(document.createElement('div'))
            gridElementArray[i].classList.add('grid', 'list', 'col', cols[i+1], 'flex');
        }

        for(let k = 0; k < val.length; k++){
            let keys = Object.keys(val[k]);
            for(let l = 0; l < 5; l++){
                let content = val[k][keys[l]];
                let innerDiv = document.createElement('div');
                innerDiv.classList.add('grid', 'list', 'col', keys[l], 'inner');
                if(keys[l] === 'source' && val[k][keys[l]] !== 'empty'){
                    const link = document.createElement('a');
                    link.href = content;
                    link.textContent = content;
                    innerDiv.append(link);
                }
                else{
                    innerDiv.textContent = content;
                }
                gridElementArray[l].append(innerDiv);
            }
            //Each Row has 6 columns, each column can have multiple values. 
        }
        for(let i = 0; i < 5; i++){
            listGridRow.append(gridElementArray[i]);
        }
        listGridContainer.append(listGridRow);
        });
      block.append(listGridContainer);
    }
  };
  getQuery();
  makeList();
}