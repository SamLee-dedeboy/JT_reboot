import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-funding container">
        <div className="footer-funding-text">
          <h2 className="footer-funding-title">Project Funding</h2>
          <blockquote className="footer-funding-body">
            This project is supported by the University of California's Multicampus Research Programs
            and Initiatives (MRPI) grant, which funds system-wide, cross-campus collaborative research
            of significance to the State of California.
          </blockquote>
        </div>
        <div className="footer-funding-logo">
          <img src="/images/uc-logo-white.png" alt="University of California" />
        </div>
      </div>
      <div className="footer-bottom container">
        <p className="footer-brand">Just Transitions in the Delta</p>
        <p className="footer-copy">&copy; {new Date().getFullYear()} All rights reserved.</p>
        <a href="mailto:just.transitions@ucdavis.edu" className="footer-email">
          just.transitions@ucdavis.edu
        </a>
        <p className="footer-org">UC Multicampus Research Program Initiative</p>
      </div>
    </footer>
  );
}
