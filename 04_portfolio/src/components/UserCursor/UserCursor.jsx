import * as React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    animate,
} from "motion/react"
import styles from "./UserCursor.module.css"

const COMPONENT_DEFAULTS = {
    color: "#eebb2f",
    size: 26,
    pressScale: 0.9,
    offsetX: 0,
    offsetY: 0,
    showLabel: true,
    name: "Drona",
    labelTiltStrength: 25,
    labelOffsetUseDefault: true,
    labelOffsetX: 22,
    labelOffsetY: 10,
}

function CursorLayer(props) {
    const {
        visible,
        arrowX,
        arrowY,
        labelX,
        labelY,
        labelRotation,
        scale,
        showLabel,
        size,
        name,
    } = props

    return (
        <div className={styles.cursorContainer}>
            {/* View Work styled Specular Glow Pill Label */}
            {showLabel && (
                <motion.div
                    className={styles.labelPill}
                    style={{
                        x: labelX,
                        y: labelY,
                        rotate: labelRotation,
                        scale,
                        opacity: visible ? 1 : 0,
                    }}
                >
                    <span className={styles.labelText}>{name}</span>
                </motion.div>
            )}

            {/* Specular Styled Arrow */}
            <motion.div
                className={styles.cursorArrow}
                style={{
                    x: arrowX,
                    y: arrowY,
                    scale,
                    width: size,
                    height: size,
                    opacity: visible ? 1 : 0,
                }}
            >
                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ display: "block", overflow: "visible" }}
                >
                    <defs>
                        <linearGradient id="cursorGoldGrad" x1="5" y1="3" x2="23" y2="24" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#fff3db" />
                            <stop offset="40%" stopColor="#ffd700" />
                            <stop offset="100%" stopColor="#c8870c" />
                        </linearGradient>
                        <filter id="cursorSpecularGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#ffd700" floodOpacity="0.6" />
                        </filter>
                    </defs>
                    <path
                        d="M5 3 L23 14 L14 16 L11 24 Z"
                        fill="url(#cursorGoldGrad)"
                        stroke="#140d07"
                        strokeWidth={1.2}
                        strokeLinejoin="round"
                        filter="url(#cursorSpecularGlow)"
                    />
                    {/* Inner highlight line on the arrow crest */}
                    <path
                        d="M6.5 5.5 L19 13.5 L13.5 14.8 L11.2 21 Z"
                        stroke="rgba(255, 255, 255, 0.7)"
                        strokeWidth={0.8}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </motion.div>
        </div>
    )
}

export default function UserCursor(rawProps) {
    const props = { ...COMPONENT_DEFAULTS, ...rawProps }
    const {
        name,
        size,
        labelTiltStrength,
        showLabel,
        offsetX,
        offsetY,
        labelOffsetX,
        labelOffsetY,
        labelOffsetUseDefault,
        pressScale,
        offset: offsetOverride,
        labelOffset: labelOffsetOverride,
    } = props

    const [isTouchDevice, setIsTouchDevice] = useState(false)
    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return
        const mql = window.matchMedia("(pointer: coarse)")
        const sync = () => setIsTouchDevice(!!mql.matches)
        sync()
        if (mql.addEventListener) {
            mql.addEventListener("change", sync)
            return () => mql.removeEventListener("change", sync)
        }
        mql.addListener?.(sync)
        return () => mql.removeListener?.(sync)
    }, [])

    const [hovering, setHovering] = useState(false)
    const [pressed, setPressed] = useState(false)

    const arrowSpring = useMemo(
        () => ({ stiffness: 480, damping: 32, mass: 0.45 }),
        []
    )
    const labelSpringCfg = useMemo(
        () => ({ stiffness: 240, damping: 26, mass: 0.65 }),
        []
    )

    const resolvedOffset = useMemo(
        () => ({
            x: offsetOverride?.x ?? offsetX,
            y: offsetOverride?.y ?? offsetY,
        }),
        [offsetOverride?.x, offsetOverride?.y, offsetX, offsetY]
    )

    const resolvedLabelOffset = useMemo(() => {
        if (labelOffsetOverride) {
            return {
                x: labelOffsetOverride.x ?? size * 0.9,
                y: labelOffsetOverride.y ?? size * 0.2 + 6,
            }
        }
        if (labelOffsetUseDefault) {
            return { x: size * 0.9, y: size * 0.2 + 6 }
        }
        return { x: labelOffsetX, y: labelOffsetY }
    }, [
        labelOffsetOverride?.x,
        labelOffsetOverride?.y,
        labelOffsetUseDefault,
        labelOffsetX,
        labelOffsetY,
        size,
    ])

    const mouseX = useMotionValue(-9999)
    const mouseY = useMotionValue(-9999)

    const arrowX = useSpring(mouseX, arrowSpring)
    const arrowY = useSpring(mouseY, arrowSpring)
    const labelX = useSpring(mouseX, labelSpringCfg)
    const labelY = useSpring(mouseY, labelSpringCfg)

    const scaleMV = useMotionValue(1)
    useEffect(() => {
        const controls = animate(scaleMV, pressed ? pressScale : 1, {
            type: "spring",
            stiffness: 500,
            damping: 28,
            mass: 0.5,
        })
        return () => controls.stop()
    }, [pressed, pressScale, scaleMV])

    const labelTiltTarget = useMotionValue(0)
    const labelRotation = useSpring(labelTiltTarget, {
        stiffness: 200,
        damping: 24,
        mass: 0.6,
    })

    const lastSampleRef = useRef(null)

    useEffect(() => {
        if (isTouchDevice || typeof window === "undefined") return

        const onMove = (e) => {
            const x = e.clientX
            const y = e.clientY

            const now = typeof performance !== "undefined" ? performance.now() : Date.now()
            const last = lastSampleRef.current
            let vx = 0
            let vy = 0
            if (last) {
                const dt = Math.max(1, now - last.t)
                vx = ((x - last.x) / dt) * 1000
                vy = ((y - last.y) / dt) * 1000
            }
            lastSampleRef.current = { x, y, t: now }

            mouseX.set(x + resolvedOffset.x)
            mouseY.set(y + resolvedOffset.y)

            const speed = Math.hypot(vx, vy)
            const norm = Math.min(1, speed / 1500)
            const sign = vx === 0 ? 0 : vx > 0 ? 1 : -1
            labelTiltTarget.set(sign * norm * labelTiltStrength)

            setHovering(true)
        }

        const onDown = () => setPressed(true)
        const onUp = () => setPressed(false)
        const onLeave = () => {
            setHovering(false)
            lastSampleRef.current = null
            labelTiltTarget.set(0)
        }

        window.addEventListener("mousemove", onMove, { passive: true })
        window.addEventListener("mousedown", onDown)
        window.addEventListener("mouseup", onUp)
        document.addEventListener("mouseleave", onLeave)

        return () => {
            window.removeEventListener("mousemove", onMove)
            window.removeEventListener("mousedown", onDown)
            window.removeEventListener("mouseup", onUp)
            document.removeEventListener("mouseleave", onLeave)
            setPressed(false)
        }
    }, [
        isTouchDevice,
        labelTiltStrength,
        resolvedOffset.x,
        resolvedOffset.y,
        mouseX,
        mouseY,
        labelTiltTarget,
    ])

    const visible = useMemo(() => {
        if (isTouchDevice) return false
        return hovering
    }, [isTouchDevice, hovering])

    const labelTranslateX = useTransform(
        labelX,
        (v) => v + resolvedLabelOffset.x
    )
    const labelTranslateY = useTransform(
        labelY,
        (v) => v + resolvedLabelOffset.y
    )

    if (isTouchDevice) return null

    return (
        <CursorLayer
            visible={visible}
            arrowX={arrowX}
            arrowY={arrowY}
            labelX={labelTranslateX}
            labelY={labelTranslateY}
            labelRotation={labelRotation}
            scale={scaleMV}
            showLabel={showLabel}
            size={size}
            name={name}
        />
    )
}
