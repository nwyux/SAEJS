import {
    Chart,
    Colors,
    BubbleController,
    CategoryScale,
    LinearScale,
    PointElement,
    Legend
  } from 'chart.js'
  
  Chart.register(
    Colors,
    BubbleController,
    PointElement,
    CategoryScale,
    LinearScale,
    Legend
  );
import { getDimensions } from './api'

(async function() {
  const data = await getDimensions();

  function mapping(row) {
    return {
        x: row.width,
        y: row.height,
        r: row.count
    }
  }

  function tiky(value) {
    if(value % 100 != 0)
        return "" 
    return (value / 100) + "m"
  }

  const chartAreaBorder = {
    id: 'chartAreaBorder',

    beforeDraw(chart, args, options) {
      const { ctx, chartArea: { left, top, width, height } } = chart;

      ctx.save();
      ctx.strokeStyle = options.borderColor;
      ctx.lineWidth = options.borderWidth;
      ctx.setLineDash(options.borderDash || []);
      ctx.lineDashOffset = options.borderDashOffset;
      ctx.strokeRect(left, top, width, height);
      ctx.restore();
    }
  };

  new Chart(
    document.getElementById('dimensions'),
    {
      type: 'bubble',
      plugins: [ chartAreaBorder ],
      options: {
        aspectRatio: 1,
        scales: {
            x: {
                max: 500,
                ticks: {
                    callback: tiky
                }
            },
            y: {
                max: 500,
                ticks: {
                    callback: tiky
                }
            }
        },
        plugins: {
            chartAreaBorder: {
              borderColor: 'red',
              borderWidth: 2,
              borderDash: [ 5, 5 ],
              borderDashOffset: 2,
            }
        }
        },
      data: {
        labels: data.map(x => x.year),
        datasets: [
            {
              label: 'width = height',
              data: data
                .filter(row => row.width === row.height)
                .map(mapping)
            },
            {
              label: 'width > height',
              data: data
                .filter(row => row.width > row.height)
                .map(mapping)
            },
            {
              label: 'width < height',
              data: data
                .filter(row => row.width < row.height)
                .map(mapping)
            }
          ]
      },
    }
  );
})();