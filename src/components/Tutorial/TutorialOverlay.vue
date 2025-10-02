<template>
  <Teleport to="body">
    <Transition name="tutorial-fade">
      <div v-if="isVisible" class="tutorial-overlay" @click="handleOverlayClick">
        <!-- Spotlight mask -->
        <svg
          v-if="spotlightBounds"
          class="spotlight-svg"
          :width="viewportWidth"
          :height="viewportHeight"
        >
          <defs>
            <mask id="spotlight-mask">
              <rect x="0" y="0" :width="viewportWidth" :height="viewportHeight" fill="white" />
              <rect
                :x="spotlightBounds.x - spotlightPadding"
                :y="spotlightBounds.y - spotlightPadding"
                :width="spotlightBounds.width + spotlightPadding * 2"
                :height="spotlightBounds.height + spotlightPadding * 2"
                :rx="8"
                fill="black"
              />
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            :width="viewportWidth"
            :height="viewportHeight"
            fill="rgba(0, 0, 0, 0.7)"
            mask="url(#spotlight-mask)"
            class="spotlight-overlay"
          />
        </svg>

        <!-- Tutorial tooltip -->
        <Transition name="tutorial-tooltip">
          <div
            v-if="currentStep"
            ref="tooltipRef"
            class="tutorial-tooltip"
            :class="`tooltip-${placement}`"
            :style="tooltipStyle"
            @click.stop
          >
            <!-- Progress indicator -->
            <div class="tooltip-progress">
              <div class="progress-dots">
                <button
                  v-for="(_, index) in totalSteps"
                  :key="index"
                  class="progress-dot"
                  :class="{ active: index === currentStepIndex, completed: index < currentStepIndex }"
                  @click="$emit('goToStep', index)"
                  :disabled="index > currentStepIndex"
                />
              </div>
              <button class="close-btn" @click="handleClose" title="Exit tutorial">
                <LucideX :size="16" />
              </button>
            </div>

            <!-- Step content -->
            <div class="tooltip-content">
              <h3 class="tooltip-title">{{ currentStep.title }}</h3>
              <p class="tooltip-description">{{ currentStep.description }}</p>

              <!-- Custom content slot -->
              <div v-if="currentStep.customContent" class="custom-content">
                <component :is="currentStep.customContent" />
              </div>

              <!-- Action hint -->
              <div v-if="currentStep.action" class="action-hint">
                <LucideMousePointer :size="14" />
                <span>{{ getActionHint(currentStep.action) }}</span>
              </div>
            </div>

            <!-- Navigation buttons -->
            <div class="tooltip-actions">
              <button
                v-if="currentStep.showPrevious !== false && currentStepIndex > 0"
                class="btn-secondary"
                @click="$emit('previous')"
              >
                <LucideChevronLeft :size="16" />
                Previous
              </button>

              <button
                v-if="currentStep.allowSkip !== false"
                class="btn-skip"
                @click="handleSkip"
              >
                Skip Tutorial
              </button>

              <button
                v-if="currentStepIndex < totalSteps - 1"
                class="btn-primary"
                @click="$emit('next')"
                :disabled="!canProceed"
              >
                {{ currentStep.showNext === false ? 'Waiting...' : 'Next' }}
                <LucideChevronRight :size="16" />
              </button>

              <button
                v-else
                class="btn-primary btn-complete"
                @click="$emit('complete')"
                :disabled="!canProceed"
              >
                <LucideCheck :size="16" />
                Complete
              </button>
            </div>
          </div>
        </Transition>

        <!-- Pulse animation for target element -->
        <div
          v-if="spotlightBounds && showPulse"
          class="pulse-indicator"
          :style="{
            left: `${spotlightBounds.x + spotlightBounds.width / 2}px`,
            top: `${spotlightBounds.y + spotlightBounds.height / 2}px`
          }"
        />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import {
  LucideX,
  LucideChevronLeft,
  LucideChevronRight,
  LucideCheck,
  LucideMousePointer
} from 'lucide-vue-next'
import type { TutorialStep } from '@/types/tutorial'

interface Props {
  isVisible: boolean
  currentStep: TutorialStep | null
  currentStepIndex: number
  totalSteps: number
  canProceed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  canProceed: true
})

const emit = defineEmits<{
  next: []
  previous: []
  skip: []
  close: []
  complete: []
  goToStep: [index: number]
}>()

const tooltipRef = ref<HTMLElement>()
const spotlightBounds = ref<DOMRect | null>(null)
const tooltipStyle = ref<Record<string, string>>({})
const placement = ref<string>('bottom')
const viewportWidth = ref(window.innerWidth)
const viewportHeight = ref(window.innerHeight)
const showPulse = ref(false)

const spotlightPadding = computed(() => props.currentStep?.spotlightPadding ?? 8)

// Calculate tooltip position
const calculateTooltipPosition = () => {
  if (!props.currentStep || !tooltipRef.value) return

  const tooltip = tooltipRef.value
  const tooltipRect = tooltip.getBoundingClientRect()

  let top = 0
  let left = 0
  let calculatedPlacement = props.currentStep.placement || 'bottom'

  if (props.currentStep.targetElement && spotlightBounds.value) {
    const target = spotlightBounds.value
    const padding = 16

    // Auto-placement if not specified
    if (!props.currentStep.placement) {
      // Calculate available space on each side
      const spaceTop = target.y
      const spaceBottom = viewportHeight.value - (target.y + target.height)
      const spaceLeft = target.x
      const spaceRight = viewportWidth.value - (target.x + target.width)

      // Choose best placement
      if (spaceBottom >= tooltipRect.height + padding) {
        calculatedPlacement = 'bottom'
      } else if (spaceTop >= tooltipRect.height + padding) {
        calculatedPlacement = 'top'
      } else if (spaceRight >= tooltipRect.width + padding) {
        calculatedPlacement = 'right'
      } else if (spaceLeft >= tooltipRect.width + padding) {
        calculatedPlacement = 'left'
      } else {
        calculatedPlacement = 'center'
      }
    }

    switch (calculatedPlacement) {
      case 'top':
        top = target.y - tooltipRect.height - padding
        left = target.x + target.width / 2 - tooltipRect.width / 2
        break
      case 'bottom':
        top = target.y + target.height + padding
        left = target.x + target.width / 2 - tooltipRect.width / 2
        break
      case 'left':
        top = target.y + target.height / 2 - tooltipRect.height / 2
        left = target.x - tooltipRect.width - padding
        break
      case 'right':
        top = target.y + target.height / 2 - tooltipRect.height / 2
        left = target.x + target.width + padding
        break
      case 'center':
        top = viewportHeight.value / 2 - tooltipRect.height / 2
        left = viewportWidth.value / 2 - tooltipRect.width / 2
        break
    }

    // Keep tooltip within viewport
    left = Math.max(padding, Math.min(left, viewportWidth.value - tooltipRect.width - padding))
    top = Math.max(padding, Math.min(top, viewportHeight.value - tooltipRect.height - padding))
  } else {
    // Center tooltip if no target
    top = viewportHeight.value / 2 - tooltipRect.height / 2
    left = viewportWidth.value / 2 - tooltipRect.width / 2
  }

  placement.value = calculatedPlacement
  tooltipStyle.value = {
    top: `${top}px`,
    left: `${left}px`
  }
}

// Update spotlight bounds when step changes
const updateSpotlight = async () => {
  if (!props.currentStep?.targetElement) {
    spotlightBounds.value = null
    showPulse.value = false
    // Position tooltip in center when no target
    await nextTick()
    calculateTooltipPosition()
    return
  }

  // Try multiple times to find element (in case it's still loading)
  let attempts = 0
  const maxAttempts = 10

  while (attempts < maxAttempts) {
    await nextTick()
    const element = document.querySelector(props.currentStep.targetElement)

    if (element) {
      spotlightBounds.value = element.getBoundingClientRect()
      showPulse.value = true

      // Hide pulse after animation
      setTimeout(() => {
        showPulse.value = false
      }, 2000)

      // Scroll element into view if needed
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })

      // Calculate position after element is found
      await nextTick()
      calculateTooltipPosition()
      return
    }

    attempts++
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  // If element not found after attempts, show tooltip in center
  console.warn(`Tutorial: Could not find element ${props.currentStep.targetElement}`)
  spotlightBounds.value = null
  showPulse.value = false
  await nextTick()
  calculateTooltipPosition()
}

// Get action hint text
const getActionHint = (action: TutorialStep['action']) => {
  if (!action) return ''

  switch (action.type) {
    case 'click':
      return 'Click the highlighted element to continue'
    case 'drag':
      return 'Drag and drop to continue'
    case 'type':
      return `Type "${action.value}" to continue`
    case 'scroll':
      return 'Scroll to see more'
    case 'wait':
      return 'Please wait...'
    default:
      return ''
  }
}

// Handle interactions
const handleOverlayClick = () => {
  if (props.currentStep?.interactive === false) {
    return
  }
  // Allow clicking through to interact with the page
}

const handleSkip = () => {
  if (confirm('Are you sure you want to skip this tutorial?')) {
    emit('skip')
  }
}

const handleClose = () => {
  if (confirm('Are you sure you want to exit the tutorial?')) {
    emit('close')
  }
}

// Handle window resize
const handleResize = () => {
  viewportWidth.value = window.innerWidth
  viewportHeight.value = window.innerHeight
  updateSpotlight()
  calculateTooltipPosition()
}

// Watch for changes
watch(() => props.currentStep, async () => {
  await updateSpotlight()
  await nextTick()
  calculateTooltipPosition()
}, { immediate: true })

watch(() => props.isVisible, (visible) => {
  if (visible) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  window.addEventListener('resize', handleResize)
  window.addEventListener('scroll', updateSpotlight)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('scroll', updateSpotlight)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.tutorial-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100000;
  pointer-events: none;
}

.spotlight-svg {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: auto;
}

.spotlight-overlay {
  transition: all 0.3s ease;
}

.tutorial-tooltip {
  position: fixed;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 0;
  max-width: 400px;
  min-width: 320px;
  z-index: 100001;
  pointer-events: auto;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.tooltip-progress {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 12px 12px 0 0;
}

.progress-dots {
  display: flex;
  gap: 8px;
}

.progress-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d1d5db;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}

.progress-dot:hover:not(:disabled) {
  transform: scale(1.2);
}

.progress-dot.active {
  background: #3b82f6;
  width: 24px;
  border-radius: 4px;
}

.progress-dot.completed {
  background: #10b981;
}

.progress-dot:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.tooltip-content {
  padding: 20px;
}

.tooltip-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.tooltip-description {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.custom-content {
  margin: 16px 0;
}

.action-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #eff6ff;
  border-radius: 6px;
  font-size: 13px;
  color: #1e40af;
  margin-top: 12px;
}

.tooltip-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 0 0 12px 12px;
}

.btn-primary,
.btn-secondary,
.btn-skip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  margin-left: auto;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-complete {
  background: #10b981;
}

.btn-complete:hover:not(:disabled) {
  background: #059669;
}

.btn-secondary {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #f3f4f6;
}

.btn-skip {
  background: transparent;
  color: #6b7280;
  padding: 8px 12px;
}

.btn-skip:hover {
  color: #374151;
  text-decoration: underline;
}

/* Pulse indicator */
.pulse-indicator {
  position: fixed;
  width: 60px;
  height: 60px;
  margin: -30px 0 0 -30px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.5);
  pointer-events: none;
  z-index: 99999;
}

.pulse-indicator::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.5);
  animation: pulse 2s ease-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}

/* Transitions */
.tutorial-fade-enter-active,
.tutorial-fade-leave-active {
  transition: opacity 0.3s ease;
}

.tutorial-fade-enter-from,
.tutorial-fade-leave-to {
  opacity: 0;
}

.tutorial-tooltip-enter-active {
  transition: all 0.3s ease;
}

.tutorial-tooltip-leave-active {
  transition: all 0.2s ease;
}

.tutorial-tooltip-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(10px);
}

.tutorial-tooltip-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-10px);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .tutorial-tooltip {
    background: #1f2937;
    border-color: rgba(255, 255, 255, 0.1);
    color: white;
  }

  .tooltip-progress,
  .tooltip-actions {
    background: #111827;
    border-color: #374151;
  }

  .tooltip-title {
    color: #f3f4f6;
  }

  .tooltip-description {
    color: #9ca3af;
  }

  .action-hint {
    background: #1e3a8a;
    color: #93c5fd;
  }

  .close-btn {
    color: #9ca3af;
  }

  .close-btn:hover {
    background: #374151;
    color: #f3f4f6;
  }

  .btn-secondary {
    background: #374151;
    color: #f3f4f6;
    border-color: #4b5563;
  }

  .btn-secondary:hover {
    background: #4b5563;
  }

  .btn-skip {
    color: #9ca3af;
  }

  .btn-skip:hover {
    color: #f3f4f6;
  }

  .progress-dot {
    background: #4b5563;
  }
}
</style>