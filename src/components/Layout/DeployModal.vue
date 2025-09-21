<template>
  <Teleport to="body">
    <div class="modal-backdrop" @click="$emit('close')">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>Deploy to Vercel</h2>
          <button @click="$emit('close')" class="close-btn">
            <X :size="20" />
          </button>
        </div>
        
        <div class="modal-body">
          <div v-if="!hasToken" class="token-section">
            <p>To deploy to Vercel, you'll need an API token.</p>
            <ol class="steps">
              <li>Go to <a href="https://vercel.com/account/tokens" target="_blank">Vercel Tokens</a></li>
              <li>Create a new token</li>
              <li>Paste it below</li>
            </ol>
            
            <div class="form-group">
              <label>Vercel API Token</label>
              <input
                v-model="token"
                type="password"
                placeholder="Enter your Vercel token"
              />
            </div>
            
            <div class="form-group">
              <label>Project Name</label>
              <input
                v-model="projectName"
                placeholder="my-awesome-site"
              />
            </div>
          </div>
          
          <div v-else-if="!isDeploying && !deploymentUrl" class="ready-section">
            <div class="ready-icon">
              <Zap :size="48" />
            </div>
            <h3>Ready to Deploy!</h3>
            <p>Your project will be deployed to:</p>
            <code>https://{{ projectName }}.vercel.app</code>
          </div>
          
          <div v-else-if="isDeploying" class="deploying-section">
            <Loader :size="48" class="loading-spinner" />
            <h3>Deploying...</h3>
            <p>This may take a few moments</p>
          </div>
          
          <div v-else-if="deploymentUrl" class="success-section">
            <CheckCircle :size="48" />
            <h3>Deployment Successful!</h3>
            <p>Your site is live at:</p>
            <a :href="deploymentUrl" target="_blank" class="deployment-link">
              {{ deploymentUrl }}
            </a>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="$emit('close')" class="btn-cancel">
            {{ deploymentUrl ? 'Close' : 'Cancel' }}
          </button>
          <button 
            v-if="!deploymentUrl"
            @click="handleDeploy" 
            class="btn-deploy"
            :disabled="!canDeploy || isDeploying"
          >
            <Zap v-if="!isDeploying" :size="16" />
            <Loader v-else :size="16" class="loading-spinner" />
            <span>{{ isDeploying ? 'Deploying...' : 'Deploy Now' }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { X, Zap, Loader, CheckCircle } from 'lucide-vue-next';
import { useEditorStore } from '@/stores/editor';
import { deploymentService } from '@/services/deploymentService';
import { codeGenerator } from '@/services/codeGenerator';
import { useToast } from '@/composables/useToast';

const emit = defineEmits<{
  close: []
}>();

const store = useEditorStore();
const { showToast } = useToast();

const token = ref(localStorage.getItem('vercel_token') || '');
const projectName = ref(store.projectName.toLowerCase().replace(/\s+/g, '-'));
const isDeploying = ref(false);
const deploymentUrl = ref('');

const hasToken = computed(() => token.value.length > 0);
const canDeploy = computed(() => hasToken.value && projectName.value.length > 0);

async function handleDeploy() {
  isDeploying.value = true;
  
  try {
    // Save token for future use
    localStorage.setItem('vercel_token', token.value);
    
    // Generate code
    const { fullPage } = await codeGenerator.generateProject(
      store.components,
      store.projectName
    );
    
    // Create files map
    const files = new Map([
      ['index.html', fullPage]
    ]);
    
    // Deploy to Vercel
    const result = await deploymentService.deployToVercel(
      files,
      token.value,
      projectName.value
    );
    
    deploymentUrl.value = result.url;
    showToast('Deployment successful!', 'success');
  } catch (error) {
    showToast('Deployment failed. Please check your token.', 'error');
  } finally {
    isDeploying.value = false;
  }
}
</script>

<style scoped>
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  z-index: 1001;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #E5E7EB;
}

.modal-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
}

.modal-body {
  padding: 24px;
  min-height: 200px;
}

.token-section p {
  color: #6B7280;
  margin-bottom: 16px;
}

.steps {
  margin: 16px 0 24px 20px;
  color: #4B5563;
  font-size: 14px;
}

.steps li {
  margin-bottom: 8px;
}

.steps a {
  color: #3B82F6;
  text-decoration: underline;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #4B5563;
}

.form-group input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 14px;
}

.ready-section,
.deploying-section,
.success-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;
}

.ready-icon {
  color: #8B5CF6;
  margin-bottom: 16px;
}

.deploying-section {
  color: #6B7280;
}

.success-section {
  color: #10B981;
}

.ready-section h3,
.deploying-section h3,
.success-section h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1F2937;
}

.ready-section code {
  margin-top: 12px;
  padding: 8px 16px;
  background: #F3F4F6;
  border-radius: 6px;
  font-family: monospace;
  font-size: 14px;
  color: #4B5563;
}

.deployment-link {
  margin-top: 12px;
  padding: 8px 16px;
  background: #EFF6FF;
  border-radius: 6px;
  color: #3B82F6;
  text-decoration: none;
  font-weight: 500;
}

.deployment-link:hover {
  background: #DBEAFE;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #E5E7EB;
}

.btn-cancel,
.btn-deploy {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: white;
  color: #6B7280;
  border: 1px solid #D1D5DB;
}

.btn-deploy {
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  color: white;
  border: none;
}

.btn-deploy:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-deploy:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>