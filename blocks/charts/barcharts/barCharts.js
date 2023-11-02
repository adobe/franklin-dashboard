import Chart from '../chartClass.js';

export default class BarChart extends Chart {
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

  transformData(callback = () => this.data) {
    if (typeof callback === 'function') {
      this.data = callback(this.data);
    }
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
      const flag = `${endpoint}Flag`;

      if ((Object.hasOwn(window, flag) && window[flag] === true) || !Object.hasOwn(window, flag)) {
        window.setTimeout(this.drawChart.bind(this), 5);
      } else if (Object.hasOwn(window, flag) && window[flag] === false) {
        // query complete, hide loading graphic
        this.data = [...window.dashboard[this.cfg.data].results.data].reverse();
        document.querySelectorAll('div.loading').forEach((loading) => {
          loading.style.display = 'none';
        });
        if (this.data.length === 0) {
          this.hideLoader(this.cfg.block);
          this.cfg.block.parentElement.parentElement.remove();
          return;
        }

        const { hostname, url } = this.data[0];
        const labels = this.data.map((row) => row[`${this.cfg['label-key']}`]);
        const series = this.data.map((row) => row[`${this.cfg.field}`]);
        const legend = this.cfg.label;
        const params = new URLSearchParams(window.location.search);

        let start = new Date(params.get('startdate'));
        let end = new Date(params.get('enddate'));
        const interval = params.get('interval');
        const offset = params.get('offset');
        const dateOffsetInMillis = (24 * 60 * 60 * 1000) * offset;
        const intervalInMillis = (24 * 60 * 60 * 1000) * interval;
        const currentDate = new Date();
        const today = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          0,
          0,
          0,
          0,
        );
        end = today - dateOffsetInMillis;
        start = end - intervalInMillis;
        let startdate = new Date(start).toLocaleDateString().split('T')[0];
        let enddate = new Date(end).toLocaleDateString().split('T')[0];

        let urlCut;
        if(url){
          urlCut = `${url.length <= 40 ? url : url.replace(/^https?:\/\/[^/]+/i, '').substring(0, 20)}${url.length > 40 ? (url.replace(/^https?:\/\/[^/]+/i, '').length > 40 ? '...' : '') : ''}`
        }

        const opts = {
          title: {
            text: `${legend} \n ${hostname ? hostname : urlCut} \n ${startdate} - ${enddate}`,
            x: 'center',
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
            extraCssText: 'width: fit-content; height: fit-content;',
          },
          legend: {
            data: [`${legend}`],
          },
          grid: {
            overflow: 'truncate',
          },
          toolbox: {
            feature: {
              restore: {},
              saveAsImage: {},
            },
          },
          xAxis: {
            type: 'log',
            logBase: 5,
          },
          yAxis: {
            data: labels,
            axisLabel: {
              show: false,
            },
          },
          series: [
            {
              type: 'bar',
              data: series,
              label: {
                position: 'insideLeft',
                formatter: '{b}',
                show: true,
                color: 'white',
              },
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
