import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Wand2 } from 'lucide-react';
import Serenity from '../templates/Serenity';
import Opulence from '../templates/Opulence';
import Garden from '../templates/Garden';
import './Preview.css';

const TEMPLATES = {
  serenity: Serenity,
  opulence: Opulence,
  garden: Garden,
};

export default function Preview() {
  const { templateId } = useParams();
  const id = templateId || 'serenity';
  const TemplateComponent = TEMPLATES[id] || Serenity;

  return (
    <div className="preview-page" id="preview-page">
      <div className="preview-bar">
        <Link to="/templates" className="preview-bar__back" id="preview-back">
          <ArrowLeft size={18} />
          <span>Back to Templates</span>
        </Link>
        <div className="preview-bar__info">
          <span className="preview-bar__label">Previewing:</span>
          <span className="preview-bar__name font-heading">{id.charAt(0).toUpperCase() + id.slice(1)}</span>
        </div>
        <div className="preview-bar__actions">
          <Link to={`/customizer/${id}`} className="btn btn-primary btn-sm" id="preview-customize">
            <Wand2 size={14} /> Customize This
          </Link>
        </div>
      </div>
      <div className="preview-content">
        <TemplateComponent />
      </div>
    </div>
  );
}
