import './InfoSection.css';

interface InfoSectionProps {
  id?: string;
  title: string;
  text: string;
  imagePosition?: 'left' | 'right';
  imageSrc?: string;
  imageAlt?: string;
  children?: React.ReactNode;
}

export default function InfoSection({
  id,
  title,
  text,
  imagePosition = 'right',
  imageSrc,
  imageAlt = '',
  children,
}: InfoSectionProps) {
  return (
    <section id={id} className="info-section">
      <div className={`info-inner container ${imagePosition === 'left' ? 'img-left' : ''}`}>
        <div className="info-text">
          <h2 className="info-title">{title}</h2>
          <blockquote className="info-body">{text}</blockquote>
          {children}
        </div>
        {imageSrc && (
          <div className="info-image">
            <img src={imageSrc} alt={imageAlt} className="info-photo" />
          </div>
        )}
      </div>
    </section>
  );
}
