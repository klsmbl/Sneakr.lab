import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Footer from '../Footer';
import './EditProfilePage.css';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { user, updateProfile } = useUser();
  const fileInputRef = useRef(null);

  const initials = useMemo(() => {
    const name = user?.name || user?.full_name || 'Alex Carter';
    return name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [user]);

  const [personal, setPersonal] = useState({
    fullName: user?.name || user?.full_name || 'Alex Carter',
    email: user?.email || 'alex.carter@email.com',
    phone: '+63 917 000 0000',
  });

  const [address, setAddress] = useState({
    country: 'Philippines',
    city: 'Angeles City',
    addressLine: 'Pampang Road, Brgy. Pampang',
    postalCode: '2009',
  });

  const [sizePrefs, setSizePrefs] = useState({
    shoeSize: 'US 9',
    width: 'Regular',
  });

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [status, setStatus] = useState('');
  const [photoPreview, setPhotoPreview] = useState(user?.profilePhoto || '');

  const updateStatus = (message) => {
    setStatus(message);
    window.setTimeout(() => {
      setStatus('');
    }, 2400);
  };

  const handlePersonalSubmit = (event) => {
    event.preventDefault();
    updateProfile({
      name: personal.fullName,
      full_name: personal.fullName,
      email: personal.email,
      phoneNumber: personal.phone,
      profilePhoto: photoPreview,
    });
    updateStatus('Profile details saved.');
  };

  const handlePhotoSelected = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      updateStatus('Please upload an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (!result) return;
      setPhotoPreview(result);
      updateProfile({ profilePhoto: result });
      updateStatus('Profile photo uploaded.');
    };
    reader.readAsDataURL(file);

    event.target.value = '';
  };

  const handleAddressSubmit = (event) => {
    event.preventDefault();
    updateStatus('Address updated.');
  };

  const handleSizeSubmit = (event) => {
    event.preventDefault();
    updateStatus('Size preferences saved.');
  };

  const handleSecuritySubmit = (event) => {
    event.preventDefault();
    if (security.newPassword !== security.confirmPassword) {
      updateStatus('New passwords do not match.');
      return;
    }
    updateStatus('Password updated successfully.');
    setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-shell">
        <header className="edit-profile-header">
          <button type="button" className="edit-profile-back" onClick={() => navigate('/account')}>
            Back to Account
          </button>
          <h1>Edit Profile</h1>
          <p>Update your personal information, profile picture, and account preferences.</p>
        </header>

        {status ? <p className="edit-profile-status">{status}</p> : null}

        <section className="edit-profile-card">
          <h2>Profile Information</h2>
          <form onSubmit={handlePersonalSubmit}>
            <div className="edit-profile-avatar-row">
              <div className="edit-profile-avatar" aria-hidden="true">
                {photoPreview ? (
                  <img src={photoPreview} alt="Profile" className="edit-profile-avatar__image" />
                ) : (
                  initials
                )}
              </div>
              <button
                type="button"
                className="edit-profile-btn edit-profile-btn--ghost"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload New Photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="edit-profile-photo-input"
                onChange={handlePhotoSelected}
              />
            </div>

            <div className="edit-profile-grid">
              <label>
                Full Name
                <input
                  type="text"
                  value={personal.fullName}
                  onChange={(event) => setPersonal((prev) => ({ ...prev, fullName: event.target.value }))}
                />
              </label>

              <label>
                Email Address
                <input
                  type="email"
                  value={personal.email}
                  onChange={(event) => setPersonal((prev) => ({ ...prev, email: event.target.value }))}
                />
              </label>

              <label>
                Phone Number
                <input
                  type="tel"
                  value={personal.phone}
                  onChange={(event) => setPersonal((prev) => ({ ...prev, phone: event.target.value }))}
                />
              </label>
            </div>

            <button className="edit-profile-btn" type="submit">Save Changes</button>
          </form>
        </section>

        <section className="edit-profile-card">
          <h2>Address Information</h2>
          <form onSubmit={handleAddressSubmit}>
            <div className="edit-profile-grid edit-profile-grid--two">
              <label>
                Country
                <input
                  type="text"
                  value={address.country}
                  onChange={(event) => setAddress((prev) => ({ ...prev, country: event.target.value }))}
                />
              </label>

              <label>
                City
                <input
                  type="text"
                  value={address.city}
                  onChange={(event) => setAddress((prev) => ({ ...prev, city: event.target.value }))}
                />
              </label>

              <label>
                Address Line
                <input
                  type="text"
                  value={address.addressLine}
                  onChange={(event) => setAddress((prev) => ({ ...prev, addressLine: event.target.value }))}
                />
              </label>

              <label>
                Postal Code
                <input
                  type="text"
                  value={address.postalCode}
                  onChange={(event) => setAddress((prev) => ({ ...prev, postalCode: event.target.value }))}
                />
              </label>
            </div>

            <button className="edit-profile-btn" type="submit">Update Address</button>
          </form>
        </section>

        <section className="edit-profile-card">
          <h2>Sneaker Size Preferences</h2>
          <form onSubmit={handleSizeSubmit}>
            <div className="edit-profile-grid edit-profile-grid--two">
              <label>
                Preferred Shoe Size
                <select
                  value={sizePrefs.shoeSize}
                  onChange={(event) => setSizePrefs((prev) => ({ ...prev, shoeSize: event.target.value }))}
                >
                  <option>US 8</option>
                  <option>US 9</option>
                  <option>US 10</option>
                  <option>EU 41</option>
                  <option>EU 42</option>
                  <option>EU 43</option>
                </select>
              </label>

              <label>
                Width
                <select
                  value={sizePrefs.width}
                  onChange={(event) => setSizePrefs((prev) => ({ ...prev, width: event.target.value }))}
                >
                  <option>Regular</option>
                  <option>Wide</option>
                </select>
              </label>
            </div>

            <button className="edit-profile-btn" type="submit">Save Size Preferences</button>
          </form>
        </section>

        <section className="edit-profile-card">
          <h2>Security Settings</h2>
          <form onSubmit={handleSecuritySubmit}>
            <div className="edit-profile-grid edit-profile-grid--two">
              <label>
                Current Password
                <input
                  type="password"
                  value={security.currentPassword}
                  onChange={(event) => setSecurity((prev) => ({ ...prev, currentPassword: event.target.value }))}
                />
              </label>

              <label>
                New Password
                <input
                  type="password"
                  value={security.newPassword}
                  onChange={(event) => setSecurity((prev) => ({ ...prev, newPassword: event.target.value }))}
                />
              </label>

              <label>
                Confirm New Password
                <input
                  type="password"
                  value={security.confirmPassword}
                  onChange={(event) => setSecurity((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                />
              </label>
            </div>

            <button className="edit-profile-btn" type="submit">Update Password</button>
          </form>
        </section>
      </div>

      <Footer />
    </div>
  );
}
