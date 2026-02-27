/**
 * Sneakr.lab - Virtual Try-On Page
 * Allows users to upload their photo and see how the shoe looks on them
 */

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './TryOnPage.css';

export function TryOnPage() {
  const navigate = useNavigate();
  const [personImage, setPersonImage] = useState(null);
  const [personImagePreview, setPersonImagePreview] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Get shoe image from localStorage
  const shoeImage = localStorage.getItem('shoe_image');

  const handlePersonImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setPersonImage(base64);
        setPersonImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTryOn = async () => {
    if (!personImage || !shoeImage) {
      setError('Please upload your photo first!');
      return;
    }

    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const response = await fetch('http://localhost:8000/api/tryon/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          person_image: personImage,
          shoe_image: shoeImage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Try-on failed');
      }

      if (data.success && data.result_image) {
        setResultImage(data.result_image);
      } else {
        throw new Error('No result image returned');
      }
    } catch (err) {
      setError(err.message || 'Failed to process try-on. Please try again.');
      console.error('Try-on error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <header className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => navigate('/customizer')}
          >
            ← Back to Customizer
          </button>
          <h1 className="h3 mb-0">Virtual Try-On</h1>
        </div>
      </header>

      <div className="row">
        {/* Left Column - Upload Section */}
        <div className="col-lg-6">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Your Custom Shoe</h5>
              {shoeImage ? (
                <div className="shoe-preview mb-3">
                  <img
                    src={shoeImage}
                    alt="Custom shoe"
                    className="img-fluid rounded"
                  />
                </div>
              ) : (
                <div className="alert alert-warning">
                  No shoe design found. Please go back to the customizer and click "Try On Your
                  Shoe".
                </div>
              )}
            </div>
          </div>

          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Upload Your Photo</h5>
              <p className="text-muted small mb-3">
                Upload a clear photo of yourself to see how the shoe looks on you!
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePersonImageUpload}
                className="form-control mb-3"
              />

              {personImagePreview && (
                <div className="person-preview mb-3">
                  <img
                    src={personImagePreview}
                    alt="Your photo"
                    className="img-fluid rounded"
                  />
                </div>
              )}

              <button
                className="btn btn-primary w-100"
                onClick={handleTryOn}
                disabled={loading || !personImage || !shoeImage}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Processing...
                  </>
                ) : (
                  '✨ Try On Your Shoe'
                )}
              </button>

              {error && (
                <div className="alert alert-danger mt-3 mb-0">
                  <strong>Error:</strong> {error}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Result Section */}
        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Result</h5>
              {loading && (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted">
                    Creating your virtual try-on... This may take a few seconds.
                  </p>
                </div>
              )}

              {resultImage && !loading && (
                <div className="result-preview">
                  <img
                    src={resultImage}
                    alt="Try-on result"
                    className="img-fluid rounded"
                  />
                  <div className="mt-3">
                    <a
                      href={resultImage}
                      download="tryon-result.png"
                      className="btn btn-success w-100"
                    >
                      💾 Download Result
                    </a>
                  </div>
                </div>
              )}

              {!resultImage && !loading && (
                <div className="text-center py-5 text-muted">
                  <p>Your try-on result will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-5 pt-3 border-top text-muted small">
        Sneakr.lab — Powered by Google Vertex AI Virtual Try-On
      </footer>
    </div>
  );
}
