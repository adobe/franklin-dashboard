export default class Chart {
  /* Member Data
     block: Object;
     echart: Object;
     options: Object;
     data: Object;
     chartId: string;
     cfg: Object;
     */

  constructor(cfg) {
    this.block = cfg.block;
    this.cfg = cfg;
  }

  getData() {
    if ((Object.hasOwn(window, 'dataIncoming') && window.dataIncoming === true) || !Object.hasOwn(window, 'dataIncoming')) {
      window.setTimeout(this.getData, 10);
    } else if (Object.hasOwn(window, 'dataIncoming') && window.dataIncoming === false) {
      // query complete, hide loading graphic
      this.data = window.dashboard[this.cfg.data].results.data;
      document.querySelectorAll('div.loading').forEach((loading) => {
        loading.style.display = 'none';
      });
    }
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

  extraDomOperations() {
    new ResizeObserver(() => {
      this.echart.resize();
    }).observe(this.block);
  }

  drawChart() {
    if (typeof echarts === 'undefined') {
      window.setTimeout(this.drawChart.bind(this), 10);
    } else {
      const currBlock = document.querySelector(`div#${this.cfg.chartId}}`);
      // eslint-disable-next-line no-undef
      this.echart = echarts.init(currBlock);

      if ((Object.hasOwn(window, 'dataIncoming') && window.dataIncoming === true) || !Object.hasOwn(window, 'dataIncoming')) {
        window.setTimeout(this.drawChart.bind(this), 30);
      } else if (Object.hasOwn(window, 'dataIncoming') && window.dataIncoming === false) {
        // query complete, hide loading graphic
        this.data = window.dashboard[this.cfg.data].results.data;
        document.querySelectorAll('div.loading').forEach((loading) => {
          loading.style.display = 'none';
        });

        const labels = this.data.map((row) => row[`${this.cfg['label-key']}`]);
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
      }
    }
  }
}
