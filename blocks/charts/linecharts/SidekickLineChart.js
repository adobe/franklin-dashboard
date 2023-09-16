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
      const legend_endpoint = this.cfg['legend-data'];
      const legend_field = this.cfg['legend-field'];
      const flag = `${endpoint}Flag`;
      const legendFlag = `${legend_endpoint}Flag`;

      if (((Object.hasOwn(window, flag) && window[flag] === true) || !Object.hasOwn(window, flag)) || (legend_endpoint && ((Object.hasOwn(window, legendFlag) && window[legendFlag] === true) || !Object.hasOwn(window, legendFlag)))) {
        window.setTimeout(this.drawChart.bind(this), 5);
      } else if (Object.hasOwn(window, flag) && window[flag] === false) {
        // query complete, hide loading graphic
        this.data = window.dashboard[this.cfg.data].results.data;
        document.querySelectorAll('div.loading').forEach((loading) => {
          loading.style.display = 'none';
        });

        const lbl = this.cfg['label-key'];
        const reverseData = [...this.data].reverse();

        let labels = reverseData.map((row) => {
          let res = row[`${lbl}`]
          return res.length > 10 ? res.substring(0, 10) : res;
        });

        const series = reverseData.map((row) => row[`${this.cfg.field}`]);
        const title = this.cfg.label;
        const params = new URLSearchParams(window.location.href);
        let opts;

        if(legend_endpoint && Object.hasOwn(window.dashboard, legend_endpoint) && this.data){
            const legend_arr = ['day'];
            const legend_map = {};
            window.dashboard[legend_endpoint].results.data.forEach((val) => {
                const {checkpoint} = val;
                if(!Object.hasOwn(legend_map, checkpoint)){
                    let arr = [];
                    legend_map[checkpoint] = arr;
                }
                legend_arr.push(checkpoint);
                this.legend_array = legend_arr;
                this.legend_map = legend_map;
            });
            this.year_map = {};
            let lastDay;
            let dataset = [];
            let lastRow = {};
            let seriesType = [];
            for(let i = 0; i < Object.keys(legend_map).length; i++){
                var randomColor = Math.floor(Math.random()*16777215).toString(16);
                seriesType.push({type: 'bar', stack: 'Total'});
            }
            this.data.forEach((row) => {
                const {day, checkpoint, invocations} = row;
                if(!lastDay){
                    lastDay = day;
                }
                if(lastDay && !(day === lastDay)){
                    dataset.push(lastRow);
                    lastDay = day;
                    lastRow = {};
                }
                if(!Object.hasOwn(lastRow, 'day')){
                    lastRow['day'] = day;
                }
                lastRow[checkpoint] = invocations;
                this.legend_map[row[legend_field]].push(row[`${this.cfg.field}`]);
                this.year_map[row[`${this.cfg['label-key']}`]] = 1;

            });
            if(endpoint === 'sidekick-by-hostname'){
                dataset.reverse();
            }
            opts = {
                title: {
                    text: `${title}\n${params.get('url')}`,
                    x: 'center',
                },
                legend: {
                    orient: 'horizontal',
                    bottom: 0,
                },
                toolbox: {
                    feature: {
                      dataZoom: {
                        xAxisIndex: 'none'
                      },
                      restore: {},
                      saveAsImage: {}
                    }
                  },
                tooltip: {
                    enterable: true,
                    trigger: 'item',
                    confine: true,
                    extraCssText: "width: fit-content; height: fit-content;"
                },
                dataset: {
                  // Define the dimension of array. In cartesian coordinate system,
                  // if the type of x-axis is category, map the first dimension to
                  // x-axis by default, the second dimension to y-axis.
                  // You can also specify 'series.encode' to complete the map
                  // without specify dimensions. Please see below.
              
                  dimensions: this.legend_array,
                  source: dataset,
                },
                xAxis: { type: 'category' },
                yAxis: {},
                series: seriesType,
            };
        } else{
        opts = {
            title: {
                text: `${title}\n${params.get('url')}`,
                x: 'center',
            },
            toolbox: {
                feature: {
                  dataZoom: {
                    xAxisIndex: 'none'
                  },
                  restore: {},
                  saveAsImage: {}
                }
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
        }
        this.configureEchart(opts);
        this.echart.setOption(opts);
        this.hideLoader(this.cfg.block);
      }
    }
  }
}
