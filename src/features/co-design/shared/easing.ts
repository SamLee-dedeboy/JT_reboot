// Svelte's cubicOut easing, (t − 1)³ + 1, kept from the original Svelte dashboard.
export const cubicOut = (t: number) => (t - 1) ** 3 + 1
