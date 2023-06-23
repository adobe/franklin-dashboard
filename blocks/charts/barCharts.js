import { Chart } from './chart.js';
export class BarChart extends Chart {
    /* Member Data
     block: Object;
     echart: Object;
     options: Object;
     data: Object;
     chartId: string;
     cfg: Object;
     */

    constructor(cfg){
        super(cfg);
        this.block = cfg.block;
        this.cfg = cfg;
    } 

    getData() {
        if((Object.hasOwn(window, 'dataIncoming') && window['dataIncoming'] === true) || !Object.hasOwn(window, 'dataIncoming')){
            window.setTimeout(this.getData, 10);
        }
        else if(Object.hasOwn(window, 'dataIncoming') && window['dataIncoming'] === false){
            // query complete, hide loading graphic
            this.data = window['dashboard'][this.cfg.data].results.data;
            document.querySelectorAll('div.loading').forEach((loading) => {
              loading['style']['display'] = 'none';
            });
        }
    }

    setData(data){
      this.data = data;
    }

    setEchart(echart){
      this.echart = echart;
    }

    configureEchart(options) {
      this.options = options;
    }

    extraDomOperations(){
        new ResizeObserver(() => {
            this.echart.resize();
          }).observe(currBlock);
    }

    drawChart(){
      if (typeof echarts === 'undefined') {
        window.setTimeout(this.drawChart.bind(this), 10);
      } else {
        const currBlock = document.querySelector(`div#${this.cfg.chartId}`)
        this.echart = echarts.init(currBlock);

        if((Object.hasOwn(window, 'dataIncoming') && window['dataIncoming'] === true) || !Object.hasOwn(window, 'dataIncoming')){
          window.setTimeout(this.drawChart.bind(this), 30);
        }
        else if(Object.hasOwn(window, 'dataIncoming') && window['dataIncoming'] === false){
            // query complete, hide loading graphic
            this.data = window['dashboard'][this.cfg.data].results.data;
            document.querySelectorAll('div.loading').forEach((loading) => {
            loading['style']['display'] = 'none';
            });

            const labels = this.data.map(row => row[`${this.cfg['label-key']}`]);
            const series = this.data.map(row => row[`${this.cfg.field}`]);
            const legend = this.cfg.label;
            const perfRanges = this.cfg.perfRanges;
            let goodUpper;
            let goodLower;
            let okayLower;
            let okayUpper;

            if (Object.hasOwn(perfRanges, this.cfg.field) && Object.hasOwn(perfRanges[this.cfg.field], 'good') && Object.hasOwn(perfRanges[this.cfg.field], 'okay') && Object.hasOwn(perfRanges[this.cfg.field], 'poor')) {
                [goodLower, goodUpper] = perfRanges[this.cfg.field].good;
                [okayLower, okayUpper] = perfRanges[this.cfg.field].okay;
            } else{
                [goodLower, goodUpper] = ['', ''];
                [okayLower, okayUpper] = ['', ''];
            }

            const dataSize = this.data.length;
            let windowPercentage = 0.05;
            let windowSize = windowPercentage * dataSize;

            while(windowSize > 10){
            windowPercentage -= 0.01;
            windowSize = windowPercentage * dataSize;
            }

            let start = 0;
            let end = windowPercentage * 100;

            const opts = {
            title: {
                text: `${legend}`,
                x: 'center',
            },
            dataZoom: [
                {
                type: 'slider',
                yAxisIndex: 0,
                zoomLock: false,
                left: 0,
                start: start,
                end: end,
                handleSize: 30,
                },
            ],  
            tooltip: {
                trigger: "axis",
                axisPointer: {
                type: "shadow"
                },
                extraCssText: 'width: fit-content; height: fit-content;'
            },
            legend: {
                data: [`${legend}`]
            },
            grid: {
                overflow: "truncate",
            },
            xAxis: {
            },
            yAxis: {
                data: labels,
                axisLabel: {
                show: false,
                }
            },
            series: [
                {
                type: 'bar',
                data: series,
                label: {
                    position: 'insideLeft',
                    formatter: '{b}',
                    show: true,
                    color: '#000000',
                },
                markArea: {
                    data: [
                    [
                        {
                        name: 'Good',
                        xAxis: `${goodLower}`, //min of green area
                        itemStyle: {
                            color: 'rgba(221,255,221, 0.5)'
                        },
                        },
                        {
                        xAxis: `${goodUpper}`, //max of green area area
                        }
                    ],
                    [
                        {
                        name: 'Needs Improvement',
                        xAxis: `${okayLower}`, //min of green area
                        itemStyle: {
                            color: 'rgba(256, 256, 256, 0.1)'
                        },
                        },
                        {
                        xAxis: `${okayUpper}`, //max of green area area
                        }
                    ],
                    ]
                },
                markLine: {
                    data: [
                    {
                        name: 'Good',
                        xAxis: `${goodUpper}`,
                        lineStyle: {
                        width: 10,
                        normal: {
                            type:'dashed',
                            color: 'green',
                        }
                        },
                        label: {
                        normal: {
                        show: false, 
                        }
                        },
                    },
                    {
                        name: 'Okay',
                        xAxis: `${okayUpper}`,
                        lineStyle: {
                        width: 10,
                        normal: {
                            type:'dashed',
                            color: 'red',
                        }
                        },
                        label: {
                        normal: {
                        show: false, 
                        }
                        },
                    },
                    ],
                    areaStyle: {
                    color: '#91cc75'
                    }
                },
                }
            ]
            };
            this.configureEchart(opts);
            this.echart.setOption(opts)
        }
        }
    }
    }
