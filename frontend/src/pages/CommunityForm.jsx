import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GlassCard from '../components/GlassCard'

export default function CommunityForm() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/community/posts/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, author: 1 })
    })
    if (res.ok) navigate('/community')
  }

  return (
    <div className="container">
      <GlassCard>
        <h2>글 작성</h2>
        <form className="stack" onSubmit={onSubmit}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="제목" />
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="내용" rows={6} />
          <button className="primary" type="submit">저장</button>
        </form>
      </GlassCard>
    </div>
  )
}


