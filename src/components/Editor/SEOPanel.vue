<template>
  <div class="seo-panel">
    <div class="panel-header">
      <div class="header-title">
        <Search :size="18" />
        <h3>SEO Settings</h3>
      </div>
      <button @click="showSEO = !showSEO" class="toggle-btn">
        <ChevronDown :size="16" :class="{ rotated: showSEO }" />
      </button>
    </div>

    <transition name="expand">
      <div v-if="showSEO" class="panel-content">
        <!-- Page Metadata -->
        <div class="seo-section">
          <h4>Page Metadata</h4>

          <div class="input-group">
            <label>
              Page Title
              <span class="char-count">{{ pageTitle.length }}/60</span>
            </label>
            <input
              v-model="pageTitle"
              type="text"
              placeholder="Your Page Title | Brand Name"
              maxlength="60"
              @input="updateSEO"
            />
            <span class="hint">Appears in browser tabs and search results</span>
          </div>

          <div class="input-group">
            <label>
              Meta Description
              <span class="char-count">{{ metaDescription.length }}/160</span>
            </label>
            <textarea
              v-model="metaDescription"
              placeholder="Brief description of your page content..."
              maxlength="160"
              rows="3"
              @input="updateSEO"
            ></textarea>
            <span class="hint">Summary shown in search results</span>
          </div>

          <div class="input-group">
            <label>URL Slug</label>
            <div class="url-input">
              <span class="url-base">{{ baseUrl }}/</span>
              <input
                v-model="urlSlug"
                type="text"
                placeholder="page-url"
                @input="updateSEO"
              />
            </div>
          </div>

          <div class="input-group">
            <label>Keywords</label>
            <input
              v-model="keywords"
              type="text"
              placeholder="keyword1, keyword2, keyword3"
              @input="updateSEO"
            />
            <span class="hint">Comma-separated list of target keywords</span>
          </div>
        </div>

        <!-- Social Media Preview -->
        <div class="seo-section">
          <h4>Social Media Preview</h4>

          <div class="social-tabs">
            <button
              v-for="platform in socialPlatforms"
              :key="platform.id"
              @click="activeSocialTab = platform.id"
              :class="['tab-btn', { active: activeSocialTab === platform.id }]"
            >
              <component :is="platform.icon" :size="14" />
              {{ platform.name }}
            </button>
          </div>

          <!-- Facebook/Open Graph -->
          <div v-if="activeSocialTab === 'facebook'" class="social-content">
            <div class="input-group">
              <label>OG Title</label>
              <input
                v-model="ogTitle"
                type="text"
                placeholder="Title for social sharing"
                @input="updateSEO"
              />
            </div>

            <div class="input-group">
              <label>OG Description</label>
              <textarea
                v-model="ogDescription"
                placeholder="Description for social sharing"
                rows="2"
                @input="updateSEO"
              ></textarea>
            </div>

            <div class="input-group">
              <label>OG Image</label>
              <div class="image-upload">
                <input
                  v-model="ogImage"
                  type="text"
                  placeholder="Image URL (1200x630px recommended)"
                  @input="updateSEO"
                />
                <button @click="selectOGImage" class="browse-btn">
                  <Upload :size="14" />
                </button>
              </div>
              <span class="hint">Recommended: 1200x630px for best results</span>
            </div>

            <!-- Facebook Preview -->
            <div class="social-preview facebook-preview">
              <div class="preview-image">
                <img v-if="ogImage" :src="ogImage" alt="OG Image" />
                <div v-else class="placeholder-image">
                  <Image :size="32" />
                </div>
              </div>
              <div class="preview-content">
                <span class="preview-domain">{{ baseUrl }}</span>
                <h5>{{ ogTitle || pageTitle || 'Page Title' }}</h5>
                <p>{{ ogDescription || metaDescription || 'Page description...' }}</p>
              </div>
            </div>
          </div>

          <!-- Twitter Card -->
          <div v-if="activeSocialTab === 'twitter'" class="social-content">
            <div class="input-group">
              <label>Twitter Card Type</label>
              <select v-model="twitterCardType" @change="updateSEO">
                <option value="summary">Summary</option>
                <option value="summary_large_image">Summary with Large Image</option>
              </select>
            </div>

            <div class="input-group">
              <label>Twitter Title</label>
              <input
                v-model="twitterTitle"
                type="text"
                placeholder="Title for Twitter"
                maxlength="70"
                @input="updateSEO"
              />
            </div>

            <div class="input-group">
              <label>Twitter Description</label>
              <textarea
                v-model="twitterDescription"
                placeholder="Description for Twitter"
                maxlength="200"
                rows="2"
                @input="updateSEO"
              ></textarea>
            </div>

            <div class="input-group">
              <label>Twitter Image</label>
              <input
                v-model="twitterImage"
                type="text"
                placeholder="Image URL"
                @input="updateSEO"
              />
            </div>

            <!-- Twitter Preview -->
            <div class="social-preview twitter-preview" :class="twitterCardType">
              <div class="preview-image">
                <img v-if="twitterImage" :src="twitterImage" alt="Twitter Image" />
                <div v-else class="placeholder-image">
                  <Image :size="32" />
                </div>
              </div>
              <div class="preview-content">
                <h5>{{ twitterTitle || pageTitle || 'Page Title' }}</h5>
                <p>{{ twitterDescription || metaDescription || 'Page description...' }}</p>
                <span class="preview-domain">{{ baseUrl }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Advanced SEO -->
        <div class="seo-section">
          <h4>Advanced SEO</h4>

          <div class="input-group">
            <label>Canonical URL</label>
            <input
              v-model="canonicalUrl"
              type="url"
              placeholder="https://example.com/page"
              @input="updateSEO"
            />
            <span class="hint">Preferred URL for this page</span>
          </div>

          <div class="input-group">
            <label>Robots Meta</label>
            <div class="checkbox-group">
              <label>
                <input
                  v-model="noIndex"
                  type="checkbox"
                  @change="updateSEO"
                />
                No Index (Hide from search engines)
              </label>
              <label>
                <input
                  v-model="noFollow"
                  type="checkbox"
                  @change="updateSEO"
                />
                No Follow (Don't follow links)
              </label>
            </div>
          </div>

          <div class="input-group">
            <label>Language</label>
            <select v-model="language" @change="updateSEO">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="pt">Portuguese</option>
              <option value="zh">Chinese</option>
              <option value="ja">Japanese</option>
              <option value="ko">Korean</option>
            </select>
          </div>

          <div class="input-group">
            <label>Schema Markup</label>
            <select v-model="schemaType" @change="updateSEO">
              <option value="">None</option>
              <option value="Article">Article</option>
              <option value="Product">Product</option>
              <option value="LocalBusiness">Local Business</option>
              <option value="Organization">Organization</option>
              <option value="Person">Person</option>
              <option value="Event">Event</option>
              <option value="FAQ">FAQ</option>
            </select>
          </div>
        </div>

        <!-- SEO Analysis -->
        <div class="seo-section">
          <h4>SEO Analysis</h4>

          <div class="seo-score">
            <div class="score-circle" :class="scoreClass">
              <span class="score-value">{{ seoScore }}</span>
              <span class="score-label">/ 100</span>
            </div>
            <div class="score-details">
              <h5>{{ scoreLabel }}</h5>
              <p>{{ scoreDescription }}</p>
            </div>
          </div>

          <div class="seo-issues">
            <div
              v-for="issue in seoIssues"
              :key="issue.id"
              class="issue-item"
              :class="issue.severity"
            >
              <component :is="getIssueIcon(issue.severity)" :size="16" />
              <span>{{ issue.message }}</span>
            </div>
          </div>

          <button @click="generateSitemap" class="action-btn">
            <FileText :size="14" />
            Generate Sitemap
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useEditorStore } from '@/stores/editor';
import { useToast } from '@/composables/useToast';
import {
  Search,
  ChevronDown,
  Upload,
  Image,
  Facebook,
  Twitter,
  Linkedin,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-vue-next';

const store = useEditorStore();
const { showToast } = useToast();

// State
const showSEO = ref(true);
const baseUrl = ref(window.location.origin);

// Page Metadata
const pageTitle = ref('');
const metaDescription = ref('');
const urlSlug = ref('');
const keywords = ref('');

// Social Media
const activeSocialTab = ref('facebook');
const ogTitle = ref('');
const ogDescription = ref('');
const ogImage = ref('');
const twitterCardType = ref('summary_large_image');
const twitterTitle = ref('');
const twitterDescription = ref('');
const twitterImage = ref('');

// Advanced SEO
const canonicalUrl = ref('');
const noIndex = ref(false);
const noFollow = ref(false);
const language = ref('en');
const schemaType = ref('');

// Social platforms
const socialPlatforms = [
  { id: 'facebook', name: 'Facebook', icon: Facebook },
  { id: 'twitter', name: 'Twitter', icon: Twitter },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin }
];

// SEO Analysis
const seoScore = computed(() => {
  let score = 0;

  // Check title
  if (pageTitle.value) {
    score += 15;
    if (pageTitle.value.length >= 30 && pageTitle.value.length <= 60) {
      score += 10;
    }
  }

  // Check description
  if (metaDescription.value) {
    score += 15;
    if (metaDescription.value.length >= 120 && metaDescription.value.length <= 160) {
      score += 10;
    }
  }

  // Check URL slug
  if (urlSlug.value) {
    score += 10;
    if (urlSlug.value.toLowerCase() === urlSlug.value && !urlSlug.value.includes(' ')) {
      score += 5;
    }
  }

  // Check keywords
  if (keywords.value) {
    score += 10;
  }

  // Check OG tags
  if (ogTitle.value || pageTitle.value) score += 5;
  if (ogDescription.value || metaDescription.value) score += 5;
  if (ogImage.value) score += 10;

  // Check schema
  if (schemaType.value) score += 10;

  return Math.min(score, 100);
});

const scoreClass = computed(() => {
  if (seoScore.value >= 80) return 'good';
  if (seoScore.value >= 60) return 'fair';
  return 'poor';
});

const scoreLabel = computed(() => {
  if (seoScore.value >= 80) return 'Good SEO';
  if (seoScore.value >= 60) return 'Fair SEO';
  return 'Poor SEO';
});

const scoreDescription = computed(() => {
  if (seoScore.value >= 80) return 'Your page is well-optimized for search engines';
  if (seoScore.value >= 60) return 'Some improvements can be made';
  return 'Several issues need attention';
});

const seoIssues = computed(() => {
  const issues = [];

  if (!pageTitle.value) {
    issues.push({
      id: 'title',
      severity: 'error',
      message: 'Page title is missing'
    });
  } else if (pageTitle.value.length < 30) {
    issues.push({
      id: 'title-short',
      severity: 'warning',
      message: 'Page title is too short (min 30 characters)'
    });
  } else if (pageTitle.value.length > 60) {
    issues.push({
      id: 'title-long',
      severity: 'warning',
      message: 'Page title is too long (max 60 characters)'
    });
  }

  if (!metaDescription.value) {
    issues.push({
      id: 'description',
      severity: 'error',
      message: 'Meta description is missing'
    });
  } else if (metaDescription.value.length < 120) {
    issues.push({
      id: 'description-short',
      severity: 'warning',
      message: 'Meta description is too short (min 120 characters)'
    });
  }

  if (!urlSlug.value) {
    issues.push({
      id: 'slug',
      severity: 'warning',
      message: 'URL slug is not set'
    });
  }

  if (!ogImage.value) {
    issues.push({
      id: 'og-image',
      severity: 'info',
      message: 'Social media image is missing'
    });
  }

  if (issues.length === 0) {
    issues.push({
      id: 'success',
      severity: 'success',
      message: 'All checks passed!'
    });
  }

  return issues;
});

// Methods
function updateSEO() {
  // Store SEO data in the global store
  if (!store.globalCustomCode) {
    store.globalCustomCode = { css: '', javascript: '', headHTML: '' };
  }

  // Generate meta tags
  const metaTags = generateMetaTags();
  store.globalCustomCode.headHTML = metaTags;

  showToast('SEO settings updated', 'success');
}

function generateMetaTags() {
  let tags = '';

  // Basic meta tags
  if (pageTitle.value) {
    tags += `<title>${pageTitle.value}</title>\n`;
  }

  if (metaDescription.value) {
    tags += `<meta name="description" content="${metaDescription.value}">\n`;
  }

  if (keywords.value) {
    tags += `<meta name="keywords" content="${keywords.value}">\n`;
  }

  // Open Graph tags
  if (ogTitle.value || pageTitle.value) {
    tags += `<meta property="og:title" content="${ogTitle.value || pageTitle.value}">\n`;
  }

  if (ogDescription.value || metaDescription.value) {
    tags += `<meta property="og:description" content="${ogDescription.value || metaDescription.value}">\n`;
  }

  if (ogImage.value) {
    tags += `<meta property="og:image" content="${ogImage.value}">\n`;
  }

  tags += `<meta property="og:type" content="website">\n`;
  tags += `<meta property="og:url" content="${baseUrl.value}/${urlSlug.value}">\n`;

  // Twitter Card tags
  tags += `<meta name="twitter:card" content="${twitterCardType.value}">\n`;

  if (twitterTitle.value || pageTitle.value) {
    tags += `<meta name="twitter:title" content="${twitterTitle.value || pageTitle.value}">\n`;
  }

  if (twitterDescription.value || metaDescription.value) {
    tags += `<meta name="twitter:description" content="${twitterDescription.value || metaDescription.value}">\n`;
  }

  if (twitterImage.value || ogImage.value) {
    tags += `<meta name="twitter:image" content="${twitterImage.value || ogImage.value}">\n`;
  }

  // Canonical URL
  if (canonicalUrl.value) {
    tags += `<link rel="canonical" href="${canonicalUrl.value}">\n`;
  }

  // Robots meta
  if (noIndex.value || noFollow.value) {
    const robotsContent = [];
    if (noIndex.value) robotsContent.push('noindex');
    if (noFollow.value) robotsContent.push('nofollow');
    tags += `<meta name="robots" content="${robotsContent.join(', ')}">\n`;
  }

  // Language
  tags += `<meta http-equiv="content-language" content="${language.value}">\n`;

  // Schema markup
  if (schemaType.value) {
    tags += generateSchemaMarkup();
  }

  return tags;
}

function generateSchemaMarkup() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': schemaType.value,
    name: pageTitle.value,
    description: metaDescription.value,
    url: `${baseUrl.value}/${urlSlug.value}`
  };

  // Use escaped script tags to avoid Vue template parsing issues
  return '\x3Cscript type="application/ld+json"\x3E' + JSON.stringify(schema, null, 2) + '\x3C/script\x3E\n';
}

function selectOGImage() {
  store.toggleAssetManager();
}

function generateSitemap() {
  // Use character codes to avoid Vue template parsing issues
  const xmlHeader = '\x3C?xml version="1.0" encoding="UTF-8"?\x3E';
  const sitemap = xmlHeader + '\n' +
'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
'  <url>\n' +
`    <loc>${baseUrl.value}/${urlSlug.value}</loc>\n` +
`    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n` +
'    <changefreq>weekly</changefreq>\n' +
'    <priority>1.0</priority>\n' +
'  </url>\n' +
'</urlset>';

  // Create download
  const blob = new Blob([sitemap], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sitemap.xml';
  a.click();

  showToast('Sitemap generated and downloaded', 'success');
}

function getIssueIcon(severity: string) {
  switch (severity) {
    case 'error': return XCircle;
    case 'warning': return AlertCircle;
    case 'success': return CheckCircle;
    default: return Info;
  }
}

// Load existing SEO data on mount
onMounted(() => {
  // Could load from localStorage or project metadata
  const savedSEO = localStorage.getItem('projectSEO');
  if (savedSEO) {
    const data = JSON.parse(savedSEO);
    pageTitle.value = data.pageTitle || '';
    metaDescription.value = data.metaDescription || '';
    urlSlug.value = data.urlSlug || '';
    keywords.value = data.keywords || '';
  }
});

// Save SEO data when changed
watch([pageTitle, metaDescription, urlSlug, keywords], () => {
  const seoData = {
    pageTitle: pageTitle.value,
    metaDescription: metaDescription.value,
    urlSlug: urlSlug.value,
    keywords: keywords.value
  };
  localStorage.setItem('projectSEO', JSON.stringify(seoData));
});
</script>

<style scoped>
.seo-panel {
  background: white;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid #e5e7eb;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-title h3 {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn:hover {
  background: #f3f4f6;
}

.toggle-btn svg {
  transition: transform 0.2s;
}

.toggle-btn svg.rotated {
  transform: rotate(180deg);
}

/* Panel Content */
.panel-content {
  padding: 16px;
}

.seo-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f3f4f6;
}

.seo-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.seo-section h4 {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 16px;
}

/* Input Groups */
.input-group {
  margin-bottom: 16px;
}

.input-group label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.char-count {
  font-size: 11px;
  color: #9ca3af;
}

.input-group input,
.input-group textarea,
.input-group select {
  width: 100%;
  padding: 8px 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 13px;
  transition: all 0.2s;
}

.input-group input:focus,
.input-group textarea:focus,
.input-group select:focus {
  outline: none;
  border-color: #5b21b6;
  box-shadow: 0 0 0 3px rgba(91, 33, 182, 0.1);
}

.input-group textarea {
  resize: vertical;
  font-family: inherit;
}

.hint {
  display: block;
  font-size: 11px;
  color: #9ca3af;
  margin-top: 4px;
}

/* URL Input */
.url-input {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

.url-base {
  padding: 8px 12px;
  background: #f9fafb;
  border-right: 1px solid #e5e7eb;
  font-size: 12px;
  color: #6b7280;
}

.url-input input {
  flex: 1;
  border: none;
  padding: 8px 12px;
}

.url-input input:focus {
  outline: none;
}

/* Image Upload */
.image-upload {
  display: flex;
  gap: 4px;
}

.image-upload input {
  flex: 1;
}

.browse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.browse-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

/* Social Tabs */
.social-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  background: #f9fafb;
  padding: 4px;
  border-radius: 8px;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  padding: 8px;
  background: transparent;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover {
  background: white;
  color: #374151;
}

.tab-btn.active {
  background: white;
  color: #5b21b6;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* Social Preview */
.social-preview {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 16px;
}

.facebook-preview {
  display: flex;
}

.facebook-preview .preview-image {
  width: 160px;
  height: 160px;
  background: #e5e7eb;
  flex-shrink: 0;
}

.twitter-preview.summary_large_image .preview-image {
  width: 100%;
  height: 160px;
}

.preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}

.preview-content {
  padding: 12px;
  flex: 1;
}

.preview-domain {
  font-size: 11px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.preview-content h5 {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 4px 0;
}

.preview-content p {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
  margin: 0;
}

/* Checkbox Group */
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
  margin-right: 8px;
  width: auto;
}

/* SEO Score */
.seo-score {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 16px;
}

.score-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid #e5e7eb;
  background: white;
}

.score-circle.good {
  border-color: #10b981;
}

.score-circle.fair {
  border-color: #f59e0b;
}

.score-circle.poor {
  border-color: #ef4444;
}

.score-value {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.score-label {
  font-size: 11px;
  color: #6b7280;
}

.score-details h5 {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px;
}

.score-details p {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

/* SEO Issues */
.seo-issues {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.issue-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  font-size: 12px;
}

.issue-item.error {
  background: #fee2e2;
  color: #dc2626;
}

.issue-item.warning {
  background: #fef3c7;
  color: #d97706;
}

.issue-item.info {
  background: #dbeafe;
  color: #1d4ed8;
}

.issue-item.success {
  background: #d1fae5;
  color: #059669;
}

/* Action Button */
.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 10px;
  background: #5b21b6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  justify-content: center;
}

.action-btn:hover {
  background: #4c1d95;
}

/* Transitions */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>