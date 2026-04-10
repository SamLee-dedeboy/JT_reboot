import PageLayout from './PageLayout';

export default function ContactUs() {
  return (
    <PageLayout title="Contact Us">
      <p>
        We'd love to hear from you. Whether you're a community member, researcher,
        policymaker, or student, there are many ways to get involved with the Just
        Transitions in the Delta project.
      </p>

      <h2>Email</h2>
      <p>
        Reach us at{' '}
        <a href="mailto:just.transitions@ucdavis.edu">just.transitions@ucdavis.edu</a>
      </p>

      <h2>Send a Message</h2>
      <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
        <input type="text" placeholder="Your Name" />
        <input type="email" placeholder="Your Email" />
        <textarea placeholder="Your Message" />
        <button type="submit">Send</button>
      </form>
    </PageLayout>
  );
}
