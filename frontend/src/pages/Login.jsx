import GlassCard from '../components/GlassCard'

export default function Login() {
  return (
    <div className="container">
      <GlassCard>
        <h2>로그인</h2>
        <form className="stack">
          <input placeholder="아이디" />
          <input placeholder="비밀번호" type="password" />
          <button className="primary">로그인</button>
        </form>
      </GlassCard>
    </div>
  )
}


