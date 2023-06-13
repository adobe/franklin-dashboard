import { readBlockConfig } from '../../scripts/lib-franklin.js';
import engineerData from './engineer-data.js';
import chartPicker from './chart-options.js';
import { postPlotDomEngineering, prePlotDomEngineering } from './engineer-dom.js';

export default function decorate(block) {
  const params = new URLSearchParams(window.location.search);
  const perfRanges = {};

  let cfg = readBlockConfig(block);
  cfg = Object.fromEntries(Object.entries(cfg).map(([k, v]) => [k, typeof v === 'string' ? v.toLowerCase() : v]));
  const typeChart = cfg.type;
  const endpoint = cfg.data;
  const tableColumn = cfg.field;
  if (Object.hasOwn(cfg, 'good') && Object.hasOwn(cfg, 'okay') && Object.hasOwn(cfg, 'poor')) {
    perfRanges[tableColumn] = {
      good: cfg.good.replace(' ', '').split(',').map((el) => parseFloat(el)),
      okay: cfg.okay.replace(' ', '').split(',').map((el) => parseFloat(el)),
      poor: cfg.poor.replace(' ', '').split(',').map((el) => parseFloat(el)),
    };
  }

  /* for next feature, make link to deep dive for a domain
  const homeLink = cfg['home-link'];
  const homeLinkLabelKey = cfg['home-link-label-key'];
  */
  const legend = cfg.label;
  const labelKey = cfg['label-key'];
  const chartId = `${[endpoint, tableColumn, typeChart].join('-')}`.toLowerCase(); // id is data row + chart type because why have this twice?
  const tableAndColumn = `${endpoint}-${tableColumn}`;
  if(!Object.hasOwn(window, 'chartCounter')){
    window.chartCounter = 1;
  }
  block.parentElement.id = `chart${window.chartCounter}`;
  block.id = `chart${window.chartCounter}`;
  window.chartCounter += 1;

  // once we read config, clear the dom.
  block.querySelectorAll(':scope > div').forEach((row) => {
    row.style.display = "none";
  });
  const echartsScript = document.createElement('script');
  echartsScript.type = 'text/javascript';
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
        //configure this chart and fill it with proper parameters
        ${prePlotDomEngineering(tableAndColumn, chartId, block)}
        ${engineerData(tableAndColumn, params, tableColumn, labelKey)}
        ${chartPicker(endpoint, typeChart, tableColumn, perfRanges, legend)}
        ${postPlotDomEngineering(tableAndColumn, chartId, params)}
        myChart.setOption(option);
      }
    }
    checkForData();
    })()
  `;

    let appendChart = () => {
      if(typeof echarts != 'undefined'){
        block.append(echartsScript);
      }else{
        window.setTimeout(appendChart, 10);
      }
    }
    appendChart();
}