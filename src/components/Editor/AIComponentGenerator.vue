<template>
  <Teleport to="body">
    <div class="ai-modal-overlay" @click.self="$emit('close')">
      <div class="ai-modal">
        <div class="modal-header">
          <div class="header-content">
            <Sparkles :size="24" class="ai-icon" />
            <h2>AI Component Generator</h2>
          </div>
          <button class="close-btn" @click="$emit('close')">
            <X :size="20" />
          </button>
        </div>
        
        <div class="modal-body">
          <div class="input-section">
            <label for="description">Describe what you want to build</label>
            <textarea
              id="description"
              v-model="description"
              placeholder="E.g., 'A hero section with a gradient background, large heading, subtitle, and call-to-action button'"
              rows="4"
              :disabled="isGenerating"
            />
          </div>
          
          <div class="options-section">
            <div class="option-group">
              <label>Style Preset</label>
              <div class="style-options">
                <button
                  v-for="style in styleOptions"
                  :key="style.value"
                  :class="['style-btn', { active: selectedStyle === style.value }]"
                  @click="selectedStyle = style.value"
                  :disabled="isGenerating"
                >
                  {{ style.label }}
                </button>
              </div>
            </div>
          </div>
          
          <div class="examples-section">
            <label>Quick Examples</label>
            <div class="examples-grid">
              <button
                v-for="example in examples"
                :key="example.label"
                class="example-btn"
                @click="useExample(example)"
                :disabled="isGenerating"
              >
                <component :is="example.icon" :size="16" />
                <span>{{ example.label }}</span>
              </button>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <div v-if="error" class="error-message">
            <AlertCircle :size="16" />
            <span>{{ error }}</span>
          </div>
          
          <div class="actions">
            <button class="btn-secondary" @click="$emit('close')" :disabled="isGenerating">
              Cancel
            </button>
            <button 
              class="btn-primary" 
              @click="generate"
              :disabled="!description.trim() || isGenerating"
            >
              <Loader2 v-if="isGenerating" :size="18" class="spin" />
              <Sparkles v-else :size="18" />
              <span>{{ isGenerating ? 'Generating...' : 'Generate Component' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { 
  Sparkles, 
  X, 
  Loader2, 
  AlertCircle,
  Layout,
  Square,
  MessageSquare,
  Users
} from 'lucide-vue-next';
import { aiComponentService } from '@/services/aiComponentService';
import { useEditorStore } from '@/stores/editor';
import { useToast } from '@/composables/useToast';

const emit = defineEmits<{
  close: [];
}>();

const store = useEditorStore();
const { showToast } = useToast();

const description = ref('');
const selectedStyle = ref<'modern' | 'minimal' | 'bold' | 'elegant'>('modern');
const isGenerating = ref(false);
const error = ref('');

const styleOptions = [
  { value: 'modern', label: 'Modern' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'bold', label: 'Bold' },
  { value: 'elegant', label: 'Elegant' }
] as const;

const examples = [
  { 
    label: 'Hero Section',
    icon: Layout,
    description: 'A hero section with a gradient background, large heading that says "Build Amazing Products", a subtitle about creating innovative solutions, and a prominent call-to-action button'
  },
  { 
    label: 'Feature Cards',
    icon: Square,
    description: 'A features section with 3 feature cards highlighting speed, security, and ease of use'
  },
  { 
    label: 'Contact Form',
    icon: MessageSquare,
    description: 'A contact form section with name, email, message fields and a submit button'
  },
  { 
    label: 'Team Section',
    icon: Users,
    description: 'A card showcasing a team member with their photo, name, role, and short bio'
  }
];

function useExample(example: typeof examples[0]) {
  description.value = example.description;
}

async function generate() {
  if (!description.value.trim()) return;
  
  isGenerating.value = true;
  error.value = '';
  
  try {
    const result = await aiComponentService.generateComponent({
      description: description.value,
      style: selectedStyle.value
    });
    
    if (result.success && result.component) {
      store.addComponentDirect(result.component);
      showToast('Component generated successfully!', 'success');
      emit('close');
    } else {
      error.value = result.error || 'Failed to generate component';
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An unexpected error occurred';
  } finally {
    isGenerating.value = false;
  }
}
</script>

<style scoped>
.ai-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.ai-modal {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 580px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #f0f9ff 0%, #f5f3ff 100%);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-icon {
  color: #7c3aed;
}

.header-content h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #6b7280;
  border-radius: 8px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  max-height: calc(90vh - 180px);
}

.input-section {
  margin-bottom: 24px;
}

.input-section label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.input-section textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 15px;
  resize: vertical;
  transition: all 0.2s;
  font-family: inherit;
}

.input-section textarea:focus {
  outline: none;
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

.input-section textarea:disabled {
  background: #f9fafb;
  cursor: not-allowed;
}

.options-section {
  margin-bottom: 24px;
}

.option-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 10px;
}

.style-options {
  display: flex;
  gap: 8px;
}

.style-btn {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.style-btn:hover:not(:disabled) {
  border-color: #d1d5db;
  color: #374151;
}

.style-btn.active {
  border-color: #7c3aed;
  background: #f5f3ff;
  color: #7c3aed;
}

.style-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.examples-section label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 10px;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.example-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  font-size: 13px;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.example-btn:hover:not(:disabled) {
  border-color: #7c3aed;
  background: #faf5ff;
  color: #7c3aed;
}

.example-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 14px;
  margin-bottom: 12px;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-secondary,
.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary {
  background: white;
  border: 1px solid #e5e7eb;
  color: #374151;
}

.btn-secondary:hover:not(:disabled) {
  background: #f3f4f6;
}

.btn-primary {
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  border: none;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
}

.btn-primary:disabled,
.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
