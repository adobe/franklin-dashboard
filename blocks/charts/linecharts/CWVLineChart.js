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
            const {commit_date, commit_url, message, owner_repo} = val;
            if(!Object.hasOwn(this, 'defaultKey')){
              this.defaultKey = owner_repo;
            }
            if(!Object.hasOwn(poiMap, owner_repo)){
              let map = {};
              poiMap[owner_repo] = map;
            }
            poiMap[owner_repo][commit_date] = {commit_url: commit_url, message: message};
          })
          this.poi_data = poiMap;
        }

        var callback = (params) => {
          if(Object.keys(this.poi_data).length > 0 && Object.hasOwn(this.poi_data[this.defaultKey], params.name)){
            const { message, commit_url} = this.poi_data[this.defaultKey][params.name];
            return `${message ? message : 'No Message Available' }<br />
            Commit Date: ${params.name}<br/>
            <a href="${commit_url}" target='_'>Click To See Commit </a><br />`
          }
        }

        const { good, okay, poor } = this.cfg.perfRanges[this.cfg.field];

        const opts = {
          title: {
            text: `${legend}`,
          },
          grid: {
            left: 30,
            right: 110,
            bottom: 30,
            containLabel: true
          },
          legend: {
            orient: 'vertical',
            left: 10,
            show: true,
            width: 30,
            data: ['a', 'b', 'c', 'd', 'e'],
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
              symbol: 'circle',
              symbolSize: (val, param) => {
                if(Object.keys(this.poi_data).length > 0 && Object.hasOwn(this.poi_data[this.defaultKey], param.name)){
                  return 15;
                }
              },
              markLine: {
                data: [
                  {
                    name: 'Good',
                    yAxis: `${good[1]}`,
                    lineStyle: {
                      width: 10,
                      normal: {
                        type: 'dashed',
                        color: 'green',
                      },
                    },
                    label: {
                      normal: {
                        position: 'end',
                        show: true,
                      },
                    },
                  },
                  {
                    name: 'Okay',
                    yAxis: `${okay[1]}`,
                    lineStyle: {
                      width: 10,
                      normal: {
                        type: 'dashed',
                        color: 'red',
                      },
                    },
                    label: {
                      normal: {
                        position: 'end',
                        show: true,
                      },
                    },
                  },
                ],
                areaStyle: {
                  color: '#91cc75',
                },
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
