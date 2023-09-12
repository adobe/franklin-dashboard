import LineChart from './lineChart.js';

export default class CWVLineChart extends LineChart {
  drawChart() {
    if (typeof echarts === 'undefined') {
      window.setTimeout(this.drawChart.bind(this), 5);
    } else {
      const currBlock = document.querySelector(`div#${this.cfg.chartId}`);
      // eslint-disable-next-line no-undef
      this.echart = echarts.init(currBlock);
      this.extraDomOperations(currBlock);
      const endpoint = this.cfg.data;
      const poi_endpoint = this.cfg['poi-data'];
      const flag = `${endpoint}Flag`;
      const poiFlag = `${poi_endpoint}Flag`;

      if (((Object.hasOwn(window, flag) && window[flag] === true) || !Object.hasOwn(window, flag)) || (poi_endpoint && ((Object.hasOwn(window, poiFlag) && window[poiFlag] === true) || !Object.hasOwn(window, poiFlag)))) {
        window.setTimeout(this.drawChart.bind(this), 5);
      } else if (Object.hasOwn(window, flag) && window[flag] === false) {
        // query complete, hide loading graphic
        this.data = window.dashboard[this.cfg.data].results.data;
        document.querySelectorAll('div.loading').forEach((loading) => {
          loading.style.display = 'none';
        });
        const reverseData = [...this.data];

        const labels = reverseData.map((row) => row[`${this.cfg['label-key']}`].substr(0, 10));
        const series = reverseData.map((row) => row[`${this.cfg.field}`]);
        const legend = this.cfg.label;

        if(poi_endpoint && Object.hasOwn(window.dashboard, this.cfg['poi-data']) && this.data){
          const poiMap = {};
          window.dashboard[this.cfg['poi-data']].results.data.forEach((val) => {
            const {commit_date, commit_url, message} = val;
            poiMap[commit_date] = {commit_url, message, owner_repo}
          })
          this.poi_data = poiMap;

        }

        var callback = (params) => {
          if(Object.hasOwn(this.poi_data, params.name)){
            const { message, commit_url} = this.poi_data[params.name];
            return `${message ? message : 'No Message Available' }<br />
            Commit Date: ${params.name}<br/>
            <a href="${commit_url}">Click to see Commit </a><br />`
          }
          return '';
        }

        const opts = {
          title: {
            text: `${legend}`,
            x: 'center',
          },
          tooltip: {
            enterable: true,
            trigger: 'item',
            formatter: callback,
            confine: true,
            extraCssText: "width: fit-content; height: fit-content;"
          },
          xAxis: {
            type: 'category',
            triggerEvent: true,
            data: labels,
            axisLabel: {
              show: true,
              interval: 1,
              rotate: 70,
            },
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              data: series,
              type: 'line',
              smooth: true,
              symbol: 'diamond',
              symbolSize: (val, param) => {
                if(Object.hasOwn(this.poi_data, param.name)){
                  return 15;
                }
              }
            },
          ],
        };
        this.configureEchart(opts);
        this.echart.setOption(opts);
        this.hideLoader(this.cfg.block);
      }
    }
  }
}
