import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout/DashboardLayout';
import PageShell from '../../components/PageShell/PageShell';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import Button from '../../components/ui/Button/Button';
import Input from '../../components/ui/Input/Input';
import './LinksPage.css';

const initialLinks = [
  { id: 1, name: 'Wiley study paper', url: 'https://faseb.onlinelibrary.wiley.com/doi/abs/10.1096/fj.00-0361com' },
  { id: 2, name: 'ScienceDirect article', url: 'https://www.sciencedirect.com/science/article/pii/S0031320301000668' },
];

const MAX_LINK_NAME_LENGTH = 60;
const MAX_URL_LENGTH = 200;

export default function LinksPage() {
  const [links, setLinks] = useState(initialLinks);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [linkName, setLinkName] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkError, setLinkError] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const openAddLink = () => {
    setIsAddOpen(true);
    setLinkError('');
  };

  const cancelAddLink = () => {
    setIsAddOpen(false);
    setLinkName('');
    setLinkUrl('');
    setLinkError('');
  };

  const validateUrl = (value) => {
    try {
      const normalized = value.trim();
      if (!normalized) return false;
      const parsed = new URL(normalized.startsWith('http') ? normalized : `https://${normalized}`);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  };

  const handleAddLink = (event) => {
    event.preventDefault();
    const trimmedName = linkName.trim();
    const trimmedUrl = linkUrl.trim();

    if (!trimmedName || !trimmedUrl || !validateUrl(trimmedUrl)) {
      setLinkError('Please provide a valid link name and URL.');
      return;
    }

    const nextLink = {
      id: Date.now(),
      name: trimmedName.slice(0, MAX_LINK_NAME_LENGTH),
      url: trimmedUrl.startsWith('http') ? trimmedUrl : `https://${trimmedUrl}`,
    };

    setLinks((prev) => [nextLink, ...prev]);
    setLinkName('');
    setLinkUrl('');
    setLinkError('');
    setIsAddOpen(false);
  };

  const copyLink = async (id, url) => {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 1400);
    } catch {
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 1400);
    }
  };

  const deleteLink = (id) => {
    setLinks((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <DashboardLayout>
      <PageShell>
        <div className="links-page">
          <div className="links-page__grid">
            <DashboardCard className="widget-moodle">
              <div className="wcard__eyebrow">PORTAL</div>
              <h3 className="wcard__title">UPMin Moodle</h3>
              <p className="wcard__desc" style={{ flexGrow: 1, marginBottom: '20px' }}>
                Access course materials, assignments, and grades.
              </p>
              <button 
                className="wcard__btn wcard__btn--full" 
                onClick={() => window.open('https://moodle.upmin.edu.ph/login/index.php', '_blank', 'noopener,noreferrer')}
              >
                Open Moodle
              </button>
            </DashboardCard>

            <DashboardCard className="widget-classroom">
              <div className="wcard__eyebrow">PORTAL</div>
              <h3 className="wcard__title">Google Classroom</h3>
              <p className="wcard__desc" style={{ flexGrow: 1, marginBottom: '20px' }}>
                Manage your class discussions and submissions.
              </p>
              <button 
                className="wcard__btn wcard__btn--full" 
                onClick={() => window.open('https://classroom.google.com/', '_blank', 'noopener,noreferrer')}
              >
                Open Classroom
              </button>
            </DashboardCard>
          </div>

          <div className="links-card">
            <div className="links-card__header">
              <h2 className="links-card__title">Resource Vault</h2>
              <button type="button" className="links-card__add-btn" aria-label="Add a link" onClick={openAddLink}>
                + Add link
              </button>
            </div>

            {isAddOpen && (
              <form className="links-card__add-panel" onSubmit={handleAddLink}>
                <div className="links-card__field-row">
                  <Input
                    value={linkName}
                    onChange={(e) => {
                      setLinkName(e.target.value.slice(0, MAX_LINK_NAME_LENGTH));
                      if (linkError) setLinkError('');
                    }}
                    placeholder="Link name"
                    aria-label="Link name"
                    maxLength={MAX_LINK_NAME_LENGTH}
                  />
                  <Input
                    value={linkUrl}
                    onChange={(e) => {
                      setLinkUrl(e.target.value.slice(0, MAX_URL_LENGTH));
                      if (linkError) setLinkError('');
                    }}
                    placeholder="URL"
                    aria-label="Link URL"
                    inputMode="url"
                    maxLength={MAX_URL_LENGTH}
                  />
                </div>
                <div className="links-card__actions">
                  <Button type="button" variant="ghost" onClick={cancelAddLink}>
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </div>
                {linkError && <p className="links-card__error">{linkError}</p>}
              </form>
            )}

            <ul className="links-list" role="list">
              {links.map((link) => (
                <li key={link.id} className="links-list__item">
                  <span className="links-list__label" title={link.name}>
                    {link.name}
                  </span>
                  <div className="links-list__actions">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="links-list__copy-btn"
                      onClick={() => copyLink(link.id, link.url)}
                    >
                      {copiedId === link.id ? 'Copied' : 'Copy'}
                    </Button>
                    <button
                      type="button"
                      className="links-list__icon-btn links-list__icon-btn--danger"
                      onClick={() => deleteLink(link.id)}
                      aria-label={`Delete ${link.name}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PageShell>
    </DashboardLayout>
  );
}
