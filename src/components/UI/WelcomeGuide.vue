<template>
  <div v-if="showGuide" class="welcome-guide">
    <div class="guide-overlay" @click="dismissGuide"></div>

    <div class="guide-content">
      <div class="guide-header">
        <h2>👋 Welcome to OpenBuild!</h2>
        <button @click="dismissGuide" class="close-btn">
          <X :size="20" />
        </button>
      </div>

      <div class="guide-steps">
        <div class="step" :class="{ active: currentStep === 1 }">
          <div class="step-number">1</div>
          <div class="step-content">
            <h3>Choose a Starting Point</h3>
            <p>Pick a template or drag components from the left sidebar</p>
          </div>
        </div>

        <div class="step" :class="{ active: currentStep === 2 }">
          <div class="step-number">2</div>
          <div class="step-content">
            <h3>Customize Your Design</h3>
            <p>Click any element to edit text, colors, and styles</p>
          </div>
        </div>

        <div class="step" :class="{ active: currentStep === 3 }">
          <div class="step-number">3</div>
          <div class="step-content">
            <h3>Preview & Publish</h3>
            <p>Test on different devices and export when ready</p>
          </div>
        </div>
      </div>

      <div class="guide-actions">
        <button @click="startWithTemplate" class="btn-primary">
          <Layout :size="18" />
          Start with Template
        </button>
        <button @click="startFromScratch" class="btn-secondary">
          <Plus :size="18" />
          Start from Scratch
        </button>
      </div>

      <div class="guide-footer">
        <label class="dont-show-again">
          <input type="checkbox" v-model="dontShowAgain" />
          <span>Don't show this again</span>
        </label>
      </div>
    </div>

    <!-- Floating tooltips for key areas -->
    <div v-if="!isGuideMinimized" class="floating-tooltips">
      <div class="tooltip-pointer component-library-pointer" v-if="currentStep === 1">
        <div class="tooltip-content">
          <span class="tooltip-arrow">👈</span>
          <p>Drag items from here to the canvas</p>
        </div>
      </div>

      <div class="tooltip-pointer canvas-pointer" v-if="currentStep === 2">
        <div class="tooltip-content">
          <p>Drop components here to build your page</p>
          <span class="tooltip-arrow">👇</span>
        </div>
      </div>

      <div class="tooltip-pointer properties-pointer" v-if="currentStep === 3">
        <div class="tooltip-content">
          <p>Edit selected items here</p>
          <span class="tooltip-arrow">👉</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { X, Layout, Plus } from 'lucide-vue-next';
import { useTemplateStore } from '@/stores/templates';

const emit = defineEmits(['close', 'start-template', 'start-scratch']);

const showGuide = ref(true);
const currentStep = ref(1);
const dontShowAgain = ref(false);
const isGuideMinimized = ref(false);

onMounted(() => {
  // Check if user has seen guide before
  const hasSeenGuide = localStorage.getItem('hasSeenWelcomeGuide');
  if (hasSeenGuide) {
    showGuide.value = false;
  }
});

function dismissGuide() {
  if (dontShowAgain.value) {
    localStorage.setItem('hasSeenWelcomeGuide', 'true');
  }
  showGuide.value = false;
  emit('close');
}

function startWithTemplate() {
  dismissGuide();
  emit('start-template');
  // Open template library
  const templateBtn = document.querySelector('[data-tooltip="Templates"]') as HTMLElement;
  templateBtn?.click();
}

function startFromScratch() {
  dismissGuide();
  emit('start-scratch');
  currentStep.value = 2;
  // Highlight component library
  setTimeout(() => {
    const componentLib = document.querySelector('.sidebar-left');
    componentLib?.classList.add('highlight-pulse');
    setTimeout(() => {
      componentLib?.classList.remove('highlight-pulse');
    }, 3000);
  }, 100);
}
</script>

<style scoped>
.welcome-guide {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

.guide-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
}

.guide-content {
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.4s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.guide-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.guide-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.guide-steps {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
}

.step {
  flex: 1;
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  border: 2px solid transparent;
  transition: all 0.3s;
}

.step.active {
  background: #ede9fe;
  border-color: #8b5cf6;
}

.step-number {
  width: 32px;
  height: 32px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #6b7280;
  flex-shrink: 0;
}

.step.active .step-number {
  background: #8b5cf6;
  border-color: #8b5cf6;
  color: white;
}

.step-content h3 {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.step-content p {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

.guide-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background: #8b5cf6;
  color: white;
}

.btn-primary:hover {
  background: #7c3aed;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.btn-secondary {
  background: white;
  color: #6b7280;
  border: 2px solid #e5e7eb;
}

.btn-secondary:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.guide-footer {
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.dont-show-again {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #6b7280;
}

.dont-show-again input {
  cursor: pointer;
}

/* Floating Tooltips */
.floating-tooltips {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9998;
}

.tooltip-pointer {
  position: absolute;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.component-library-pointer {
  left: 240px;
  top: 50%;
  transform: translateY(-50%);
}

.canvas-pointer {
  left: 50%;
  top: 200px;
  transform: translateX(-50%);
}

.properties-pointer {
  right: 320px;
  top: 50%;
  transform: translateY(-50%);
}

.tooltip-content {
  background: #1f2937;
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.tooltip-arrow {
  font-size: 20px;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* Highlight animation for sidebar */
:global(.highlight-pulse) {
  animation: highlightPulse 1s ease 3;
}

@keyframes highlightPulse {
  0%, 100% {
    box-shadow: none;
  }
  50% {
    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.4);
  }
}
</style>