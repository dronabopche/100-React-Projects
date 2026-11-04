import * as React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    animate,
} from "motion/react"

const COMPONENT_DEFAULTS = {
    color: "#eebb2f",
    size: 26,
    pressScale: 0.92,
    offsetX: 0,
    offsetY: 0,
    showLabel: true,
    name: "Drona",
    textColor: "#0c0806",
    labelTiltStrength: 25,
    labelOffsetUseDefault: true,
    labelOffsetX: 22,
    labelOffsetY: 10,
}

function CursorLayer(props) {
    const {
        layerStyle,
        visible,
        arrowX,
        arrowY,
        labelX,
        labelY,
        labelRotation,
        scale,
        showLabel,
        color,
        size,
        arrowContent,
        labelContent,
    } = props

    return (
        <div style={layerStyle}>
            {showLabel && (
                <motion.div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        x: labelX,
                        y: labelY,
                        rotate: labelRotation,
                        scale,
                        background: color,
                        borderRadius: 999,
                        padding: `${size * 0.18}px ${size * 0.36}px`,
                        boxShadow:
                            "0 4px 14px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)",
                        opacity: visible ? 1 : 0,
                        transformOrigin: "0% 50%",
                        transition: "opacity 140ms ease",
                        willChange: "transform, opacity",
                        userSelect: "none",
                        pointerEvents: "none",
                        zIndex: 999999,
                    }}
                >
                    {labelContent}
                </motion.div>
            )}

            <motion.div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    x: arrowX,
                    y: arrowY,
                    scale,
                    width: size,
                    height: size,
                    opacity: visible ? 1 : 0,
                    transformOrigin: "0% 0%",
                    transition: "opacity 140ms ease",
                    willChange: "transform, opacity",
                    pointerEvents: "none",
                    zIndex: 999999,
                }}
            >
                <div style={{ width: size, height: size }}>
                    {arrowContent}
                </div>
            </motion.div>
        </div>
    )
}

export default function UserCursor(rawProps) {
    const props = { ...COMPONENT_DEFAULTS, ...rawProps }
    const {
        name,
        arrow,
        label,
        color,
        textColor,
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
        () => ({ stiffness: 420, damping: 32, mass: 0.5 }),
        []
    )
    const labelSpringCfg = useMemo(
        () => ({ stiffness: 220, damping: 26, mass: 0.7 }),
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

    const arrowContent = useMemo(() => {
        if (typeof arrow === "function") {
            try {
                return arrow(color)
            } catch {
                return null
            }
        }
        if (arrow !== undefined && arrow !== null) return arrow
        return (
            <svg
                width={size}
                height={size}
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ display: "block", overflow: "visible" }}
            >
                <path
                    d="M5 3 L23 14 L14 16 L11 24 Z"
                    fill={color}
                    stroke="rgba(0,0,0,0.25)"
                    strokeWidth={0.7}
                    strokeLinejoin="round"
                />
            </svg>
        )
    }, [arrow, color, size])

    const labelContent = useMemo(() => {
        if (label !== undefined && label !== null) return label
        return (
            <div
                style={{
                    color: textColor,
                    fontSize: Math.max(9, size * 0.42),
                    lineHeight: 1.1,
                    fontWeight: 700,
                    fontFamily:
                        'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    whiteSpace: "nowrap",
                    letterSpacing: 0.2,
                }}
            >
                {name}
            </div>
        )
    }, [label, name, textColor, size])

    if (isTouchDevice) return null

    const layerStyle = {
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 999999,
    }

    return (
        <CursorLayer
            layerStyle={layerStyle}
            visible={visible}
            arrowX={arrowX}
            arrowY={arrowY}
            labelX={labelTranslateX}
            labelY={labelTranslateY}
            labelRotation={labelRotation}
            scale={scaleMV}
            showLabel={showLabel}
            color={color}
            size={size}
            arrowContent={arrowContent}
            labelContent={labelContent}
        />
    )
}

