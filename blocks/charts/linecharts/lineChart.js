import Chart from '../chartClass.js';

export default class LineChart extends Chart {
  constructor(cfg) {
    super(cfg);
    this.cfg = cfg;
  }

  setData(data) {
    this.data = data;
  }

  setEchart(echart) {
    this.echart = echart;
  }

  configureEchart(options) {
    this.options = options;
  }

  extraDomOperations(chartElement) {
    super.extraDomOperations(chartElement);
  }

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

        const lbl = this.cfg['label-key'];

        let labels = this.data.map((row) => {
          let res = row[`${this.cfg['label-key']}`]
          return res.length > 10 ? res.substring(0, 10) : res;
        });

        labels = [...labels.sort()]
        const series = this.data.map((row) => row[`${this.cfg.field}`]);
        const legend = this.cfg.label;

        const opts = {
          title: {
            text: `${legend}`,
            x: 'center',
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
              symbol: 'none',
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
