import './TextColumns.css';

interface Column {
  title: string;
  text: string;
}

interface TextColumnsProps {
  columns: Column[];
}

export default function TextColumns({ columns }: TextColumnsProps) {
  return (
    <section className="text-columns">
      <div className="text-columns-inner container">
        {columns.map((col) => (
          <div key={col.title} className="text-col">
            <h2 className="text-col-title">{col.title}</h2>
            <blockquote className="text-col-body">{col.text}</blockquote>
          </div>
        ))}
      </div>
    </section>
  );
}
