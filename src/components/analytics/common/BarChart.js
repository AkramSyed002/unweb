import { Bar } from 'react-chartjs-2'
export const BarChart = () => {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Booking',
        data: [5, 3, 4, 7, 5, 2.5, 8, 10],
        borderColor: ['rgba(255,206,86,0.2)'],
        backgroundColor: [
          'rgba(54,162,235,0.2)',
          'rgba(200,72,105,0.2)',
          'rgba(150,62,135,0.2)',
        ],
      },
    ],
  }
  const options = {
    title: {
      display: true,
      text: 'Bar Chart',
    },
    scales: {
      yAxes: [
        {
          ticks: {
            min: 2,
            max: 10,
            stepSize: 2,
          },
        },
      ],
    },
  }
  return <Bar data={data} options={options} />
}
