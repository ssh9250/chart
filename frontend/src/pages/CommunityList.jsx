import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import GlassCard from '../components/GlassCard'

export default function CommunityList() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch('/api/community/posts/')
      .then(r => r.json())
      .then(setPosts)
      .catch(() => setPosts([]))
  }, [])

  return (
    <div className="container">
      <GlassCard>
        <h2>커뮤니티</h2>
        <ul className="list">
          {posts.map(p => (
            <li key={p.id}>
              <Link to={`/community/${p.id}`}>{p.title}</Link>
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  )
}


