import './Funding.css';

export default function Funding() {
  return (
    <section className="funding">
      <div className="funding-inner container">
        <div className="funding-text">
          <h2 className="funding-title">Project Funding</h2>
          <blockquote className="funding-body">
            This project is supported by the University of California's Multicampus Research Programs
            and Initiatives (MRPI) grant, which funds system-wide, cross-campus collaborative research
            of significance to the State of California.
          </blockquote>
        </div>
        <div className="funding-logo">
          <img src="/images/uc-logo-white.png" alt="University of California" />
        </div>
      </div>
    </section>
  );
}
