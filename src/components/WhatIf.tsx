import './WhatIf.css';

export default function WhatIf() {
  return (
    <section className="what-if">
      <div className="what-if-inner container">
        <div className="what-if-text">
          <h2 className="what-if-heading">What If?</h2>
          <blockquote className="what-if-quote">
            What if we considered a wide range of future scenarios for equitable water management
            in the Delta, under a shifting climate of uncertainty? What would these scenarios look
            like? How might these scenarios compare amongst the many social and ecological factors
            at play? What potential benefits and tradeoffs would need to be considered in each of
            these futures? How might these adaptation scenarios support a framework for Just
            Transitions in the Delta?
          </blockquote>
        </div>
        <div className="what-if-image">
          <img src="/images/delta-aerial.jpg" alt="Aerial view of the Sacramento-San Joaquin Delta" className="what-if-photo" />
        </div>
      </div>
    </section>
  );
}
