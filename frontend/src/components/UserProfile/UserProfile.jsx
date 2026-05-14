import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import avatarSrc from '../../assets/dashboard/avatar.png';
import './UserProfile.css';

const NAME_MAX_LENGTH = 20;

function PencilIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}

export default function UserProfile({ subtitle, className = '' }) {
  const { user, updateProfile, uploadAvatar } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(user?.name?.slice(0, NAME_MAX_LENGTH) ?? 'User');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl ?? null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('No file selected');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const previewUrlRef = useRef(null);

  useEffect(() => {
    setName(user?.name?.slice(0, NAME_MAX_LENGTH) ?? 'User');
    setAvatarPreview(user?.avatarUrl ?? null);
    setSelectedFileName(user?.avatarUrl ? 'Current profile picture' : 'No file selected');
    setSelectedFile(null);
  }, [user?.name, user?.avatarUrl]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const avatarUrl = avatarPreview || avatarSrc;

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const nextUrl = URL.createObjectURL(file);
    previewUrlRef.current = nextUrl;
    setAvatarPreview(nextUrl);
    setSelectedFileName(file.name);
    setSelectedFile(file);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Display name cannot be empty.');
      return;
    }

    setSaving(true);
    setError('');
    
    try {
      // 1. If there's a new file, upload it first
      if (selectedFile) {
        await uploadAvatar(selectedFile);
      }

      // 2. Update name (this will also refresh the user state globally)
      await updateProfile({
        name: name.trim()
      });

      setEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name?.slice(0, NAME_MAX_LENGTH) ?? 'User');
    setAvatarPreview(user?.avatarUrl ?? null);
    setSelectedFileName(user?.avatarUrl ? 'Current profile picture' : 'No file selected');
    setError('');
    setEditing(false);
  };

  const displayName = name.trim() || 'User';

  return (
    <div className={`user-profile ${className}`.trim()}>
      <img src={avatarUrl} alt={`${displayName} profile`} className="user-profile__avatar" />
      <div className="user-profile__content">
        <div className="user-profile__title-row">
          <h1 className="user-profile__title">Hello {displayName}!</h1>
          <button
            type="button"
            className="user-profile__edit"
            aria-label="Edit profile"
            onClick={() => setEditing(true)}
          >
            <PencilIcon />
          </button>
        </div>
        <p className="user-profile__subtitle">{subtitle}</p>

        {editing && (
          <div className="user-profile__editor">
            <div className="user-profile__field">
              <label htmlFor="profile-name" className="user-profile__label">
                Display name
              </label>
              <input
                id="profile-name"
                className="user-profile__input"
                value={name}
                onChange={(event) => {
                  setName(event.target.value.slice(0, NAME_MAX_LENGTH));
                  if (error) setError('');
                }}
                placeholder="Enter display name"
                maxLength={NAME_MAX_LENGTH}
              />
            </div>
            <div className="user-profile__field">
              <span className="user-profile__label">Profile picture</span>
              <div className="user-profile__upload-row">
                <button
                  type="button"
                  className="user-profile__upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose file
                </button>
                <span className="user-profile__upload-meta">{selectedFileName}</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
            {error && <p className="user-profile__error">{error}</p>}
            <div className="user-profile__actions">
              <button
                type="button"
                className="user-profile__action user-profile__action--ghost"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="user-profile__action user-profile__action--primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
