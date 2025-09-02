import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import GlassCard from '../components/GlassCard'

export default function CommunityDetail() {
  const { id } = useParams()
  const [post, setPost] = useState(null)

  useEffect(() => {
    fetch(`/api/community/posts/${id}/`)
      .then(r => r.json())
      .then(setPost)
      .catch(() => setPost(null))
  }, [id])

  if (!post) return null

  return (
    <div className="container">
      <GlassCard>
        <h2>{post.title}</h2>
        <p>{post.content}</p>
      </GlassCard>
    </div>
  )
}


