import { readBlockConfig } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  // const params = new URLSearchParams(window.location.search);

  let cfg = readBlockConfig(block);
  cfg = Object.fromEntries(Object.entries(cfg).map(([k, v]) => [k, typeof v === 'string' ? v.toLowerCase() : v]));
  const endpoint = cfg.data;
  const { columns } = cfg;
  const { col1 } = cfg;
  const { col2 } = cfg;

  const echartsScript = document.createElement('script');
  echartsScript.type = 'text/partytown';
  // echartsScript.src ='../../scripts/test.js'
  echartsScript.async = true;
  echartsScript.innerHTML = `
    (async function(){
        //data will live in this variable res
        let res;
        //request data
        function checkForData(){
            if((Object.hasOwn(window, 'dataIncoming') && window.dataIncoming === true) || !Object.hasOwn(window, 'dataIncoming')){
                window.setTimeout(checkForData, 10);
            }
            else if(Object.hasOwn(window, 'dataIncoming') && window.dataIncoming === false){
                const data = window.dashboard['${endpoint}'];
                res = data.results.data;
                res = res.sort((a, b) => {
                    if(a.pageviews < b.pageviews){
                        return -1;
                    }
                    else if(a.pageviews > b.pageviews){
                        return 1;
                    }
                    else{
                        return 0;
                    }
                })

                const list = document.createElement('div');
                const col1Title = document.createElement('div');
                const col2Title = document.createElement('div');
                col1Title.className = 'title';
                col2Title.className = 'title';
                col1Title.id = 'col1Title';
                col2Title.id = 'col2Title';
                const heading1 = document.createElement('div');
                const heading2 = document.createElement('div');
                heading1.textContent = '${col1}';
                heading2.textContent = '${col2}';
                col1Title.appendChild(heading1);
                col2Title.appendChild(heading2);
                list.appendChild(col1Title);
                list.appendChild(col2Title);
                list.className = 'columns-${columns}'
                res.forEach((row, idx) => {
                    const div1 = document.createElement('div');
                    const div2 = document.createElement('div');
                    div1.textContent = row.${col1};
                    div2.textContent = row.${col2};
                    div1.className = 'row'+idx;
                    div2.className = 'row'+idx;
                    div1.id = 'item1';
                    div2.id = 'item2';
                    list.appendChild(div1);
                    list.appendChild(div2);
                });
                const currBlock = document.querySelector('div .${block.className.split(' ').join('.')}');
                currBlock.appendChild(list);
            }
        }
        checkForData();
    })()`;

  block.append(echartsScript);
}
