/**
 * v2 templates — built on the new component set (faq, pricing, testimonials,
 * gallery, productGrid, accordion). Each is a complete single-page layout
 * users can drop in and have a publishable site in one click.
 *
 * Component construction goes through `block()` so we don't have to repeat
 * boilerplate (id generation, default styles, prop wiring) in every entry.
 */

import { nanoid } from 'nanoid';
import type { Component, ComponentType } from '@/types/component';
import type { Template } from '@/types/template';

function block(
  type: ComponentType,
  props: Component['props'] = {},
  styles: Component['styles'] = { base: {} },
  children?: Component[],
): Component {
  return {
    id: nanoid(8),
    type,
    displayName: type,
    props,
    styles,
    children,
  };
}

/* ------------------------------------------------------------------ */
/* SaaS launch                                                        */
/* ------------------------------------------------------------------ */

const saasLaunchV2: Template = {
  id: 'v2-saas-launch',
  name: 'SaaS launch',
  category: 'landing',
  thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800',
  description: 'A clean SaaS landing page: hero, social proof, features, pricing, FAQ, CTA.',
  tags: ['saas', 'landing', 'pricing', 'faq', 'featured'],
  components: [
    block('navigation', {
      content: {
        logo: 'Lumen',
        links: [
          { text: 'Features', href: '#features' },
          { text: 'Pricing', href: '#pricing' },
          { text: 'FAQ', href: '#faq' },
          { text: 'Sign in', href: '#' },
        ],
      },
    }),
    block('hero', {
      content: {
        heading: 'Ship faster. Stress less.',
        subheading: 'Lumen turns your scattered docs, tickets, and code into one searchable knowledge base.',
        buttonText: 'Start free trial',
      },
    }, { base: { padding: '96px 24px', textAlign: 'center', background: 'linear-gradient(180deg, var(--color-surface, #F9FAFB), white)' } }),
    block('testimonials', {
      content: {
        title: 'Trusted by 4,200+ teams',
        items: [
          { quote: 'We replaced 3 SaaS tools with Lumen and got two engineering days back per week.', name: 'Ava Petrov', title: 'CTO, Glide', rating: 5 },
          { quote: 'Search actually finds what I mean, not just what I typed.', name: 'Marcus Lee', title: 'PM, Hopper', rating: 5 },
          { quote: 'The onboarding fits on a single screen. Refreshing.', name: 'Sara Okonkwo', title: 'Eng manager', rating: 5 },
        ],
      },
    }),
    block('features', {
      content: {
        heading: 'Everything in one tab',
        features: [
          { icon: '🔍', title: 'Unified search', description: 'One box, every doc / repo / ticket.' },
          { icon: '🧠', title: 'AI summaries', description: 'Skim 10 pages in 10 seconds.' },
          { icon: '🔒', title: 'SOC 2 ready', description: 'SSO, audit logs, data residency.' },
          { icon: '⚡', title: '60ms p95', description: 'Local-first cache, no waiting.' },
          { icon: '🧩', title: '40+ integrations', description: 'Slack, Notion, Linear, GitHub…' },
          { icon: '📤', title: 'Open export', description: 'Markdown export, never locked in.' },
        ],
      },
    }, { base: { padding: '80px 24px', background: 'white' } }),
    block('pricing', { content: { tiers: [
      { name: 'Starter', price: '$0', period: '/mo', description: 'For solo builders.', features: ['Up to 3 sources', 'Community support', '7-day search history'], ctaLabel: 'Start free', ctaHref: '#' },
      { name: 'Team', price: '$12', period: '/seat/mo', description: 'For growing teams.', features: ['Unlimited sources', 'Email support', 'Full search history', 'SSO (SAML)'], ctaLabel: 'Start trial', ctaHref: '#', highlighted: true },
      { name: 'Enterprise', price: 'Custom', period: '', description: 'Compliance, scale, SLA.', features: ['Everything in Team', 'Audit log export', 'Data residency', 'Priority on-call'], ctaLabel: 'Talk to us', ctaHref: '#' },
    ], title: 'Simple pricing', subtitle: 'No seats, no surprises.' } }),
    block('faq', { content: {
      title: 'Frequently asked',
      subtitle: '',
      items: [
        { question: 'Is there a free plan?', answer: 'Yes — Starter is free forever for solo users.' },
        { question: 'Can I self-host?', answer: 'Yes, the open-source agent ships under MIT.' },
        { question: 'How does billing work?', answer: 'Monthly, per active seat. Cancel any time.' },
        { question: 'Where is my data stored?', answer: 'Default us-east-1; eu-west-1 available on Team and up.' },
      ],
    } }),
    block('cta', { content: { heading: 'Ready to ship faster?', description: 'Free trial, no credit card.', buttonText: 'Start free trial' } }, { base: { padding: '96px 24px', background: 'linear-gradient(135deg, var(--color-primary, #3B82F6), var(--color-secondary, #6366F1))', color: 'white', textAlign: 'center' } }),
    block('footer', { content: { copyright: '© 2026 Lumen Software', links: ['Privacy', 'Terms', 'Status', 'Contact'] } }),
  ],
};

/* ------------------------------------------------------------------ */
/* Online store                                                       */
/* ------------------------------------------------------------------ */

const onlineStoreV2: Template = {
  id: 'v2-online-store',
  name: 'Online store',
  category: 'ecommerce',
  thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
  description: 'Single-page storefront with product grid, social proof, FAQ, and Stripe-ready checkout.',
  tags: ['ecommerce', 'commerce', 'shop', 'featured'],
  components: [
    block('navigation', { content: { logo: 'Stitch & Co.', links: [
      { text: 'Shop', href: '#shop' },
      { text: 'About', href: '#about' },
      { text: 'Contact', href: '#contact' },
    ] } }),
    block('hero', { content: {
      heading: 'Wear something honest.',
      subheading: 'Heavyweight basics made in small batches. Free shipping over $75.',
      buttonText: 'Shop the collection',
    } }, { base: { padding: '120px 24px', textAlign: 'center', background: 'linear-gradient(180deg, #FEF7E6, white)' } }),
    block('productGrid', { content: { source: 'all', columns: 3, showPrice: true, showAddToCart: true } }, { base: { padding: '64px 24px', maxWidth: '1200px', margin: '0 auto' } }),
    block('testimonials', { content: {
      title: 'Customers on Stitch',
      items: [
        { quote: 'Best tee I have owned. Wash 12, still no pilling.', name: 'Jamie R.', title: 'Verified buyer', rating: 5 },
        { quote: 'The fabric feels expensive without the price.', name: 'Devi K.', title: 'Verified buyer', rating: 5 },
        { quote: 'Fit is consistent across sizes. Rare.', name: 'Theo M.', title: 'Verified buyer', rating: 5 },
      ],
    } }),
    block('faq', { content: {
      title: 'Shipping & returns',
      subtitle: '',
      items: [
        { question: 'How long does shipping take?', answer: '2–5 business days in the US, 7–12 internationally.' },
        { question: 'What is your return policy?', answer: 'Free returns within 30 days, no questions asked.' },
        { question: 'Are sizes true to fit?', answer: 'Yes — see the chart on each product page. We use the same template across the line.' },
        { question: 'Do you offer exchanges?', answer: 'Yes, included with free returns.' },
      ],
    } }),
    block('newsletter', { content: {
      title: 'New drops, no spam',
      subtitle: 'One email a month, the day something new lands.',
      placeholder: 'you@example.com',
      buttonLabel: 'Notify me',
      useGlobalFormProvider: true,
      successMessage: "You're on the list.",
    } }),
    block('footer', { content: { copyright: '© 2026 Stitch & Co.', links: ['Shipping', 'Returns', 'Contact', 'Instagram'] } }),
  ],
};

/* ------------------------------------------------------------------ */
/* Photographer portfolio                                             */
/* ------------------------------------------------------------------ */

const photoPortfolioV2: Template = {
  id: 'v2-photo-portfolio',
  name: 'Photographer portfolio',
  category: 'portfolio',
  thumbnail: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800',
  description: 'Minimal portfolio centred on a responsive gallery, with about + contact sections.',
  tags: ['portfolio', 'photography', 'gallery', 'featured'],
  components: [
    block('navigation', { content: { logo: 'Mira Adekola', links: [
      { text: 'Work', href: '#work' },
      { text: 'About', href: '#about' },
      { text: 'Contact', href: '#contact' },
    ] } }),
    block('hero', { content: {
      heading: 'Quiet portraits, loud cities.',
      subheading: 'Editorial and documentary photography from Lagos, London and Lisbon.',
      buttonText: 'See the work',
    } }, { base: { padding: '120px 24px', textAlign: 'center' } }),
    block('gallery', { content: { images: [
      { url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800', alt: 'Mountain ridge' },
      { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800', alt: 'Wheat field' },
      { url: 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=800', alt: 'Forest path' },
      { url: 'https://images.unsplash.com/photo-1444065381814-865dc9da92c0?w=800', alt: 'Desert dunes' },
      { url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800', alt: 'Lakeside reflection' },
      { url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800', alt: 'Snow-capped peaks' },
    ], columns: 3, gap: 12, lightbox: true } }, { base: { padding: '40px 24px' } }),
    block('testimonials', { content: {
      title: 'Selected words',
      items: [
        { quote: 'Mira sees moments other photographers walk past.', name: 'The Editorial Quarterly', title: 'Feature, 2025', rating: 5 },
        { quote: 'Quiet work that lingers.', name: 'Bloom Mag', title: 'Review', rating: 5 },
      ],
    } }),
    block('newsletter', { content: {
      title: 'Get new work, twice a year',
      subtitle: 'Newsletter only, no socials.',
      placeholder: 'you@example.com',
      buttonLabel: 'Subscribe',
      useGlobalFormProvider: true,
      successMessage: 'Subscribed.',
    } }),
    block('footer', { content: { copyright: '© 2026 Mira Adekola Studio', links: ['Email', 'Instagram', 'Print sales'] } }),
  ],
};

/* ------------------------------------------------------------------ */
/* Restaurant                                                         */
/* ------------------------------------------------------------------ */

const restaurantV2: Template = {
  id: 'v2-restaurant',
  name: 'Restaurant',
  category: 'business',
  thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
  description: 'A warm one-pager for a neighbourhood restaurant: hours, menu sections, reservations.',
  tags: ['restaurant', 'food', 'business'],
  components: [
    block('navigation', { content: { logo: 'Almond Tree Kitchen', links: [
      { text: 'Menu', href: '#menu' },
      { text: 'Hours', href: '#hours' },
      { text: 'Reservations', href: '#book' },
    ] } }),
    block('hero', { content: {
      heading: 'Almond Tree Kitchen',
      subheading: 'Open-fire Mediterranean cooking, served slow.',
      buttonText: 'Book a table',
    } }, { base: { padding: '140px 24px', textAlign: 'center', background: 'linear-gradient(180deg, #F5EBDD, white)' } }),
    block('gallery', { content: { images: [
      { url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', alt: 'Wood-fired bread' },
      { url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800', alt: 'Roast vegetables' },
      { url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800', alt: 'Pasta course' },
    ], columns: 3, gap: 8, lightbox: true } }, { base: { padding: '32px 24px' } }),
    block('features', { content: {
      heading: 'On the menu',
      features: [
        { icon: '🍞', title: 'Hearth', description: 'Wood-fired focaccia, charred greens, salt-baked fish.' },
        { icon: '🍝', title: 'Pasta', description: 'Hand-rolled daily. Egg yolk raviolo, cacio e pepe, anchovy linguine.' },
        { icon: '🍷', title: 'Cellar', description: 'Low-intervention pours from Sicily, Friuli, the Loire.' },
      ],
    } }),
    block('accordion', { content: { items: [
      { title: 'Opening hours', content: 'Tuesday–Saturday, 18:00–23:00. Closed Sunday and Monday.' },
      { title: 'Reservations', content: 'Tables for up to 6 online. Larger parties: call 020 1234 5678.' },
      { title: 'Dietary needs', content: 'GF and vegan tasting menus available with 48-hour notice.' },
      { title: 'Private hire', content: 'Available Mondays and full restaurant for 32 guests.' },
    ], allowMultiple: true } }, { base: { padding: '40px 24px' } }),
    block('cta', { content: {
      heading: 'A table for you',
      description: 'Book online or call 020 1234 5678.',
      buttonText: 'Book a table',
    } }, { base: { padding: '80px 24px', background: '#1A1A1A', color: 'white', textAlign: 'center' } }),
    block('footer', { content: { copyright: '© 2026 Almond Tree Kitchen, London', links: ['Instagram', 'Press', 'Vouchers'] } }),
  ],
};

/* ------------------------------------------------------------------ */
/* Agency                                                             */
/* ------------------------------------------------------------------ */

const agencyV2: Template = {
  id: 'v2-agency',
  name: 'Studio / agency',
  category: 'business',
  thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
  description: 'Studio one-pager with service accordion, case studies grid, and a strong CTA.',
  tags: ['agency', 'studio', 'business'],
  components: [
    block('navigation', { content: { logo: 'Drift Studio', links: [
      { text: 'Work', href: '#work' },
      { text: 'Services', href: '#services' },
      { text: 'Contact', href: '#contact' },
    ] } }),
    block('hero', { content: {
      heading: 'A small studio that ships big things.',
      subheading: 'Brand, product and motion for ambitious teams.',
      buttonText: 'See selected work',
    } }, { base: { padding: '120px 24px', textAlign: 'center' } }),
    block('features', { content: {
      heading: 'Selected work',
      features: [
        { icon: '◆', title: 'Mariner', description: 'Brand + product for a marine analytics startup.' },
        { icon: '●', title: 'Hearthside', description: 'Identity + packaging for a Brooklyn bakery.' },
        { icon: '▲', title: 'Halo Health', description: 'Patient-facing app, end-to-end product design.' },
      ],
    } }),
    block('accordion', { content: { items: [
      { title: 'Brand', content: 'Naming, identity, voice, brand guidelines. From wordmark to launch.' },
      { title: 'Product', content: 'UX strategy, design systems, prototyping, hand-off to engineering.' },
      { title: 'Motion', content: 'Brand motion, product micro-interactions, launch films.' },
      { title: 'Strategy', content: 'Positioning workshops, narrative audits, GTM messaging.' },
    ], allowMultiple: false } }, { base: { padding: '40px 24px' } }),
    block('testimonials', { content: {
      title: 'Clients on Drift',
      items: [
        { quote: 'Drift took our half-baked idea and shipped a brand we are proud of.', name: 'Reza Hassan', title: 'Founder, Mariner', rating: 5 },
        { quote: 'The motion package alone paid for the project. Conversion up 32%.', name: 'Liana Park', title: 'GM, Halo', rating: 5 },
      ],
    } }),
    block('cta', { content: {
      heading: 'Got a brief?',
      description: 'We take on six engagements a year. Two slots open Q3.',
      buttonText: 'Start a conversation',
    } }, { base: { padding: '96px 24px', background: 'var(--color-text, #111827)', color: 'white', textAlign: 'center' } }),
    block('footer', { content: { copyright: '© 2026 Drift Studio Ltd.', links: ['Privacy', 'Hello'] } }),
  ],
};

export const v2Templates: Template[] = [
  saasLaunchV2,
  onlineStoreV2,
  photoPortfolioV2,
  restaurantV2,
  agencyV2,
];
