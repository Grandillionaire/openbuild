<template>
  <div
    ref="componentElement"
    :class="[
      'component-wrapper',
      `component-${component.type}`,
      {
        'is-selected': selected,
        'is-hovered': hovered,
        'is-container': hasChildren
      }
    ]"
    :data-component-id="component.id"
    @click.stop="handleSelect"
    @mouseenter="$emit('mouseenter')"
    @mouseleave="$emit('mouseleave')"
    @contextmenu.prevent="handleContextMenu"
  >
    <!-- Component Controls -->
    <div v-if="selected" class="component-controls">
      <button 
        class="control-btn drag-handle"
        title="Drag to move"
        @mousedown.stop
      >
        <Move :size="14" />
      </button>
      <button 
        class="control-btn"
        title="Duplicate"
        @click.stop="duplicate"
      >
        <Copy :size="14" />
      </button>
      <button 
        class="control-btn"
        title="Delete"
        @click.stop="deleteComponent"
      >
        <Trash2 :size="14" />
      </button>
    </div>
    
    <!-- Component Label -->
    <div v-if="selected || hovered" class="component-label">
      {{ component.displayName || component.type || 'Component' }}
    </div>
    
    <!-- Render Component Content -->
    <div 
      class="component-content"
      :style="[computedStyles, { animation: animationStyleString }]"
    >
      <!-- Layout Components -->
      <template v-if="component.type === 'container' || component.type === 'section' || component.type === 'div'">
        <div class="component-inner">
          <ComponentRenderer
            v-for="child in component.children"
            :key="child.id"
            :component="child"
            :selected="store.selectedId === child.id"
            :hovered="store.hoveredId === child.id"
            @select="$emit('select', $event)"
            @mouseenter="store.hoveredId = child.id"
            @mouseleave="store.hoveredId = null"
          />
          <div v-if="(!component.children || component.children.length === 0) && selected" 
               class="empty-container">
            <Plus :size="24" />
            <span>Drop components here</span>
          </div>
        </div>
      </template>
      
      <!-- Grid Component -->
      <template v-else-if="component.type === 'grid'">
        <div class="grid-container" :style="gridStyles">
          <ComponentRenderer
            v-for="child in component.children"
            :key="child.id"
            :component="child"
            :selected="store.selectedId === child.id"
            :hovered="store.hoveredId === child.id"
            @select="$emit('select', $event)"
            @mouseenter="store.hoveredId = child.id"
            @mouseleave="store.hoveredId = null"
          />
        </div>
      </template>
      
      <!-- Flex Component -->
      <template v-else-if="component.type === 'flex'">
        <div class="flex-container" :style="flexStyles">
          <ComponentRenderer
            v-for="child in component.children"
            :key="child.id"
            :component="child"
            :selected="store.selectedId === child.id"
            :hovered="store.hoveredId === child.id"
            @select="$emit('select', $event)"
            @mouseenter="store.hoveredId = child.id"
            @mouseleave="store.hoveredId = null"
          />
        </div>
      </template>
      
      <!-- Content Components -->
      <template v-else-if="component.type === 'heading'">
        <component :is="headingTag" class="heading-content">
          {{ component.props.content || component.props.text || 'Heading' }}
        </component>
      </template>

      <template v-else-if="component.type === 'text'">
        <p class="text-content">{{ component.props.content || component.props.text || 'Text' }}</p>
      </template>

      <template v-else-if="component.type === 'button'">
        <button class="button-content" :style="buttonStyles">
          {{ component.props.content || component.props.text || 'Button' }}
        </button>
      </template>
      
      <template v-else-if="component.type === 'link'">
        <a href="#" class="link-content" @click.prevent>
          {{ component.props.content }}
        </a>
      </template>
      
      <template v-else-if="component.type === 'image'">
        <img 
          :src="component.props.attributes?.src || 'https://via.placeholder.com/600x400'" 
          :alt="component.props.attributes?.alt || 'Image'"
          class="image-content"
        />
      </template>
      
      <template v-else-if="component.type === 'spacer'">
        <div class="spacer-content"></div>
      </template>
      
      <!-- Block Components -->
      <template v-else-if="component.type === 'hero'">
        <div class="hero-content">
          <h1>{{ typeof component.props.content === 'object' ? component.props.content?.heading : '' }}</h1>
          <p>{{ typeof component.props.content === 'object' ? component.props.content?.subheading : '' }}</p>
          <button class="hero-button">{{ typeof component.props.content === 'object' ? component.props.content?.buttonText : '' }}</button>
        </div>
      </template>
      
      <template v-else-if="component.type === 'features'">
        <div class="features-grid">
          <div 
            v-for="(feature, index) in (typeof component.props.content === 'object' ? component.props.content?.features : [])" 
            :key="index"
            class="feature-item"
          >
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </template>
      
      <template v-else-if="component.type === 'navigation'">
        <nav class="nav-content">
          <div class="nav-logo">{{ typeof component.props.content === 'object' ? component.props.content?.logo : '' }}</div>
          <div class="nav-links">
            <a 
              v-for="(link, index) in (typeof component.props.content === 'object' ? component.props.content?.links : [])" 
              :key="index"
              href="#"
              @click.prevent
            >
              {{ link.text }}
            </a>
          </div>
        </nav>
      </template>
      
      <template v-else-if="component.type === 'footer'">
        <footer class="footer-content">
          <div class="footer-links">
            <a v-for="(link, index) in (typeof component.props.content === 'object' ? component.props.content?.links : [])" 
               :key="index" 
               href="#"
               @click.prevent
            >
              {{ link }}
            </a>
          </div>
          <p>{{ typeof component.props.content === 'object' ? component.props.content?.copyright : '' }}</p>
        </footer>
      </template>
      
      <template v-else-if="component.type === 'cta'">
        <div class="cta-content">
          <h2>{{ typeof component.props.content === 'object' ? component.props.content?.heading : '' }}</h2>
          <p>{{ typeof component.props.content === 'object' ? component.props.content?.description : '' }}</p>
          <button class="cta-button">{{ typeof component.props.content === 'object' ? component.props.content?.buttonText : '' }}</button>
        </div>
      </template>
    </div>
    
    <!-- Drop Indicator -->
    <div v-if="showDropIndicator" class="drop-indicator"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue';
import { useEditorStore } from '@/stores/editor';
import { Move, Copy, Trash2, Plus } from 'lucide-vue-next';
import type { Component, Animation } from '@/types/component';

const props = defineProps<{
  component: Component;
  selected: boolean;
  hovered: boolean;
}>();

const emit = defineEmits<{
  select: [id: string];
  mouseenter: [];
  mouseleave: [];
}>();

const store = useEditorStore();
const showDropIndicator = ref(false);

// Computed
const hasChildren = computed(() => 
  props.component.children && props.component.children.length > 0
);

const headingTag = computed(() => {
  const level = props.component.props.attributes?.level || props.component.props.level;
  return level ? `h${level}` : 'h2';
});

const computedStyles = computed(() => {
  const styles = { ...props.component.styles.base };
  
  // Apply responsive styles based on viewport
  const viewport = store.viewport;
  if (viewport === 'tablet' && props.component.styles.md) {
    Object.assign(styles, props.component.styles.md);
  } else if (viewport === 'desktop' && props.component.styles.lg) {
    Object.assign(styles, props.component.styles.lg);
  }
  
  return styles;
});

const gridStyles = computed(() => {
  const content = props.component.props.content;
  const columns = typeof content === 'object' && content?.columns 
    ? content.columns 
    : null;
  const gap = typeof content === 'object' && content?.gap 
    ? content.gap 
    : '20px';
  
  return {
    display: 'grid',
    gridTemplateColumns: columns 
      ? `repeat(${columns}, 1fr)` 
      : 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: gap
  };
});

const flexStyles = computed(() => ({
  display: 'flex',
  flexDirection: String(props.component.styles.base?.flexDirection || 'row'),
  alignItems: String(props.component.styles.base?.alignItems || 'stretch'),
  justifyContent: String(props.component.styles.base?.justifyContent || 'flex-start'),
  gap: String(props.component.styles.base?.gap || '16px')
}));

const buttonStyles = computed(() => ({
  ...props.component.styles.base,
  cursor: 'pointer'
}));

// Methods
function handleSelect() {
  emit('select', props.component.id);
}

function handleContextMenu() {
  // Show context menu with options
  emit('select', props.component.id);
}

function duplicate() {
  store.duplicateComponent(props.component.id);
}

function deleteComponent() {
  store.deleteComponent(props.component.id);
}

// Animation handling
const componentElement = ref<HTMLElement>();
const animationStyles = ref<Record<string, string>>({});
const scrollObserver = ref<IntersectionObserver | null>(null);

// Animation CSS generation is handled in the animation styles

// Apply animations based on trigger
function applyAnimations() {
  const animations = props.component.props.animations || [];
  
  animations.forEach((animation) => {
    switch (animation.trigger) {
      case 'onLoad':
        applyLoadAnimation(animation);
        break;
      case 'onScroll':
        setupScrollAnimation(animation);
        break;
      case 'onHover':
        setupHoverAnimation(animation);
        break;
      case 'onClick':
        setupClickAnimation(animation);
        break;
      case 'continuous':
        applyContinuousAnimation(animation);
        break;
    }
  });
}

function applyLoadAnimation(animation: Animation) {
  if (!componentElement.value) return;
  
  const animationName = `animation-${animation.id}`;
  const duration = `${animation.options.duration}ms`;
  const delay = `${animation.options.delay}ms`;
  const easing = animation.options.easing;
  const direction = animation.options.direction || 'normal';
  const iterations = animation.options.loop ? 'infinite' : '1';
  
  animationStyles.value[animation.id] = `${animationName} ${duration} ${easing} ${delay} ${iterations} ${direction} both`;
}

function setupScrollAnimation(animation: Animation) {
  if (!componentElement.value) return;
  
  const options = {
    threshold: animation.scrollOptions?.threshold || 0.5,
    rootMargin: animation.scrollOptions?.rootMargin || '0px'
  };
  
  scrollObserver.value = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        applyLoadAnimation(animation);
        // Unobserve after animation triggers (unless looping)
        if (!animation.options.loop) {
          scrollObserver.value?.unobserve(entry.target);
        }
      }
    });
  }, options);
  
  scrollObserver.value.observe(componentElement.value);
}

function setupHoverAnimation(animation: Animation) {
  if (!componentElement.value) return;
  
  const element = componentElement.value.querySelector('.component-content') as HTMLElement;
  if (!element) return;
  
  element.addEventListener('mouseenter', () => {
    applyLoadAnimation(animation);
  });
  
  element.addEventListener('mouseleave', () => {
    // Remove animation
    delete animationStyles.value[animation.id];
  });
}

function setupClickAnimation(animation: Animation) {
  if (!componentElement.value) return;
  
  const element = componentElement.value.querySelector('.component-content') as HTMLElement;
  if (!element) return;
  
  element.addEventListener('click', () => {
    // Remove and re-add animation to restart it
    delete animationStyles.value[animation.id];
    
    // Force reflow
    void element.offsetWidth;
    
    applyLoadAnimation(animation);
  });
}

function applyContinuousAnimation(animation: Animation) {
  animation.options.loop = true;
  applyLoadAnimation(animation);
}

// Computed animation style string
const animationStyleString = computed(() => {
  return Object.values(animationStyles.value).join(', ');
});

// Lifecycle
onMounted(() => {
  applyAnimations();
});

onUnmounted(() => {
  if (scrollObserver.value) {
    scrollObserver.value.disconnect();
  }
});

// Watch for animation changes
watch(() => props.component.props.animations, () => {
  animationStyles.value = {};
  if (scrollObserver.value) {
    scrollObserver.value.disconnect();
  }
  applyAnimations();
}, { deep: true });
</script>

<style scoped>
.component-wrapper {
  position: relative;
  outline: 2px solid transparent;
  transition: outline 0.2s;
  margin: 4px 0;
}

.component-wrapper.is-hovered {
  outline-color: #93C5FD;
}

.component-wrapper.is-selected {
  outline-color: #3B82F6;
}

.component-controls {
  position: absolute;
  top: -32px;
  right: 0;
  display: flex;
  gap: 4px;
  background: #3B82F6;
  border-radius: 4px;
  padding: 4px;
  z-index: 100;
}

.control-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s;
}

.control-btn:hover {
  background: #F3F4F6;
}

.drag-handle {
  cursor: move;
}

.component-label {
  position: absolute;
  top: -24px;
  left: 0;
  font-size: 11px;
  color: #3B82F6;
  font-weight: 500;
  padding: 2px 6px;
  background: white;
  border-radius: 3px;
  border: 1px solid #3B82F6;
  z-index: 99;
}

.empty-container {
  min-height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed #D1D5DB;
  border-radius: 8px;
  color: #9CA3AF;
  margin: 8px;
}

.drop-indicator {
  position: absolute;
  left: 0;
  right: 0;
  height: 3px;
  background: #3B82F6;
  border-radius: 2px;
}

/* Component-specific styles */
.hero-content {
  text-align: center;
  padding: 60px 20px;
}

.hero-content h1 {
  font-size: 48px;
  margin-bottom: 16px;
}

.hero-content p {
  font-size: 20px;
  margin-bottom: 24px;
  color: #6B7280;
}

.hero-button, .cta-button {
  padding: 12px 32px;
  background: #3B82F6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  padding: 20px;
}

.feature-item {
  text-align: center;
}

.feature-icon {
  font-size: 36px;
  margin-bottom: 12px;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
}

.nav-logo {
  font-size: 20px;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 24px;
}

.nav-links a {
  color: #4B5563;
  text-decoration: none;
}

.footer-content {
  text-align: center;
  padding: 32px 20px;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
}

.footer-links a {
  color: #6B7280;
  text-decoration: none;
}

.cta-content {
  text-align: center;
  padding: 60px 20px;
}

.cta-content h2 {
  font-size: 32px;
  margin-bottom: 12px;
}

.cta-content p {
  font-size: 18px;
  margin-bottom: 24px;
  color: #6B7280;
}
</style>