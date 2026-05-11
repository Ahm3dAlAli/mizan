'use client';

import { useEffect, useState } from 'react';

export default function MizanLanding() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="nav-inner">
            <a href="#" className="brand">
              <div className="brand-mark">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="11" x2="19" y2="11" />
                  <line x1="11" y1="3" x2="11" y2="13" />
                  <circle cx="7" cy="16" r="3" />
                  <circle cx="15" cy="16" r="3" />
                </svg>
              </div>
              <span className="brand-name">Mizan</span>
            </a>
            <div className="nav-links">
              <a href="#how-it-works" className="nav-link">How it works</a>
              <a href="#corridors" className="nav-link">Corridors</a>
              <a href="#docs" className="nav-link">Docs</a>
            </div>
            <div className="nav-cta-wrap">
              <a href="#contact" className="btn btn-primary">Get started</a>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-mesh"></div>
          <div className="container hero-inner">
            <div className="reveal">
              <div className="hero-eyebrow">
                <span className="pill-dot"></span>
                <span>Live on Arc Testnet</span>
              </div>
              <h1 className="h1">Agentic payment infrastructure for SMEs</h1>
              <p className="body-l hero-subhead">
                The first system that lets autonomous agents authenticate corridors, route value across chains, and settle SME payments in stablecoins—independently, transparently, instantly.
              </p>
              <div className="hero-cta">
                <a href="#get-started" className="btn btn-primary">Start integrating</a>
                <a href="#demo" className="btn btn-secondary">View demo</a>
              </div>
            </div>

            <div className="hero-product reveal">
              <div className="dash">
                <div className="dash-chrome">
                  <div className="dash-dots">
                    <div className="dash-dot"></div>
                    <div className="dash-dot"></div>
                    <div className="dash-dot"></div>
                  </div>
                  <div className="dash-url">
                    <div className="dash-url-pill">
                      <svg className="dash-lock" viewBox="0 0 10 10" fill="currentColor">
                        <path d="M5 0C3.3 0 2 1.3 2 3v1H1v6h8V4H8V3C8 1.3 6.7 0 5 0zm0 1c1.1 0 2 .9 2 2v1H3V3c0-1.1.9-2 2-2z"/>
                      </svg>
                      <span>dash.mizan.io</span>
                    </div>
                  </div>
                </div>
                <div className="dash-body">
                  <div className="dash-section-label">Available balance</div>
                  <div className="dash-flex">
                    <div>
                      <div className="dash-balance">487,203<span className="currency">USDC</span></div>
                      <div className="dash-week-up mono">↑ +14.2% this week</div>
                    </div>
                    <div className="dash-org">
                      <div className="dash-org-name">Zenith Exports Ltd.</div>
                      <div className="dash-org-meta">Lagos, Nigeria</div>
                    </div>
                  </div>
                  <div className="dash-chains">
                    <div className="dash-chain">
                      <div className="dash-chain-name">Arc</div>
                      <div className="dash-chain-val mono">312,450</div>
                    </div>
                    <div className="dash-chain">
                      <div className="dash-chain-name">Polygon</div>
                      <div className="dash-chain-val mono">98,712</div>
                    </div>
                    <div className="dash-chain">
                      <div className="dash-chain-name">Base</div>
                      <div className="dash-chain-val mono">76,041</div>
                    </div>
                  </div>
                  <div className="dash-divider"></div>
                  <div className="run-header">
                    <div className="run-title">Latest payroll run</div>
                    <div className="run-meta mono">2 hours ago</div>
                  </div>
                  <div className="run-summary mono">
                    <span>52,100 USDC</span>
                    <span className="arrow">→</span>
                    <span>23 recipients</span>
                    <span className="meta">across 3 chains</span>
                  </div>
                  <div className="recipients">
                    <div className="recipient">
                      <div className="recipient-name">Sarah Okonkwo</div>
                      <div className="recipient-loc">Abuja, NG</div>
                      <div className="recipient-amt mono">2,400 USDC</div>
                      <div className="recipient-chain">
                        Polygon<span className="cctp">•CCTP</span>
                      </div>
                      <div className="recipient-status">
                        <span className="dot"></span>
                        Settled
                      </div>
                    </div>
                    <div className="recipient">
                      <div className="recipient-name">Kwame Mensah</div>
                      <div className="recipient-loc">Accra, GH</div>
                      <div className="recipient-amt mono">1,950 USDC</div>
                      <div className="recipient-chain">
                        Base<span className="cctp">•CCTP</span>
                      </div>
                      <div className="recipient-status">
                        <span className="dot"></span>
                        Settled
                      </div>
                    </div>
                    <div className="recipient">
                      <div className="recipient-name">Amara Nwosu</div>
                      <div className="recipient-loc">Lagos, NG</div>
                      <div className="recipient-amt mono">2,100 USDC</div>
                      <div className="recipient-chain">Arc</div>
                      <div className="recipient-status held">
                        <span className="dot"></span>
                        Compliance
                      </div>
                    </div>
                  </div>
                  <div className="run-actions">
                    <button className="btn btn-secondary btn-sm">View all recipients</button>
                    <button className="btn btn-ghost btn-sm">Export report →</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="stack">
          <div className="container">
            <div className="stack-inner">
              <div className="stack-label">Powered by</div>
              <div className="stack-logo">Circle CCTP</div>
              <div className="stack-sep"></div>
              <div className="stack-logo">Arc Blockchain</div>
              <div className="stack-sep"></div>
              <div className="stack-logo">USDC</div>
              <div className="stack-sep"></div>
              <div className="stack-logo">Polygon</div>
              <div className="stack-sep"></div>
              <div className="stack-logo">Base</div>
            </div>
          </div>
        </div>

        <section className="section" id="how-it-works">
          <div className="container reveal">
            <div className="thesis-content">
              <div className="eyebrow">Our thesis</div>
              <h2 className="h2">SMEs in emerging markets are locked out of global payments</h2>
              <p className="body-l">
                Traditional banking rails are slow, expensive, and opaque. Cross-border transfers can take days and cost 5-10% in fees.
                Compliance bottlenecks delay legitimate business payments for weeks.
              </p>
              <p className="body-l">
                Meanwhile, stablecoins and blockchain infrastructure have matured to production-grade reliability—but adoption
                is held back by complexity and fragmentation.
              </p>
              <div className="thesis-close">
                Mizan solves this with AI agents that handle routing, compliance, and settlement autonomously.
              </div>
            </div>
          </div>
        </section>

        <section className="section-tight" id="steps">
          <div className="container">
            <div className="reveal">
              <div className="eyebrow">How it works</div>
              <h2 className="h2">Three steps to autonomous payments</h2>
            </div>
            <div className="steps">
              <div className="reveal">
                <div className="step-illust">
                  <div className="step-num">01</div>
                  <svg className="step-svg" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="50" cy="50" r="30" stroke="#0A4D3C" strokeWidth="3"/>
                    <path d="M50 30 L50 50 L65 50" stroke="#0A4D3C" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="step-title">Connect your treasury</div>
                <div className="step-desc">
                  Link your existing USDC wallet or create a new multi-chain treasury. Mizan monitors balances across Arc, Polygon, and Base.
                </div>
              </div>
              <div className="reveal">
                <div className="step-illust">
                  <div className="step-num">02</div>
                  <svg className="step-svg" viewBox="0 0 100 100" fill="none">
                    <rect x="20" y="30" width="60" height="40" rx="4" stroke="#0A4D3C" strokeWidth="3"/>
                    <line x1="35" y1="45" x2="65" y2="45" stroke="#0A4D3C" strokeWidth="2"/>
                    <line x1="35" y1="55" x2="55" y2="55" stroke="#0A4D3C" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="step-title">Define payment corridors</div>
                <div className="step-desc">
                  Set rules for who gets paid, when, and where. Agents authenticate each corridor and validate compliance automatically.
                </div>
              </div>
              <div className="reveal">
                <div className="step-illust">
                  <div className="step-num">03</div>
                  <svg className="step-svg" viewBox="0 0 100 100" fill="none">
                    <path d="M30 50 Q50 20, 70 50" stroke="#0A4D3C" strokeWidth="3" fill="none"/>
                    <circle cx="30" cy="50" r="5" fill="#0A4D3C"/>
                    <circle cx="70" cy="50" r="5" fill="#0A4D3C"/>
                  </svg>
                </div>
                <div className="step-title">Let agents execute</div>
                <div className="step-desc">
                  Autonomous agents route payments through the cheapest, fastest path—using CCTP when available, native bridges otherwise.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="product-large">
          <div className="section container">
            <div className="reveal">
              <div className="eyebrow">Agent reasoning</div>
              <h2 className="h2">Transparent decision-making at every step</h2>
            </div>
            <div className="dash-large dash-flat reveal">
              <div className="dash">
                <div className="dash-chrome">
                  <div className="dash-dots">
                    <div className="dash-dot"></div>
                    <div className="dash-dot"></div>
                    <div className="dash-dot"></div>
                  </div>
                  <div className="dash-url">
                    <div className="dash-url-pill">
                      <svg className="dash-lock" viewBox="0 0 10 10" fill="currentColor">
                        <path d="M5 0C3.3 0 2 1.3 2 3v1H1v6h8V4H8V3C8 1.3 6.7 0 5 0zm0 1c1.1 0 2 .9 2 2v1H3V3c0-1.1.9-2 2-2z"/>
                      </svg>
                      <span>dash.mizan.io/runs/b4f8a2</span>
                    </div>
                  </div>
                </div>
                <div className="dash-body">
                  <div className="run-detail-header mono">Run #b4f8a2c — Payroll • March 2026</div>
                  <div className="run-detail-summary">
                    <span className="mono">52,100 USDC</span>
                    <span className="arrow">→</span>
                    <span>23 recipients</span>
                    <span className="meta">across Nigeria, Ghana, Kenya</span>
                  </div>
                  <div className="reasoning">
                    <div className="reasoning-label">
                      <span>Agent reasoning</span>
                      <span className="mono">Runtime: 2.4s</span>
                    </div>
                    <div className="reasoning-text">
                      <span className="dim">Authenticated corridor:</span> <span className="mono">Nigeria-USDC-Polygon</span> (verified via local banking partner + on-chain registry)
                    </div>
                    <div className="reasoning-text">
                      <span className="dim">Routing decision:</span> 18/23 recipients via CCTP (Polygon → Base), avg. cost <span className="mono">$0.12</span> per transfer
                    </div>
                    <div className="reasoning-text">
                      <span className="dim">Compliance check:</span> 1 recipient flagged for manual review (Amara Nwosu) — funds held pending KYC refresh
                    </div>
                    <div className="reasoning-text">
                      <span className="dim">Settlement time:</span> 22/23 settled in <span className="mono">38 seconds</span>, 1 pending review
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="product-caption reveal">
              Every payment run is logged on-chain with full reasoning trails. Agents provide transparency that traditional payment processors can't match—you see exactly why each decision was made, in real time.
            </p>
          </div>
        </section>

        <section className="section" id="corridors">
          <div className="container">
            <div className="reveal">
              <div className="eyebrow">Payment corridors</div>
              <h2 className="h2">Pre-authenticated routes for common SME flows</h2>
              <p className="body-l" style={{ maxWidth: '640px', marginTop: '20px' }}>
                Each corridor is a vetted path for moving value—complete with local banking partners, compliance frameworks, and optimized routing.
              </p>
            </div>
            <div className="corridors-grid">
              <div className="corridor reveal">
                <div className="corridor-route">NG → USDC → Polygon</div>
                <div className="corridor-name">Nigeria Export Payroll</div>
                <div className="corridor-rule"></div>
                <div className="corridor-kv">
                  <span className="k">Avg. settlement</span>
                  <span className="v mono">42s</span>
                </div>
                <div className="corridor-kv">
                  <span className="k">Cost per transfer</span>
                  <span className="v mono">$0.14</span>
                </div>
                <div className="corridor-kv">
                  <span className="k">Monthly volume</span>
                  <span className="v mono">$1.2M</span>
                </div>
                <div className="corridor-cap">
                  Optimized for SME payroll to Nigerian contractors. CCTP-enabled, local banking rail verified.
                </div>
              </div>
              <div className="corridor reveal">
                <div className="corridor-route">GH → USDC → Base</div>
                <div className="corridor-name">Ghana B2B Payments</div>
                <div className="corridor-rule"></div>
                <div className="corridor-kv">
                  <span className="k">Avg. settlement</span>
                  <span className="v mono">38s</span>
                </div>
                <div className="corridor-kv">
                  <span className="k">Cost per transfer</span>
                  <span className="v mono">$0.11</span>
                </div>
                <div className="corridor-kv">
                  <span className="k">Monthly volume</span>
                  <span className="v mono">$840K</span>
                </div>
                <div className="corridor-cap">
                  Ghana merchant-to-merchant flows. Lower fees via Base L2, full CCTP support.
                </div>
              </div>
              <div className="corridor reveal">
                <div className="corridor-route">KE → USDC → Arc</div>
                <div className="corridor-name">Kenya Supplier Network</div>
                <div className="corridor-rule"></div>
                <div className="corridor-kv">
                  <span className="k">Avg. settlement</span>
                  <span className="v mono">45s</span>
                </div>
                <div className="corridor-kv">
                  <span className="k">Cost per transfer</span>
                  <span className="v mono">$0.09</span>
                </div>
                <div className="corridor-kv">
                  <span className="k">Monthly volume</span>
                  <span className="v mono">$620K</span>
                </div>
                <div className="corridor-cap">
                  Kenyan supplier payments via Arc blockchain. Lowest-cost route for regional flows.
                </div>
              </div>
              <div className="corridor reveal">
                <div className="corridor-route">ZA → USDC → Polygon</div>
                <div className="corridor-name">South Africa Remittances</div>
                <div className="corridor-rule"></div>
                <div className="corridor-kv">
                  <span className="k">Avg. settlement</span>
                  <span className="v mono">51s</span>
                </div>
                <div className="corridor-kv">
                  <span className="k">Cost per transfer</span>
                  <span className="v mono">$0.16</span>
                </div>
                <div className="corridor-kv">
                  <span className="k">Monthly volume</span>
                  <span className="v mono">$980K</span>
                </div>
                <div className="corridor-cap">
                  Cross-border remittances from South African businesses. Compliance-heavy, fully audited.
                </div>
              </div>
              <div className="corridor reveal">
                <div className="corridor-route">EG → USDC → Base</div>
                <div className="corridor-name">Egypt Freelancer Payouts</div>
                <div className="corridor-rule"></div>
                <div className="corridor-kv">
                  <span className="k">Avg. settlement</span>
                  <span className="v mono">39s</span>
                </div>
                <div className="corridor-kv">
                  <span className="k">Cost per transfer</span>
                  <span className="v mono">$0.12</span>
                </div>
                <div className="corridor-kv">
                  <span className="k">Monthly volume</span>
                  <span className="v mono">$440K</span>
                </div>
                <div className="corridor-cap">
                  Optimized for gig economy platforms paying Egyptian freelancers in USDC.
                </div>
              </div>
              <div className="corridor corridor-custom reveal">
                <div className="plus">+</div>
                <div className="label">Request custom corridor</div>
                <div className="sub">We'll build it in 2-4 weeks</div>
              </div>
            </div>
          </div>
        </section>

        <section className="numbers">
          <div className="section container">
            <div className="reveal">
              <div className="eyebrow">By the numbers</div>
              <h2 className="h2">Testnet traction since launch</h2>
            </div>
            <div className="numbers-row">
              <div className="stat reveal">
                <div className="stat-num mono">$4.2M</div>
                <div className="stat-label">Volume settled</div>
              </div>
              <div className="stat reveal">
                <div className="stat-num mono">1,847</div>
                <div className="stat-label">Businesses</div>
              </div>
              <div className="stat reveal">
                <div className="stat-num mono">52K</div>
                <div className="stat-label">Transactions</div>
              </div>
              <div className="stat reveal">
                <div className="stat-num mono">12</div>
                <div className="stat-label">Countries</div>
              </div>
              <div className="stat reveal">
                <div className="stat-num mono">41s</div>
                <div className="stat-label">Avg settlement</div>
              </div>
              <div className="stat reveal">
                <div className="stat-num mono">$0.13</div>
                <div className="stat-label">Avg cost</div>
              </div>
            </div>
            <div className="numbers-foot reveal mono">
              Arc Testnet • Last 30 days • Updated daily
            </div>
          </div>
        </section>

        <section className="built-on section-tight">
          <div className="container">
            <div className="built-on-grid">
              <div className="reveal">
                <div className="eyebrow">Built on</div>
                <h2 className="h3">Production-grade infrastructure from day one</h2>
                <p className="body-l" style={{ marginTop: '20px' }}>
                  Mizan is built on Arc blockchain and Circle's CCTP protocol—battle-tested infrastructure that powers billions in stablecoin transfers.
                </p>
              </div>
              <div>
                <div className="built-row">
                  <div className="built-cell reveal">
                    <div className="built-cell-label">Blockchain</div>
                    <div className="built-cell-name">Arc</div>
                    <div className="built-cell-desc">Low-cost L2 optimized for payments</div>
                  </div>
                  <div className="built-cell reveal">
                    <div className="built-cell-label">Stablecoin</div>
                    <div className="built-cell-name">USDC</div>
                    <div className="built-cell-desc">Native digital dollar</div>
                  </div>
                  <div className="built-cell reveal">
                    <div className="built-cell-label">Protocol</div>
                    <div className="built-cell-name">CCTP</div>
                    <div className="built-cell-desc">Native cross-chain transfers</div>
                  </div>
                </div>
                <a href="#docs" className="attribution-link reveal">
                  Read the technical docs →
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-band section-tight">
          <div className="container">
            <div className="reveal">
              <h2 className="h2">Ready to build?</h2>
              <p className="cta-band-sub">
                Start integrating Mizan into your SME payment flows today. Arc Testnet is live.
              </p>
              <div className="cta-band-actions">
                <a href="#get-started" className="btn btn-primary">Start integrating</a>
                <a href="#docs" className="btn btn-secondary">Read the docs</a>
              </div>
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="container">
            <div className="footer-top">
              <div className="footer-brand">
                <div className="name">Mizan</div>
                <div className="rule"></div>
                <div className="ar">ميزان</div>
                <div className="meta">
                  Agentic payment infrastructure<br />
                  for emerging market SMEs
                </div>
              </div>
              <div className="footer-col">
                <h5>Product</h5>
                <ul>
                  <li><a href="#how-it-works">How it works</a></li>
                  <li><a href="#corridors">Corridors</a></li>
                  <li><a href="#pricing">Pricing</a></li>
                  <li><a href="#demo">Demo</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h5>Developers</h5>
                <ul>
                  <li><a href="#docs">Documentation</a></li>
                  <li><a href="#api">API Reference</a></li>
                  <li><a href="#sdk">SDK</a></li>
                  <li><a href="#github">GitHub</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h5>Company</h5>
                <ul>
                  <li><a href="#about">About</a></li>
                  <li><a href="#blog">Blog</a></li>
                  <li><a href="#careers">Careers</a></li>
                  <li><a href="#contact">Contact</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h5>Legal</h5>
                <ul>
                  <li><a href="#privacy">Privacy</a></li>
                  <li><a href="#terms">Terms</a></li>
                  <li><a href="#compliance">Compliance</a></li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <p>
                © 2026 Mizan. All rights reserved. Mizan is not a bank or financial institution.
                USDC is issued by Circle. Always do your own research.
              </p>
              <div className="footer-care mono">Built with ♥ for SMEs</div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
