// Chart configuration
const chartServiceConfig = {
  endpoint: 'https://helix-pages.anywhere.run/helix-services/run-query@v3/rum-pageviews.chart',
  chartDisplay: {
    type: 'line',
    data: {
      labels: '@day',
      datasets: [{
        data: '@pageviews',
        fill: false,
        borderColor: '#eb3639',
        borderWidth: 5,
        pointRadius: 0,
      }],
    },
    options: {
      legend: {
        display: false,
      },
      scales: {
        xAxes: [{
          display: false,
          gridLines: {
            display: false,
          },
        }],
        yAxes: [{
          display: false,
          gridLines: {
            display: false,
          },
        }],
      },
    },
  },
};

export default chartServiceConfig;
