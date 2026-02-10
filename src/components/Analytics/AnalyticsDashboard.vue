<template>
  <div class="analytics-dashboard">
    <div class="dashboard-header">
      <div class="header-title">
        <BarChart3 :size="24" class="icon" />
        <div>
          <h2>Analytics Dashboard</h2>
          <p class="subtitle">Insights into your project activity</p>
        </div>
      </div>
      <div class="header-actions">
        <select v-model="timeRange" class="time-select">
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
        <button @click="refreshData" class="refresh-btn">
          <RefreshCw :size="16" :class="{ spinning: isLoading }" />
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon components">
          <Boxes :size="24" />
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ stats.totalComponents }}</span>
          <span class="stat-label">Total Components</span>
          <span class="stat-change positive">
            <TrendingUp :size="14" />
            +{{ stats.componentsChange }}%
          </span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon pages">
          <FileText :size="24" />
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ stats.pagesCreated }}</span>
          <span class="stat-label">Pages Created</span>
          <span class="stat-change positive">
            <TrendingUp :size="14" />
            +{{ stats.pagesChange }}%
          </span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon templates">
          <Layout :size="24" />
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ stats.templatesUsed }}</span>
          <span class="stat-label">Templates Used</span>
          <span class="stat-change neutral">
            <Minus :size="14" />
            {{ stats.templatesChange }}%
          </span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon exports">
          <Download :size="24" />
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ stats.exports }}</span>
          <span class="stat-label">Exports</span>
          <span class="stat-change positive">
            <TrendingUp :size="14" />
            +{{ stats.exportsChange }}%
          </span>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-section">
      <!-- Components Used Bar Chart -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>Components Used</h3>
          <div class="chart-legend">
            <span class="legend-item">
              <span class="dot" style="background: #6366F1"></span>
              Usage Count
            </span>
          </div>
        </div>
        <div class="chart-body bar-chart">
          <div class="bar-chart-container">
            <div
              v-for="(item, index) in componentUsageData"
              :key="item.name"
              class="bar-item"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <span class="bar-label">{{ item.name }}</span>
              <div class="bar-track">
                <div
                  class="bar-fill"
                  :style="{ width: `${(item.count / maxComponentCount) * 100}%` }"
                ></div>
              </div>
              <span class="bar-value">{{ item.count }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pages Over Time Line Chart -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>Pages Created Over Time</h3>
          <div class="chart-legend">
            <span class="legend-item">
              <span class="dot" style="background: #10B981"></span>
              Pages
            </span>
          </div>
        </div>
        <div class="chart-body line-chart">
          <svg viewBox="0 0 400 200" class="line-svg">
            <!-- Grid lines -->
            <g class="grid-lines">
              <line v-for="i in 5" :key="i" :x1="40" :x2="390" :y1="i * 35 + 10" :y2="i * 35 + 10" />
            </g>
            
            <!-- Y-axis labels -->
            <g class="y-labels">
              <text v-for="(label, i) in yAxisLabels" :key="i" x="35" :y="i * 35 + 15" text-anchor="end">
                {{ label }}
              </text>
            </g>
            
            <!-- X-axis labels -->
            <g class="x-labels">
              <text v-for="(label, i) in xAxisLabels" :key="i" :x="60 + i * 55" y="195" text-anchor="middle">
                {{ label }}
              </text>
            </g>
            
            <!-- Area fill -->
            <path :d="areaPath" class="area-fill" />
            
            <!-- Line -->
            <path :d="linePath" class="line-path" />
            
            <!-- Data points -->
            <g class="data-points">
              <circle
                v-for="(point, i) in lineChartPoints"
                :key="i"
                :cx="point.x"
                :cy="point.y"
                r="4"
                class="data-point"
              />
            </g>
          </svg>
        </div>
      </div>
    </div>

    <!-- Templates & Activity Section -->
    <div class="secondary-section">
      <!-- Popular Templates -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>Popular Templates</h3>
          <a href="#" class="view-all">View all</a>
        </div>
        <div class="templates-list">
          <div
            v-for="(template, index) in popularTemplates"
            :key="template.name"
            class="template-item"
          >
            <span class="template-rank">{{ index + 1 }}</span>
            <div class="template-preview" :style="{ backgroundColor: template.color }">
              <Layout :size="16" />
            </div>
            <div class="template-info">
              <span class="template-name">{{ template.name }}</span>
              <span class="template-category">{{ template.category }}</span>
            </div>
            <div class="template-stats">
              <span class="template-uses">{{ template.uses }} uses</span>
              <div class="template-trend" :class="template.trend > 0 ? 'up' : 'down'">
                <TrendingUp v-if="template.trend > 0" :size="12" />
                <TrendingDown v-else :size="12" />
                {{ Math.abs(template.trend) }}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>Recent Activity</h3>
          <a href="#" class="view-all">View all</a>
        </div>
        <div class="activity-list">
          <div
            v-for="activity in recentActivity"
            :key="activity.id"
            class="activity-item"
          >
            <div class="activity-icon" :class="activity.type">
              <component :is="getActivityIcon(activity.type)" :size="16" />
            </div>
            <div class="activity-content">
              <span class="activity-text">{{ activity.text }}</span>
              <span class="activity-time">{{ activity.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Insights -->
    <div class="insights-section">
      <h3>Quick Insights</h3>
      <div class="insights-grid">
        <div class="insight-card">
          <Lightbulb :size="20" class="insight-icon" />
          <p>You've used <strong>Section</strong> components the most. Consider creating a custom section template!</p>
        </div>
        <div class="insight-card">
          <Target :size="20" class="insight-icon" />
          <p>Your projects have an average of <strong>12 components</strong> per page. That's optimal for performance!</p>
        </div>
        <div class="insight-card">
          <Zap :size="20" class="insight-icon" />
          <p>Try the new AI component generator to speed up your workflow by up to <strong>40%</strong>.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  BarChart3,
  RefreshCw,
  Boxes,
  FileText,
  Layout,
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
  Lightbulb,
  Target,
  Zap,
  Plus,
  Edit,
  Trash2
} from 'lucide-vue-next';
import { useEditorStore } from '@/stores/editor';

const store = useEditorStore();

// State
const isLoading = ref(false);
const timeRange = ref('30d');

// Mock statistics data
const stats = ref({
  totalComponents: 47,
  componentsChange: 12,
  pagesCreated: 8,
  pagesChange: 25,
  templatesUsed: 5,
  templatesChange: 0,
  exports: 12,
  exportsChange: 33
});

// Component usage data for bar chart
const componentUsageData = ref([
  { name: 'Section', count: 24 },
  { name: 'Container', count: 18 },
  { name: 'Text', count: 15 },
  { name: 'Button', count: 12 },
  { name: 'Image', count: 10 },
  { name: 'Heading', count: 8 },
  { name: 'Grid', count: 6 },
  { name: 'Form', count: 4 }
]);

const maxComponentCount = computed(() => 
  Math.max(...componentUsageData.value.map(d => d.count))
);

// Line chart data
const pagesOverTime = ref([2, 3, 4, 4, 5, 6, 8]);
const xAxisLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const yAxisLabels = computed(() => {
  const max = Math.max(...pagesOverTime.value);
  return [max, Math.round(max * 0.75), Math.round(max * 0.5), Math.round(max * 0.25), 0];
});

const lineChartPoints = computed(() => {
  const maxVal = Math.max(...pagesOverTime.value);
  return pagesOverTime.value.map((val, i) => ({
    x: 60 + i * 55,
    y: 175 - (val / maxVal) * 150
  }));
});

const linePath = computed(() => {
  return lineChartPoints.value
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');
});

const areaPath = computed(() => {
  const points = lineChartPoints.value;
  if (points.length === 0) return '';
  
  const firstX = points[0].x;
  const lastX = points[points.length - 1].x;
  
  return `${linePath.value} L ${lastX} 175 L ${firstX} 175 Z`;
});

// Popular templates
const popularTemplates = ref([
  { name: 'Startup Landing', category: 'Landing Page', uses: 156, trend: 12, color: '#6366F1' },
  { name: 'Portfolio Pro', category: 'Portfolio', uses: 124, trend: 8, color: '#EC4899' },
  { name: 'Tech Blog', category: 'Blog', uses: 98, trend: -3, color: '#10B981' },
  { name: 'E-commerce Basic', category: 'E-commerce', uses: 87, trend: 15, color: '#F59E0B' },
  { name: 'Agency Site', category: 'Business', uses: 65, trend: 5, color: '#8B5CF6' }
]);

// Recent activity
const recentActivity = ref([
  { id: 1, type: 'create', text: 'Created new page "About Us"', time: '2 hours ago' },
  { id: 2, type: 'edit', text: 'Modified Hero Section component', time: '4 hours ago' },
  { id: 3, type: 'export', text: 'Exported project as ZIP', time: 'Yesterday' },
  { id: 4, type: 'template', text: 'Used "Startup Landing" template', time: 'Yesterday' },
  { id: 5, type: 'delete', text: 'Removed unused Footer component', time: '2 days ago' },
  { id: 6, type: 'create', text: 'Created new page "Contact"', time: '3 days ago' }
]);

function getActivityIcon(type: string) {
  const icons: Record<string, any> = {
    create: Plus,
    edit: Edit,
    delete: Trash2,
    export: Download,
    template: Layout
  };
  return icons[type] || Plus;
}

async function refreshData() {
  isLoading.value = true;
  
  // Simulate data refresh
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Update with slightly different mock data
  stats.value.totalComponents = store.components.length || stats.value.totalComponents;
  
  isLoading.value = false;
}

onMounted(() => {
  // Update total components from actual store
  if (store.components.length > 0) {
    stats.value.totalComponents = countAllComponents(store.components);
  }
});

function countAllComponents(components: any[]): number {
  let count = 0;
  for (const comp of components) {
    count++;
    if (comp.children?.length) {
      count += countAllComponents(comp.children);
    }
  }
  return count;
}
</script>

<style scoped>
.analytics-dashboard {
  padding: 24px;
  background: #F9FAFB;
  min-height: 100%;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.time-select {
  padding: 8px 12px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

.refresh-btn {
  padding: 8px;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  cursor: pointer;
  color: #6B7280;
  transition: all 0.2s;
}

.refresh-btn:hover {
  background: #F3F4F6;
  color: #1F2937;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-icon.components { background: linear-gradient(135deg, #6366F1, #8B5CF6); }
.stat-icon.pages { background: linear-gradient(135deg, #10B981, #34D399); }
.stat-icon.templates { background: linear-gradient(135deg, #F59E0B, #FBBF24); }
.stat-icon.exports { background: linear-gradient(135deg, #EC4899, #F472B6); }

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1F2937;
  line-height: 1;
}

.stat-label {
  font-size: 13px;
  color: #6B7280;
  margin-top: 4px;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  margin-top: 8px;
}

.stat-change.positive { color: #10B981; }
.stat-change.negative { color: #EF4444; }
.stat-change.neutral { color: #6B7280; }

/* Charts Section */
.charts-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.chart-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #F3F4F6;
}

.chart-header h3 {
  font-size: 15px;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
}

.chart-legend {
  display: flex;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6B7280;
}

.legend-item .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.view-all {
  font-size: 13px;
  color: #6366F1;
  text-decoration: none;
}

.view-all:hover {
  text-decoration: underline;
}

.chart-body {
  padding: 20px;
}

/* Bar Chart */
.bar-chart-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  animation: fadeInUp 0.3s ease forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bar-label {
  width: 80px;
  font-size: 13px;
  color: #6B7280;
  text-align: right;
}

.bar-track {
  flex: 1;
  height: 24px;
  background: #F3F4F6;
  border-radius: 6px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366F1, #8B5CF6);
  border-radius: 6px;
  transition: width 0.5s ease;
}

.bar-value {
  width: 30px;
  font-size: 13px;
  font-weight: 600;
  color: #1F2937;
}

/* Line Chart */
.line-chart {
  height: 220px;
}

.line-svg {
  width: 100%;
  height: 100%;
}

.grid-lines line {
  stroke: #F3F4F6;
  stroke-width: 1;
}

.y-labels text,
.x-labels text {
  fill: #9CA3AF;
  font-size: 11px;
}

.area-fill {
  fill: url(#areaGradient);
  fill: rgba(16, 185, 129, 0.1);
}

.line-path {
  fill: none;
  stroke: #10B981;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.data-point {
  fill: #10B981;
  stroke: white;
  stroke-width: 2;
  transition: r 0.2s ease;
}

.data-point:hover {
  r: 6;
}

/* Secondary Section */
.secondary-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

/* Templates List */
.templates-list {
  padding: 12px 20px;
}

.template-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #F3F4F6;
}

.template-item:last-child {
  border-bottom: none;
}

.template-rank {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: #F3F4F6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #6B7280;
}

.template-preview {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.template-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.template-name {
  font-size: 14px;
  font-weight: 500;
  color: #1F2937;
}

.template-category {
  font-size: 12px;
  color: #9CA3AF;
}

.template-stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.template-uses {
  font-size: 13px;
  font-weight: 500;
  color: #1F2937;
}

.template-trend {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 11px;
  font-weight: 500;
}

.template-trend.up { color: #10B981; }
.template-trend.down { color: #EF4444; }

/* Activity List */
.activity-list {
  padding: 12px 20px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #F3F4F6;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.activity-icon.create { background: #10B981; }
.activity-icon.edit { background: #6366F1; }
.activity-icon.delete { background: #EF4444; }
.activity-icon.export { background: #F59E0B; }
.activity-icon.template { background: #8B5CF6; }

.activity-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.activity-text {
  font-size: 13px;
  color: #1F2937;
}

.activity-time {
  font-size: 12px;
  color: #9CA3AF;
}

/* Insights Section */
.insights-section {
  margin-bottom: 24px;
}

.insights-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 16px;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.insight-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.insight-icon {
  color: #F59E0B;
  flex-shrink: 0;
}

.insight-card p {
  font-size: 13px;
  color: #6B7280;
  margin: 0;
  line-height: 1.5;
}

.insight-card strong {
  color: #1F2937;
}

/* Responsive */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .charts-section,
  .secondary-section {
    grid-template-columns: 1fr;
  }
  
  .insights-grid {
    grid-template-columns: 1fr;
  }
}
</style>
