import React, { useState, useEffect } from 'react'
import styles from './ChibiKing.module.css'

const DIALOGUES = {
  start: {
    text: "Halt! You stand before King Alistair, sovereign ruler of this React portfolio. State your purpose, traveler!",
    options: [
      { label: "🏰 Tell me about this realm", next: "realm" },
      { label: "💎 I'm here for your jewels!", next: "heist" },
      { label: "💰 Can I have some gold?", next: "gold" },
      { label: "👑 Why are you so small?", next: "small" },
      { label: "❌ Farewell, Your Majesty", action: "close" }
    ]
  },
  realm: {
    text: "This is the Drona Portfolio Realm, powered by CSS grids and fast ML models. I sit here looking adorable while Drona compiles code.",
    options: [
      { label: "⚔️ Who guards this place?", next: "guards" },
      { label: "↩️ Let's discuss something else", next: "start" }
    ]
  },
  guards: {
    text: "My elite guards patrol the fort! They only walk in straight lines and reverse at walls, but if you stand in their line of sight, you are busted!",
    options: [
      { label: "🎮 I want to try the game!", action: "openGame" },
      { label: "↩️ Understood, Your Majesty", next: "start" }
    ]
  },
  heist: {
    text: "Aha! A thief! If you want my jewels, click the 🎮 Controller in the sidebar or challenge me right here! But you will never steal my crown or escape my fort!",
    options: [
      { label: "🎮 Launch the Heist!", action: "openGame" },
      { label: "↩️ Just kidding, I'll go back", next: "start" }
    ]
  },
  gold: {
    text: "Gold? For a peasant? Go write some clean JavaScript code, and maybe I will toss a copper coin. Now shoo!",
    options: [
      { label: "↩️ Back to questions", next: "start" }
    ]
  },
  small: {
    text: "How dare you! I am not small, I am 'compact' and 'stylized'! It is the vector SVG coordinate system! Bow before my chibi majesty!",
    options: [
      { label: "👑 You do look majestic", next: "majestic" },
      { label: "↩️ Let's change the subject", next: "start" }
    ]
  },
  majestic: {
    text: "Hmph! Naturally. I shall let you live. Now, do you have any real business with me?",
    options: [
      { label: "↩️ Ask another question", next: "start" }
    ]
  }
}

export default function ChibiKing({ openGame }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentNode, setCurrentNode] = useState('start')
  const [showPrompt, setShowPrompt] = useState(true)

  // Periodic greeting prompt bubble
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPrompt(true)
    }, 4000)
    return () => clearTimeout(timer)
  }, [isOpen])

  const handleOptionClick = (option) => {
    if (option.action === 'close') {
      setIsOpen(false)
      setCurrentNode('start')
    } else if (option.action === 'openGame') {
      setIsOpen(false)
      setCurrentNode('start')
      if (openGame) openGame()
    } else if (option.next) {
      setCurrentNode(option.next)
    }
  }

  const activeNode = DIALOGUES[currentNode] || DIALOGUES.start

  return (
    <div className={styles.widgetWrapper}>
      {/* Floating King Character */}
      <div 
        className={`${styles.kingContainer} ${isOpen ? styles.hidden : ''}`}
        onClick={() => {
          setIsOpen(true)
          setShowPrompt(false)
        }}
      >
        {showPrompt && (
          <div className={styles.promptBubble}>
            Speak, peasant! 👑
            <div className={styles.promptArrow} />
          </div>
        )}

        <div className={styles.kingCharacter}>
          <svg viewBox="0 0 100 100" className={styles.kingSvg}>
            {/* Cape */}
            <path d="M25 70 L15 88 L85 88 L75 70 Z" fill="#6b1a1a" stroke="#2e200f" strokeWidth="1.5" />
            <path d="M28 70 L19 88 L32 88 Z" fill="#eebb2f" />
            <path d="M72 70 L81 88 L68 88 Z" fill="#eebb2f" />
            
            {/* Body */}
            <rect x="35" y="63" width="30" height="23" rx="5" fill="#1a1108" stroke="#3d2c15" strokeWidth="1.5" />
            <path d="M35 63 C40 70, 60 70, 65 63" fill="none" stroke="#eebb2f" strokeWidth="2.5" />
            
            {/* Head */}
            <circle cx="50" cy="50" r="21" fill="#fcdbb0" stroke="#3d2c15" strokeWidth="1.5" />
            
            {/* Crown */}
            <path d="M31 34 L36 21 L50 29 L64 21 L69 34 Z" fill="#eebb2f" stroke="#3d2c15" strokeWidth="1.5" />
            {/* Gems */}
            <circle cx="36" cy="22" r="2" fill="#ff4757" />
            <circle cx="50" cy="30" r="2" fill="#a855f7" />
            <circle cx="64" cy="22" r="2" fill="#ff4757" />
            <circle cx="50" cy="21" r="1.2" fill="#fff" />
            
            {/* Eyes */}
            <circle cx="43" cy="50" r="3.5" fill="#3d2c15" />
            <circle cx="44.5" cy="48.5" r="1.2" fill="#ffffff" />
            <circle cx="57" cy="50" r="3.5" fill="#3d2c15" />
            <circle cx="58.5" cy="48.5" r="1.2" fill="#ffffff" />
            
            {/* Mustache */}
            <path d="M43 56 Q50 51 57 56 Q50 59 43 56" fill="#7a6448" stroke="#3d2c15" strokeWidth="0.8" />
            
            {/* Blush */}
            <circle cx="38" cy="54" r="1.8" fill="#ff4757" opacity="0.35" />
            <circle cx="62" cy="54" r="1.8" fill="#ff4757" opacity="0.35" />
          </svg>
        </div>
      </div>

      {/* RPG Dialogue Conversation Panel */}
      <div className={`${styles.dialogPanel} ${isOpen ? styles.visible : ''}`}>
        {/* Header */}
        <div className={styles.dialogHeader}>
          <div className={styles.dialogHeaderLeft}>
            <span className={styles.dialogHeaderCrown}>👑</span>
            <div>
              <div className={styles.kingName}>King Alistair</div>
              <div className={styles.kingStatus}>Sovereign Chibi</div>
            </div>
          </div>
          <button 
            className={styles.closeDialogBtn} 
            onClick={() => {
              setIsOpen(false)
              setCurrentNode('start')
            }}
            title="Close Dialogue"
          >
            ✖
          </button>
        </div>

        {/* Dialogue Body */}
        <div className={styles.dialogBody}>
          <div className={styles.kingAvatarLarge}>
            <svg viewBox="0 0 100 100" className={styles.avatarLargeSvg}>
              {/* Crown */}
              <path d="M31 34 L36 21 L50 29 L64 21 L69 34 Z" fill="#eebb2f" stroke="#3d2c15" strokeWidth="1.5" />
              <circle cx="36" cy="22" r="2" fill="#ff4757" />
              <circle cx="50" cy="30" r="2" fill="#a855f7" />
              <circle cx="64" cy="22" r="2" fill="#ff4757" />
              
              {/* Head */}
              <circle cx="50" cy="50" r="21" fill="#fcdbb0" stroke="#3d2c15" strokeWidth="1.5" />
              
              {/* Eyes */}
              <circle cx="43" cy="50" r="3.5" fill="#3d2c15" />
              <circle cx="44.5" cy="48.5" r="1.2" fill="#ffffff" />
              <circle cx="57" cy="50" r="3.5" fill="#3d2c15" />
              <circle cx="58.5" cy="48.5" r="1.2" fill="#ffffff" />
              
              {/* Mustache */}
              <path d="M43 56 Q50 51 57 56 Q50 59 43 56" fill="#7a6448" stroke="#3d2c15" strokeWidth="0.8" />
              <circle cx="38" cy="54" r="1.8" fill="#ff4757" opacity="0.35" />
              <circle cx="62" cy="54" r="1.8" fill="#ff4757" opacity="0.35" />
            </svg>
          </div>
          
          <div className={styles.dialogText}>
            "{activeNode.text}"
          </div>
        </div>

        {/* Options List */}
        <div className={styles.dialogOptions}>
          {activeNode.options.map((opt, idx) => (
            <button 
              key={idx} 
              className={styles.dialogOptBtn} 
              onClick={() => handleOptionClick(opt)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
