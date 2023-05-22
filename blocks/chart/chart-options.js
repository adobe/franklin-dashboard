/**
 * This function chooses the chart option based on the endpoint and tablecolumn! Each possible table/column must have a chart config
 * as these are different types of data that mandate different types of displays
 * @param {*} typeChart 
 * @param {*} tableColumn 
 * @param {*} perfRanges 
 * @param {*} legend 
 * @param {*} min 
 * @param {*} max 
 * @returns 
 */
export const chartPicker = (endpoint, typeChart, tableColumn, perfRanges, legend, min, max) => {
    const pick = `${endpoint}-${typeChart}`;
    const CHART_CONFIG = {
      'daily-rum-line': `{
        title: {
        text: currentUrl + ' ${legend}',
        x: 'center',
        top: 15,
        },
        xAxis: {
          data: labels,
          type: 'category',
        },
        dataZoom: [
          {
              id: 'dataZoomX',
              type: 'slider',
              startValue: start,
              filterMode: 'filter'
          }
        ],
        yAxis: {
          min: ${min},
          max: ${max},
        },
        series: [
          {
            name: '${tableColumn}',
            type: 'line',
            data: series,
            markLine: {
              symbol: 'none',
              data: [
                {
                  name: 'Good',
                  yAxis: ${perfRanges[tableColumn]['good'][1]},
                  label: {
                    normal: {
                    show: true, 
                    }
                  },
                  lineStyle: {
                    width: 10,
                    normal: {
                      type:'dashed',
                      color: 'green',
                    }
                  },
                },
                {
                  name: 'Okay',
                  yAxis: ${perfRanges[tableColumn]['okay'][1]},
                  label: {
                    normal: {
                    show: true, 
                    }
                  },
                  lineStyle: {
                    width: 10,
                    normal: {
                      type:'dashed',
                      color: 'orange',
                    }
                  },
                },
                {
                  name: 'Poor',
                  yAxis: ${perfRanges[tableColumn]['poor'][0]},
                  label: {
                    normal: {
                    show: true, 
                    }
                  },
                  lineStyle: {
                    width: 10,
                    normal: {
                      type:'dashed',
                      color: 'red',
                    }
                  },
                },
              ],
              areaStyle: {
                color: '#91cc75'
              }
            },
            markArea: {
              data: [
                [
                  {
                    name: 'Good',
                    yAxis: ${perfRanges[tableColumn]['good'][0]}, //min of green area
                    itemStyle: {
                      color: 'rgba(23, 232, 30, 0.2)'
                    },
                  },
                  {
                    yAxis: ${perfRanges[tableColumn]['good'][1]}, //max of green area area
                  }
                ],
                [
                  {
                    name: 'Needs Improvement',
                    yAxis: ${perfRanges[tableColumn]['okay'][0]}, //min of green area
                    itemStyle: {
                      color: 'rgba(256, 256, 256, 0.4)'
                    },
                  },
                  {
                    yAxis: ${perfRanges[tableColumn]['okay'][1]}, //max of green area area
                  }
                ],
              ]
            },
          }
        ]
      };`,
      'rum-dashboard-bar-horizontal': `{
        title: {
          text: '${legend}',
          x: 'center',
        },
        tooltip: {},
        legend: {
          data: ['${tableColumn}']
        },
        xAxis: {
          min: ${min},
          max: ${max},
        },
        yAxis: {
          data: labels,
          triggerEvent: true,
        },
        grid: {
          containLabel: true,
        },
        series: [
          {
            type: 'bar',
            data: series,
          }
        ]
      };`,
    };
    return `var option = ` + CHART_CONFIG[pick];
  };