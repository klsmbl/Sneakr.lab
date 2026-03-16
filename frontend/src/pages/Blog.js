import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Blog.css';
import Footer from '../Footer';

const BLOG_ITEMS = [
  {
    slug: 'how-to-measure-shoe-size',
    title: 'How to Measure Shoe Size',
    date: 'Mar 3, 2026',
    preview:
      'Learn how to accurately measure your shoe size at home to ensure the perfect fit for your custom sneakers.',
    image: '/how to measure shoe size.webp'
  }
];

function Blog() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="blog-page">
      <section className="blog-hero">
        <div className="blog-hero__content">
          <button
            type="button"
            className="blog-hero__back"
            onClick={() => navigate('/')}
          >
            ← Back to Home
          </button>
          <p className="blog-hero__eyebrow">INSIGHTS</p>
          <h1 className="blog-hero__title">Blog</h1>
          <p className="blog-hero__subtitle">
            Guides, tips, and updates about custom sneakers, sizing, and design.
          </p>
        </div>
      </section>

      <main className="blog-content">
        <section className="blog-grid" aria-label="Blog article list">
          {BLOG_ITEMS.map((item) => (
            <article
              className="blog-card"
              key={item.slug}
              onClick={() => navigate(`/blog/${item.slug}`, { state: { showFooterLoader: true } })}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  navigate(`/blog/${item.slug}`, { state: { showFooterLoader: true } });
                }
              }}
            >
              <div className="blog-card__media-wrap">
                <img
                  src={item.image}
                  alt={`${item.title} featured`}
                  className="blog-card__media"
                  loading="lazy"
                />
                <span className="blog-card__cta">Read Article</span>
              </div>

              <div className="blog-card__body">
                <p className="blog-card__date">{item.date}</p>
                <h2 className="blog-card__title">{item.title}</h2>
                <p className="blog-card__preview">{item.preview}</p>
              </div>
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Blog;
