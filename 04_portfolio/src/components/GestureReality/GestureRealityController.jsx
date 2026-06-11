import React, { Suspense, lazy } from 'react'
import { useGestureStore } from '../../store/useGestureStore'

// Lazy load the heavy 3D canvas
const GestureCanvas = lazy(() => import('./PhysicsWorld/GestureCanvas'))

export default function GestureRealityController({ theme, onClose }) {
  const mode = useGestureStore((state) => state.mode)
  const setMode = useGestureStore((state) => state.setMode)

  // Initialize directly to ACTIVE since loading sequence was removed
  React.useEffect(() => {
    setMode('ACTIVE')

    return () => {
      setMode('INACTIVE')
    }
  }, [setMode])

  return (
    <>
      {mode === 'ACTIVE' && (
        <Suspense fallback={null}>
          <GestureCanvas theme={theme} onClose={onClose} />
        </Suspense>
      )}
    </>
  )
}
