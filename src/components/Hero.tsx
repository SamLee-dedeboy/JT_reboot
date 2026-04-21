import './Hero.css';
import { assetUrl } from '../utils/baseUrl';

export default function Hero() {
  return (
    <section className="hero">
      <img
        src={assetUrl('/images/hero-title.png')}
        alt="Just Transitions in the Delta — Envisioning adaptation strategies in the Sacramento-San Joaquin Delta under conditions of drought, salinity and sea-level rise."
        className="hero-image"
      />
    </section>
  );
}
