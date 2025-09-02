import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js'
import { useEffect, useState } from 'react'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

export default function Chart({ symbol }) {
  const [labels, setLabels] = useState([])
  const [prices, setPrices] = useState([])

  useEffect(() => {
    fetch(`/api/stocks/prices/${symbol}/`)
      .then(r => r.json())
      .then(data => {
        setLabels(data.labels || [])
        setPrices(data.prices || [])
      })
  }, [symbol])

  const data = {
    labels,
    datasets: [
      {
        label: symbol,
        data: prices,
        borderColor: 'rgba(99, 102, 241, 1)',
        backgroundColor: 'rgba(99, 102, 241, 0.2)'
      }
    ]
  }

  return <Line data={data} />
}


