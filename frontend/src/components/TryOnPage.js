/**
 * Sneakr.lab - Virtual Try-On Page
 * Allows users to upload their photo and see how the shoe looks on them
 */

import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mockup3D } from './Mockup3D';
import './TryOnPage.css';

const DJANGO_API_BASE = process.env.REACT_APP_DJANGO_API_URL || 'http://localhost:8000';

export function TryOnPage() {
  const navigate = useNavigate();
  const [personImage, setPersonImage] = useState(null);
  const [personImagePreview, setPersonImagePreview] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [captureFunction, setCaptureFunction] = useState(null);
  const fileInputRef = useRef(null);

  // Get shoe image from localStorage
  const shoeImage = localStorage.getItem('shoe_image');

  const handleCaptureReady = useCallback((captureFunc) => {
    setCaptureFunction(() => captureFunc);
  }, []);

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
    const currentShoeImage = captureFunction ? captureFunction() : shoeImage;

    if (!personImage || !currentShoeImage) {
      setError('Please upload your photo first!');
      return;
    }

    // Keep localStorage sync so page refresh still preserves latest preview image.
    localStorage.setItem('shoe_image', currentShoeImage);

    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const response = await fetch(`${DJANGO_API_BASE}/api/virtual-tryon/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          person_image: personImage,
          shoe_image: currentShoeImage,
        }),
      });

      const raw = await response.text();
      let data = null;
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        if (!response.ok) {
          throw new Error(`Try-on request failed (${response.status}). Server returned non-JSON response.`);
        }
        throw new Error('Invalid server response format.');
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Try-on failed');
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
    <div className="tryon-shell">
      <div className="container py-4 py-lg-5">
      <header className="tryon-header d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4 mb-lg-5">
        <div className="d-flex align-items-center gap-3 tryon-header__left">
          <button
            className="tryon-back-btn"
            onClick={() => navigate('/customizer')}
          >
            Back
          </button>
          <div>
            <p className="tryon-kicker mb-1">Sneakr.lab Studio</p>
            <h1 className="h3 mb-0">Vertex AI Virtual Try-On</h1>
          </div>
        </div>
        <div className="tryon-header-badge">Performance Preview</div>
      </header>

      <div className="tryon-intro mb-4 mb-lg-5">
        <p className="mb-0">
          Upload your photo, then generate a realistic preview of your custom sneaker on-foot.
          Optimized for clean, front-facing images and natural lighting.
        </p>
      </div>

      <div className="row g-4">
        {/* Left Column - Upload Section */}
        <div className="col-lg-6">
          <div className="tryon-panel mb-4">
            <div className="tryon-panel__head">
              <h5 className="mb-1">Your Custom Shoe</h5>
              <p className="mb-0">Captured directly from your current design</p>
            </div>
            <div className="tryon-panel__body">
              {shoeImage ? (
                <div className="shoe-preview mb-0">
                  <div className="tryon-3d-wrap">
                    <Mockup3D onCaptureReady={handleCaptureReady} minimal embedded />
                  </div>
                </div>
              ) : (
                <div className="tryon-note tryon-note--warning">
                  No shoe design was found. Return to customizer and click Try On Your Shoe.
                </div>
              )}
            </div>
          </div>

          <div className="tryon-panel mb-4 mb-lg-0">
            <div className="tryon-panel__head">
              <h5 className="mb-1">Upload Your Photo</h5>
              <p className="mb-0">
                Use a full-body or lower-body photo for best placement accuracy.
              </p>
            </div>
            <div className="tryon-panel__body">
              <div className="tryon-upload-grid mb-3">
                <span>1. Bright lighting</span>
                <span>2. Clear legs or shoes visible</span>
                <span>3. Minimal motion blur</span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePersonImageUpload}
                className="form-control tryon-file-input mb-3"
              />

              {personImagePreview && (
                <div className="person-preview mb-3">
                  <img
                    src={personImagePreview}
                    alt="Your photo"
                    className="img-fluid"
                  />
                </div>
              )}

              <button
                className="tryon-generate-btn w-100"
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
                    Generating with AI...
                  </>
                ) : (
                  'Generate Try-On Preview'
                )}
              </button>

              {error && (
                <div className="tryon-note tryon-note--error mt-3 mb-0">
                  <strong>Error:</strong> {error}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Result Section */}
        <div className="col-lg-6">
          <div className="tryon-panel tryon-panel--result">
            <div className="tryon-panel__head">
              <h5 className="mb-1">Result</h5>
              <p className="mb-0">AI-generated fit preview from Google Vertex</p>
            </div>
            <div className="tryon-panel__body">
              {loading && (
                <div className="tryon-state text-center py-5">
                  <div className="spinner-border mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mb-2">
                    <strong>Generating your preview with Vertex AI...</strong>
                  </p>
                  <p className="small mb-0">
                    This may take 30-60 seconds as we process your images with AI.
                  </p>
                </div>
              )}

              {resultImage && !loading && (
                <div className="result-preview">
                  <div className="tryon-note tryon-note--success mb-3">
                    <strong>Success:</strong> Your preview is ready.
                  </div>
                  
                  <img
                    src={resultImage}
                    alt="Virtual Try-On result"
                    className="img-fluid"
                  />
                  
                  <div className="mt-3">
                    <a
                      href={resultImage}
                      download="virtual-tryon-result.png"
                      className="tryon-download-btn w-100"
                    >
                      Download Result
                    </a>
                  </div>
                </div>
              )}

              {!resultImage && !loading && (
                <div className="tryon-empty text-center py-5">
                  <p className="mb-2">Your try-on result will appear here</p>
                  <span>Upload your photo and press Generate Try-On Preview.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="tryon-footer mt-4 mt-lg-5">
        Sneakr.lab — Powered by Google Vertex AI Virtual Try-On
      </footer>
      </div>
    </div>
  );
}
