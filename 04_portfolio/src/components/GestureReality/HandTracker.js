import { FilesetResolver, GestureRecognizer } from '@mediapipe/tasks-vision'

class HandTracker {
  constructor() {
    this.recognizer = null
    this.video = null
    this.lastVideoTime = -1
    this.isInitialized = false
  }

  async initialize() {
    if (this.isInitialized) return

    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm'
    )

    this.recognizer = await GestureRecognizer.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task',
        delegate: 'GPU',
      },
      runningMode: 'VIDEO',
      numHands: 2,
    })

    this.isInitialized = true
  }

  async startCamera() {
    if (!this.video) {
      this.video = document.createElement('video')
      this.video.setAttribute('playsinline', '')
      this.video.setAttribute('autoplay', '')
      this.video.setAttribute('muted', '')
      this.video.muted = true
      this.video.style.position = 'absolute'
      this.video.style.width = '1px'
      this.video.style.height = '1px'
      this.video.style.opacity = '0'
      this.video.style.pointerEvents = 'none'
      document.body.appendChild(this.video)
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      })
      this.video.srcObject = stream
      await this.video.play()
      return true
    } catch (error) {
      console.error('Error accessing webcam:', error)
      return false
    }
  }

  stopCamera() {
    if (this.video && this.video.srcObject) {
      this.video.srcObject.getTracks().forEach((track) => track.stop())
    }
    if (this.video && this.video.parentNode) {
      this.video.parentNode.removeChild(this.video)
      this.video = null
    }
  }

  detect() {
    if (
      !this.isInitialized ||
      !this.video ||
      this.video.readyState < 2 ||
      this.video.currentTime === this.lastVideoTime
    ) {
      return null
    }

    this.lastVideoTime = this.video.currentTime

    try {
      const results = this.recognizer.recognizeForVideo(
        this.video,
        performance.now()
      )
      return results
    } catch (e) {
      return null
    }
  }
}

export const handTracker = new HandTracker()
