<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Animation Library</h2>
        <button @click="$emit('close')" class="close-btn">
          <X :size="20" />
        </button>
      </div>

      <div class="library-tabs">
        <button 
          v-for="category in categories"
          :key="category.id"
          @click="activeCategory = category.id"
          :class="['tab', { active: activeCategory === category.id }]"
        >
          <component :is="category.icon" :size="16" />
          {{ category.name }}
        </button>
      </div>

      <div class="library-content">
        <div class="animation-grid">
          <div 
            v-for="animation in filteredAnimations"
            :key="animation.id"
            @click="selectAnimation(animation)"
            class="animation-card"
          >
            <div class="animation-preview">
              <div 
                class="preview-box"
                :class="['animate', animation.className]"
              ></div>
            </div>
            <h3>{{ animation.name }}</h3>
            <p>{{ animation.description }}</p>
            <div class="animation-tags">
              <span class="tag">{{ animation.duration }}s</span>
              <span class="tag">{{ animation.easing }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { 
  X, Sparkles, Move, Maximize, RotateCw, 
  Zap, Eye, Heart, Star 
} from 'lucide-vue-next';

const emit = defineEmits(['close', 'select']);

const activeCategory = ref('entrance');

const categories = [
  { id: 'entrance', name: 'Entrance', icon: Sparkles },
  { id: 'motion', name: 'Motion', icon: Move },
  { id: 'emphasis', name: 'Emphasis', icon: Zap },
  { id: 'exit', name: 'Exit', icon: Eye },
  { id: 'special', name: 'Special', icon: Star }
];

const animations = [
  // Entrance Animations
  {
    id: 'fadeIn',
    category: 'entrance',
    name: 'Fade In',
    description: 'Fade in from transparent',
    className: 'fadeIn',
    duration: 1,
    easing: 'ease',
    keyframes: [
      { opacity: 0 },
      { opacity: 1 }
    ]
  },
  {
    id: 'slideInLeft',
    category: 'entrance',
    name: 'Slide In Left',
    description: 'Slide in from the left',
    className: 'slideInLeft',
    duration: 0.8,
    easing: 'ease-out',
    keyframes: [
      { transform: 'translateX(-100%)', opacity: 0 },
      { transform: 'translateX(0)', opacity: 1 }
    ]
  },
  {
    id: 'slideInRight',
    category: 'entrance',
    name: 'Slide In Right',
    description: 'Slide in from the right',
    className: 'slideInRight',
    duration: 0.8,
    easing: 'ease-out',
    keyframes: [
      { transform: 'translateX(100%)', opacity: 0 },
      { transform: 'translateX(0)', opacity: 1 }
    ]
  },
  {
    id: 'slideInUp',
    category: 'entrance',
    name: 'Slide In Up',
    description: 'Slide in from the bottom',
    className: 'slideInUp',
    duration: 0.8,
    easing: 'ease-out',
    keyframes: [
      { transform: 'translateY(100%)', opacity: 0 },
      { transform: 'translateY(0)', opacity: 1 }
    ]
  },
  {
    id: 'scaleIn',
    category: 'entrance',
    name: 'Scale In',
    description: 'Scale in from small',
    className: 'scaleIn',
    duration: 0.6,
    easing: 'ease-out',
    keyframes: [
      { transform: 'scale(0)', opacity: 0 },
      { transform: 'scale(1)', opacity: 1 }
    ]
  },
  {
    id: 'bounceIn',
    category: 'entrance',
    name: 'Bounce In',
    description: 'Bounce in with spring effect',
    className: 'bounceIn',
    duration: 1,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    keyframes: [
      { transform: 'scale(0.3)', opacity: 0 },
      { transform: 'scale(1.05)' },
      { transform: 'scale(0.9)', opacity: 1 },
      { transform: 'scale(1)' }
    ]
  },

  // Motion Animations
  {
    id: 'pulse',
    category: 'motion',
    name: 'Pulse',
    description: 'Scale pulse effect',
    className: 'pulse',
    duration: 1,
    easing: 'ease-in-out',
    loop: true,
    keyframes: [
      { transform: 'scale(1)' },
      { transform: 'scale(1.05)' },
      { transform: 'scale(1)' }
    ]
  },
  {
    id: 'shake',
    category: 'motion',
    name: 'Shake',
    description: 'Horizontal shake',
    className: 'shake',
    duration: 0.8,
    easing: 'ease-in-out',
    keyframes: [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-10px)' },
      { transform: 'translateX(10px)' },
      { transform: 'translateX(-10px)' },
      { transform: 'translateX(10px)' },
      { transform: 'translateX(0)' }
    ]
  },
  {
    id: 'swing',
    category: 'motion',
    name: 'Swing',
    description: 'Pendulum swing',
    className: 'swing',
    duration: 1,
    easing: 'ease-in-out',
    keyframes: [
      { transform: 'rotate(0deg)' },
      { transform: 'rotate(15deg)' },
      { transform: 'rotate(-10deg)' },
      { transform: 'rotate(5deg)' },
      { transform: 'rotate(-5deg)' },
      { transform: 'rotate(0deg)' }
    ]
  },

  // Emphasis Animations
  {
    id: 'flash',
    category: 'emphasis',
    name: 'Flash',
    description: 'Flash effect',
    className: 'flash',
    duration: 1,
    easing: 'ease',
    keyframes: [
      { opacity: 1 },
      { opacity: 0 },
      { opacity: 1 },
      { opacity: 0 },
      { opacity: 1 }
    ]
  },
  {
    id: 'rubberBand',
    category: 'emphasis',
    name: 'Rubber Band',
    description: 'Elastic stretch effect',
    className: 'rubberBand',
    duration: 1,
    easing: 'ease',
    keyframes: [
      { transform: 'scale(1)' },
      { transform: 'scale(1.25, 0.75)' },
      { transform: 'scale(0.75, 1.25)' },
      { transform: 'scale(1.15, 0.85)' },
      { transform: 'scale(0.95, 1.05)' },
      { transform: 'scale(1)' }
    ]
  },
  {
    id: 'jello',
    category: 'emphasis',
    name: 'Jello',
    description: 'Jelly wobble effect',
    className: 'jello',
    duration: 1,
    easing: 'ease',
    keyframes: [
      { transform: 'skewX(0deg) skewY(0deg)' },
      { transform: 'skewX(-12.5deg) skewY(-12.5deg)' },
      { transform: 'skewX(6.25deg) skewY(6.25deg)' },
      { transform: 'skewX(-3.125deg) skewY(-3.125deg)' },
      { transform: 'skewX(1.5625deg) skewY(1.5625deg)' },
      { transform: 'skewX(0deg) skewY(0deg)' }
    ]
  },

  // Exit Animations
  {
    id: 'fadeOut',
    category: 'exit',
    name: 'Fade Out',
    description: 'Fade out to transparent',
    className: 'fadeOut',
    duration: 1,
    easing: 'ease',
    keyframes: [
      { opacity: 1 },
      { opacity: 0 }
    ]
  },
  {
    id: 'slideOutLeft',
    category: 'exit',
    name: 'Slide Out Left',
    description: 'Slide out to the left',
    className: 'slideOutLeft',
    duration: 0.8,
    easing: 'ease-in',
    keyframes: [
      { transform: 'translateX(0)', opacity: 1 },
      { transform: 'translateX(-100%)', opacity: 0 }
    ]
  },
  {
    id: 'zoomOut',
    category: 'exit',
    name: 'Zoom Out',
    description: 'Zoom out to small',
    className: 'zoomOut',
    duration: 0.6,
    easing: 'ease-in',
    keyframes: [
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(0.3)', opacity: 0 }
    ]
  },

  // Special Animations
  {
    id: 'heartBeat',
    category: 'special',
    name: 'Heartbeat',
    description: 'Pulsing heartbeat',
    className: 'heartBeat',
    duration: 1.3,
    easing: 'ease-in-out',
    loop: true,
    keyframes: [
      { transform: 'scale(1)' },
      { transform: 'scale(1.3)' },
      { transform: 'scale(1)' },
      { transform: 'scale(1.3)' },
      { transform: 'scale(1)' }
    ]
  },
  {
    id: 'flipInX',
    category: 'special',
    name: 'Flip In X',
    description: '3D flip on X axis',
    className: 'flipInX',
    duration: 1,
    easing: 'ease',
    keyframes: [
      { transform: 'perspective(400px) rotateX(90deg)', opacity: 0 },
      { transform: 'perspective(400px) rotateX(-20deg)' },
      { transform: 'perspective(400px) rotateX(10deg)', opacity: 1 },
      { transform: 'perspective(400px) rotateX(-5deg)' },
      { transform: 'perspective(400px) rotateX(0)' }
    ]
  },
  {
    id: 'lightSpeedIn',
    category: 'special',
    name: 'Light Speed In',
    description: 'Fast slide with skew',
    className: 'lightSpeedIn',
    duration: 1,
    easing: 'ease-out',
    keyframes: [
      { transform: 'translate3d(100%, 0, 0) skewX(-30deg)', opacity: 0 },
      { transform: 'skewX(20deg)', opacity: 1 },
      { transform: 'skewX(-5deg)' },
      { transform: 'translate3d(0, 0, 0)' }
    ]
  }
];

const filteredAnimations = computed(() => {
  return animations.filter(a => a.category === activeCategory.value);
});

function selectAnimation(animation) {
  // Convert keyframes to timeline format
  const timeline = animation.keyframes.map((keyframe, index) => ({
    time: index / (animation.keyframes.length - 1), // Distribute evenly from 0 to 1
    properties: keyframe
  }));
  
  const animationData = {
    id: Date.now().toString(),
    type: animation.id,
    name: animation.name,
    trigger: 'onLoad', // Default trigger
    timeline: timeline,
    options: {
      duration: animation.duration * 1000, // Convert seconds to milliseconds
      delay: 0,
      easing: animation.easing,
      loop: animation.loop || false,
      direction: 'normal'
    }
  };
  
  emit('select', animationData);
  emit('close');
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  background: var(--bg-primary);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
}

.close-btn {
  padding: 8px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.library-tabs {
  display: flex;
  gap: 8px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-secondary);
  overflow-x: auto;
}

.tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.tab:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.tab.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.library-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.animation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.animation-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.animation-card:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.animation-preview {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  background: var(--bg-primary);
  border-radius: 6px;
  overflow: hidden;
}

.preview-box {
  width: 60px;
  height: 60px;
  background: var(--primary);
  border-radius: 8px;
}

.animation-card h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.animation-card p {
  margin: 0 0 12px 0;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.animation-tags {
  display: flex;
  gap: 6px;
}

.tag {
  padding: 4px 8px;
  background: var(--bg-hover);
  border-radius: 4px;
  font-size: 11px;
  color: var(--text-secondary);
}

/* Animation Classes */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInLeft {
  from { 
    transform: translateX(-100%);
    opacity: 0;
  }
  to { 
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from { 
    transform: translateX(100%);
    opacity: 0;
  }
  to { 
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInUp {
  from { 
    transform: translateY(100%);
    opacity: 0;
  }
  to { 
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes scaleIn {
  from { 
    transform: scale(0);
    opacity: 0;
  }
  to { 
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes bounceIn {
  0% { 
    transform: scale(0.3);
    opacity: 0;
  }
  50% { transform: scale(1.05); }
  70% { 
    transform: scale(0.9);
    opacity: 1;
  }
  100% { transform: scale(1); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }
}

@keyframes swing {
  20% { transform: rotate(15deg); }
  40% { transform: rotate(-10deg); }
  60% { transform: rotate(5deg); }
  80% { transform: rotate(-5deg); }
  100% { transform: rotate(0deg); }
}

@keyframes flash {
  0%, 50%, 100% { opacity: 1; }
  25%, 75% { opacity: 0; }
}

@keyframes rubberBand {
  0% { transform: scale(1); }
  30% { transform: scale(1.25, 0.75); }
  40% { transform: scale(0.75, 1.25); }
  50% { transform: scale(1.15, 0.85); }
  65% { transform: scale(0.95, 1.05); }
  75% { transform: scale(1.05, 0.95); }
  100% { transform: scale(1); }
}

@keyframes jello {
  0%, 11.1%, 100% { transform: skewX(0deg) skewY(0deg); }
  22.2% { transform: skewX(-12.5deg) skewY(-12.5deg); }
  33.3% { transform: skewX(6.25deg) skewY(6.25deg); }
  44.4% { transform: skewX(-3.125deg) skewY(-3.125deg); }
  55.5% { transform: skewX(1.5625deg) skewY(1.5625deg); }
  66.6% { transform: skewX(-0.78125deg) skewY(-0.78125deg); }
  77.7% { transform: skewX(0.390625deg) skewY(0.390625deg); }
  88.8% { transform: skewX(-0.1953125deg) skewY(-0.1953125deg); }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes slideOutLeft {
  from { 
    transform: translateX(0);
    opacity: 1;
  }
  to { 
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes zoomOut {
  from { 
    transform: scale(1);
    opacity: 1;
  }
  to { 
    transform: scale(0.3);
    opacity: 0;
  }
}

@keyframes heartBeat {
  0% { transform: scale(1); }
  14% { transform: scale(1.3); }
  28% { transform: scale(1); }
  42% { transform: scale(1.3); }
  70% { transform: scale(1); }
}

@keyframes flipInX {
  0% { 
    transform: perspective(400px) rotateX(90deg);
    opacity: 0;
  }
  40% { transform: perspective(400px) rotateX(-20deg); }
  60% { 
    transform: perspective(400px) rotateX(10deg);
    opacity: 1;
  }
  80% { transform: perspective(400px) rotateX(-5deg); }
  100% { transform: perspective(400px) rotateX(0); }
}

@keyframes lightSpeedIn {
  0% { 
    transform: translate3d(100%, 0, 0) skewX(-30deg);
    opacity: 0;
  }
  60% { 
    transform: skewX(20deg);
    opacity: 1;
  }
  80% { transform: skewX(-5deg); }
  100% { transform: translate3d(0, 0, 0); }
}

.animate {
  animation-duration: 2s;
  animation-fill-mode: both;
  animation-iteration-count: infinite;
}

.animate.fadeIn { animation-name: fadeIn; }
.animate.slideInLeft { animation-name: slideInLeft; }
.animate.slideInRight { animation-name: slideInRight; }
.animate.slideInUp { animation-name: slideInUp; }
.animate.scaleIn { animation-name: scaleIn; }
.animate.bounceIn { animation-name: bounceIn; }
.animate.pulse { animation-name: pulse; }
.animate.shake { animation-name: shake; }
.animate.swing { animation-name: swing; }
.animate.flash { animation-name: flash; }
.animate.rubberBand { animation-name: rubberBand; }
.animate.jello { animation-name: jello; }
.animate.fadeOut { animation-name: fadeOut; }
.animate.slideOutLeft { animation-name: slideOutLeft; }
.animate.zoomOut { animation-name: zoomOut; }
.animate.heartBeat { animation-name: heartBeat; }
.animate.flipInX { animation-name: flipInX; }
.animate.lightSpeedIn { animation-name: lightSpeedIn; }
</style>