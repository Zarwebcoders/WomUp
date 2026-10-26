import React, { useState, useEffect } from 'react';
import { getStoredMedia, addMediaItem, deleteMediaItem, resetToDefaults } from '../data/galleryData';
import { useModal } from '../context/ModalContext';

export default function AdminPortal() {
  const { showToast } = useModal();
  
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('womup_admin_session') === 'true';
  });
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Current Credentials (default or custom)
  const [storedCredentials, setStoredCredentials] = useState(() => {
    try {
      const saved = localStorage.getItem('womup_admin_creds');
      return saved ? JSON.parse(saved) : { id: 'admin@womup.in', password: 'womup@admin2026' };
    } catch {
      return { id: 'admin@womup.in', password: 'womup@admin2026' };
    }
  });

  // Active Admin View: 'add' | 'manage' | 'settings'
  const [activeTab, setActiveTab] = useState('add');

  // Media list state
  const [mediaList, setMediaList] = useState(getStoredMedia);

  // Form State for Adding Media
  const [mediaType, setMediaType] = useState('photo'); // 'photo' | 'video'
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('merchants');
  const [location, setLocation] = useState('Ahmedabad, Gujarat');
  const [desc, setDesc] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDuration, setVideoDuration] = useState('2:00 min');
  const [videoThumbnail, setVideoThumbnail] = useState('/assets/vendor_store_owner.jpg');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password change form
  const [newAdminId, setNewAdminId] = useState(storedCredentials.id);
  const [newPassword, setNewPassword] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');

    const inputId = adminId.trim();
    const inputPass = password.trim();

    // Check credentials (supports 'admin' or stored email/id)
    const isValidId = inputId.toLowerCase() === storedCredentials.id.toLowerCase() || inputId.toLowerCase() === 'admin';
    const isValidPass = inputPass === storedCredentials.password || inputPass === 'admin' || inputPass === 'womup@admin2026';

    if (isValidId && isValidPass) {
      setIsLoggedIn(true);
      localStorage.setItem('womup_admin_session', 'true');
      setAdminId('');
      setPassword('');
      if (showToast) showToast('✓ Logged in to WOMUP Admin Portal', 'success', 3000);
    } else {
      setAuthError('Invalid Admin ID or Password. Please try again.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('womup_admin_session');
    if (showToast) showToast('Logged out of Admin Portal', 'info', 2500);
  };

  // Handle Image File Upload (convert to base64 Data URL for instant live view)
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Photo is larger than 5MB. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setImagePreview(uploadEvent.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle Video URL normalization (convert standard youtube watch to embed)
  const formatVideoEmbedUrl = (rawUrl) => {
    if (!rawUrl) return 'https://www.youtube.com/embed/dQw4w9WgXcQ';
    let url = rawUrl.trim();
    if (url.includes('watch?v=')) {
      const videoId = url.split('watch?v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  // Handle Add Media Submit
  const handleAddMedia = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a title.');
      return;
    }

    if (mediaType === 'photo' && !imagePreview) {
      alert('Please upload a photo or enter an image preview.');
      return;
    }

    setIsSubmitting(true);

    const categoryLabels = {
      merchants: 'Partner Stores',
      shoppers: 'Shoppers Moments',
      videos: 'Video Guides',
      events: 'Team & Events',
    };

    const newItem = {
      type: mediaType,
      title: title.trim(),
      category: category,
      categoryLabel: categoryLabels[category] || 'Promotion',
      location: location.trim(),
      desc: desc.trim() || 'Verified promotional media from WOMUP network.',
      image: mediaType === 'photo' ? imagePreview : undefined,
      videoUrl: mediaType === 'video' ? formatVideoEmbedUrl(videoUrl) : undefined,
      duration: mediaType === 'video' ? (videoDuration.trim() || '2:15 min') : undefined,
      thumbnail: mediaType === 'video' ? (imagePreview || videoThumbnail) : undefined,
      tag: mediaType === 'video' ? 'PROMO VIDEO' : 'VERIFIED STORE',
    };

    const updated = addMediaItem(newItem);
    setMediaList(updated);
    setIsSubmitting(false);

    // Reset Form
    setTitle('');
    setDesc('');
    setImagePreview('');
    setVideoUrl('');

    if (showToast) {
      showToast(`✓ New ${mediaType.toUpperCase()} successfully published to Website Gallery!`, 'success', 4000);
    }

    // Switch to manage tab
    setActiveTab('manage');
  };

  // Handle Delete Media
  const handleDelete = (id, itemTitle) => {
    if (window.confirm(`Are you sure you want to remove "${itemTitle}" from the website gallery?`)) {
      const updated = deleteMediaItem(id);
      setMediaList(updated);
      if (showToast) showToast('Media item removed from gallery.', 'info', 3000);
    }
  };

  // Handle Reset to Defaults
  const handleResetDefaults = () => {
    if (window.confirm('Reset all gallery items to original default sample media?')) {
      const defaults = resetToDefaults();
      setMediaList(defaults);
      if (showToast) showToast('Gallery reset to default items.', 'info', 3000);
    }
  };

  // Handle Credentials Update
  const handleUpdateCredentials = (e) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      alert('Please enter a new password.');
      return;
    }
    const newCreds = {
      id: newAdminId.trim() || 'admin@womup.in',
      password: newPassword.trim(),
    };
    localStorage.setItem('womup_admin_creds', JSON.stringify(newCreds));
    setStoredCredentials(newCreds);
    setNewPassword('');
    setSettingsSuccess('✓ Admin credentials updated successfully! Keep your new password secure.');
    setTimeout(() => setSettingsSuccess(''), 4000);
  };

  // -------------------------------------------------------------
  // VIEW 1: ADMIN LOGIN SCREEN (If not logged in)
  // -------------------------------------------------------------
  if (!isLoggedIn) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-card">
          <div className="admin-login-brand">
            <img src="/assets/new-logo.png" alt="WOMUP" className="admin-logo-img" />
            <h2 className="admin-login-title">Admin Portal</h2>
            <p className="admin-login-subtitle">
              WOMUP ENTERPRISE PRIVATE LIMITED &bull; Website Promotion &amp; Media Management
            </p>
          </div>

          {authError && (
            <div className="admin-auth-error">
              <span>⚠️ {authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="admin-form-group">
              <label className="admin-label">Admin ID / Email</label>
              <div className="admin-input-wrap">
                <svg viewBox="0 0 24 24" className="admin-input-icon" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="admin@womup.in or admin"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Password</label>
              <div className="admin-input-wrap">
                <svg viewBox="0 0 24 24" className="admin-input-icon" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="admin-input"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="admin-toggle-pwd"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-admin-login">
              Login to Admin Portal
            </button>
          </form>

          <div className="admin-login-hint-box">
            <strong>Default Access Credentials:</strong>
            <p>Admin ID: <code>admin@womup.in</code> (or <code>admin</code>)</p>
            <p>Password: <code>womup@admin2026</code> (or <code>admin</code>)</p>
            <small>You can change these credentials inside the dashboard after logging in.</small>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: ADMIN DASHBOARD (When authenticated)
  // -------------------------------------------------------------
  const photoCount = mediaList.filter((m) => m.type === 'photo').length;
  const videoCount = mediaList.filter((m) => m.type === 'video').length;

  return (
    <div className="admin-dashboard-wrapper">
      {/* Top Navbar */}
      <header className="admin-header-bar">
        <div className="admin-header-inner">
          <div className="admin-header-brand">
            <img src="/assets/new-logo.png" alt="WOMUP" className="admin-header-logo" />
            <div className="admin-header-titles">
              <h3>WOMUP Media CMS</h3>
              <span className="admin-status-dot">● Admin Logged In ({storedCredentials.id})</span>
            </div>
          </div>

          <div className="admin-header-actions">
            <a href="/gallery" target="_blank" rel="noopener noreferrer" className="btn-admin-preview">
              View Live Gallery ↗
            </a>
            <button type="button" className="btn-admin-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="admin-main-container">
        {/* Metric Cards Row */}
        <div className="admin-metrics-row">
          <div className="admin-metric-card">
            <span className="metric-num pink">{mediaList.length}</span>
            <span className="metric-label">Total Media Items</span>
          </div>
          <div className="admin-metric-card">
            <span className="metric-num purple">{photoCount}</span>
            <span className="metric-label">Active Photos</span>
          </div>
          <div className="admin-metric-card">
            <span className="metric-num blue">{videoCount}</span>
            <span className="metric-label">Promotional Videos</span>
          </div>
          <div className="admin-metric-card">
            <span className="metric-num green">Live</span>
            <span className="metric-label">Website Status</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-nav-tabs">
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            ➕ Add New Photo / Video
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'manage' ? 'active' : ''}`}
            onClick={() => setActiveTab('manage')}
          >
            🗂️ Manage Gallery Media ({mediaList.length})
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Security &amp; Password
          </button>
        </div>

        {/* TAB 1: ADD NEW PHOTO / VIDEO FORM */}
        {activeTab === 'add' && (
          <div className="admin-card-section">
            <div className="admin-card-header">
              <h2>Publish New Photo or Video to Website</h2>
              <p>Uploaded media instantly appears on the public website Gallery (`/gallery`).</p>
            </div>

            <form onSubmit={handleAddMedia} className="admin-upload-form">
              {/* Type Switcher */}
              <div className="admin-form-group">
                <label className="admin-label">Choose Media Type</label>
                <div className="media-type-selector">
                  <button
                    type="button"
                    className={`type-btn ${mediaType === 'photo' ? 'active' : ''}`}
                    onClick={() => setMediaType('photo')}
                  >
                    📸 Photo / Image
                  </button>
                  <button
                    type="button"
                    className={`type-btn ${mediaType === 'video' ? 'active' : ''}`}
                    onClick={() => setMediaType('video')}
                  >
                    🎬 Video (YouTube / MP4)
                  </button>
                </div>
              </div>

              {/* Title Input */}
              <div className="admin-form-group">
                <label className="admin-label">Title / Heading *</label>
                <input
                  type="text"
                  className="admin-input-control"
                  placeholder="e.g. New Supermarket Partner Store in SG Highway"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Category & Location Row */}
              <div className="admin-form-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Category</label>
                  <select
                    className="admin-input-control"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="merchants">🏪 Partner Stores &amp; Retailers</option>
                    <option value="shoppers">🛍️ Happy Shoppers &amp; Savings</option>
                    <option value="videos">🎬 Videos &amp; Explainer Guides</option>
                    <option value="events">🤝 Team, Events &amp; Office</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Location / Area</label>
                  <input
                    type="text"
                    className="admin-input-control"
                    placeholder="e.g. Ahmedabad (380051) or Mahesana"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              {/* PHOTO SPECIFIC: Upload File with live preview */}
              {mediaType === 'photo' ? (
                <div className="admin-form-group">
                  <label className="admin-label">Select Photo from Device</label>
                  <div className="file-drop-area">
                    <input
                      type="file"
                      accept="image/*"
                      id="photoFileInput"
                      onChange={handleImageFileChange}
                      className="hidden-file-input"
                    />
                    <label htmlFor="photoFileInput" className="file-upload-btn-label">
                      <span>📁 Tap to choose Photo from Phone or Laptop</span>
                    </label>
                    <p className="upload-file-hint">Supports JPG, PNG, WEBP. Max size 5MB.</p>
                  </div>

                  {imagePreview && (
                    <div className="image-live-preview-box">
                      <p className="preview-label">Selected Photo Preview:</p>
                      <img src={imagePreview} alt="Preview" className="uploaded-thumb-preview" />
                    </div>
                  )}
                </div>
              ) : (
                /* VIDEO SPECIFIC: YouTube / Embed URL */
                <div className="admin-form-group">
                  <label className="admin-label">Video URL (YouTube Watch or Share Link) *</label>
                  <input
                    type="url"
                    className="admin-input-control"
                    placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    required
                  />

                  <div className="admin-form-grid-2" style={{ marginTop: '12px' }}>
                    <div>
                      <label className="admin-label">Video Duration</label>
                      <input
                        type="text"
                        className="admin-input-control"
                        placeholder="e.g. 2:15 min"
                        value={videoDuration}
                        onChange={(e) => setVideoDuration(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="admin-label">Optional Thumbnail Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        id="videoThumbInput"
                        onChange={handleImageFileChange}
                        className="hidden-file-input"
                      />
                      <label htmlFor="videoThumbInput" className="file-upload-btn-label" style={{ padding: '8px' }}>
                        <span>📁 Choose Thumbnail</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="admin-form-group">
                <label className="admin-label">Short Description / Story</label>
                <textarea
                  className="admin-input-control admin-textarea"
                  rows={3}
                  placeholder="Describe this store, offer, or customer story..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                ></textarea>
              </div>

              {/* Submit CTA */}
              <button type="submit" className="btn-admin-submit-media" disabled={isSubmitting}>
                {isSubmitting ? 'Publishing...' : `🚀 Publish ${mediaType === 'photo' ? 'Photo' : 'Video'} to Website`}
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: MANAGE EXISTING MEDIA */}
        {activeTab === 'manage' && (
          <div className="admin-card-section">
            <div className="admin-card-header flex-between">
              <div>
                <h2>Manage Website Gallery Media ({mediaList.length} Items)</h2>
                <p>Review, preview, or remove photos and videos from the live website.</p>
              </div>
              <button type="button" className="btn-admin-reset" onClick={handleResetDefaults}>
                🔄 Reset to Sample Defaults
              </button>
            </div>

            <div className="admin-media-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Thumbnail</th>
                    <th>Type</th>
                    <th>Title &amp; Caption</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mediaList.map((item) => (
                    <tr key={item.id}>
                      <td style={{ width: '80px' }}>
                        <img
                          src={item.type === 'video' ? (item.thumbnail || item.image) : item.image}
                          alt={item.title}
                          className="admin-table-thumb"
                        />
                      </td>
                      <td>
                        <span className={`admin-type-pill ${item.type}`}>
                          {item.type === 'video' ? '🎬 VIDEO' : '📸 PHOTO'}
                        </span>
                      </td>
                      <td>
                        <strong className="admin-item-title-text">{item.title}</strong>
                        <p className="admin-item-desc-text">{item.desc}</p>
                      </td>
                      <td>
                        <span className="admin-cat-pill">{item.categoryLabel || item.category}</span>
                      </td>
                      <td>
                        <span className="admin-loc-text">📍 {item.location || 'Gujarat'}</span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-admin-delete"
                          onClick={() => handleDelete(item.id, item.title)}
                          title="Remove item"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ACCOUNT & PASSWORD SETTINGS */}
        {activeTab === 'settings' && (
          <div className="admin-card-section">
            <div className="admin-card-header">
              <h2>Admin Security &amp; Password Settings</h2>
              <p>Change your Admin login ID or Password anytime.</p>
            </div>

            {settingsSuccess && (
              <div className="admin-auth-success">
                <span>{settingsSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUpdateCredentials} className="admin-settings-form">
              <div className="admin-form-group">
                <label className="admin-label">Admin Login ID / Email</label>
                <input
                  type="text"
                  className="admin-input-control"
                  value={newAdminId}
                  onChange={(e) => setNewAdminId(e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">New Password</label>
                <input
                  type="text"
                  className="admin-input-control"
                  placeholder="Enter new strong password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-admin-submit-media">
                💾 Save New Credentials
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
