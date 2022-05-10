import { Doughnut } from 'react-chartjs-2'
export const CircleChart = () => {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Booking',
        data: [5, 3, 4, 7, 5, 2.5, 8, 10],
        backgroundColor: [
          'rgba(173,216,260,8)',
          'rgba(190,60,18,8)',
          'rgba(119,204,143,8)',
        ],
      },
    ],
  }
  const options = {
    title: {
      display: true,
      text: 'Doughnut Chart',
    },
  }
  return <Doughnut data={data} options={options} />
}
