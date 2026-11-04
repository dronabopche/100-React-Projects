/* eslint-disable */
// Reliefwave — Originkit

import * as React from "react"
import { useEffect, useRef } from "react"


/** Tuning values. Stripped at publish; the tuned values are baked in here. */
const ADVANCED_DEFAULTS = {
    orbit: 12000,
    startAngle: 135,
    elevation: 25,
    elevationSwing: 15,
    period: 66,
    relief: 8,
    ambient: 100,
    diffuse: 75,
    specular: 23,
    shininess: 36,
    occlusion: 55,
    shadowColor: "#141B2B",
    lift: 3,
    linen: 10,
    linenSize: 3,
    seed: 7,
    waveSpacing: 7,
    waveWidth: 3,
    ringSize: 9,
    dotSpacing: 7,
    softness: 1,
    pointerRadius: 20,
    pointerBoost: 35,
    pointerElevation: 35,
    grain: 0,
    vignette: 0,
    hover: 50,
}

// ── moved controls (builder) ──
/**
 * Controls moved in the builder: into Advanced, out of it, or into groups of
 * their own. The code reads each one where it was first written, so the props
 * are put back in that shape before anything reads them.
 */
const MOVED_CONTROLS = {"into":{},"out":{"hover":"advanced"}}
const GROUP_FALLBACKS = { advanced: ADVANCED_DEFAULTS }
function withMovedControls(props) {
    const out = { ...props }
    for (const [k, g] of Object.entries(MOVED_CONTROLS.into)) out[k] = props?.[g]?.[k] ?? GROUP_FALLBACKS[g]?.[k]
    for (const [k, g] of Object.entries(MOVED_CONTROLS.out)) {
        if (out[k] !== undefined) out[g] = { ...(out[g] ?? {}), [k]: out[k] }
    }
    return out
}
// ── /moved controls ──

// ── relief tile (reference units: one repeat is 557 × 660) ──
const REF_W = 557
const REF_H = 660
const TAU = Math.PI * 2
const LV = { floor: 0.26, groove: 0.16, wave: 0.6, plate: 0.52, raised: 0.64, dimple: 0.38, ridge: 0.8 }

const num = (v, d) => (typeof v === "number" && isFinite(v) ? v : d)
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const grey = (v) => {
    const c = Math.round(clamp(v, 0, 1) * 255)
    return `rgb(${c},${c},${c})`
}

function mulberry32(seed) {
    let a = seed >>> 0 || 1
    return () => {
        a = (a + 0x6d2b79f5) | 0
        let t = Math.imul(a ^ (a >>> 15), 1 | a)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

function parseColor(c, fb) {
    if (typeof c !== "string") return fb
    let s = c.trim()
    const hexIn = s.match(/#[0-9a-f]{3,8}\b/i)
    if (s[0] !== "#" && !/^rgba?\(/i.test(s) && hexIn) s = hexIn[0]
    if (s[0] === "#") {
        let h = s.slice(1)
        if (h.length === 3 || h.length === 4) h = h.split("").map((x) => x + x).join("")
        const n = parseInt(h.slice(0, 6), 16)
        if (h.length >= 6 && !isNaN(n)) return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
        return fb
    }
    const m = s.match(/rgba?\(([^)]+)\)/i)
    if (m) {
        const p = m[1].split(/[\s,\/]+/).filter(Boolean).map(parseFloat)
        if (p.length >= 3 && p.slice(0, 3).every((v) => isFinite(v))) return [p[0] / 255, p[1] / 255, p[2] / 255]
    }
    return fb
}

function blobPath(ctx, cx, cy, rx, ry, ph, wob, lobes, scallop = false) {
    ctx.beginPath()
    const N = scallop ? 160 : 72
    for (let i = 0; i <= N; i++) {
        const t = (i / N) * TAU
        const w = scallop
            ? wob * (Math.abs(Math.sin(t * lobes * 0.5 + ph)) - 0.6)
            : wob * Math.sin(lobes * t + ph) + wob * 0.45 * Math.sin((lobes + 2) * t + ph * 1.7)
        const x = cx + Math.cos(t) * rx * (1 + w)
        const y = cy + Math.sin(t) * ry * (1 + w)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
    }
    ctx.closePath()
}

function rrect(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2)
    ctx.beginPath()
    ctx.moveTo(x + rr, y)
    ctx.arcTo(x + w, y, x + w, y + h, rr)
    ctx.arcTo(x + w, y + h, x, y + h, rr)
    ctx.arcTo(x, y + h, x, y, rr)
    ctx.arcTo(x, y, x + w, y, rr)
    ctx.closePath()
}

function circle(ctx, x, y, r) {
    ctx.beginPath()
    ctx.arc(x, y, Math.max(0.2, r), 0, TAU)
}

function fillStroke(ctx, level, lw) {
    ctx.fillStyle = grey(level)
    ctx.fill()
    ctx.strokeStyle = grey(LV.ridge)
    ctx.lineWidth = lw
    ctx.stroke()
}

function moat(ctx, lw = 6) {
    ctx.strokeStyle = grey(LV.groove)
    ctx.lineWidth = lw
    ctx.stroke()
}

// Draw a shape at every half-drop lattice copy that touches the tile, so the tile repeats seamlessly.
function stamp(ctx, box, draw) {
    for (let a = -1; a <= 1; a++) {
        for (let b = -2; b <= 2; b++) {
            const ox = a * REF_W
            const oy = a * REF_H * 0.5 + b * REF_H
            if (box[2] + ox < 0 || box[0] + ox > REF_W || box[3] + oy < 0 || box[1] + oy > REF_H) continue
            ctx.save()
            ctx.translate(ox, oy)
            draw()
            ctx.restore()
        }
    }
}

function packRings(cx, cy, rx, ry, R, rnd) {
    const out = []
    const ex = Math.max(4, rx - R * 0.9)
    const ey = Math.max(4, ry - R * 0.9)
    const md = (2 * R + 1.2) ** 2
    for (let t = 0; t < 1600 && out.length < 90; t++) {
        const x = cx + (rnd() * 2 - 1) * ex
        const y = cy + (rnd() * 2 - 1) * ey
        const dx = (x - cx) / ex
        const dy = (y - cy) / ey
        if (dx * dx + dy * dy > 1) continue
        let ok = true
        for (const o of out) {
            if ((o[0] - x) ** 2 + (o[1] - y) ** 2 < md) {
                ok = false
                break
            }
        }
        if (ok) out.push([x, y])
    }
    return out
}

function figure(ctx, x, footY, h) {
    ctx.beginPath()
    ctx.moveTo(x - h * 0.2, footY)
    ctx.lineTo(x - h * 0.1, footY - h * 0.68)
    ctx.lineTo(x + h * 0.1, footY - h * 0.68)
    ctx.lineTo(x + h * 0.2, footY)
    ctx.closePath()
    fillStroke(ctx, LV.raised, 1)
    circle(ctx, x, footY - h * 0.8, h * 0.12)
    fillStroke(ctx, LV.raised, 1)
    ctx.beginPath()
    ctx.moveTo(x - h * 0.2, footY - h * 0.88)
    ctx.lineTo(x, footY - h * 1.02)
    ctx.lineTo(x + h * 0.2, footY - h * 0.88)
    ctx.closePath()
    fillStroke(ctx, LV.raised, 0.9)
}

function roof(ctx, cx, baseY, rw, rh, bw) {
    const half = rw / 2
    const inner = bw * 0.55
    const tipY = baseY - rh * 0.42
    const path = () => {
        ctx.beginPath()
        ctx.moveTo(cx - half, tipY)
        ctx.quadraticCurveTo(cx - inner * 1.05, baseY + rh * 0.04, cx - inner, baseY)
        ctx.lineTo(cx + inner, baseY)
        ctx.quadraticCurveTo(cx + inner * 1.05, baseY + rh * 0.04, cx + half, tipY)
        ctx.quadraticCurveTo(cx + inner * 0.75, baseY - rh * 0.55, cx + bw * 0.22, baseY - rh)
        ctx.lineTo(cx - bw * 0.22, baseY - rh)
        ctx.quadraticCurveTo(cx - inner * 0.75, baseY - rh * 0.55, cx - half, tipY)
        ctx.closePath()
    }
    path()
    moat(ctx, 4)
    fillStroke(ctx, LV.raised, 2.2)
    ctx.save()
    path()
    ctx.clip()
    ctx.strokeStyle = grey(LV.groove)
    ctx.lineWidth = 1.1
    for (let k = 1; k <= 3; k++) {
        const y = baseY - rh * (k / 4)
        ctx.beginPath()
        ctx.moveTo(cx - half, y - rh * 0.28)
        ctx.quadraticCurveTo(cx, y + rh * 0.14, cx + half, y - rh * 0.28)
        ctx.stroke()
    }
    ctx.strokeStyle = grey(LV.ridge)
    ctx.lineWidth = 1
    for (let x = cx - half + 2; x < cx + half; x += 4.5) {
        ctx.beginPath()
        ctx.moveTo(x, baseY - rh)
        ctx.lineTo(x + (x - cx) * 0.18, baseY)
        ctx.stroke()
    }
    ctx.restore()
    path()
    ctx.strokeStyle = grey(LV.ridge)
    ctx.lineWidth = 2.2
    ctx.stroke()
    for (const s of [-1, 1]) {
        circle(ctx, cx + s * half, tipY - 1.6, 2.3)
        fillStroke(ctx, LV.ridge, 0.8)
    }
}

function archPath(ctx, dx, bottom, dw, dh) {
    ctx.beginPath()
    ctx.moveTo(dx - dw / 2, bottom)
    ctx.lineTo(dx - dw / 2, bottom - dh + dw / 2)
    ctx.arc(dx, bottom - dh + dw / 2, dw / 2, Math.PI, 0)
    ctx.lineTo(dx + dw / 2, bottom)
    ctx.closePath()
}

function pagoda(ctx, cx, by, w, h, storeys) {
    rrect(ctx, cx - w * 0.5, by - h, w, h, 6)
    ctx.fillStyle = grey(0.34)
    ctx.fill()
    const terraceH = h * 0.12
    const tW = w * 0.84
    for (let s = 0; s < 2; s++) {
        const sw = tW * (1 - s * 0.1)
        const sy = by - (terraceH * (s + 1)) / 2
        ctx.beginPath()
        ctx.rect(cx - sw / 2, sy, sw, terraceH / 2)
        fillStroke(ctx, LV.plate, 1.6)
    }
    let y = by - terraceH
    const unit = (h - terraceH - h * 0.08) / storeys
    for (let i = 0; i < storeys; i++) {
        const bw = w * 0.56 * (1 - i * 0.2)
        const wh = unit * 0.55
        const rh = unit * 0.5
        ctx.beginPath()
        ctx.rect(cx - bw / 2, y - wh, bw, wh)
        fillStroke(ctx, LV.plate, 1.8)
        ctx.save()
        ctx.beginPath()
        ctx.rect(cx - bw / 2, y - wh, bw, wh)
        ctx.clip()
        ctx.strokeStyle = grey(LV.groove)
        ctx.lineWidth = 1.1
        for (let x = cx - bw / 2 + 3; x < cx + bw / 2; x += 4) {
            ctx.beginPath()
            ctx.moveTo(x, y - wh)
            ctx.lineTo(x, y)
            ctx.stroke()
        }
        ctx.restore()
        const nd = i === 0 ? 3 : 2
        const dw = bw * (i === 0 ? 0.2 : 0.16)
        const dh = wh * (i === 0 ? 0.78 : 0.55)
        for (let d = 0; d < nd; d++) {
            const dx = cx + (d - (nd - 1) / 2) * bw * (i === 0 ? 0.3 : 0.34)
            archPath(ctx, dx, y - (i === 0 ? 0 : wh * 0.15), dw, dh)
            ctx.fillStyle = grey(LV.groove)
            ctx.fill()
            ctx.strokeStyle = grey(LV.ridge)
            ctx.lineWidth = 1.6
            ctx.stroke()
        }
        if (i > 0) {
            ctx.strokeStyle = grey(LV.ridge)
            ctx.lineWidth = 1.2
            for (let x = cx - bw * 0.62; x <= cx + bw * 0.62; x += 4) {
                ctx.beginPath()
                ctx.moveTo(x, y)
                ctx.lineTo(x, y - wh * 0.22)
                ctx.stroke()
            }
        }
        roof(ctx, cx, y - wh, bw * 1.5, rh, bw)
        y = y - wh - rh * 0.78
    }
    ctx.strokeStyle = grey(LV.ridge)
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(cx, y + unit * 0.1)
    ctx.lineTo(cx, y - h * 0.06)
    ctx.stroke()
    circle(ctx, cx, y - h * 0.07, 2.4)
    fillStroke(ctx, LV.ridge, 0.8)
}

function bakeRelief(S, adv) {
    const TW = Math.round(REF_W * S)
    const TH = Math.round((REF_H * S) / 2) * 2
    const cv = document.createElement("canvas")
    cv.width = TW
    cv.height = TH
    const ctx = cv.getContext("2d")
    ctx.setTransform(TW / REF_W, 0, 0, TH / REF_H, 0, 0)
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.fillStyle = grey(LV.floor)
    ctx.fillRect(0, 0, REF_W, REF_H)

    const rnd = mulberry32(Math.round(num(adv.seed, 7)) * 7919 + 13)
    const sp = clamp(num(adv.waveSpacing, 7), 3, 24)
    const lw = clamp(num(adv.waveWidth, 3), 0.6, sp - 1)
    const R = clamp(num(adv.ringSize, 9), 4, 24)
    const ds = clamp(num(adv.dotSpacing, 7), 3, 20)

    // 1 · wavy-line water and hill fields, patch by patch
    const patches = []
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 4; c++) {
            const turn = rnd()
            patches.push({
                cx: ((c + 0.5) * REF_W) / 4 + (rnd() - 0.5) * 60,
                cy: ((r + 0.5) * REF_H) / 5 + (rnd() - 0.5) * 50,
                rx: 80 + rnd() * 35,
                ry: 62 + rnd() * 30,
                ph: rnd() * TAU,
                ang: turn < 0.65 ? (rnd() - 0.5) * 0.6 : (rnd() < 0.5 ? -1 : 1) * (0.6 + rnd() * 0.7),
                a1: 2 + rnd() * 1.8,
                l1: 16 + rnd() * 10,
                p1: rnd() * TAU,
                a2: 4 + rnd() * 10,
                l2: 80 + rnd() * 80,
                p2: rnd() * TAU,
            })
        }
    }
    for (let i = patches.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1))
        const t = patches[i]
        patches[i] = patches[j]
        patches[j] = t
    }
    for (const q of patches) {
        stamp(ctx, [q.cx - q.rx * 1.25, q.cy - q.ry * 1.25, q.cx + q.rx * 1.25, q.cy + q.ry * 1.25], () => {
            blobPath(ctx, q.cx, q.cy, q.rx, q.ry, q.ph, 0.1, 3)
            ctx.fillStyle = grey(LV.floor)
            ctx.fill()
            ctx.save()
            ctx.clip()
            ctx.translate(q.cx, q.cy)
            ctx.rotate(q.ang)
            const Rm = Math.max(q.rx, q.ry) * 1.35
            const n = Math.ceil(Rm / sp) + 3
            const steps = Math.ceil((2 * Rm) / 2.5)
            ctx.strokeStyle = grey(LV.wave)
            ctx.lineWidth = lw
            for (let k = -n; k <= n; k++) {
                ctx.beginPath()
                for (let s = 0; s <= steps; s++) {
                    const x = -Rm + s * 2.5
                    const y = k * sp + q.a1 * Math.sin((x * TAU) / q.l1 + k * 0.5 + q.p1) + q.a2 * Math.sin((x * TAU) / q.l2 + k * 0.07 + q.p2)
                    if (s === 0) ctx.moveTo(x, y)
                    else ctx.lineTo(x, y)
                }
                ctx.stroke()
            }
            ctx.restore()
            blobPath(ctx, q.cx, q.cy, q.rx, q.ry, q.ph, 0.1, 3)
            ctx.strokeStyle = grey(LV.groove)
            ctx.lineWidth = 2.5
            ctx.stroke()
        })
    }

    // 2 · motifs
    const draws = []
    const add = (box, fn) => draws.push([box, fn])

    const bubble = (cx, cy, rx, ry) => {
        const ph = rnd() * TAU
        const lobes = 9 + Math.floor(rnd() * 4)
        const rings = packRings(cx, cy, rx, ry, R, rnd)
        add([cx - rx - 8, cy - ry - 8, cx + rx + 8, cy + ry + 26], () => {
            rrect(ctx, cx - 5, cy + ry * 0.7, 10, ry * 0.3 + 22, 3)
            fillStroke(ctx, LV.raised, 2)
            blobPath(ctx, cx, cy, rx, ry, ph, 0.07, lobes, true)
            moat(ctx)
            ctx.fillStyle = grey(LV.plate)
            ctx.fill()
            ctx.save()
            ctx.clip()
            for (const [x, y] of rings) {
                circle(ctx, x, y, R + 0.9)
                ctx.fillStyle = grey(LV.groove)
                ctx.fill()
                circle(ctx, x, y, R - 1.5)
                ctx.strokeStyle = grey(LV.ridge)
                ctx.lineWidth = 3
                ctx.stroke()
                circle(ctx, x, y, R - 3.2)
                ctx.fillStyle = grey(LV.dimple)
                ctx.fill()
                circle(ctx, x, y, 1.7)
                ctx.fillStyle = grey(LV.ridge)
                ctx.fill()
            }
            ctx.restore()
            blobPath(ctx, cx, cy, rx, ry, ph, 0.07, lobes, true)
            ctx.strokeStyle = grey(LV.ridge)
            ctx.lineWidth = 2.4
            ctx.stroke()
        })
    }

    const stipple = (cx, cy, rx, ry) => {
        const ph = rnd() * TAU
        const dots = []
        let row = 0
        for (let y = cy - ry; y <= cy + ry; y += ds, row++) {
            for (let x = cx - rx; x <= cx + rx; x += ds) {
                const jx = x + (row & 1 ? ds / 2 : 0) + (rnd() - 0.5) * ds * 0.35
                const jy = y + (rnd() - 0.5) * ds * 0.35
                const dx = (jx - cx) / (rx - 5)
                const dy = (jy - cy) / (ry - 5)
                if (dx * dx + dy * dy < 1) dots.push([jx, jy])
            }
        }
        add([cx - rx - 8, cy - ry - 8, cx + rx + 8, cy + ry + 8], () => {
            blobPath(ctx, cx, cy, rx, ry, ph, 0.1, 4)
            moat(ctx)
            ctx.fillStyle = grey(LV.plate)
            ctx.fill()
            ctx.save()
            ctx.clip()
            ctx.fillStyle = grey(LV.ridge)
            for (const [x, y] of dots) {
                circle(ctx, x, y, 1.9)
                ctx.fill()
            }
            ctx.restore()
            blobPath(ctx, cx, cy, rx, ry, ph, 0.1, 4)
            ctx.strokeStyle = grey(LV.ridge)
            ctx.lineWidth = 2.6
            ctx.stroke()
        })
    }

    const coral = (cx, cy, r) => {
        const ph = rnd() * TAU
        const segs = []
        const grow = (x, y, ang, len, depth) => {
            const x2 = x + Math.cos(ang) * len
            const y2 = y + Math.sin(ang) * len
            segs.push([x, y, x2, y2, 1.2 + depth * 0.7])
            if (depth <= 0) return
            const spread = 0.42 + rnd() * 0.2
            grow(x2, y2, ang - spread + (rnd() - 0.5) * 0.2, len * 0.7, depth - 1)
            grow(x2, y2, ang + spread + (rnd() - 0.5) * 0.2, len * 0.7, depth - 1)
        }
        grow(cx, cy + r * 0.9, -Math.PI / 2, r * 0.55, 3)
        add([cx - r - 8, cy - r - 8, cx + r + 8, cy + r + 8], () => {
            blobPath(ctx, cx, cy, r, r * 0.92, ph, 0.06, 3)
            moat(ctx)
            ctx.fillStyle = grey(LV.raised)
            ctx.fill()
            ctx.save()
            ctx.clip()
            ctx.strokeStyle = grey(LV.groove)
            for (const s of segs) {
                ctx.lineWidth = s[4]
                ctx.beginPath()
                ctx.moveTo(s[0], s[1])
                ctx.lineTo(s[2], s[3])
                ctx.stroke()
            }
            ctx.restore()
            blobPath(ctx, cx, cy, r, r * 0.92, ph, 0.06, 3)
            ctx.strokeStyle = grey(LV.ridge)
            ctx.lineWidth = 2.2
            ctx.stroke()
        })
    }

    const fence = (x0, x1, y, h) => {
        add([x0 - 4, y - 4, x1 + 4, y + h + 4], () => {
            ctx.fillStyle = grey(LV.groove)
            ctx.fillRect(x0 - 2, y - 2, x1 - x0 + 4, h + 4)
            ctx.fillStyle = grey(LV.ridge)
            ctx.fillRect(x0, y, x1 - x0, 2.4)
            ctx.fillRect(x0, y + h - 2.4, x1 - x0, 2.4)
            for (let x = x0; x <= x1 - 1.8; x += 5) ctx.fillRect(x, y, 1.8, h)
        })
    }

    const ledge = (x0, y0, x1, y1, tilt) => {
        const cx = (x0 + x1) / 2
        const cy = (y0 + y1) / 2
        const w = x1 - x0
        const h = y1 - y0
        add([x0 - 10, y0 - 14, x1 + 10, y1 + 14], () => {
            ctx.save()
            ctx.translate(cx, cy)
            ctx.rotate(tilt)
            rrect(ctx, -w / 2, -h / 2, w, h, h / 2)
            moat(ctx, 5)
            ctx.fillStyle = grey(0.6)
            ctx.fill()
            ctx.save()
            ctx.clip()
            ctx.strokeStyle = grey(LV.groove)
            ctx.lineWidth = 1.4
            for (const f of [-0.15, 0.18]) {
                ctx.beginPath()
                for (let x = -w / 2; x <= w / 2; x += 3) {
                    const y = f * h + Math.sin(x * 0.18) * 1.2
                    if (x === -w / 2) ctx.moveTo(x, y)
                    else ctx.lineTo(x, y)
                }
                ctx.stroke()
            }
            ctx.restore()
            rrect(ctx, -w / 2, -h / 2, w, h, h / 2)
            ctx.strokeStyle = grey(LV.ridge)
            ctx.lineWidth = 2
            ctx.stroke()
            ctx.restore()
        })
    }

    stipple(295, 196, 38, 36)
    coral(390, 190, 50)
    coral(535, 220, 42)
    bubble(505, 80, 58, 58)
    bubble(55, 90, 60, 58)
    bubble(40, 255, 42, 42)
    add([250, 34, 350, 142], () => pagoda(ctx, 300, 140, 90, 100, 2))
    fence(60, 175, 162, 22)
    bubble(217, 362, 66, 78)
    ledge(385, 296, 520, 326, -0.08)
    ledge(370, 375, 470, 395, 0.04)
    add([266, 316, 394, 384], () => {
        rrect(ctx, 270, 320, 120, 60, 10)
        moat(ctx, 5)
        ctx.fillStyle = grey(0.5)
        ctx.fill()
        ctx.strokeStyle = grey(LV.ridge)
        ctx.lineWidth = 2.2
        ctx.stroke()
        ctx.strokeStyle = grey(LV.ridge)
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(322, 326)
        ctx.lineTo(350, 374)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(296, 349)
        ctx.lineTo(362, 347)
        ctx.quadraticCurveTo(352, 366, 329, 366)
        ctx.quadraticCurveTo(306, 366, 296, 349)
        ctx.closePath()
        fillStroke(ctx, LV.raised, 1.6)
        figure(ctx, 336, 349, 20)
        figure(ctx, 311, 350, 12)
    })
    add([476, 336, 564, 412], () => pagoda(ctx, 520, 410, 80, 70, 1))
    add([10, 316, 120, 482], () => pagoda(ctx, 65, 480, 100, 160, 2))
    add([326, 386, 424, 450], () => {
        const yb = 440
        const yc = (x) => yb - 10 * (1 - ((x - 375) / 45) ** 2)
        ctx.beginPath()
        for (let x = 330; x <= 420; x += 3) ctx.lineTo(x, yc(x) - 3)
        for (let x = 420; x >= 330; x -= 3) ctx.lineTo(x, yc(x) + 13)
        ctx.closePath()
        ctx.fillStyle = grey(LV.groove)
        ctx.fill()
        ctx.strokeStyle = grey(LV.ridge)
        for (const [off, w] of [
            [0, 3],
            [10, 4],
        ]) {
            ctx.lineWidth = w
            ctx.beginPath()
            for (let x = 330; x <= 420; x += 3) ctx.lineTo(x, yc(x) + off)
            ctx.stroke()
        }
        ctx.lineWidth = 1.6
        for (let x = 332; x <= 418; x += 5) {
            ctx.beginPath()
            ctx.moveTo(x, yc(x))
            ctx.lineTo(x, yc(x) + 10)
            ctx.stroke()
        }
        figure(ctx, 352, yc(352) - 1, 22)
        figure(ctx, 370, yc(370) - 1, 24)
        figure(ctx, 393, yc(393) - 1, 21)
    })
    stipple(490, 485, 66, 34)
    bubble(442, 575, 78, 82)
    stipple(267, 498, 62, 58)
    add([230, 494, 316, 592], () => pagoda(ctx, 272, 590, 75, 90, 2))
    stipple(62, 535, 48, 44)
    fence(30, 210, 585, 18)

    for (const [box, fn] of draws) stamp(ctx, box, fn)

    // 3 · soften the bevels, wrapping on the half-drop lattice
    const img = ctx.getImageData(0, 0, TW, TH)
    const d = img.data
    let h = new Float32Array(TW * TH)
    for (let i = 0; i < h.length; i++) h[i] = d[i * 4] / 255
    h = blurWrap(h, TW, TH, Math.round(clamp(num(adv.softness, 1), 0, 4)))
    for (let i = 0; i < h.length; i++) {
        const v = Math.round(clamp(h[i], 0, 1) * 255)
        d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = v
        d[i * 4 + 3] = 255
    }
    return img
}

function blurWrap(src, W, H, passes) {
    let a = src
    let b = new Float32Array(src.length)
    const half = H / 2
    for (let p = 0; p < passes; p++) {
        for (let y = 0; y < H; y++) {
            const row = y * W
            const lRow = ((y + half) % H) * W
            const rRow = ((y - half + H) % H) * W
            for (let x = 0; x < W; x++) {
                const l = x > 0 ? a[row + x - 1] : a[lRow + W - 1]
                const r = x < W - 1 ? a[row + x + 1] : a[rRow]
                b[row + x] = (l + 2 * a[row + x] + r) * 0.25
            }
        }
        let t = a
        a = b
        b = t
        for (let y = 0; y < H; y++) {
            const row = y * W
            const up = ((y - 1 + H) % H) * W
            const dn = ((y + 1) % H) * W
            for (let x = 0; x < W; x++) b[row + x] = (a[up + x] + 2 * a[row + x] + a[dn + x]) * 0.25
        }
        t = a
        a = b
        b = t
    }
    return a
}

// ── shaders ──
const VERT = `attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`

const FRAG = `precision highp float;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec2 uTexSize;
uniform float uTile;
uniform float uDrift;
uniform vec3 uL;
uniform vec3 uBase;
uniform vec3 uLight;
uniform vec3 uShadow;
uniform vec3 uBg;
uniform float uK;
uniform float uAmb;
uniform float uDif;
uniform float uSpec;
uniform float uShin;
uniform float uAO;
uniform float uLift;
uniform float uLinen;
uniform float uLinenPx;
uniform float uSeed;
uniform float uTime;
uniform float uGrain;
uniform float uVig;
uniform vec3 uMouse;
uniform float uRadius;
uniform float uBoost;
uniform float uPElev;

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }

float relief(vec2 p){
  float asp = uTexSize.x / max(uTexSize.y, 1.0);
  float c = floor(p.x / asp);
  vec2 q = vec2(p.x - c * asp, p.y - c * 0.5);
  return texture2D(uTex, vec2(q.x / asp, fract(q.y))).r;
}

float weave(vec2 p, float fade){
  vec2 r = p * 660.0 / max(uLinenPx, 0.5);
  float w = sin(r.x * 6.2831853) * sin(r.y * 6.2831853);
  float n = hash(floor(r) + uSeed) - 0.5;
  return w * (1.0 + 1.2 * n) * uLinen * fade;
}

float heightAt(vec2 p, float fade){ return relief(p) + weave(p, fade); }

void main(){
  vec2 fc = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec2 p = fc / max(uTile, 1.0) + vec2(0.0, uDrift);
  float fade = smoothstep(1.6, 3.0, uLinenPx * uTile / 660.0);
  float e = 1.0 / max(uTexSize.y, 1.0);
  float h0 = relief(p);
  float hx = heightAt(p + vec2(e, 0.0), fade) - heightAt(p - vec2(e, 0.0), fade);
  float hy = heightAt(p + vec2(0.0, e), fade) - heightAt(p - vec2(0.0, e), fade);
  vec3 n = normalize(vec3(-0.5 * hx * uK, -0.5 * hy * uK, 1.0));

  vec2 d = uMouse.xy - fc;
  float g = uMouse.z * exp(-dot(d, d) / max(2.0 * uRadius * uRadius, 1.0));
  vec2 dir = d / max(length(d), 1.0);
  vec3 Lp = normalize(vec3(dir * cos(uPElev), sin(uPElev)));
  vec3 L = normalize(mix(uL, Lp, clamp(g * 0.85, 0.0, 1.0)));

  float flatLit = uAmb + uDif * max(L.z, 0.05);
  float lam = (uAmb + uDif * max(dot(n, L), 0.0)) / max(flatLit, 0.001);
  if (lam > 1.0) lam = 1.0 + (lam - 1.0) * (1.0 + uBoost * g);
  vec3 hv = normalize(L + vec3(0.0, 0.0, 1.0));
  float sp = pow(max(dot(n, hv), 0.0), max(uShin, 1.0)) * uSpec * (1.0 + uBoost * g);
  float cav = 1.0 - smoothstep(0.2, 0.48, h0);

  vec3 col = uBase * lam;
  col = mix(col, uShadow * lam, uAO * cav);
  vec2 uv = fc / max(uRes, vec2(1.0));
  col *= 1.0 + uLift * (1.0 - uv.x - uv.y) * 0.5;
  col += uLight * sp;
  float gr = hash(fc + fract(uTime * 0.37) * 517.0) - 0.5;
  col += gr * uGrain * 0.22;
  float ar = uRes.x / max(uRes.y, 1.0);
  float vd = length((uv - 0.5) * vec2(ar, 1.0)) / length(vec2(ar, 1.0) * 0.5);
  col = mix(col, uBg, uVig * smoothstep(0.35, 1.0, vd));
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`

const UNIFORMS = [
    "uTex", "uRes", "uTexSize", "uTile", "uDrift", "uL", "uBase", "uLight", "uShadow", "uBg", "uK", "uAmb", "uDif",
    "uSpec", "uShin", "uAO", "uLift", "uLinen", "uLinenPx", "uSeed", "uTime", "uGrain", "uVig", "uMouse", "uRadius",
    "uBoost", "uPElev",
]

/**
 * Embossed Wallpaper Monochrome
 *
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 800
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function EmbossedWallpaperMonochrome(props) {
    props = withMovedControls(props)
    const {
        speed = 50,
        scale = 64,
        depth = 18,
        drift = 30,
        baseColor = "#000000",
        lightColor = "#FFFFFF",
        background = "#FFFFFF",
        style,
    } = props
    const rootRef = useRef(null)
    const canvasRef = useRef(null)
    const propsRef = useRef(props)
    propsRef.current = props

    useEffect(() => {
        const root = rootRef.current
        const canvas = canvasRef.current
        if (!root || !canvas) return

        const size = { w: 0, h: 0, dpr: 1 }
        const resize = () => {
            size.w = root.offsetWidth
            size.h = root.offsetHeight
            size.dpr = Math.min(window.devicePixelRatio || 1, 2)
            canvas.width = Math.max(1, Math.round(size.w * size.dpr))
            canvas.height = Math.max(1, Math.round(size.h * size.dpr))
        }
        resize()
        const ro = new ResizeObserver(resize)
        ro.observe(root)

        const ptr = { tx: 0, ty: 0, x: 0, y: 0, over: 0, down: false, s: 0 }
        const onMove = (e) => {
            ptr.tx = e.offsetX
            ptr.ty = e.offsetY
            if (ptr.s < 0.02) {
                ptr.x = ptr.tx
                ptr.y = ptr.ty
            }
            ptr.over = 1
        }
        const onLeave = () => {
            ptr.over = 0
        }
        const onDown = (e) => {
            onMove(e)
            ptr.down = true
        }
        const onUp = () => {
            ptr.down = false
        }
        root.addEventListener("pointermove", onMove)
        root.addEventListener("pointerenter", onMove)
        root.addEventListener("pointerleave", onLeave)
        root.addEventListener("pointerdown", onDown)
        window.addEventListener("pointerup", onUp)
        window.addEventListener("pointercancel", onUp)
        const mql = typeof window.matchMedia === "function" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null

        let raf = 0
        let gl = null
        let prog = null
        let buf = null
        let tex = null
        const U = {}
        let texW = 1
        let texH = 1
        let bakedKey = ""

        const cleanup = () => {
            cancelAnimationFrame(raf)
            ro.disconnect()
            root.removeEventListener("pointermove", onMove)
            root.removeEventListener("pointerenter", onMove)
            root.removeEventListener("pointerleave", onLeave)
            root.removeEventListener("pointerdown", onDown)
            window.removeEventListener("pointerup", onUp)
            window.removeEventListener("pointercancel", onUp)
            if (gl) {
                if (tex) gl.deleteTexture(tex)
                if (buf) gl.deleteBuffer(buf)
                if (prog) gl.deleteProgram(prog)
            }
        }

        try {
            const attrs = { antialias: false, premultipliedAlpha: false, preserveDrawingBuffer: true }
            gl = canvas.getContext("webgl2", attrs) || canvas.getContext("webgl", attrs)
            if (!gl) throw new Error("WebGL unavailable")
            const isGL2 = typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext
            const compile = (type, src) => {
                const s = gl.createShader(type)
                gl.shaderSource(s, src)
                gl.compileShader(s)
                if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader error")
                return s
            }
            const vs = compile(gl.VERTEX_SHADER, VERT)
            const fs = compile(gl.FRAGMENT_SHADER, FRAG)
            prog = gl.createProgram()
            gl.attachShader(prog, vs)
            gl.attachShader(prog, fs)
            gl.linkProgram(prog)
            gl.deleteShader(vs)
            gl.deleteShader(fs)
            if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || "link error")
            gl.useProgram(prog)
            for (const name of UNIFORMS) {
                const loc = gl.getUniformLocation(prog, name)
                if (loc === null) throw new Error(`Missing uniform ${name}`)
                U[name] = loc
            }
            buf = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, buf)
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
            const aPos = gl.getAttribLocation(prog, "aPos")
            gl.enableVertexAttribArray(aPos)
            gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)
            tex = gl.createTexture()
            gl.activeTexture(gl.TEXTURE0)
            gl.bindTexture(gl.TEXTURE_2D, tex)
            const wrap = isGL2 ? gl.REPEAT : gl.CLAMP_TO_EDGE
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
            gl.uniform1i(U.uTex, 0)
        } catch (err) {
            console.error("EmbossedWallpaperMonochrome:", err)
            return cleanup
        }

        let last = -1
        let phase = 0
        let driftOff = 0
        let clock = 0

        const frame = (now) => {
            raf = requestAnimationFrame(frame)
            const dt = last < 0 ? 0 : Math.min((now - last) / 1000, 1 / 20)
            last = now
            clock += dt
            const p = propsRef.current
            const adv = { ...ADVANCED_DEFAULTS, ...(p.advanced ?? {}) }
            const reduce = !!(mql && mql.matches)
            const sp = reduce ? 0 : Math.max(0, num(p.speed, 50)) / 50
            phase += dt * sp
            if (size.w < 2 || size.h < 2) return
            const dpr = size.dpr

            const tilePx = Math.max(
                40,
                size.h * dpr * (Math.max(5, num(adv.period, 66)) / 100) * (Math.max(10, num(p.scale, 100)) / 100)
            )
            const driftRate = (Math.max(0, num(p.drift, 30)) / 30) * (4 / 12 / 100)
            driftOff = (driftOff + (dt * sp * driftRate * size.h * dpr) / tilePx) % 1

            const S = clamp(Math.round((tilePx / REF_H) * 5) / 5, 0.6, 2.2)
            const key = [S, adv.seed, adv.waveSpacing, adv.waveWidth, adv.ringSize, adv.dotSpacing, adv.softness].join("|")
            if (key !== bakedKey) {
                bakedKey = key
                const img = bakeRelief(S, adv)
                texW = img.width
                texH = img.height
                gl.bindTexture(gl.TEXTURE_2D, tex)
                gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1)
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
            }

            const orbit = Math.max(0.5, num(adv.orbit, 12000) / 1000)
            const cyc = phase / orbit
            const theta = ((num(adv.startAngle, 135) - 360 * cyc) * Math.PI) / 180
            const phi =
                ((num(adv.elevation, 25) + num(adv.elevationSwing, 15) * 0.5 * (1 - Math.cos(TAU * cyc))) * Math.PI) / 180
            const L = [Math.cos(phi) * Math.cos(theta), -Math.cos(phi) * Math.sin(theta), Math.sin(phi)]

            const kS = 1 - Math.exp(-dt / 0.12)
            const kP = 1 - Math.exp(-dt / 0.08)
            const target = reduce ? 0 : ptr.over * (Math.max(0, num(adv.hover, 50)) / 50) * (ptr.down ? 1.5 : 1)
            ptr.s += (target - ptr.s) * kS
            ptr.x += (ptr.tx - ptr.x) * kP
            ptr.y += (ptr.ty - ptr.y) * kP

            const base = parseColor(p.baseColor ?? "#37445C", [0.216, 0.267, 0.361])
            const light = parseColor(p.lightColor ?? "#8C9BB3", [0.549, 0.608, 0.702])
            const shadow = parseColor(adv.shadowColor, [0.078, 0.106, 0.169])
            const bg = parseColor(p.background ?? "#000000", [0, 0, 0])

            gl.viewport(0, 0, canvas.width, canvas.height)
            gl.useProgram(prog)
            gl.uniform2f(U.uRes, canvas.width, canvas.height)
            gl.uniform2f(U.uTexSize, texW, texH)
            gl.uniform1f(U.uTile, tilePx)
            gl.uniform1f(U.uDrift, driftOff)
            gl.uniform3f(U.uL, L[0], L[1], L[2])
            gl.uniform3f(U.uBase, base[0], base[1], base[2])
            gl.uniform3f(U.uLight, light[0], light[1], light[2])
            gl.uniform3f(U.uShadow, shadow[0], shadow[1], shadow[2])
            gl.uniform3f(U.uBg, bg[0], bg[1], bg[2])
            gl.uniform1f(U.uK, num(adv.relief, 8) * (Math.max(0, num(p.depth, 50)) / 50))
            gl.uniform1f(U.uAmb, num(adv.ambient, 55) / 100)
            gl.uniform1f(U.uDif, num(adv.diffuse, 75) / 100)
            gl.uniform1f(U.uSpec, num(adv.specular, 15) / 100)
            gl.uniform1f(U.uShin, num(adv.shininess, 24))
            gl.uniform1f(U.uAO, num(adv.occlusion, 55) / 100)
            gl.uniform1f(U.uLift, num(adv.lift, 3) / 100)
            gl.uniform1f(U.uLinen, num(adv.linen, 10) / 1000)
            gl.uniform1f(U.uLinenPx, Math.max(1, num(adv.linenSize, 3)))
            gl.uniform1f(U.uSeed, num(adv.seed, 7))
            gl.uniform1f(U.uTime, clock)
            gl.uniform1f(U.uGrain, num(adv.grain, 0) / 100)
            gl.uniform1f(U.uVig, num(adv.vignette, 0) / 100)
            gl.uniform3f(U.uMouse, ptr.x * dpr, ptr.y * dpr, ptr.s)
            gl.uniform1f(U.uRadius, (num(adv.pointerRadius, 20) / 100) * size.w * dpr)
            gl.uniform1f(U.uBoost, num(adv.pointerBoost, 35) / 100)
            gl.uniform1f(U.uPElev, (num(adv.pointerElevation, 35) * Math.PI) / 180)
            gl.drawArrays(gl.TRIANGLES, 0, 3)
        }
        raf = requestAnimationFrame(frame)

        return cleanup
    }, [])

    return (
        <div
            ref={rootRef}
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                minWidth: 0, minHeight: 0,
                ...style,
                overflow: "hidden",
                background,
            }}
        >
            <canvas
                ref={canvasRef}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
            />
        </div>
    )
}
