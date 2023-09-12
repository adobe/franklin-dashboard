import { readBlockConfig } from '../../scripts/lib-franklin.js';
import { drawLoader } from '../../scripts/loader.js';
// import { drawLoading } from '../../scripts/loading.js';
import { getQueryInfo, queryRequest, getUrlBase } from '../../scripts/scripts.js';
import LineChart from './linecharts/lineChart.js';
import BarChart from './barcharts/barCharts.js';
import CWVBarChart from './barcharts/CWVBarChart.js';
import CWVLineChart from './linecharts/CWVLineChart.js';

export default function decorate(block) {
  //draw the loading graphic
  drawLoader(block);
  const perfRanges = {};

  let cfg = readBlockConfig(block);
  cfg = Object.fromEntries(Object.entries(cfg).map(([k, v]) => [k, typeof v === 'string' ? v.toLowerCase() : v]));
  const typeChart = cfg.type;
  const endpoint = cfg.data;
  const poi_endpoint = cfg['poi-data'];
  const poi_field = cfg['poi-field']
  // As soon as we have endpoint, fire off request for data
  const tableColumn = cfg.field;
  if (Object.hasOwn(cfg, 'good') && Object.hasOwn(cfg, 'okay') && Object.hasOwn(cfg, 'poor')) {
    perfRanges[tableColumn] = {
      good: cfg.good.replace(' ', '').split(',').map((el) => parseFloat(el)),
      okay: cfg.okay.replace(' ', '').split(',').map((el) => parseFloat(el)),
      poor: cfg.poor.replace(' ', '').split(',').map((el) => parseFloat(el)),
    };
  }

  const chartId = `${[endpoint, tableColumn, typeChart].join('-')}`.toLowerCase(); // id is data row + chart type because why have this twice?
  if (!Object.hasOwn(window, 'chartCounter')) {
    window.chartCounter = 1;
  }
  block.parentElement.id = `chart${window.chartCounter}`;
  block.id = `chart${window.chartCounter}`;
  window.chartCounter += 1;

  cfg.block = block;
  cfg.chartId = chartId;
  cfg.perfRanges = perfRanges;

  // once we read config, clear the dom.
  block.querySelectorAll(':scope > div:not(.loader)').forEach((row) => {
    row.remove();
  });

  const currBlock = document.querySelector(`div#${block.id}.${block.className.split(' ').join('.')}`);
  // construct canvas where chart will sit
  const canvasWrapper = document.createElement('div');
  canvasWrapper.style.height = '100%';
  canvasWrapper.style.width = '100%';
  canvasWrapper.id = chartId;
  currBlock.append(canvasWrapper);

  const getQuery = () => {
    if (!Object.hasOwn(window, 'gettingQueryInfo')) {
      getQueryInfo();
    }
    if (Object.hasOwn(window, 'gettingQueryInfo') && window.gettingQueryInfo === true) {
      window.setTimeout(getQuery, 1);
    } else if (Object.hasOwn(window, 'gettingQueryInfo') && window.gettingQueryInfo === false) {
      if(endpoint){
        queryRequest(endpoint, getUrlBase(endpoint));
      }
      if(poi_endpoint){
        queryRequest(poi_endpoint, getUrlBase(poi_endpoint));
      }
    }
  };

  const makeChart = () => {
    let thisChart;
    if (typeChart === 'line' && (endpoint === 'rum-pageviews' || endpoint === 'sk-daily-users') || endpoint === 'daily-rum') {
      thisChart = new CWVLineChart(cfg);
    } else if (typeChart === 'bar' && endpoint === 'rum-dashboard') {
      thisChart = new CWVBarChart(cfg);
    } else if (typeChart === 'bar') {
      thisChart = new BarChart(cfg);
    } else if (typeChart === 'line') {
      thisChart = new LineChart(cfg);
    }
    thisChart.drawChart();
    // query complete, hide loading graphic
  };

  getQuery();
  makeChart();
}
