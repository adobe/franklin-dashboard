/**
 * select appropriate DOM operations and tie them to the type of chart, data being plotted; some charts require different 
 * eventhandling and other DOM level operations that can be specified below.
 * @param {*} tableAndColumn 
 * @param {*} chartId 
 * @param {*} paramData 
 * @returns 
 */
export function postPlotDomEngineering(tableAndColumn, chartId, paramData){
    //make urls in chart selectable
    const urlChartDomOps = `\ndocument.getElementById('${chartId}').querySelectorAll('svg > g > text[x="0"][y="0"]').forEach((cell, idx, nodeList) => {
        cell.innerHTML = '<a href="/screens/franklin?url=' + cell.innerHTML + '&' + '${paramData.toString()}">' + cell.innerHTML + '</a>';
    });\n`
  
    const commonDomOps = `\nnew ResizeObserver(() => {
        myChart.resize();
      }).observe(currBlock);\n`
  
    /* ------------------------------------------------------------------------- */
    //ADD ANOTHER SET OF INLINE JS THAT HANDLES DOM MANIPULATION BELOW.
  
    const DOM_CONFIG = {
      'rum-dashboard-avglcp': urlChartDomOps + commonDomOps,
      'rum-dashboard-avgfid': urlChartDomOps + commonDomOps,
      'rum-dashboard-avgcls': urlChartDomOps + commonDomOps,
      //cashub queries
      'daily-rum-avglcp': commonDomOps,
      'daily-rum-avgfid': commonDomOps,
      'daily-rum-avgcls': commonDomOps,
    }
    return DOM_CONFIG[tableAndColumn];
  }
  
  export function prePlotDomEngineering(tableAndColumn, chartId, block){
        const commonDomOps = `
        //Make Chart Below
        const currBlock = document.querySelector('div#${block.id}.${block.className.split(' ').join('.')}');
        // construct canvas where chart will sit
        const canvasWrapper = document.createElement('div');
        canvasWrapper.id = '${chartId}';
        currBlock.append(canvasWrapper);
        let myChart = echarts.init(canvasWrapper, null, { renderer: 'svg' });
        `

        const DOM_CONFIG = {
            'rum-dashboard-avglcp': commonDomOps,
            'rum-dashboard-avgfid': commonDomOps,
            'rum-dashboard-avgcls': commonDomOps,
            //cashub queries
            'daily-rum-avglcp': commonDomOps,
            'daily-rum-avgfid': commonDomOps,
            'daily-rum-avgcls': commonDomOps,
          }
    return DOM_CONFIG[tableAndColumn]
}