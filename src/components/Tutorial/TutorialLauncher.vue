<template>
  <Teleport to="body">
    <!-- Floating launcher button -->
    <Transition name="launcher-fade">
      <button
        v-if="!tutorialStore.isActive && !isExpanded"
        class="tutorial-launcher-btn"
        @click="toggleExpanded"
        title="Tutorials & Help"
      >
        <LucideGraduationCap :size="24" />
        <span class="launcher-label">Tutorials</span>
        <span v-if="hasNewTutorials" class="notification-dot"></span>
      </button>
    </Transition>

    <!-- Expanded tutorial panel -->
    <Transition name="panel-slide">
      <div v-if="isExpanded" class="tutorial-panel" @click.self="toggleExpanded">
        <div class="panel-content" @click.stop>
          <!-- Header -->
          <div class="panel-header">
            <div class="header-content">
              <LucideGraduationCap :size="24" />
              <div>
                <h2 class="panel-title">Interactive Tutorials</h2>
                <p class="panel-subtitle">Learn OpenBuild step by step</p>
              </div>
            </div>
            <button class="close-btn" @click="toggleExpanded">
              <LucideX :size="20" />
            </button>
          </div>

          <!-- Progress overview -->
          <div class="progress-overview">
            <div class="progress-stat">
              <span class="stat-value">{{ completedCount }}</span>
              <span class="stat-label">Completed</span>
            </div>
            <div class="progress-stat">
              <span class="stat-value">{{ totalTutorials }}</span>
              <span class="stat-label">Total</span>
            </div>
            <div class="progress-stat">
              <span class="stat-value">{{ progressPercentage }}%</span>
              <span class="stat-label">Progress</span>
            </div>
          </div>

          <!-- Search and filter -->
          <div class="search-filter">
            <div class="search-input">
              <LucideSearch :size="18" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search tutorials..."
                class="search-field"
              />
            </div>
            <select v-model="selectedCategory" class="category-filter">
              <option value="">All Categories</option>
              <option value="basic">Getting Started</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="power-user">Power User</option>
            </select>
          </div>

          <!-- Recommended tutorial -->
          <div v-if="recommendedTutorial && !searchQuery" class="recommended-section">
            <h3 class="section-title">
              <LucideSparkles :size="16" />
              Recommended Next
            </h3>
            <div
              class="tutorial-card recommended"
              @click="startTutorial(recommendedTutorial.id)"
            >
              <div class="card-icon">
                <component :is="getIconComponent(recommendedTutorial.icon)" :size="24" />
              </div>
              <div class="card-content">
                <h4 class="card-title">{{ recommendedTutorial.name }}</h4>
                <p class="card-description">{{ recommendedTutorial.description }}</p>
                <div class="card-meta">
                  <span class="duration">
                    <LucideClock :size="14" />
                    {{ recommendedTutorial.duration }} min
                  </span>
                  <span class="difficulty" :class="recommendedTutorial.category">
                    {{ getCategoryLabel(recommendedTutorial.category) }}
                  </span>
                </div>
              </div>
              <LucidePlayCircle :size="24" class="play-icon" />
            </div>
          </div>

          <!-- Tutorial categories -->
          <div class="categories-section">
            <div
              v-for="category in filteredCategories"
              :key="category.id"
              class="category-group"
            >
              <h3 class="category-title">
                <component :is="getIconComponent(category.icon)" :size="18" />
                {{ category.name }}
              </h3>
              <p class="category-description">{{ category.description }}</p>

              <div class="tutorials-grid">
                <div
                  v-for="tutorial in getCategoryTutorials(category.id)"
                  :key="tutorial.id"
                  class="tutorial-card"
                  :class="{
                    completed: tutorialStore.hasCompletedTutorial(tutorial.id),
                    locked: !arePrerequisitesMet(tutorial)
                  }"
                  @click="handleTutorialClick(tutorial)"
                >
                  <div class="card-header">
                    <div class="card-icon">
                      <component :is="getIconComponent(tutorial.icon)" :size="20" />
                    </div>
                    <div v-if="tutorialStore.hasCompletedTutorial(tutorial.id)" class="completed-badge">
                      <LucideCheckCircle :size="16" />
                    </div>
                    <div v-else-if="!arePrerequisitesMet(tutorial)" class="locked-badge">
                      <LucideLock :size="16" />
                    </div>
                  </div>

                  <h4 class="card-title">{{ tutorial.name }}</h4>
                  <p class="card-description">{{ tutorial.description }}</p>

                  <div class="card-footer">
                    <span class="duration">
                      <LucideClock :size="12" />
                      {{ tutorial.duration }} min
                    </span>
                    <span class="steps-count">
                      {{ tutorial.steps.length }} steps
                    </span>
                  </div>

                  <!-- Resume indicator -->
                  <div
                    v-if="getTutorialProgress(tutorial.id) && !tutorialStore.hasCompletedTutorial(tutorial.id)"
                    class="resume-indicator"
                  >
                    <span class="resume-text">Resume</span>
                    <div class="resume-progress" :style="{ width: getProgressWidth(tutorial.id) }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer actions -->
          <div class="panel-footer">
            <button class="reset-btn" @click="handleReset">
              <LucideRotateCcw :size="16" />
              Reset Progress
            </button>
            <label class="auto-start-toggle">
              <input
                type="checkbox"
                v-model="autoStart"
                @change="updateAutoStart"
              />
              <span>Auto-start tutorials</span>
            </label>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  LucideGraduationCap,
  LucideX,
  LucideSearch,
  LucidePlayCircle,
  LucideCheckCircle,
  LucideLock,
  LucideClock,
  LucideSparkles,
  LucideRotateCcw,
  LucideRocket,
  LucidePackage,
  LucidePalette,
  LucideZap,
  LucideLayout,
  LucidePlusSquare,
  LucideFileText,
  LucideMove,
  LucideSettings,
  LucideType,
  LucideBrush,
  LucideSmartphone,
  LucidePlayCircle as LucidePlay,
  LucideFileInput,
  LucideFiles,
  LucideSearch as LucideSearchIcon,
  LucideCode
} from 'lucide-vue-next'
import { useTutorialStore } from '@/stores/tutorial'
import {
  tutorials,
  tutorialCategories,
  getTutorialsByCategory,
  arePrerequisitesMet as checkPrerequisites
} from '@/data/tutorials'
import type { Tutorial } from '@/types/tutorial'

const tutorialStore = useTutorialStore()

const isExpanded = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('')
const autoStart = ref(tutorialStore.preferences.autoStart)

// Icon mapping
const iconMap: Record<string, any> = {
  'rocket': LucideRocket,
  'package': LucidePackage,
  'palette': LucidePalette,
  'zap': LucideZap,
  'layout': LucideLayout,
  'plus-square': LucidePlusSquare,
  'file-text': LucideFileText,
  'move': LucideMove,
  'settings': LucideSettings,
  'type': LucideType,
  'brush': LucideBrush,
  'smartphone': LucideSmartphone,
  'play-circle': LucidePlay,
  'file-input': LucideFileInput,
  'files': LucideFiles,
  'search': LucideSearchIcon,
  'code': LucideCode
}

// Computed
const completedCount = computed(() => tutorialStore.completedTutorials.size)
const totalTutorials = computed(() => tutorials.length)
const progressPercentage = computed(() =>
  Math.round((completedCount.value / totalTutorials.value) * 100)
)

const hasNewTutorials = computed(() => {
  return tutorialStore.isFirstTime && completedCount.value === 0
})

const recommendedTutorial = computed(() => tutorialStore.nextRecommendedTutorial)

const filteredCategories = computed(() => {
  if (!selectedCategory.value) return tutorialCategories

  return tutorialCategories.filter(cat => {
    const catTutorials = getTutorialsByCategory(cat.id)
    return catTutorials.some(t => t.category === selectedCategory.value)
  })
})

const filteredTutorials = computed(() => {
  let filtered = [...tutorials]

  if (selectedCategory.value) {
    filtered = filtered.filter(t => t.category === selectedCategory.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(t =>
      t.name.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      t.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }

  return filtered
})

// Methods
function toggleExpanded() {
  isExpanded.value = !isExpanded.value
  if (isExpanded.value) {
    tutorialStore.showLauncher = false
  }
}

function getIconComponent(iconName: string) {
  return iconMap[iconName] || LucideGraduationCap
}

function getCategoryLabel(category: string) {
  const labels: Record<string, string> = {
    'basic': 'Beginner',
    'intermediate': 'Intermediate',
    'advanced': 'Advanced',
    'power-user': 'Power User'
  }
  return labels[category] || category
}

function getCategoryTutorials(categoryId: string) {
  const tutorials = getTutorialsByCategory(categoryId)

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    return tutorials.filter(t =>
      t.name.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      t.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }

  return tutorials
}

function arePrerequisitesMet(tutorial: Tutorial) {
  return checkPrerequisites(tutorial.id, tutorialStore.completedTutorials)
}

function getTutorialProgress(tutorialId: string) {
  return tutorialStore.getTutorialProgress(tutorialId)
}

function getProgressWidth(tutorialId: string) {
  const progress = getTutorialProgress(tutorialId)
  if (!progress) return '0%'

  const tutorial = tutorials.find(t => t.id === tutorialId)
  if (!tutorial) return '0%'

  return `${(progress.currentStepIndex / tutorial.steps.length) * 100}%`
}

function startTutorial(tutorialId: string) {
  const progress = getTutorialProgress(tutorialId)
  const startFrom = progress?.currentStepIndex || 0

  tutorialStore.startTutorial(tutorialId, startFrom)
  isExpanded.value = false
}

function handleTutorialClick(tutorial: Tutorial) {
  if (!arePrerequisitesMet(tutorial)) {
    alert(`Please complete the prerequisite tutorials first: ${tutorial.prerequisites?.join(', ')}`)
    return
  }

  if (tutorialStore.hasCompletedTutorial(tutorial.id)) {
    if (confirm('You\'ve already completed this tutorial. Would you like to restart it?')) {
      startTutorial(tutorial.id)
    }
  } else {
    startTutorial(tutorial.id)
  }
}

function updateAutoStart() {
  tutorialStore.updatePreferences({ autoStart: autoStart.value })
}

function handleReset() {
  if (confirm('Are you sure you want to reset all tutorial progress? This cannot be undone.')) {
    tutorialStore.resetAllProgress()
  }
}

// Watch for launcher visibility
watch(() => tutorialStore.showLauncher, (show) => {
  if (show && !isExpanded.value && !tutorialStore.isActive) {
    // Auto-show launcher when requested by store
    setTimeout(() => {
      isExpanded.value = true
    }, 500)
  }
})
</script>

<style scoped>
/* Launcher button */
.tutorial-launcher-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  z-index: 9990;
}

.tutorial-launcher-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px rgba(102, 126, 234, 0.5);
}

.launcher-label {
  display: none;
}

@media (min-width: 768px) {
  .launcher-label {
    display: inline;
  }
}

.notification-dot {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 12px;
  height: 12px;
  background: #ef4444;
  border: 2px solid white;
  border-radius: 50%;
  animation: pulse-dot 2s infinite;
}

@keyframes pulse-dot {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

/* Tutorial panel */
.tutorial-panel {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9991;
  padding: 20px;
}

.panel-content {
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

/* Panel header */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.panel-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

.panel-subtitle {
  font-size: 14px;
  opacity: 0.9;
  margin: 4px 0 0 0;
}

.close-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Progress overview */
.progress-overview {
  display: flex;
  justify-content: space-around;
  padding: 20px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.progress-stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

/* Search and filter */
.search-filter {
  display: flex;
  gap: 12px;
  padding: 20px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.search-input {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f3f4f6;
  border-radius: 8px;
}

.search-field {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-size: 14px;
}

.category-filter {
  padding: 8px 12px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

/* Content area */
.categories-section {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

/* Recommended section */
.recommended-section {
  padding: 0 20px 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  margin: 0 0 12px 0;
}

/* Category groups */
.category-group {
  margin-bottom: 32px;
}

.category-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.category-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 16px 0;
}

/* Tutorials grid */
.tutorials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

/* Tutorial card */
.tutorial-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.tutorial-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.tutorial-card.recommended {
  display: flex;
  align-items: center;
  gap: 16px;
  background: linear-gradient(135deg, #f0f4ff 0%, #f5f0ff 100%);
  border: 2px solid #667eea;
}

.tutorial-card.completed {
  background: #f0fdf4;
  border-color: #10b981;
}

.tutorial-card.locked {
  opacity: 0.6;
  cursor: not-allowed;
}

.tutorial-card.locked:hover {
  transform: none;
  box-shadow: none;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.card-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 8px;
  color: #667eea;
}

.recommended .card-icon {
  background: white;
}

.completed-badge,
.locked-badge {
  color: #10b981;
}

.locked-badge {
  color: #6b7280;
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
}

.card-description {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0 0 12px 0;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #6b7280;
}

.duration,
.steps-count {
  display: flex;
  align-items: center;
  gap: 4px;
}

.difficulty {
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 4px;
  background: #f3f4f6;
}

.difficulty.basic {
  background: #dbeafe;
  color: #1e40af;
}

.difficulty.intermediate {
  background: #fef3c7;
  color: #92400e;
}

.difficulty.advanced {
  background: #fce7f3;
  color: #9f1239;
}

.difficulty.power-user {
  background: #ede9fe;
  color: #6b21a8;
}

.play-icon {
  color: #667eea;
}

/* Resume indicator */
.resume-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #e5e7eb;
  border-radius: 0 0 12px 12px;
  overflow: hidden;
}

.resume-progress {
  height: 100%;
  background: #667eea;
  transition: width 0.3s ease;
}

.resume-text {
  position: absolute;
  top: -20px;
  right: 8px;
  font-size: 11px;
  font-weight: 600;
  color: #667eea;
}

/* Panel footer */
.panel-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: transparent;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: white;
  color: #ef4444;
  border-color: #ef4444;
}

.auto-start-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6b7280;
  cursor: pointer;
}

.auto-start-toggle input {
  cursor: pointer;
}

/* Transitions */
.launcher-fade-enter-active,
.launcher-fade-leave-active {
  transition: all 0.3s ease;
}

.launcher-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.launcher-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: all 0.3s ease;
}

.panel-slide-enter-from,
.panel-slide-leave-to {
  opacity: 0;
}

.panel-slide-enter-from .panel-content,
.panel-slide-leave-to .panel-content {
  transform: scale(0.9) translateY(20px);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .panel-content {
    background: #1f2937;
  }

  .panel-header {
    background: linear-gradient(135deg, #4c5fd5 0%, #6b46c1 100%);
  }

  .progress-overview {
    background: #111827;
    border-color: #374151;
  }

  .stat-value {
    color: #f3f4f6;
  }

  .stat-label {
    color: #9ca3af;
  }

  .search-filter {
    background: #1f2937;
    border-color: #374151;
  }

  .search-input {
    background: #374151;
    color: #f3f4f6;
  }

  .search-field {
    color: #f3f4f6;
  }

  .category-filter {
    background: #374151;
    color: #f3f4f6;
    border-color: #4b5563;
  }

  .categories-section {
    background: #1f2937;
  }

  .category-title {
    color: #f3f4f6;
  }

  .category-description {
    color: #9ca3af;
  }

  .tutorial-card {
    background: #374151;
    border-color: #4b5563;
  }

  .tutorial-card:hover {
    border-color: #667eea;
  }

  .tutorial-card.recommended {
    background: linear-gradient(135deg, #2d3748 0%, #3a2d4a 100%);
  }

  .tutorial-card.completed {
    background: #064e3b;
  }

  .card-icon {
    background: #4b5563;
  }

  .card-title {
    color: #f3f4f6;
  }

  .card-description,
  .card-footer {
    color: #9ca3af;
  }

  .panel-footer {
    background: #111827;
    border-color: #374151;
  }

  .reset-btn {
    border-color: #4b5563;
    color: #9ca3af;
  }

  .reset-btn:hover {
    background: #374151;
  }

  .auto-start-toggle {
    color: #9ca3af;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .tutorial-panel {
    padding: 0;
  }

  .panel-content {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .tutorials-grid {
    grid-template-columns: 1fr;
  }

  .progress-overview {
    padding: 16px;
  }

  .stat-value {
    font-size: 20px;
  }
}
</style>