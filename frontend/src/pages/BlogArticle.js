import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BlogArticle.css';
import Footer from '../Footer';

const tableOfContents = [
  { id: 'key-takeaways', label: 'Key Takeaways' },
  { id: 'what-youll-need', label: "What You'll Need" },
  { id: 'foot-measurement-tools', label: 'foot measurement tools' },
  { id: 'how-to-measure-foot-size-at-home', label: 'How to Measure Foot Size at Home' },
  { id: 'shoe-size-chart', label: 'Shoe Size Chart' },
  { id: 'why-shoe-width-matters', label: 'Why Shoe Width Matters' },
  { id: 'common-mistakes', label: '6 Common Mistakes When Measuring Your Feet' },
  { id: 'how-to-tell-fit-right', label: 'How to Tell if Your Shoes Fit Right' },
  { id: 'custom-shoes-fit', label: "Getting the Right Fit With Shoe Zero's Custom Shoes" },
  { id: 'faq', label: 'Frequently Asked Questions' }
];

function BlogArticle() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="blog-article-page">
      <header className="blog-article-header">
        <div className="blog-article-header__inner">
          <Link to="/blog" className="blog-article-back-link">
            <span className="blog-article-back-link__arrow" aria-hidden="true">&larr;</span>
            <span>Back to Blog</span>
          </Link>
          <h1 className="blog-article-title">How to Measure Shoe Size</h1>
          <p className="blog-article-meta" aria-label="Article metadata">
            <span>Mar 3, 2026</span>
            <span className="blog-article-meta__dot" aria-hidden="true">|</span>
            <span>By Conrad Shiu</span>
          </p>
        </div>
      </header>

      <main className="blog-article-content">
        <div className="blog-article-banner-wrap">
          <img
            src="/how to measure shoe size.webp"
            alt="How to Measure Shoe Size banner"
            className="blog-article-banner"
          />
        </div>

        <div className="blog-article-layout">
          <aside className="blog-article-toc" aria-label="Table of Contents">
            <p className="blog-article-toc__title">TABLE OF CONTENTS</p>
            <nav>
              <ul className="blog-article-toc__list">
                {tableOfContents.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className="blog-article-toc__link">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <article className="blog-article-body" aria-label="Blog article content area">
            <section className="blog-article-section blog-article-section--intro">
              <p>
                To measure your shoe size at home, trace your foot on a sheet of paper, measure the
                distance from your heel to your longest toe for length, and measure across the widest
                point for width. Then match those numbers to a size chart. The whole process takes about
                five minutes with tools you already have at home.
              </p>
              <p>
                Getting this right matters more than most people realize. Research published in the
                Journal of Foot and Ankle Research found that a significant majority of people wear shoes
                that do not fit properly. That leads to blisters, discomfort, and foot problems that build
                up over time. The fix is straightforward: measure your feet accurately, check the right
                size chart, and pay attention to both length and width.
              </p>
              <p>
                Let's walk through how to get accurate foot measurements, what to watch out for, how to
                read a size chart, and how to use your measurements when ordering custom shoes.
              </p>
            </section>

            <section id="key-takeaways" className="blog-article-section blog-article-key-box">
              <h2>Key Takeaways</h2>
              <ul>
                <li>Measure your feet at the end of the day when they are largest.</li>
                <li>
                  You only need paper, a pencil, and a ruler, and the whole process takes about five
                  minutes.
                </li>
                <li>Always measure both feet and use the larger foot's measurement for sizing.</li>
                <li>Both length and width affect how a shoe fits, so measure both.</li>
                <li>
                  Sizing varies between brands and shoe styles, so always check the specific size chart
                  before ordering.
                </li>
              </ul>
            </section>

            <section id="what-youll-need" className="blog-article-section">
              <h3>What You'll Need</h3>
              <h4 id="foot-measurement-tools" className="blog-article-subhead">foot measurement tools</h4>
              <div className="blog-article-tools-layout">
                <div className="blog-article-tools-copy">
                  <p>You don't need any special equipment. Before you start, gather these items:</p>
                  <ul>
                    <li>A piece of paper large enough for your foot (tape two sheets together if needed)</li>
                    <li>A pen or pencil</li>
                    <li>A ruler or tape measure</li>
                    <li>Tape to secure the paper to the floor</li>
                    <li>The socks you plan to wear with the shoes</li>
                  </ul>
                </div>
                <img
                  src="/foot_measurement_tools.webp"
                  alt="Foot measurement tools"
                  className="blog-article-tools-image"
                />
              </div>
              <p>
                One detail people often skip: put on the socks you plan to wear with the shoes before
                measuring. Sock thickness affects your foot's dimensions, and measuring barefoot can give
                you a size that feels too snug once you add socks into the equation. This small step saves
                you from ordering a pair that pinches.
              </p>
            </section>

            <section id="how-to-measure-foot-size-at-home" className="blog-article-section">
              <h3>How to Measure Foot Size at Home</h3>
              <p>
                Follow these steps carefully. Rushing through the process is the fastest way to end up
                with inaccurate numbers.
              </p>
              <h4 className="blog-article-subhead">Step 1: Prepare Your Surface</h4>
              <p>
                Tape your paper to a hard, flat floor with one edge pressed against a wall. Make sure all
                corners are secured so the paper doesn't shift while you trace. The wall gives your heel a
                fixed reference point, which makes the length measurement more reliable.
              </p>
              <p>
                Use a hard surface like tile, hardwood, or laminate. Carpet compresses under your weight,
                which causes the paper to shift and throws off your tracing. If carpet is all you have,
                place a hardcover book or cutting board under the paper to create a firm base.
              </p>

              <h4 className="blog-article-subhead">Step 2: Position Your Foot</h4>
              <p>
                Stand on the paper with your heel lightly touching the wall behind you. Keep your weight
                evenly distributed on both feet. Don't lean to one side or shift your weight onto the foot
                you're measuring. Your knees should have a slight natural bend, not locked straight.
              </p>
              <p>
                Standing is essential here. When you sit down, your foot doesn't spread to its full size
                under your body weight. That difference can be as much as half a size. Even if it feels
                awkward to trace while standing, the accuracy is worth it. If you can, have someone else
                do the tracing while you stand still.
              </p>

              <h4 className="blog-article-subhead">Step 3: Trace Your Foot</h4>
              <p>
                Hold your pencil straight up and down, perpendicular to the paper, not tilted. Trace
                slowly around your entire foot, keeping the pencil tip as close to your foot as possible.
                Move from the heel around the outside edge, across the toes, and back down the inside.
              </p>
              <p>
                Repeat this for your other foot on a separate piece of paper. Almost everyone has one foot
                that's slightly bigger than the other. That's completely normal, and you'll need both
                tracings to figure out which one to base your size on.
              </p>

              <h4 className="blog-article-subhead">Step 4: Measure Your Foot Length</h4>
              <div className="blog-article-measure-layout">
                <div>
                  <p>
                    Using your ruler or tape measure, find the distance from the very back of the heel to
                    the tip of the longest toe on each tracing. Write this number down in both inches and
                    millimeters. Different size charts use different units, so having both saves you time
                    later.
                  </p>
                  <p>
                    Here's something that trips people up: your longest toe isn't always your big toe. For
                    many people, the second toe extends further. Take a look at your tracing and measure to
                    whichever toe reaches the farthest point. Using the wrong reference toe can put you off
                    by a quarter size or more.
                  </p>

                  <h4 className="blog-article-subhead">Step 5: Measure Your Foot Width</h4>
                  <p>
                    Place your ruler or tape measure across the widest part of each tracing. This is
                    usually at the ball of the foot, the area just behind your toes where the foot is
                    broadest. Record this measurement along with your length.
                  </p>
                  <p>
                    Width matters just as much as length for a comfortable fit, but most people skip it
                    entirely. If you've ever worn shoes that felt fine in length but pinched at the sides
                    or left your pinky toe cramped, the width was likely the issue. Knowing your width
                    measurement helps you choose between standard, wide, and narrow options.
                  </p>
                </div>

                <img
                  src="/foot_length_measurement.webp"
                  alt="Foot length measurement"
                  className="blog-article-measure-image"
                />
              </div>

              <h4 className="blog-article-subhead">Step 6: Find Your Size on a Chart</h4>
              <p>
                Take the measurements from your larger foot and compare them to a size chart. If you
                traced your foot rather than using the wall method, subtract about 5 millimeters (roughly
                3/16 of an inch) from your length measurement. This accounts for the small gap between the
                pencil line and your actual foot.
              </p>
              <p>
                Size charts vary by brand and by region. The US, UK, and European systems all use
                different numbering, so always confirm which system the chart is using before you match
                your numbers. A US men's 10 is not the same as a UK 10 or an EU 10. Mixing up the systems
                will lead you to the wrong size entirely.
              </p>
              <p>
                Your foot's internal length should also leave at least 5 millimeters of space between your
                longest toe and the front of the shoe. That extra room is what lets you walk comfortably
                without your toes hitting the end. So if your foot measures 263mm, you'd want a shoe with
                an internal length around 268mm or the next size up.
              </p>
              <p>
                If you're between two sizes on any chart, go with the larger one. A shoe with a little
                extra room is always more comfortable than one that's too tight. You can fine-tune the fit
                with thicker socks or an insole.
              </p>
            </section>

            <section id="shoe-size-chart" className="blog-article-section">
              <h3>Shoe Zero Size Chart</h3>
              <p>
                The chart above shows the sizing for our Classic Zero model. Keep in mind that our sizing
                can vary between shoe styles depending on the materials and construction of each model.
                After measuring your feet, check the size guide on the specific product page for the style
                you're designing. Each product page has its own dedicated chart so you can match your
                measurements to that exact shoe.
              </p>
              <p className="blog-article-chart-caption">classic zero shoe size guide</p>
              <img
                src="/classic_zero_shoe_size_guide.webp"
                alt="Classic Zero shoe size guide"
                className="blog-article-chart-image"
              />
            </section>

            <section id="why-shoe-width-matters" className="blog-article-section">
              <h3>Why Shoe Width Matters</h3>
              <p>
                Length gets all the attention, but width is what separates a good fit from a great one. A
                shoe that matches your foot length perfectly can still feel uncomfortable if it's too
                narrow or too wide for your foot shape.
              </p>
              <p>
                Shoe widths are labeled with letters. In men's sizing, D is standard width, B is narrow,
                2E is wide, and 4E is extra wide. In women's sizing, B is standard, A or AA is narrow,
                and D is wide. These letters aren't perfectly standardized across brands, so a D width
                from one company might feel slightly different from another. They still give you a
                reliable starting point.
              </p>
              <p>
                If you regularly feel pinching across the ball of your foot, your pinky toe pressing
                against the side, or a general tightness that isn't related to length, you probably need a
                wider shoe. Going up in length won't fix a width problem. It'll just leave you with extra
                space at the toe while the sides still feel tight. Addressing width directly is the better
                solution, and knowing your width measurement from Step 5 makes that straightforward.
              </p>
            </section>

            <section id="common-mistakes" className="blog-article-section">
              <h3>6 Common Mistakes When Measuring Your Feet</h3>
              <p>
                Even a simple measurement can go wrong if you miss a few details. Here are the most common
                errors and how to avoid them.
              </p>
              <h4 className="blog-article-subhead">Measuring while sitting down</h4>
              <p>
                Your foot spreads under your full body weight when you stand. Measuring while seated gives
                a smaller reading that can easily be off by half a size. Always stand with your weight
                distributed naturally across both feet.
              </p>
              <h4 className="blog-article-subhead">Measuring on carpet or a soft surface</h4>
              <p>
                The paper shifts, the tracing blurs, and the ruler doesn't sit flat. Hard floors give you
                clean lines and consistent numbers. If you only have carpeted rooms, put a firm flat
                surface like a hardcover book underneath the paper.
              </p>
              <h4 className="blog-article-subhead">Measuring in the morning</h4>
              <p>
                Feet swell throughout the day as you walk, stand, and move. By evening, your feet are at
                their largest. Measuring in the morning gives you a smaller size that might feel tight by
                afternoon. Always measure later in the day for the most realistic fit.
              </p>
              <h4 className="blog-article-subhead">Using the wrong toe as your reference</h4>
              <p>
                The longest toe determines your shoe size, and that isn't always the big toe. Check your
                tracing before measuring. The second toe is longer than the big toe for a large portion of
                people, and using the wrong one throws off your length by a meaningful amount.
              </p>
              <h4 className="blog-article-subhead">Tilting the pencil while tracing</h4>
              <p>
                If the pencil leans inward or outward instead of staying straight up and down, the traced
                line won't match your actual foot outline. Keep the pencil perpendicular to the paper
                throughout the entire tracing.
              </p>
              <h4 className="blog-article-subhead">Assuming your size hasn't changed</h4>
              <p>
                Feet change over time due to age, weight shifts, activity levels, and conditions like
                pregnancy. The size you wore five years ago may not be your size today. Measuring fresh
                before a new purchase takes five minutes and prevents weeks of dealing with shoes that
                don't fit.
              </p>
              <ul>
                <li>Measuring while sitting down.</li>
                <li>Measuring on carpet or a soft surface.</li>
                <li>Measuring in the morning.</li>
                <li>Using the wrong toe as your reference.</li>
                <li>Tilting the pencil while tracing.</li>
                <li>Assuming your size hasn't changed.</li>
              </ul>
            </section>

            <section id="how-to-tell-fit-right" className="blog-article-section">
              <h3>How to Tell if Your Shoes Fit Right</h3>
              <p>
                Measuring gives you the right starting point, but the real test happens when you put the
                shoes on. Here's how to check that everything fits the way it should.
              </p>
              <h4 className="blog-article-subhead">Toe Box Check</h4>
              <p>
                Press your thumb down on the front of the shoe while wearing it. There should be about a
                thumb's width of space between your longest toe and the end of the shoe. Your toes should
                be able to wiggle freely without pressing against the sides or the top. If your big toe or
                pinky toe feels squeezed, the shoe is either too narrow or too short.
              </p>
              <h4 className="blog-article-subhead">Heel Check</h4>
              <p>
                Your heel should sit firmly in the back of the shoe without slipping up and down when you
                walk. A heel that lifts out of the shoe with each step means the shoe is too long or the
                heel counter doesn't match your foot shape. The back of the shoe should cup your heel
                snugly without rubbing or digging into the skin.
              </p>
              <h4 className="blog-article-subhead">The Walk Test</h4>
              <p>
                Take the shoes for a short walk on a hard surface. Pay attention to any spots where the
                shoe rubs, pinches, or creates pressure. A well-fitting shoe should feel comfortable right
                out of the box. Don't count on a break-in period to fix a fit issue. If a shoe doesn't
                feel right when you first walk in it, it's unlikely to improve significantly over time.
              </p>
            </section>

            <section id="custom-shoes-fit" className="blog-article-section">
              <h3>Getting the Right Fit With Shoe Zero's Custom Shoes</h3>
              <p>
                Now that you have your measurements, putting them to use is simple. Every Shoe Zero custom
                shoe has a dedicated size guide on its product page. Different materials and construction
                methods affect how each style fits, which is why we provide a specific chart for every
                model rather than a single universal chart.
              </p>
              <p>
                Your length and width measurements give you a solid starting point. From there, check the
                size guide on the product page for the exact style you're designing. Match your foot length
                to the chart, and if you fall between two sizes, choose the larger one. A small amount of
                extra room is easy to adjust, but a shoe that's too tight has no easy fix.
              </p>
              <p>
                If you're ordering custom branded shoes for your team or company, accurate sizing across
                multiple people becomes even more important. Collect individual measurements from each
                person rather than relying on their self-reported size. People commonly misjudge their own
                size by half a size or more, and when you're ordering in bulk, a few wrong sizes can
                create unnecessary hassle.
              </p>
            </section>

            <section id="faq" className="blog-article-section">
              <h3>Frequently Asked Questions</h3>
              <h4 className="blog-article-subhead">How Often Should I Measure My Shoe Size?</h4>
              <p>
                At least once a year and always before a major shoe purchase. Feet change over time due to
                age, weight shifts, activity levels, and pregnancy.
              </p>
              <h4 className="blog-article-subhead">Can I Use an Online Shoe Size Calculator?</h4>
              <p>
                They provide a reasonable estimate but aren't a substitute for measuring your feet
                yourself. Your own measurements matched to the brand's specific size chart will always be
                more accurate.
              </p>
              <h4 className="blog-article-subhead">What If My Feet Are Different Sizes?</h4>
              <p>Always use the measurements from your larger foot when choosing a shoe size.</p>
              <h4 className="blog-article-subhead">What Should I Do If I Fall Between Two Sizes?</h4>
              <p>
                Go with the larger size. A slightly roomier shoe is more comfortable than one that's too
                tight.
              </p>
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default BlogArticle;
