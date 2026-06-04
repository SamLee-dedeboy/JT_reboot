/* What If? — the validated question text, presented as a crossfading banner.
   Copy is verbatim; only the presentation changes. */
const WHATIF_QUESTIONS = [
  { text: 'What if we considered a wide range of future scenarios for equitable water management in the Delta, under a shifting climate of uncertainty?',
    keywords: ['future scenarios', 'equitable water management', 'uncertainty'] },
  { text: 'What would these scenarios look like?',
    keywords: ['scenarios'] },
  { text: 'How might these scenarios compare amongst the many social and ecological factors at play?',
    keywords: ['social and ecological factors'] },
  { text: 'What potential benefits and tradeoffs would need to be considered in each of these futures?',
    keywords: ['benefits and tradeoffs'] },
  { text: 'How might these adaptation scenarios support a framework for Just Transitions in the Delta?',
    keywords: ['Just Transitions in the Delta'] },
];

function highlightKeywords(text, keywords) {
  if (!keywords || !keywords.length) return text;
  const escaped = keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const re = new RegExp(`(${escaped.join('|')})`, 'g');
  return text.split(re).map((part, i) =>
    keywords.includes(part) ? <mark key={i} className="hl">{part}</mark> : part
  );
}

function WhatIf({ interval = 5200, motionOff = false }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (motionOff || paused) return;
    const id = setInterval(() => setI((n) => (n + 1) % WHATIF_QUESTIONS.length), interval);
    return () => clearInterval(id);
  }, [interval, motionOff, paused]);

  if (motionOff) {
    // Static, fully-readable fallback: stacked list
    return (
      <section className="whatif whatif-static" id="whatif">
        <div className="container">
          <div className="whatif-eyebrow">What if?</div>
          <ol className="whatif-list">
            {WHATIF_QUESTIONS.map((q, n) => (
              <li key={n}><span className="whatif-num">{String(n + 1).padStart(2, '0')}</span>{highlightKeywords(q.text, q.keywords)}</li>
            ))}
          </ol>
          <a href="#" className="btn btn-primary whatif-cta">View Adaptation Scenarios <Icon name="arrow-right" size={18} /></a>
        </div>
      </section>
    );
  }

  return (
    <section
      className="whatif" id="whatif"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="whatif-bg" aria-hidden="true" />
      <div className="container whatif-inner">
        <div className="whatif-eyebrow">What if?</div>

        <div className="whatif-stage" aria-live="polite">
          {WHATIF_QUESTIONS.map((q, n) => (
            <p key={n} className={`whatif-q ${n === i ? 'active' : ''}`} aria-hidden={n !== i}>{highlightKeywords(q.text, q.keywords)}</p>
          ))}
        </div>

        <div className="whatif-controls">
          <div className="whatif-dots">
            {WHATIF_QUESTIONS.map((_, n) => (
              <button
                key={n}
                className={`whatif-drop ${n === i ? 'on' : ''}`}
                onClick={() => setI(n)}
                aria-label={`Question ${n + 1}`}
              >
                <Icon name="drop" size={22} stroke="var(--brand-blue)" />
              </button>
            ))}
          </div>
        </div>

        <a href="#" className="btn btn-primary whatif-cta">View Adaptation Scenarios <Icon name="arrow-right" size={18} /></a>
      </div>
    </section>
  );
}

window.WhatIf = WhatIf;
window.WHATIF_QUESTIONS = WHATIF_QUESTIONS;
