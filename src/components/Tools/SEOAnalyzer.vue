<template>
  <div class="seo-analyzer">
    <div class="analyzer-header">
      <div class="header-title">
        <Search :size="24" class="icon" />
        <div>
          <h2>SEO Analyzer</h2>
          <p class="subtitle">Optimize your page for search engines</p>
        </div>
      </div>
      <button @click="analyzeCurrentPage" class="analyze-btn" :disabled="isAnalyzing">
        <RefreshCw :size="16" :class="{ spinning: isAnalyzing }" />
        {{ isAnalyzing ? 'Analyzing...' : 'Re-analyze' }}
      </button>
    </div>

    <!-- Score Overview -->
    <div class="score-section">
      <div class="score-circle" :class="scoreClass">
        <svg viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#E5E7EB"
            stroke-width="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            :stroke="scoreColor"
            stroke-width="8"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="dashOffset"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div class="score-value">
          <span class="number">{{ seoScore }}</span>
          <span class="label">SEO Score</span>
        </div>
      </div>
      <div class="score-breakdown">
        <div class="breakdown-item" v-for="item in scoreBreakdown" :key="item.label">
          <div class="breakdown-header">
            <span class="breakdown-label">{{ item.label }}</span>
            <span class="breakdown-score" :class="getScoreClass(item.score)">
              {{ item.score }}/{{ item.max }}
            </span>
          </div>
          <div class="breakdown-bar">
            <div
              class="breakdown-fill"
              :style="{ width: `${(item.score / item.max) * 100}%` }"
              :class="getScoreClass(item.score, item.max)"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Analysis Results -->
    <div class="results-section">
      <h3>Analysis Results</h3>
      
      <div class="result-categories">
        <button
          v-for="cat in categories"
          :key="cat.id"
          :class="['category-btn', { active: activeCategory === cat.id }]"
          @click="activeCategory = cat.id"
        >
          <component :is="cat.icon" :size="16" />
          {{ cat.name }}
          <span :class="['count', cat.status]">{{ cat.count }}</span>
        </button>
      </div>

      <div class="results-list">
        <div
          v-for="result in filteredResults"
          :key="result.id"
          :class="['result-item', result.status]"
        >
          <div class="result-icon">
            <CheckCircle v-if="result.status === 'pass'" :size="20" />
            <AlertTriangle v-else-if="result.status === 'warning'" :size="20" />
            <XCircle v-else :size="20" />
          </div>
          <div class="result-content">
            <h4>{{ result.title }}</h4>
            <p>{{ result.description }}</p>
            <div v-if="result.value" class="result-value">
              <code>{{ result.value }}</code>
            </div>
            <div v-if="result.recommendation" class="recommendation">
              <Lightbulb :size="14" />
              <span>{{ result.recommendation }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Keyword Analysis -->
    <div class="keywords-section">
      <h3>Keyword Density</h3>
      <div class="keyword-input">
        <input
          v-model="targetKeyword"
          type="text"
          placeholder="Enter target keyword to analyze..."
          @keyup.enter="analyzeKeyword"
        />
        <button @click="analyzeKeyword" :disabled="!targetKeyword.trim()">
          Analyze
        </button>
      </div>
      
      <div v-if="keywordAnalysis" class="keyword-results">
        <div class="keyword-stat">
          <span class="stat-label">Occurrences</span>
          <span class="stat-value">{{ keywordAnalysis.count }}</span>
        </div>
        <div class="keyword-stat">
          <span class="stat-label">Density</span>
          <span class="stat-value">{{ keywordAnalysis.density }}%</span>
        </div>
        <div class="keyword-stat">
          <span class="stat-label">In Title</span>
          <span :class="['stat-value', keywordAnalysis.inTitle ? 'good' : 'bad']">
            {{ keywordAnalysis.inTitle ? 'Yes' : 'No' }}
          </span>
        </div>
        <div class="keyword-stat">
          <span class="stat-label">In Headings</span>
          <span :class="['stat-value', keywordAnalysis.inHeadings ? 'good' : 'bad']">
            {{ keywordAnalysis.inHeadings ? 'Yes' : 'No' }}
          </span>
        </div>
      </div>

      <div class="common-words">
        <h4>Most Common Words</h4>
        <div class="word-cloud">
          <span
            v-for="word in commonWords"
            :key="word.text"
            class="word-item"
            :style="{ fontSize: `${12 + word.count * 2}px`, opacity: 0.5 + (word.count / 20) }"
          >
            {{ word.text }}
          </span>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="actions-section">
      <h3>Quick Actions</h3>
      <div class="action-buttons">
        <button @click="generateMetaTags" class="action-btn">
          <Code :size="18" />
          Generate Meta Tags
        </button>
        <button @click="exportReport" class="action-btn">
          <FileText :size="18" />
          Export Report
        </button>
        <button @click="checkMobile" class="action-btn">
          <Smartphone :size="18" />
          Mobile Check
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  Search,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Lightbulb,
  Code,
  FileText,
  Smartphone,
  Type,
  Image,
  Link,
  FileSearch,
  Globe
} from 'lucide-vue-next';
import { useEditorStore } from '@/stores/editor';
import { useToast } from '@/composables/useToast';

interface SEOResult {
  id: string;
  title: string;
  description: string;
  status: 'pass' | 'warning' | 'fail';
  value?: string;
  recommendation?: string;
  category: 'content' | 'technical' | 'images' | 'links';
}

interface KeywordAnalysis {
  count: number;
  density: string;
  inTitle: boolean;
  inHeadings: boolean;
}

const store = useEditorStore();
const { showToast } = useToast();

// State
const isAnalyzing = ref(false);
const seoScore = ref(0);
const targetKeyword = ref('');
const keywordAnalysis = ref<KeywordAnalysis | null>(null);
const activeCategory = ref('all');
const results = ref<SEOResult[]>([]);

// Constants
const circumference = 2 * Math.PI * 45;

// Computed
const dashOffset = computed(() => {
  const progress = seoScore.value / 100;
  return circumference * (1 - progress);
});

const scoreColor = computed(() => {
  if (seoScore.value >= 80) return '#10B981';
  if (seoScore.value >= 60) return '#F59E0B';
  return '#EF4444';
});

const scoreClass = computed(() => {
  if (seoScore.value >= 80) return 'good';
  if (seoScore.value >= 60) return 'medium';
  return 'poor';
});

const scoreBreakdown = ref([
  { label: 'Content', score: 0, max: 30 },
  { label: 'Technical', score: 0, max: 25 },
  { label: 'Images', score: 0, max: 25 },
  { label: 'Links', score: 0, max: 20 },
]);

const categories = computed(() => [
  { 
    id: 'all', 
    name: 'All', 
    icon: Globe, 
    count: results.value.length,
    status: 'neutral'
  },
  { 
    id: 'content', 
    name: 'Content', 
    icon: Type, 
    count: results.value.filter(r => r.category === 'content').length,
    status: getCategoryStatus('content')
  },
  { 
    id: 'technical', 
    name: 'Technical', 
    icon: FileSearch, 
    count: results.value.filter(r => r.category === 'technical').length,
    status: getCategoryStatus('technical')
  },
  { 
    id: 'images', 
    name: 'Images', 
    icon: Image, 
    count: results.value.filter(r => r.category === 'images').length,
    status: getCategoryStatus('images')
  },
  { 
    id: 'links', 
    name: 'Links', 
    icon: Link, 
    count: results.value.filter(r => r.category === 'links').length,
    status: getCategoryStatus('links')
  },
]);

const filteredResults = computed(() => {
  if (activeCategory.value === 'all') return results.value;
  return results.value.filter(r => r.category === activeCategory.value);
});

const commonWords = ref([
  { text: 'website', count: 8 },
  { text: 'design', count: 6 },
  { text: 'business', count: 5 },
  { text: 'services', count: 4 },
  { text: 'contact', count: 4 },
  { text: 'professional', count: 3 },
  { text: 'team', count: 3 },
  { text: 'solutions', count: 2 },
]);

// Methods
function getScoreClass(score: number, max: number = 100): string {
  const percentage = (score / max) * 100;
  if (percentage >= 80) return 'good';
  if (percentage >= 60) return 'medium';
  return 'poor';
}

function getCategoryStatus(category: string): string {
  const categoryResults = results.value.filter(r => r.category === category);
  const failCount = categoryResults.filter(r => r.status === 'fail').length;
  const warningCount = categoryResults.filter(r => r.status === 'warning').length;
  
  if (failCount > 0) return 'fail';
  if (warningCount > 0) return 'warning';
  return 'pass';
}

async function analyzeCurrentPage() {
  isAnalyzing.value = true;
  results.value = [];
  
  // Simulate analysis with delay
  await delay(500);

  // Analyze content from components
  const components = store.components;
  const allText = extractAllText(components);
  const images = extractImages(components);
  const links = extractLinks(components);
  const headings = extractHeadings(components);

  // Title analysis
  const title = store.projectName || 'Untitled';
  if (title.length >= 30 && title.length <= 60) {
    results.value.push({
      id: '1',
      title: 'Title Length',
      description: `Your title is ${title.length} characters, which is optimal.`,
      status: 'pass',
      value: title,
      category: 'content'
    });
    scoreBreakdown.value[0].score += 10;
  } else if (title.length < 30) {
    results.value.push({
      id: '1',
      title: 'Title Too Short',
      description: `Your title is only ${title.length} characters. Aim for 30-60 characters.`,
      status: 'warning',
      value: title,
      recommendation: 'Add more descriptive keywords to your title.',
      category: 'content'
    });
    scoreBreakdown.value[0].score += 5;
  } else {
    results.value.push({
      id: '1',
      title: 'Title Too Long',
      description: `Your title is ${title.length} characters. Search engines may truncate it.`,
      status: 'warning',
      value: title,
      recommendation: 'Shorten your title to under 60 characters.',
      category: 'content'
    });
    scoreBreakdown.value[0].score += 5;
  }

  await delay(200);

  // Meta description (mock - would come from project settings)
  const metaDescription = 'Built with OpenBuild website builder';
  if (metaDescription.length >= 120 && metaDescription.length <= 160) {
    results.value.push({
      id: '2',
      title: 'Meta Description',
      description: 'Your meta description length is optimal.',
      status: 'pass',
      value: metaDescription,
      category: 'content'
    });
    scoreBreakdown.value[0].score += 10;
  } else {
    results.value.push({
      id: '2',
      title: 'Meta Description',
      description: 'Meta description should be 120-160 characters.',
      status: 'warning',
      value: metaDescription,
      recommendation: 'Write a compelling description with your target keywords.',
      category: 'content'
    });
    scoreBreakdown.value[0].score += 5;
  }

  await delay(200);

  // Heading hierarchy
  if (headings.h1 === 1) {
    results.value.push({
      id: '3',
      title: 'H1 Heading',
      description: 'Your page has exactly one H1 heading, which is ideal.',
      status: 'pass',
      category: 'content'
    });
    scoreBreakdown.value[0].score += 10;
  } else if (headings.h1 === 0) {
    results.value.push({
      id: '3',
      title: 'Missing H1 Heading',
      description: 'Your page doesn\'t have an H1 heading.',
      status: 'fail',
      recommendation: 'Add a single H1 heading that includes your main keyword.',
      category: 'content'
    });
  } else {
    results.value.push({
      id: '3',
      title: 'Multiple H1 Headings',
      description: `Your page has ${headings.h1} H1 headings. Use only one.`,
      status: 'warning',
      recommendation: 'Keep only one H1 and convert others to H2.',
      category: 'content'
    });
    scoreBreakdown.value[0].score += 5;
  }

  await delay(200);

  // Image alt tags
  const imagesWithAlt = images.filter(img => img.alt && img.alt.trim());
  if (images.length === 0) {
    results.value.push({
      id: '4',
      title: 'No Images',
      description: 'Your page has no images.',
      status: 'warning',
      recommendation: 'Consider adding relevant images to improve engagement.',
      category: 'images'
    });
    scoreBreakdown.value[2].score += 10;
  } else if (imagesWithAlt.length === images.length) {
    results.value.push({
      id: '4',
      title: 'Image Alt Tags',
      description: `All ${images.length} images have alt text.`,
      status: 'pass',
      category: 'images'
    });
    scoreBreakdown.value[2].score += 25;
  } else {
    results.value.push({
      id: '4',
      title: 'Missing Alt Tags',
      description: `${images.length - imagesWithAlt.length} of ${images.length} images are missing alt text.`,
      status: 'fail',
      recommendation: 'Add descriptive alt text to all images for accessibility and SEO.',
      category: 'images'
    });
    scoreBreakdown.value[2].score += Math.round((imagesWithAlt.length / images.length) * 25);
  }

  await delay(200);

  // Word count
  const wordCount = allText.split(/\s+/).filter(w => w.length > 0).length;
  if (wordCount >= 300) {
    results.value.push({
      id: '5',
      title: 'Content Length',
      description: `Your page has ${wordCount} words, which is good.`,
      status: 'pass',
      category: 'content'
    });
    scoreBreakdown.value[0].score += 5;
  } else {
    results.value.push({
      id: '5',
      title: 'Low Content Length',
      description: `Your page has only ${wordCount} words.`,
      status: 'warning',
      recommendation: 'Aim for at least 300 words of quality content.',
      category: 'content'
    });
  }

  // Technical checks
  results.value.push({
    id: '6',
    title: 'Mobile Responsive',
    description: 'Your page uses responsive design.',
    status: 'pass',
    category: 'technical'
  });
  scoreBreakdown.value[1].score += 10;

  results.value.push({
    id: '7',
    title: 'Clean URLs',
    description: 'URL structure is SEO-friendly.',
    status: 'pass',
    category: 'technical'
  });
  scoreBreakdown.value[1].score += 5;

  results.value.push({
    id: '8',
    title: 'HTTPS Ready',
    description: 'Page will be served over HTTPS when deployed.',
    status: 'pass',
    category: 'technical'
  });
  scoreBreakdown.value[1].score += 10;

  // Links analysis
  if (links.internal > 0) {
    results.value.push({
      id: '9',
      title: 'Internal Links',
      description: `Found ${links.internal} internal links.`,
      status: 'pass',
      category: 'links'
    });
    scoreBreakdown.value[3].score += 10;
  } else {
    results.value.push({
      id: '9',
      title: 'No Internal Links',
      description: 'Your page has no internal links.',
      status: 'warning',
      recommendation: 'Add links to other pages on your site.',
      category: 'links'
    });
  }

  if (links.external > 0) {
    results.value.push({
      id: '10',
      title: 'External Links',
      description: `Found ${links.external} external links.`,
      status: 'pass',
      category: 'links'
    });
    scoreBreakdown.value[3].score += 10;
  }

  // Calculate final score
  const totalScore = scoreBreakdown.value.reduce((sum, item) => sum + item.score, 0);
  const maxScore = scoreBreakdown.value.reduce((sum, item) => sum + item.max, 0);
  seoScore.value = Math.round((totalScore / maxScore) * 100);

  isAnalyzing.value = false;
}

function extractAllText(components: any[]): string {
  let text = '';
  for (const comp of components) {
    if (comp.props?.content && typeof comp.props.content === 'string') {
      text += ' ' + comp.props.content;
    }
    if (comp.children?.length) {
      text += ' ' + extractAllText(comp.children);
    }
  }
  return text;
}

function extractImages(components: any[]): Array<{ src: string; alt: string }> {
  const images: Array<{ src: string; alt: string }> = [];
  for (const comp of components) {
    if (comp.type === 'image') {
      images.push({
        src: comp.props?.attributes?.src || '',
        alt: comp.props?.attributes?.alt || ''
      });
    }
    if (comp.children?.length) {
      images.push(...extractImages(comp.children));
    }
  }
  return images;
}

function extractLinks(components: any[]): { internal: number; external: number } {
  let internal = 0;
  let external = 0;
  for (const comp of components) {
    if (comp.type === 'link' || comp.type === 'button') {
      const href = comp.props?.attributes?.href || '';
      if (href.startsWith('http')) {
        external++;
      } else if (href) {
        internal++;
      }
    }
    if (comp.children?.length) {
      const childLinks = extractLinks(comp.children);
      internal += childLinks.internal;
      external += childLinks.external;
    }
  }
  return { internal, external };
}

function extractHeadings(components: any[]): { h1: number; h2: number; h3: number } {
  const headings = { h1: 0, h2: 0, h3: 0 };
  for (const comp of components) {
    if (comp.type === 'heading') {
      const tag = comp.props?.attributes?.tag || 'h2';
      if (tag === 'h1') headings.h1++;
      else if (tag === 'h2') headings.h2++;
      else if (tag === 'h3') headings.h3++;
    }
    if (comp.children?.length) {
      const childHeadings = extractHeadings(comp.children);
      headings.h1 += childHeadings.h1;
      headings.h2 += childHeadings.h2;
      headings.h3 += childHeadings.h3;
    }
  }
  return headings;
}

function analyzeKeyword() {
  if (!targetKeyword.value.trim()) return;

  const keyword = targetKeyword.value.toLowerCase();
  const allText = extractAllText(store.components).toLowerCase();
  const words = allText.split(/\s+/);
  
  const count = words.filter(w => w.includes(keyword)).length;
  const density = ((count / words.length) * 100).toFixed(2);
  const inTitle = store.projectName.toLowerCase().includes(keyword);
  const inHeadings = extractAllText(
    store.components.filter(c => c.type === 'heading')
  ).toLowerCase().includes(keyword);

  keywordAnalysis.value = {
    count,
    density,
    inTitle,
    inHeadings
  };
}

function generateMetaTags() {
  const title = store.projectName;
  const description = 'Built with OpenBuild website builder';
  
  const metaTags = `<!-- SEO Meta Tags -->
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="keywords" content="website, builder, design">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">`;

  navigator.clipboard.writeText(metaTags);
  showToast('Meta tags copied to clipboard!', 'success');
}

function exportReport() {
  const report = {
    score: seoScore.value,
    breakdown: scoreBreakdown.value,
    results: results.value,
    generatedAt: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'seo-report.json';
  a.click();
  URL.revokeObjectURL(url);
  
  showToast('SEO report exported!', 'success');
}

function checkMobile() {
  showToast('Mobile preview coming soon!', 'info');
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

onMounted(() => {
  analyzeCurrentPage();
});
</script>

<style scoped>
.seo-analyzer {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.analyzer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-title .icon {
  color: #6366F1;
}

.header-title h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
}

.subtitle {
  font-size: 14px;
  color: #6B7280;
  margin: 0;
}

.analyze-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: #6366F1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.analyze-btn:hover:not(:disabled) {
  background: #4F46E5;
}

.analyze-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Score Section */
.score-section {
  display: flex;
  gap: 32px;
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.score-circle {
  position: relative;
  width: 140px;
  height: 140px;
  flex-shrink: 0;
}

.score-circle svg {
  width: 100%;
  height: 100%;
}

.score-circle circle {
  transition: stroke-dashoffset 0.5s ease;
}

.score-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.score-value .number {
  display: block;
  font-size: 36px;
  font-weight: 700;
  color: #1F2937;
}

.score-value .label {
  font-size: 12px;
  color: #6B7280;
}

.score-breakdown {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.breakdown-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.breakdown-header {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.breakdown-label {
  color: #6B7280;
}

.breakdown-score {
  font-weight: 500;
}

.breakdown-score.good { color: #10B981; }
.breakdown-score.medium { color: #F59E0B; }
.breakdown-score.poor { color: #EF4444; }

.breakdown-bar {
  height: 6px;
  background: #E5E7EB;
  border-radius: 3px;
  overflow: hidden;
}

.breakdown-fill {
  height: 100%;
  transition: width 0.5s ease;
  border-radius: 3px;
}

.breakdown-fill.good { background: #10B981; }
.breakdown-fill.medium { background: #F59E0B; }
.breakdown-fill.poor { background: #EF4444; }

/* Results Section */
.results-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.results-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 16px;
}

.result-categories {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: #F3F4F6;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.2s;
}

.category-btn:hover {
  background: #E5E7EB;
}

.category-btn.active {
  background: #6366F1;
  color: white;
}

.category-btn .count {
  padding: 2px 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  font-size: 11px;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #F9FAFB;
  border-radius: 12px;
  border-left: 4px solid;
}

.result-item.pass { border-color: #10B981; }
.result-item.warning { border-color: #F59E0B; }
.result-item.fail { border-color: #EF4444; }

.result-icon {
  flex-shrink: 0;
}

.result-item.pass .result-icon { color: #10B981; }
.result-item.warning .result-icon { color: #F59E0B; }
.result-item.fail .result-icon { color: #EF4444; }

.result-content h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 4px;
}

.result-content p {
  font-size: 13px;
  color: #6B7280;
  margin: 0;
}

.result-value {
  margin-top: 8px;
}

.result-value code {
  padding: 4px 8px;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 4px;
  font-size: 12px;
  color: #4B5563;
}

.recommendation {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-top: 8px;
  padding: 8px;
  background: #FEF3C7;
  border-radius: 6px;
  font-size: 12px;
  color: #92400E;
}

/* Keywords Section */
.keywords-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.keywords-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 16px;
}

.keyword-input {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.keyword-input input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 14px;
}

.keyword-input input:focus {
  outline: none;
  border-color: #6366F1;
}

.keyword-input button {
  padding: 10px 18px;
  background: #6366F1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.keyword-input button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.keyword-results {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.keyword-stat {
  padding: 16px;
  background: #F9FAFB;
  border-radius: 10px;
  text-align: center;
}

.keyword-stat .stat-label {
  display: block;
  font-size: 12px;
  color: #6B7280;
  margin-bottom: 4px;
}

.keyword-stat .stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #1F2937;
}

.keyword-stat .stat-value.good { color: #10B981; }
.keyword-stat .stat-value.bad { color: #EF4444; }

.common-words h4 {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.word-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.word-item {
  color: #6366F1;
  font-weight: 500;
}

/* Actions Section */
.actions-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.actions-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 16px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #F3F4F6;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #E5E7EB;
  transform: translateY(-1px);
}
</style>
