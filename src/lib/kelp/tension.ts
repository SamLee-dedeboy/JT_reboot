// Maps the [0,1] tension slider to the KelpFusion algorithm parameters.
//
// Note on direction: an SPG edge (u,v) is dropped when a detour through some
// point w is shorter than t * |uv|. By the triangle inequality a detour is
// always >= the direct distance, so t = 1 drops nothing (complete, hull-like
// graph) and larger t drops more (sparse, line-like graph). The slider label
// reads "line-based -> hull-based", so slider 0 maps to t = 2 (line) and
// slider 1 maps to t = 1 (hull).

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

/** Slider value [0,1] -> SPG tension t in [1,2] (0 = line/sparse, 1 = hull/dense). */
export function tensionToT(value: number): number {
  return 2 - clamp01(value);
}

/** Slider value [0,1] -> capsule half-width in px (denser/hull = fatter). */
export function tensionToThickness(value: number): number {
  return 14 + clamp01(value) * 16;
}
