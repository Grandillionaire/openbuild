<template>
  <div v-if="open" class="ow-overlay" @click.self="dismiss">
    <div class="ow" role="dialog" aria-labelledby="ow-title">
      <button class="ow-skip" @click="dismiss" aria-label="Skip onboarding">Skip</button>

      <!-- Step 1: choose intent -->
      <section v-if="step === 'intent'" class="ow-step">
        <header>
          <div class="ow-eyebrow">Welcome to OpenBuild</div>
          <h2 id="ow-title">What are you building today?</h2>
          <p>Pick the closest match — you can change everything later.</p>
        </header>
        <div class="ow-grid">
          <button
            v-for="opt in intents"
            :key="opt.id"
            :class="['ow-card', { selected: chosenIntent === opt.id }]"
            @click="chosenIntent = opt.id"
          >
            <div class="ow-card-icon">{{ opt.icon }}</div>
            <div class="ow-card-title">{{ opt.label }}</div>
            <div class="ow-card-sub">{{ opt.subtitle }}</div>
          </button>
        </div>
        <footer>
          <button class="ow-btn-secondary" @click="dismiss">Start from a blank canvas</button>
          <button class="ow-btn-primary" :disabled="!chosenIntent" @click="step = 'starter'">
            Next →
          </button>
        </footer>
      </section>

      <!-- Step 2: choose starter -->
      <section v-else-if="step === 'starter'" class="ow-step">
        <header>
          <button class="ow-back" @click="step = 'intent'" aria-label="Back">← Back</button>
          <h2 id="ow-title">{{ activeIntent?.starterPrompt }}</h2>
          <p>{{ activeIntent?.starterHint }}</p>
        </header>
        <div class="ow-grid ow-grid--templates">
          <button
            v-for="t in recommendedTemplates"
            :key="t.id"
            :class="['ow-template', { selected: chosenTemplateId === t.id }]"
            @click="chosenTemplateId = t.id"
          >
            <div class="ow-template-thumb" :style="{ backgroundImage: `url('${t.thumbnail}')` }"></div>
            <div class="ow-template-body">
              <div class="ow-template-title">{{ t.name }}</div>
              <div class="ow-template-sub">{{ t.description }}</div>
            </div>
          </button>
          <button
            class="ow-template ow-template--blank"
            :class="{ selected: chosenTemplateId === '__blank__' }"
            @click="chosenTemplateId = '__blank__'"
          >
            <div class="ow-template-thumb ow-template-thumb--blank">+</div>
            <div class="ow-template-body">
              <div class="ow-template-title">Start blank</div>
              <div class="ow-template-sub">Build from scratch with the component library</div>
            </div>
          </button>
        </div>
        <footer>
          <label v-if="chosenIntent === 'store'" class="ow-toggle">
            <input type="checkbox" v-model="seedDemoStore" />
            Also seed a fully-configured demo store I can play with first
          </label>
          <button class="ow-btn-primary ow-btn-big" :disabled="!chosenTemplateId" @click="apply">
            {{ chosenTemplateId === '__blank__' ? 'Open the editor' : 'Use this template' }} →
          </button>
        </footer>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useEditorStore } from '@/stores/editor';
import { useTemplateStore } from '@/stores/templates';
import { useCommerceStore } from '@/stores/commerce';
import type { Template, TemplateCategory } from '@/types/template';

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ (e: 'close'): void; (e: 'opened-store'): void }>();

const editorStore = useEditorStore();
const templateStore = useTemplateStore();
const commerceStore = useCommerceStore();

type IntentId = 'store' | 'landing' | 'portfolio' | 'business' | 'blog' | 'explore';

const intents: ReadonlyArray<{
  id: IntentId;
  label: string;
  subtitle: string;
  icon: string;
  category?: TemplateCategory;
  starterPrompt: string;
  starterHint: string;
}> = [
  {
    id: 'store', label: 'Online store', subtitle: 'Sell products with Stripe',
    icon: '🛍', category: 'ecommerce',
    starterPrompt: 'Pick a starting store',
    starterHint: 'Each template is fully editable. Seeded with placeholder products you can replace.',
  },
  {
    id: 'landing', label: 'Landing page', subtitle: 'Launch a product or app',
    icon: '🚀', category: 'landing',
    starterPrompt: 'Pick a starting landing page',
    starterHint: 'Hero, social proof, features, pricing, FAQ — pick what fits.',
  },
  {
    id: 'portfolio', label: 'Portfolio', subtitle: 'Show off your work',
    icon: '🎨', category: 'portfolio',
    starterPrompt: 'Pick a starting portfolio',
    starterHint: 'Each one is responsive and has space for image galleries.',
  },
  {
    id: 'business', label: 'Business site', subtitle: 'Agency, restaurant, studio',
    icon: '🏢', category: 'business',
    starterPrompt: 'Pick a starting business template',
    starterHint: 'Services, hours, testimonials, contact — all wired up.',
  },
  {
    id: 'blog', label: 'Blog', subtitle: 'Personal or magazine',
    icon: '✍️', category: 'blog',
    starterPrompt: 'Pick a starting blog layout',
    starterHint: 'Drop in your posts; the layout handles the rest.',
  },
  {
    id: 'explore', label: 'Just exploring', subtitle: 'Show me what OpenBuild can do',
    icon: '👀',
    starterPrompt: 'Pick anything that catches your eye',
    starterHint: 'No commitment — start from scratch any time.',
  },
];

const step = ref<'intent' | 'starter'>('intent');
const chosenIntent = ref<IntentId | null>(null);
const chosenTemplateId = ref<string | null>(null);
const seedDemoStore = ref(true);

const activeIntent = computed(() => intents.find((i) => i.id === chosenIntent.value));

const recommendedTemplates = computed<Template[]>(() => {
  const cat = activeIntent.value?.category;
  const all = templateStore.templates;
  if (!cat) return all.slice(0, 6);
  // v2 templates (id starts with v2-) first, then everything in the category
  const matching = all.filter((t) => t.category === cat);
  return matching.sort((a, b) => {
    const av = a.id.startsWith('v2-') ? 0 : 1;
    const bv = b.id.startsWith('v2-') ? 0 : 1;
    return av - bv;
  }).slice(0, 6);
});

function apply() {
  if (!chosenTemplateId.value) return;
  if (chosenTemplateId.value !== '__blank__') {
    const tpl = templateStore.templates.find((t) => t.id === chosenTemplateId.value);
    if (tpl) {
      // Replace canvas with the template's components.
      editorStore.components = JSON.parse(JSON.stringify(tpl.components));
      editorStore.selectedId = null;
    }
  }
  if (chosenIntent.value === 'store' && seedDemoStore.value) {
    commerceStore.seedDemoCatalog();
    emit('opened-store');
  }
  dismiss();
}

function dismiss() {
  try { localStorage.setItem('openbuild_onboarded_v2', 'true'); } catch { /* opaque origin */ }
  emit('close');
}

void props;
</script>

<style scoped>
.ow-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(15, 23, 42, 0.6);
  display: grid; place-items: center;
  backdrop-filter: blur(4px);
  animation: ow-fade 0.2s ease-out;
}
@keyframes ow-fade { from { opacity: 0; } to { opacity: 1; } }

.ow {
  width: min(900px, 94vw);
  max-height: 92vh;
  background: white;
  border-radius: 20px;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.35);
  display: flex; flex-direction: column;
  overflow: hidden;
  position: relative;
}
.ow-skip {
  position: absolute; top: 16px; right: 16px;
  background: transparent; border: 0; cursor: pointer;
  color: #6B7280; font-size: 0.875rem; font-weight: 500;
  padding: 6px 12px; border-radius: 6px;
}
.ow-skip:hover { background: #F3F4F6; color: #111827; }
.ow-back {
  background: transparent; border: 0; cursor: pointer;
  color: #6B7280; font-size: 0.875rem; font-weight: 500;
  padding: 4px 0; margin-bottom: 16px;
  align-self: flex-start;
}
.ow-back:hover { color: #111827; }

.ow-step {
  padding: 40px 48px 32px;
  display: flex; flex-direction: column; gap: 24px;
  overflow-y: auto;
}
.ow-step header { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
.ow-eyebrow { font-size: 0.75rem; font-weight: 600; color: #6366F1; letter-spacing: 0.1em; text-transform: uppercase; }
.ow-step h2 { margin: 0; font-size: 1.875rem; font-weight: 700; color: #111827; line-height: 1.2; }
.ow-step header p { margin: 0; color: #6B7280; font-size: 0.9375rem; }

.ow-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.ow-grid--templates { grid-template-columns: repeat(2, 1fr); }
@media (max-width: 700px) {
  .ow-grid { grid-template-columns: 1fr 1fr; }
  .ow-grid--templates { grid-template-columns: 1fr; }
}

.ow-card {
  display: flex; flex-direction: column; align-items: flex-start; gap: 4px;
  padding: 20px;
  background: white; border: 2px solid #E5E7EB; border-radius: 14px;
  cursor: pointer; text-align: left;
  transition: border-color 0.15s, transform 0.1s;
}
.ow-card:hover { border-color: #C7D2FE; transform: translateY(-1px); }
.ow-card.selected { border-color: #6366F1; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.12); }
.ow-card-icon { font-size: 1.75rem; margin-bottom: 4px; }
.ow-card-title { font-weight: 600; color: #111827; font-size: 1rem; }
.ow-card-sub { color: #6B7280; font-size: 0.8125rem; line-height: 1.4; }

.ow-template {
  display: flex; gap: 14px; align-items: center;
  padding: 12px;
  background: white; border: 2px solid #E5E7EB; border-radius: 12px;
  cursor: pointer; text-align: left;
  transition: border-color 0.15s, transform 0.1s;
}
.ow-template:hover { border-color: #C7D2FE; }
.ow-template.selected { border-color: #6366F1; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.12); }
.ow-template-thumb {
  width: 100px; height: 70px;
  background-color: #F3F4F6;
  background-size: cover; background-position: center;
  border-radius: 8px; flex-shrink: 0;
}
.ow-template-thumb--blank {
  display: grid; place-items: center;
  font-size: 1.5rem; color: #9CA3AF; font-weight: 300;
  background: linear-gradient(135deg, #F9FAFB, #F3F4F6);
  border: 2px dashed #D1D5DB;
}
.ow-template-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.ow-template-title { font-weight: 600; color: #111827; font-size: 0.9375rem; }
.ow-template-sub { color: #6B7280; font-size: 0.8125rem; line-height: 1.4; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }

footer {
  margin-top: 8px;
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding-top: 16px; border-top: 1px solid #F3F4F6;
}
.ow-toggle { display: flex; align-items: center; gap: 8px; font-size: 0.8125rem; color: #4B5563; cursor: pointer; }
.ow-toggle input { width: 16px; height: 16px; cursor: pointer; }
.ow-btn-primary {
  padding: 10px 22px;
  background: linear-gradient(135deg, #3B82F6, #6366F1);
  color: white; border: 0; border-radius: 10px;
  font-weight: 600; font-size: 0.9375rem;
  cursor: pointer; transition: transform 0.1s, box-shadow 0.2s;
  box-shadow: 0 4px 12px -4px rgba(99, 102, 241, 0.5);
}
.ow-btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 16px -4px rgba(99, 102, 241, 0.6); }
.ow-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
.ow-btn-big { padding: 12px 28px; font-size: 1rem; }
.ow-btn-secondary {
  padding: 10px 18px; background: transparent; border: 0;
  color: #6B7280; font-weight: 500; font-size: 0.875rem;
  cursor: pointer; border-radius: 8px;
}
.ow-btn-secondary:hover { background: #F3F4F6; color: #111827; }
</style>
