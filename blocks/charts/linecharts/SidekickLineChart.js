import Chart from '../chartClass.js';

export default class SidekickLineChart extends Chart {
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
      const legendEndpoint = this.cfg['legend-data'];
      const legendField = this.cfg['legend-field'];
      const flag = `${endpoint}Flag`;
      const legendFlag = `${legendEndpoint}Flag`;
      if(!Object.hasOwn(window, 'chartGroup')){
        window.chartGroup = [];
      }
      if(endpoint !== 'sidekick-by-url' || endpoint !== 'sidekick-by-hostname'){
        this.echart.group = 'group1';
        window.chartGroup.push(this.echart);
      }

      if (((Object.hasOwn(window, flag) && window[flag] === true) || !Object.hasOwn(window, flag))
      || (legendEndpoint && ((Object.hasOwn(window, legendFlag) && window[legendFlag] === true)
    || !Object.hasOwn(window, legendFlag)))) {
        window.setTimeout(this.drawChart.bind(this), 5);
      } else if (Object.hasOwn(window, flag) && window[flag] === false) {
        // query complete, hide loading graphic
        this.data = window.dashboard[this.cfg.data].results.data;
        document.querySelectorAll('div.loading').forEach((loading) => {
          loading.style.display = 'none';
        });

        const lbl = this.cfg['label-key'];
        const reverseData = [...this.data].reverse();

        const labels = reverseData.map((row) => {
          const res = row[`${lbl}`];
          return res.length > 10 ? res.substring(0, 10) : res;
        });

        const series = reverseData.map((row) => row[`${this.cfg.field}`]);
        const title = this.cfg.label;
        const params = new URLSearchParams(window.location.href);
        let opts;

        if (legendEndpoint && Object.hasOwn(window.dashboard, legendEndpoint) && this.data) {
          const legendArr = ['day'];
          const legendMap = {};
          window.dashboard[legendEndpoint].results.data.forEach((val) => {
            const { checkpoint } = val;
            if (!Object.hasOwn(legendMap, checkpoint)) {
              const arr = [];
              legendMap[checkpoint.substring(9)] = arr;
            }
            legendArr.push(checkpoint.substring(9));
            this.legendArray = legendArr;
            this.legendMap = legendMap;
          });
          this.year_map = {};
          let lastDay;
          const dataset = [];
          let lastRow = {};
          const seriesType = [];
          for (let i = 0; i < Object.keys(legendMap).length; i += 1) {
            seriesType.push({ type: 'bar', stack: 'Total' });
          }
          this.data.forEach((row) => {
            const { day, checkpoint, invocations } = row;
            if (!lastDay) {
              lastDay = day;
            }
            if (lastDay && !(day === lastDay)) {
              dataset.push(lastRow);
              lastDay = day;
              lastRow = {};
            }
            if (!Object.hasOwn(lastRow, 'day')) {
              lastRow.day = day;
            }
            lastRow[checkpoint.substring(9)] = invocations;
          });
          if (endpoint === 'sidekick-by-hostname') {
            dataset.reverse();
          }
          opts = {
            title: {
              text: `${title}\n${params.get('url')}`,
              top: 0,
              x: 'center',
            },
            legend: {
              orient: 'horizontal',
              extraCssText: 'width: fit-content; height: fit-content;',
              bottom: 0,
              x: 'left'
            },
            toolbox: {
              feature: {
                restore: {},
                saveAsImage: {},
              },
            },
            dataZoom: [
              {
                type: 'inside',
                show: false,
                start: 0,
                end: 100,
              },
            ],
            tooltip: {
                enterable: true,
                confine: true,
                extraCssText: 'width: fit-content; height: fit-content;',
                order: 'valueDesc'
              },
            dataset: {
              dimensions: this.legendArray,
              source: dataset,
            },
            xAxis: { type: 'category' },
            yAxis: {},
            series: seriesType,
          };
        } else {
          opts = {
            title: {
              text: `${title}\n${params.get('url')}`,
              x: 'center',
            },
            lineStyle: {
              color: `#${(0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)}`,
            },
            tooltip: {
                enterable: true,
                trigger: 'axis',
                confine: true,
                extraCssText: 'width: fit-content; height: fit-content;',
                order: 'valueDesc'
              },
            toolbox: {
              feature: {
                restore: {},
                saveAsImage: {},
              },
            },
            dataZoom: [
              {
                type: 'inside',
                show: false,
                start: 0,
                end: 100,
              },
            ],
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
                itemStyle: {
                  color: `#${(0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)}`,
                },
              },
            ],
          };
        }
        this.configureEchart(opts);
        this.echart.setOption(opts);
        this.hideLoader(this.cfg.block);
        if(!Object.hasOwn(window, 'connected')){
            window.connected = 0;
            window.connected = window.connected + 1;
        }else{
            window.connected = window.connected + 1;
            if(window.connected === 3){
              echarts.connect('group1');
              echarts.connect(window.chartGroup);
            }
        }
      }
    }
  }
}
