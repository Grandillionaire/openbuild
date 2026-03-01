import type { ComponentDefinition } from '@/types/component';
import { escapeHtml, sanitizeUrl } from '@/utils/htmlEscape';

export const formComponentDefinitions: Record<string, ComponentDefinition> = {
  form: {
    type: 'form' as any,
    displayName: 'Form',
    category: 'form' as const,
    icon: 'form',
    acceptsChildren: true,
    defaultProps: {
      method: 'POST',
      action: '#'
    },
    defaultStyles: {
      base: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '24px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }
    },
    generateHTML: (component) => {
      const method = component.props.method || 'POST';
      const action = component.props.action || '#';
      return `<form class="c-${component.id}" id="${component.id}" method="${escapeHtml(method)}" action="${sanitizeUrl(action)}">`;
    },
    generateCSS: (component) => {
      const styles = component.props.style || component.styles?.base || {};
      const cssProps = Object.entries(styles)
        .map(([prop, value]) => `  ${prop.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
        .join('\n');
      return `.c-${component.id} {\n${cssProps}\n}`;
    }
  },

  input: {
    type: 'input' as any,
    displayName: 'Input',
    category: 'form' as const,
    icon: 'input',
    acceptsChildren: false,
    defaultProps: {
      type: 'text',
      placeholder: 'Enter text...',
      name: 'input',
      required: false
    },
    defaultStyles: {
      base: {
        width: '100%',
        padding: '12px 16px',
        fontSize: '16px',
        border: '1px solid #e5e7eb',
        borderRadius: '6px',
        backgroundColor: 'white',
        transition: 'all 0.2s'
      }
    },
    generateHTML: (component) => {
      const type = component.props.type || 'text';
      const placeholder = component.props.placeholder || '';
      const name = component.props.name || 'input';
      const required = component.props.required ? 'required' : '';
      const value = component.props.value || '';
      return `<input class="c-${component.id}" id="${component.id}" type="${escapeHtml(type)}" name="${escapeHtml(name)}" placeholder="${escapeHtml(placeholder)}" value="${escapeHtml(value)}" ${required} />`;
    },
    generateCSS: (component) => {
      const styles = component.props.style || component.styles?.base || {};
      const cssProps = Object.entries(styles)
        .map(([prop, value]) => `  ${prop.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
        .join('\n');
      return `.c-${component.id} {\n${cssProps}\n}\n.c-${component.id}:focus {\n  outline: none;\n  border-color: #5b21b6;\n  box-shadow: 0 0 0 3px rgba(91, 33, 182, 0.1);\n}`;
    }
  },

  textarea: {
    type: 'textarea' as any,
    displayName: 'Textarea',
    category: 'form' as const,
    icon: 'textarea',
    acceptsChildren: false,
    defaultProps: {
      placeholder: 'Enter your message...',
      name: 'message',
      rows: 5,
      required: false
    },
    defaultStyles: {
      base: {
        width: '100%',
        padding: '12px 16px',
        fontSize: '16px',
        border: '1px solid #e5e7eb',
        borderRadius: '6px',
        backgroundColor: 'white',
        resize: 'vertical',
        transition: 'all 0.2s',
        fontFamily: 'inherit'
      }
    },
    generateHTML: (component) => {
      const placeholder = component.props.placeholder || '';
      const name = component.props.name || 'message';
      const rows = component.props.rows || 5;
      const required = component.props.required ? 'required' : '';
      const value = component.props.value || '';
      return `<textarea class="c-${component.id}" id="${component.id}" name="${escapeHtml(name)}" placeholder="${escapeHtml(placeholder)}" rows="${rows}" ${required}>${escapeHtml(value)}</textarea>`;
    },
    generateCSS: (component) => {
      const styles = component.props.style || component.styles?.base || {};
      const cssProps = Object.entries(styles)
        .map(([prop, value]) => `  ${prop.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
        .join('\n');
      return `.c-${component.id} {\n${cssProps}\n}\n.c-${component.id}:focus {\n  outline: none;\n  border-color: #5b21b6;\n  box-shadow: 0 0 0 3px rgba(91, 33, 182, 0.1);\n}`;
    }
  },

  select: {
    type: 'select' as any,
    displayName: 'Select',
    category: 'form' as const,
    icon: 'select',
    acceptsChildren: true,
    defaultProps: {
      name: 'select',
      required: false,
      options: [
        { value: '', label: 'Choose an option...' },
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' }
      ]
    },
    defaultStyles: {
      base: {
        width: '100%',
        padding: '12px 16px',
        fontSize: '16px',
        border: '1px solid #e5e7eb',
        borderRadius: '6px',
        backgroundColor: 'white',
        cursor: 'pointer',
        transition: 'all 0.2s'
      }
    },
    generateHTML: (component) => {
      const name = component.props.name || 'select';
      const required = component.props.required ? 'required' : '';
      const options = component.props.options || [];
      const optionsHTML = options.map((opt: any) =>
        `<option value="${escapeHtml(opt.value)}">${escapeHtml(opt.label)}</option>`
      ).join('\n');
      return `<select class="c-${component.id}" id="${component.id}" name="${escapeHtml(name)}" ${required}>\n${optionsHTML}\n</select>`;
    },
    generateCSS: (component) => {
      const styles = component.props.style || component.styles?.base || {};
      const cssProps = Object.entries(styles)
        .map(([prop, value]) => `  ${prop.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
        .join('\n');
      return `.c-${component.id} {\n${cssProps}\n}\n.c-${component.id}:focus {\n  outline: none;\n  border-color: #5b21b6;\n  box-shadow: 0 0 0 3px rgba(91, 33, 182, 0.1);\n}`;
    }
  },

  checkbox: {
    type: 'checkbox' as any,
    displayName: 'Checkbox',
    category: 'form' as const,
    icon: 'checkbox',
    acceptsChildren: false,
    defaultProps: {
      name: 'checkbox',
      label: 'I agree to the terms',
      required: false,
      checked: false
    },
    defaultStyles: {
      base: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }
    },
    generateHTML: (component) => {
      const name = component.props.name || 'checkbox';
      const label = component.props.label || 'Checkbox';
      const required = component.props.required ? 'required' : '';
      const checked = component.props.checked ? 'checked' : '';
      return `<label class="c-${component.id}" id="${component.id}">
        <input type="checkbox" name="${escapeHtml(name)}" ${required} ${checked} />
        <span>${escapeHtml(label)}</span>
      </label>`;
    },
    generateCSS: (component) => {
      const styles = component.props.style || component.styles?.base || {};
      const cssProps = Object.entries(styles)
        .map(([prop, value]) => `  ${prop.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
        .join('\n');
      return `.c-${component.id} {\n${cssProps}\n  cursor: pointer;\n}\n.c-${component.id} input[type="checkbox"] {\n  width: 18px;\n  height: 18px;\n  cursor: pointer;\n}`;
    }
  },

  radio: {
    type: 'radio' as any,
    displayName: 'Radio Group',
    category: 'form' as const,
    icon: 'radio',
    acceptsChildren: false,
    defaultProps: {
      name: 'radio-group',
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' }
      ],
      required: false
    },
    defaultStyles: {
      base: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }
    },
    generateHTML: (component) => {
      const name = component.props.name || 'radio-group';
      const options = component.props.options || [];
      const required = component.props.required ? 'required' : '';
      const optionsHTML = options.map((opt: any, index: number) =>
        `<label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
          <input type="radio" name="${escapeHtml(name)}" value="${escapeHtml(opt.value)}" ${index === 0 ? required : ''} />
          <span>${escapeHtml(opt.label)}</span>
        </label>`
      ).join('\n');
      return `<div class="c-${component.id}" id="${component.id}">\n${optionsHTML}\n</div>`;
    },
    generateCSS: (component) => {
      const styles = component.props.style || component.styles?.base || {};
      const cssProps = Object.entries(styles)
        .map(([prop, value]) => `  ${prop.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
        .join('\n');
      return `.c-${component.id} {\n${cssProps}\n}\n.c-${component.id} input[type="radio"] {\n  width: 18px;\n  height: 18px;\n  cursor: pointer;\n}`;
    }
  },

  label: {
    type: 'label' as any,
    displayName: 'Label',
    category: 'form' as const,
    icon: 'label',
    acceptsChildren: false,
    defaultProps: {
      text: 'Label',
      for: '',
      required: false
    },
    defaultStyles: {
      base: {
        display: 'block',
        fontSize: '14px',
        fontWeight: '500',
        color: '#374151',
        marginBottom: '6px'
      }
    },
    generateHTML: (component) => {
      const text = component.props.text || 'Label';
      const forAttr = component.props.for ? `for="${escapeHtml(component.props.for)}"` : '';
      const required = component.props.required ? '<span style="color: #ef4444;">*</span>' : '';
      return `<label class="c-${component.id}" id="${component.id}" ${forAttr}>${escapeHtml(text)}${required}</label>`;
    },
    generateCSS: (component) => {
      const styles = component.props.style || component.styles?.base || {};
      const cssProps = Object.entries(styles)
        .map(([prop, value]) => `  ${prop.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
        .join('\n');
      return `.c-${component.id} {\n${cssProps}\n}`;
    }
  },

  formGroup: {
    type: 'formGroup' as any,
    displayName: 'Form Group',
    category: 'form' as const,
    icon: 'form-group',
    acceptsChildren: true,
    defaultProps: {},
    defaultStyles: {
      base: {
        marginBottom: '20px'
      }
    },
    generateHTML: (component) => {
      return `<div class="c-${component.id} form-group" id="${component.id}">`;
    },
    generateCSS: (component) => {
      const styles = component.props.style || component.styles?.base || {};
      const cssProps = Object.entries(styles)
        .map(([prop, value]) => `  ${prop.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
        .join('\n');
      return `.c-${component.id} {\n${cssProps}\n}`;
    }
  },

  submitButton: {
    type: 'submitButton' as any,
    displayName: 'Submit Button',
    category: 'form' as const,
    icon: 'button',
    acceptsChildren: false,
    defaultProps: {
      text: 'Submit',
      disabled: false
    },
    defaultStyles: {
      base: {
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: '600',
        color: 'white',
        backgroundColor: '#5b21b6',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.2s'
      }
    },
    generateHTML: (component) => {
      const text = component.props.text || 'Submit';
      const disabled = component.props.disabled ? 'disabled' : '';
      return `<button class="c-${component.id}" id="${component.id}" type="submit" ${disabled}>${escapeHtml(text)}</button>`;
    },
    generateCSS: (component) => {
      const styles = component.props.style || component.styles?.base || {};
      const cssProps = Object.entries(styles)
        .map(([prop, value]) => `  ${prop.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
        .join('\n');
      return `.c-${component.id} {\n${cssProps}\n}\n.c-${component.id}:hover:not(:disabled) {\n  background-color: #4c1d95;\n  transform: translateY(-1px);\n}\n.c-${component.id}:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}`;
    }
  }
};