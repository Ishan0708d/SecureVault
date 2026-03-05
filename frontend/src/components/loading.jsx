import { useEffect, useState } from "react"

export default function Loading({ onFinish }) {
  const [unlock, setUnlock] = useState(false)

  useEffect(() => {
    // unlock animation after 1.5s
    const unlockTimer = setTimeout(() => {
      setUnlock(true)
    }, 1500)

    // open dashboard after animation
    const finishTimer = setTimeout(() => {
      if (onFinish) onFinish()
    }, 2200)

    return () => {
      clearTimeout(unlockTimer)
      clearTimeout(finishTimer)
    }
  }, [])

  return (
    <div className="loading-screen">
      <div className={`lock ${unlock ? "unlock" : ""}`}>
        <div className="shackle"></div>
        <div className="body"></div>
      </div>

      <p className="loading-text">Decrypting your vault...</p>
    </div>
  )
}