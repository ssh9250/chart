import Chart from '../components/Chart'
import GlassCard from '../components/GlassCard'

export default function Home() {
  return (
    <div className="container">
      <GlassCard>
        <h2>차트</h2>
        <Chart symbol="AAPL" />
      </GlassCard>
    </div>
  )
}


