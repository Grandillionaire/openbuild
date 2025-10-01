<template>
  <div class="form-builder">
    <div class="builder-header">
      <h3>Form Builder</h3>
      <button @click="showFormBuilder = !showFormBuilder" class="toggle-btn">
        <ChevronDown :size="16" :class="{ rotated: showFormBuilder }" />
      </button>
    </div>

    <transition name="expand">
      <div v-if="showFormBuilder" class="builder-content">
        <!-- Quick Add Form Elements -->
        <div class="quick-add">
          <h5>Quick Add Elements</h5>
          <div class="element-grid">
            <button
              v-for="element in formElements"
              :key="element.type"
              @click="addFormElement(element)"
              class="element-btn"
              :title="element.description"
            >
              <component :is="element.icon" :size="16" />
              <span>{{ element.label }}</span>
            </button>
          </div>
        </div>

        <!-- Form Templates -->
        <div class="form-templates">
          <h5>Form Templates</h5>
          <div class="template-list">
            <button
              v-for="template in formTemplates"
              :key="template.id"
              @click="applyFormTemplate(template)"
              class="template-btn"
            >
              <FileText :size="14" />
              {{ template.name }}
            </button>
          </div>
        </div>

        <!-- Form Settings -->
        <div class="form-settings" v-if="isFormSelected">
          <h5>Form Settings</h5>

          <div class="setting-group">
            <label>Form Action</label>
            <input
              v-model="formAction"
              type="text"
              placeholder="https://your-endpoint.com/submit"
              @input="updateFormSettings"
            />
          </div>

          <div class="setting-group">
            <label>Method</label>
            <select v-model="formMethod" @change="updateFormSettings">
              <option value="POST">POST</option>
              <option value="GET">GET</option>
            </select>
          </div>

          <div class="setting-group">
            <label>Email Notifications</label>
            <input
              v-model="notificationEmail"
              type="email"
              placeholder="admin@example.com"
              @input="updateFormSettings"
            />
          </div>

          <div class="setting-group">
            <label>Success Message</label>
            <input
              v-model="successMessage"
              type="text"
              placeholder="Thank you! We'll be in touch."
              @input="updateFormSettings"
            />
          </div>

          <div class="setting-group">
            <label>
              <input
                v-model="enableValidation"
                type="checkbox"
                @change="updateFormSettings"
              />
              Enable client-side validation
            </label>
          </div>

          <div class="setting-group">
            <label>
              <input
                v-model="enableRecaptcha"
                type="checkbox"
                @change="updateFormSettings"
              />
              Enable reCAPTCHA
            </label>
          </div>
        </div>

        <!-- Form Field Editor -->
        <div class="field-editor" v-if="selectedField">
          <h5>Field Settings</h5>

          <div class="setting-group">
            <label>Field Name</label>
            <input
              v-model="fieldName"
              type="text"
              @input="updateFieldSettings"
            />
          </div>

          <div class="setting-group">
            <label>Label</label>
            <input
              v-model="fieldLabel"
              type="text"
              @input="updateFieldSettings"
            />
          </div>

          <div class="setting-group" v-if="showPlaceholder">
            <label>Placeholder</label>
            <input
              v-model="fieldPlaceholder"
              type="text"
              @input="updateFieldSettings"
            />
          </div>

          <div class="setting-group">
            <label>
              <input
                v-model="fieldRequired"
                type="checkbox"
                @change="updateFieldSettings"
              />
              Required field
            </label>
          </div>

          <div class="setting-group" v-if="fieldType === 'input'">
            <label>Input Type</label>
            <select v-model="inputType" @change="updateFieldSettings">
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="tel">Phone</option>
              <option value="number">Number</option>
              <option value="password">Password</option>
              <option value="date">Date</option>
              <option value="time">Time</option>
              <option value="url">URL</option>
            </select>
          </div>

          <div class="setting-group" v-if="showValidation">
            <label>Validation Pattern</label>
            <input
              v-model="validationPattern"
              type="text"
              placeholder="e.g., [0-9]{3}-[0-9]{3}-[0-9]{4}"
              @input="updateFieldSettings"
            />
          </div>

          <div class="setting-group" v-if="showValidation">
            <label>Error Message</label>
            <input
              v-model="errorMessage"
              type="text"
              placeholder="Please enter a valid value"
              @input="updateFieldSettings"
            />
          </div>
        </div>

        <!-- Form Preview -->
        <div class="form-preview">
          <h5>Form Preview</h5>
          <button @click="testForm" class="test-btn">
            <Play :size="14" />
            Test Form
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useEditorStore } from '@/stores/editor';
import { useToast } from '@/composables/useToast';
import { formComponentDefinitions } from '@/config/formComponents';
import { nanoid } from 'nanoid';
import {
  ChevronDown,
  Type,
  AlignLeft,
  List,
  CheckSquare,
  Circle,
  Mail,
  Send,
  FileText,
  Hash,
  Calendar,
  Play,
  Tag
} from 'lucide-vue-next';

const store = useEditorStore();
const { showToast } = useToast();

// State
const showFormBuilder = ref(true);
const formAction = ref('');
const formMethod = ref('POST');
const notificationEmail = ref('');
const successMessage = ref('Thank you for your submission!');
const enableValidation = ref(true);
const enableRecaptcha = ref(false);

// Field editing
const selectedField = ref<any>(null);
const fieldName = ref('');
const fieldLabel = ref('');
const fieldPlaceholder = ref('');
const fieldRequired = ref(false);
const fieldType = ref('');
const inputType = ref('text');
const validationPattern = ref('');
const errorMessage = ref('');

// Form elements
const formElements = [
  { type: 'input', label: 'Input', icon: Type, description: 'Text input field' },
  { type: 'textarea', label: 'Textarea', icon: AlignLeft, description: 'Multi-line text' },
  { type: 'select', label: 'Select', icon: List, description: 'Dropdown menu' },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare, description: 'Checkbox option' },
  { type: 'radio', label: 'Radio', icon: Circle, description: 'Radio buttons' },
  { type: 'email', label: 'Email', icon: Mail, description: 'Email input' },
  { type: 'submitButton', label: 'Submit', icon: Send, description: 'Submit button' },
  { type: 'label', label: 'Label', icon: Tag, description: 'Field label' }
];

// Form templates
const formTemplates = [
  {
    id: 'contact',
    name: 'Contact Form',
    fields: ['name', 'email', 'message', 'submit']
  },
  {
    id: 'newsletter',
    name: 'Newsletter Signup',
    fields: ['email', 'submit']
  },
  {
    id: 'survey',
    name: 'Survey Form',
    fields: ['name', 'email', 'rating', 'feedback', 'submit']
  },
  {
    id: 'registration',
    name: 'Registration Form',
    fields: ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'terms', 'submit']
  },
  {
    id: 'feedback',
    name: 'Feedback Form',
    fields: ['rating', 'comments', 'email', 'submit']
  }
];

// Computed
const isFormSelected = computed(() => {
  return store.selectedComponent?.type === 'form';
});

const showPlaceholder = computed(() => {
  return ['input', 'textarea', 'select'].includes(fieldType.value);
});

const showValidation = computed(() => {
  return fieldType.value === 'input' && enableValidation.value;
});

// Methods
function addFormElement(element: any) {
  // Check if a form is selected or create one
  let formComponent = store.selectedComponent;
  let isNewForm = false;

  if (!formComponent || formComponent.type !== 'form') {
    // Create a new form and add it to canvas
    const newForm = createFormComponent();
    formComponent = store.addComponentDirect(newForm);
    isNewForm = true;
  }

  // Create the form element
  let newElement: any;

  switch (element.type) {
    case 'input':
      newElement = createInputField();
      break;
    case 'textarea':
      newElement = createTextareaField();
      break;
    case 'select':
      newElement = createSelectField();
      break;
    case 'checkbox':
      newElement = createCheckboxField();
      break;
    case 'radio':
      newElement = createRadioGroup();
      break;
    case 'email':
      newElement = createEmailField();
      break;
    case 'submitButton':
      newElement = createSubmitButton();
      break;
    case 'label':
      newElement = createLabel();
      break;
    default:
      return;
  }

  // For new forms, we need to get the actual component from store
  if (isNewForm) {
    formComponent = store.findComponentById(store.components, formComponent.id);
    if (!formComponent) {
      console.error('Failed to find newly created form component');
      return;
    }
  }

  // Add element to form
  if (!formComponent.children) {
    formComponent.children = [];
  }
  formComponent.children.push(newElement);

  // Update the component in store
  store.updateComponent(formComponent.id, { children: formComponent.children });
  showToast(`Added ${element.label} to form`, 'success');
}

function createFormComponent() {
  return {
    id: nanoid(),
    type: 'form',
    props: {
      method: 'POST',
      action: '#',
      style: formComponentDefinitions.form.defaultStyles?.base
    },
    children: []
  };
}

function createInputField() {
  return {
    id: nanoid(),
    type: 'input',
    props: {
      type: 'text',
      name: 'input-' + nanoid(6),
      placeholder: 'Enter text...',
      required: false,
      style: formComponentDefinitions.input.defaultStyles?.base
    },
    children: []
  };
}

function createTextareaField() {
  return {
    id: nanoid(),
    type: 'textarea',
    props: {
      name: 'message',
      placeholder: 'Enter your message...',
      rows: 5,
      required: false,
      style: formComponentDefinitions.textarea.defaultStyles?.base
    },
    children: []
  };
}

function createSelectField() {
  return {
    id: nanoid(),
    type: 'select',
    props: {
      name: 'select-' + nanoid(6),
      options: [
        { value: '', label: 'Choose an option...' },
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' }
      ],
      style: formComponentDefinitions.select.defaultStyles?.base
    },
    children: []
  };
}

function createCheckboxField() {
  return {
    id: nanoid(),
    type: 'checkbox',
    props: {
      name: 'checkbox-' + nanoid(6),
      label: 'I agree to the terms',
      style: formComponentDefinitions.checkbox.defaultStyles?.base
    },
    children: []
  };
}

function createRadioGroup() {
  return {
    id: nanoid(),
    type: 'radio',
    props: {
      name: 'radio-' + nanoid(6),
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' }
      ],
      style: formComponentDefinitions.radio.defaultStyles?.base
    },
    children: []
  };
}

function createEmailField() {
  return {
    id: nanoid(),
    type: 'input',
    props: {
      type: 'email',
      name: 'email',
      placeholder: 'Enter your email...',
      required: true,
      style: formComponentDefinitions.input.defaultStyles?.base
    },
    children: []
  };
}

function createSubmitButton() {
  return {
    id: nanoid(),
    type: 'submitButton',
    props: {
      text: 'Submit',
      style: formComponentDefinitions.submitButton.defaultStyles?.base
    },
    children: []
  };
}

function createLabel() {
  return {
    id: nanoid(),
    type: 'label',
    props: {
      text: 'Field Label',
      style: formComponentDefinitions.label.defaultStyles?.base
    },
    children: []
  };
}

function applyFormTemplate(template: any) {
  // Create form with template fields
  const form = createFormComponent();

  // Add fields based on template
  template.fields.forEach((fieldType: string) => {
    let field: any;

    switch (fieldType) {
      case 'name':
        field = createInputField();
        field.props.name = 'name';
        field.props.placeholder = 'Your Name';
        field.props.required = true;
        break;
      case 'firstName':
        field = createInputField();
        field.props.name = 'firstName';
        field.props.placeholder = 'First Name';
        field.props.required = true;
        break;
      case 'lastName':
        field = createInputField();
        field.props.name = 'lastName';
        field.props.placeholder = 'Last Name';
        field.props.required = true;
        break;
      case 'email':
        field = createEmailField();
        break;
      case 'message':
      case 'feedback':
      case 'comments':
        field = createTextareaField();
        field.props.name = fieldType;
        field.props.placeholder = 'Your ' + fieldType;
        break;
      case 'password':
        field = createInputField();
        field.props.type = 'password';
        field.props.name = 'password';
        field.props.placeholder = 'Password';
        field.props.required = true;
        break;
      case 'confirmPassword':
        field = createInputField();
        field.props.type = 'password';
        field.props.name = 'confirmPassword';
        field.props.placeholder = 'Confirm Password';
        field.props.required = true;
        break;
      case 'rating':
        field = createRadioGroup();
        field.props.name = 'rating';
        field.props.options = [
          { value: '5', label: 'Excellent' },
          { value: '4', label: 'Good' },
          { value: '3', label: 'Average' },
          { value: '2', label: 'Poor' },
          { value: '1', label: 'Very Poor' }
        ];
        break;
      case 'terms':
        field = createCheckboxField();
        field.props.name = 'terms';
        field.props.label = 'I agree to the Terms and Conditions';
        field.props.required = true;
        break;
      case 'submit':
        field = createSubmitButton();
        break;
      default:
        return;
    }

    if (field) {
      form.children!.push(field);
    }
  });

  // Add form to canvas
  store.addComponentDirect(form);
  showToast(`Applied ${template.name} template`, 'success');
}

function updateFormSettings() {
  if (!isFormSelected.value || !store.selectedComponent) return;

  store.updateComponent(store.selectedComponent.id, {
    props: {
      ...store.selectedComponent.props,
      method: formMethod.value,
      action: formAction.value,
      'data-notification-email': notificationEmail.value,
      'data-success-message': successMessage.value,
      'data-validation': enableValidation.value,
      'data-recaptcha': enableRecaptcha.value
    }
  });
}

function updateFieldSettings() {
  if (!selectedField.value) return;

  selectedField.value.props = {
    ...selectedField.value.props,
    name: fieldName.value,
    label: fieldLabel.value,
    placeholder: fieldPlaceholder.value,
    required: fieldRequired.value,
    type: inputType.value,
    pattern: validationPattern.value,
    'data-error': errorMessage.value
  };

  // Update component in store
  if (store.selectedComponent) {
    store.updateComponent(store.selectedComponent.id, store.selectedComponent);
  }
}

function testForm() {
  showToast('Form test mode activated', 'info');
  // Could open a preview modal or test the form submission
}

// Watch for selected component changes
watch(() => store.selectedComponent, (component) => {
  if (component?.type === 'form') {
    formAction.value = component.props.action || '';
    formMethod.value = component.props.method || 'POST';
    notificationEmail.value = component.props['data-notification-email'] || '';
    successMessage.value = component.props['data-success-message'] || '';
    enableValidation.value = component.props['data-validation'] !== false;
    enableRecaptcha.value = component.props['data-recaptcha'] === true;
  } else if (component && ['input', 'textarea', 'select', 'checkbox', 'radio'].includes(component.type)) {
    selectedField.value = component;
    fieldType.value = component.type;
    fieldName.value = component.props.name || '';
    fieldLabel.value = component.props.label || '';
    fieldPlaceholder.value = component.props.placeholder || '';
    fieldRequired.value = component.props.required || false;
    inputType.value = component.props.type || 'text';
    validationPattern.value = component.props.pattern || '';
    errorMessage.value = component.props['data-error'] || '';
  } else {
    selectedField.value = null;
  }
}, { immediate: true });
</script>

<style scoped>
.form-builder {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.builder-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.builder-header h3 {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn:hover {
  background: #f3f4f6;
}

.toggle-btn svg {
  transition: transform 0.2s;
}

.toggle-btn svg.rotated {
  transform: rotate(180deg);
}

/* Builder Content */
.builder-content {
  margin-top: 12px;
}

/* Quick Add */
.quick-add {
  margin-bottom: 20px;
}

.quick-add h5,
.form-templates h5,
.form-settings h5,
.field-editor h5,
.form-preview h5 {
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.element-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.element-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.element-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #374151;
}

/* Form Templates */
.form-templates {
  margin-bottom: 20px;
}

.template-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.template-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.template-btn:hover {
  background: #f9fafb;
  border-color: #5b21b6;
  color: #374151;
}

/* Settings */
.form-settings,
.field-editor {
  margin-bottom: 20px;
}

.setting-group {
  margin-bottom: 12px;
}

.setting-group label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
}

.setting-group input[type="text"],
.setting-group input[type="email"],
.setting-group select {
  width: 100%;
  padding: 6px 8px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 12px;
}

.setting-group input[type="checkbox"] {
  margin-right: 6px;
}

/* Form Preview */
.test-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #5b21b6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.test-btn:hover {
  background: #4c1d95;
}

/* Transitions */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>