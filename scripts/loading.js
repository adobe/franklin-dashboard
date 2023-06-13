/**
 * draw a loading graphic in the specified DOM element
 * @param {Element} domObj The target DOM element
 */
export async function drawLoading(domObj) {
  // check if echarts is loaded
  if (typeof echarts === 'undefined') {
    // wait 10ms and check again
    setTimeout(() => {
      drawLoading(domObj);
    }, 10);
  } else {
    // ready to draw
    const option = {
      graphic: {
        elements: [
          {
            type: 'group',
            left: 'center',
            top: 'center',
            children: new Array(7).fill(0).map((val, i) => ({
              type: 'rect',
              x: i * 20,
              shape: {
                x: 0,
                y: -40,
                width: 10,
                height: 80,
              },
              style: {
                fill: '#5470c6',
              },
              keyframeAnimation: {
                duration: 1000,
                delay: i * 200,
                loop: true,
                keyframes: [
                  {
                    percent: 0.5,
                    scaleY: 0.3,
                    easing: 'cubicIn',
                  },
                  {
                    percent: 1,
                    scaleY: 1,
                    easing: 'cubicOut',
                  },
                ],
              },
            })),
          },
        ],
      },
    };

    // eslint-disable-next-line no-undef
    echarts.init(domObj).setOption(option);
  }
}

/**
 * hide the loading graphic in the specified DOM element
 * @param {Element} domObj The target DOM element
 */
export async function hideLoading(domObj) {
  domObj.style.display = 'none';
}
