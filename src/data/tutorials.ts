import type { Tutorial, TutorialCategory } from '@/types/tutorial'

export const tutorialCategories: TutorialCategory[] = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'Learn the basics of OpenBuild',
    icon: 'rocket',
    tutorials: ['interface-overview', 'first-component', 'using-templates'],
    order: 1
  },
  {
    id: 'components',
    name: 'Working with Components',
    description: 'Master component creation and editing',
    icon: 'package',
    tutorials: ['drag-and-drop', 'component-properties', 'layout-components', 'content-components'],
    order: 2
  },
  {
    id: 'design',
    name: 'Design & Styling',
    description: 'Style your components like a pro',
    icon: 'palette',
    tutorials: ['styling-basics', 'responsive-design', 'themes', 'animations'],
    order: 3
  },
  {
    id: 'advanced',
    name: 'Advanced Features',
    description: 'Power user features for complex projects',
    icon: 'zap',
    tutorials: ['form-builder', 'multi-page', 'seo-optimization', 'custom-code'],
    order: 4
  }
]

export const tutorials: Tutorial[] = [
  // ============== GETTING STARTED ==============
  {
    id: 'interface-overview',
    name: 'Interface Overview',
    description: 'Get familiar with the OpenBuild interface',
    icon: 'layout',
    category: 'basic',
    duration: 3,
    tags: ['beginner', 'ui', 'interface'],
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to OpenBuild!',
        description: 'OpenBuild is a powerful visual website builder that lets you create professional websites without writing code. Let\'s explore the interface together!',
        placement: 'center',
        spotlight: false,
        showPrevious: false,
        allowSkip: true
      },
      {
        id: 'component-library',
        title: 'Component Library',
        description: 'This is your component library. All the building blocks for your website are here. You can drag any component onto the canvas to add it to your page.',
        targetElement: '.component-library',
        placement: 'right',
        spotlight: true,
        spotlightPadding: 16
      },
      {
        id: 'canvas-area',
        title: 'Canvas',
        description: 'This is your canvas - where you build your website. Drag components here and arrange them to create your perfect layout.',
        targetElement: '.canvas-container',
        placement: 'left',
        spotlight: true,
        spotlightPadding: 20
      },
      {
        id: 'property-editor',
        title: 'Property Editor',
        description: 'When you select a component, its properties appear here. You can customize everything from colors and fonts to spacing and animations.',
        targetElement: '.property-editor',
        placement: 'left',
        spotlight: true,
        spotlightPadding: 16
      },
      {
        id: 'header-toolbar',
        title: 'Toolbar',
        description: 'The toolbar gives you quick access to important actions like templates, saving, preview, and export options.',
        targetElement: '.app-header',
        placement: 'bottom',
        spotlight: true,
        spotlightPadding: 12
      },
      {
        id: 'viewport-controls',
        title: 'Responsive Preview',
        description: 'Switch between desktop, tablet, and mobile views to see how your site looks on different devices.',
        targetElement: '.viewport-controls',
        placement: 'bottom',
        spotlight: true
      },
      {
        id: 'complete',
        title: 'You\'re Ready to Build!',
        description: 'You now know the basics of the OpenBuild interface. Try dragging a component from the library to the canvas to get started!',
        placement: 'center',
        spotlight: false,
        showNext: false
      }
    ]
  },

  {
    id: 'first-component',
    name: 'Adding Your First Component',
    description: 'Learn how to add and edit components',
    icon: 'plus-square',
    category: 'basic',
    duration: 5,
    tags: ['beginner', 'components', 'editing'],
    steps: [
      {
        id: 'intro',
        title: 'Let\'s Add a Component!',
        description: 'In this tutorial, you\'ll learn how to add components to your page and customize them.',
        placement: 'center',
        showPrevious: false
      },
      {
        id: 'open-library',
        title: 'Find a Heading Component',
        description: 'Look for the "Heading" component in the Content section of the component library.',
        targetElement: '.component-library .category-content',
        placement: 'right',
        spotlight: true,
        interactive: true
      },
      {
        id: 'drag-component',
        title: 'Drag to Canvas',
        description: 'Click and drag the Heading component onto the canvas. Drop it in the center area.',
        targetElement: '.component-item[data-component="heading"]',
        placement: 'right',
        spotlight: true,
        interactive: true,
        action: {
          type: 'drag',
          target: '.canvas-drop-zone'
        }
      },
      {
        id: 'component-added',
        title: 'Great! Component Added',
        description: 'Your heading has been added to the canvas. Now click on it to select it.',
        targetElement: '.canvas-component[data-type="heading"]',
        placement: 'top',
        spotlight: true,
        interactive: true,
        validation: {
          type: 'element-clicked',
          target: '.canvas-component[data-type="heading"]'
        }
      },
      {
        id: 'edit-text',
        title: 'Edit the Text',
        description: 'With the heading selected, look at the property editor on the right. Change the text content to something custom.',
        targetElement: '.property-editor .content-section',
        placement: 'left',
        spotlight: true,
        interactive: true
      },
      {
        id: 'change-style',
        title: 'Style Your Heading',
        description: 'Scroll down to the Typography section and try changing the font size, color, or alignment.',
        targetElement: '.property-editor .typography-section',
        placement: 'left',
        spotlight: true,
        interactive: true
      },
      {
        id: 'complete',
        title: 'Excellent Work!',
        description: 'You\'ve successfully added and customized your first component. Keep exploring to build amazing websites!',
        placement: 'center',
        showNext: false
      }
    ]
  },

  {
    id: 'using-templates',
    name: 'Using Templates',
    description: 'Quick start with pre-built templates',
    icon: 'file-text',
    category: 'basic',
    duration: 4,
    tags: ['beginner', 'templates', 'quick-start'],
    steps: [
      {
        id: 'intro',
        title: 'Start with Templates',
        description: 'Templates are the fastest way to create a professional website. Let\'s explore how to use them.',
        placement: 'center',
        showPrevious: false
      },
      {
        id: 'open-templates',
        title: 'Open Template Gallery',
        description: 'Click the "Templates" button in the header to open the template gallery.',
        targetElement: '.header-btn-templates',
        placement: 'bottom',
        spotlight: true,
        interactive: true,
        validation: {
          type: 'element-clicked',
          target: '.header-btn-templates'
        }
      },
      {
        id: 'browse-templates',
        title: 'Browse Templates',
        description: 'Browse through different categories or search for specific template types. Each template includes pre-designed sections.',
        targetElement: '.template-gallery',
        placement: 'center',
        spotlight: true,
        interactive: true
      },
      {
        id: 'preview-template',
        title: 'Preview Before Using',
        description: 'Hover over any template to see a preview. Click "Use Template" when you find one you like.',
        targetElement: '.template-card',
        placement: 'top',
        spotlight: true,
        interactive: true
      },
      {
        id: 'customize-template',
        title: 'Make It Yours',
        description: 'After loading a template, customize it by editing text, changing colors, and replacing images to match your brand.',
        placement: 'center'
      },
      {
        id: 'section-templates',
        title: 'Section Templates',
        description: 'You can also add individual sections like Hero, Features, or Footer from the Blocks category in the component library.',
        targetElement: '.component-library .category-blocks',
        placement: 'right',
        spotlight: true
      },
      {
        id: 'complete',
        title: 'Template Master!',
        description: 'Templates save hours of design work. Mix and match sections from different templates to create unique designs!',
        placement: 'center',
        showNext: false
      }
    ]
  },

  // ============== COMPONENTS ==============
  {
    id: 'drag-and-drop',
    name: 'Drag and Drop Mastery',
    description: 'Master the drag and drop system',
    icon: 'move',
    category: 'intermediate',
    duration: 5,
    tags: ['components', 'interaction', 'layout'],
    steps: [
      {
        id: 'intro',
        title: 'Drag and Drop Like a Pro',
        description: 'Learn advanced drag and drop techniques to build layouts faster and more efficiently.',
        placement: 'center',
        showPrevious: false
      },
      {
        id: 'drag-basics',
        title: 'Drag from Library',
        description: 'Components can be dragged from the library. The canvas will show drop zones where you can place them.',
        targetElement: '.component-library',
        placement: 'right',
        spotlight: true
      },
      {
        id: 'drop-zones',
        title: 'Drop Zones',
        description: 'Blue highlights appear when dragging to show valid drop zones. Components can be nested inside containers.',
        targetElement: '.canvas-container',
        placement: 'top',
        spotlight: true
      },
      {
        id: 'reorder-components',
        title: 'Reorder Components',
        description: 'Select any component on the canvas and drag it to reorder. Use the Quick Actions bar for precise positioning.',
        targetElement: '.quick-actions-bar',
        placement: 'left',
        spotlight: true
      },
      {
        id: 'keyboard-shortcuts',
        title: 'Keyboard Shortcuts',
        description: 'Use Ctrl+D to duplicate, Delete to remove, and arrow keys with selected components for fine control.',
        placement: 'center'
      },
      {
        id: 'nested-components',
        title: 'Nesting Components',
        description: 'Containers, Sections, and layout components can hold other components. This creates structured, organized layouts.',
        targetElement: '.component-library .category-layout',
        placement: 'right',
        spotlight: true
      },
      {
        id: 'complete',
        title: 'Drag and Drop Master!',
        description: 'You now know all the drag and drop techniques. Practice makes perfect!',
        placement: 'center',
        showNext: false
      }
    ]
  },

  {
    id: 'component-properties',
    name: 'Component Properties',
    description: 'Deep dive into property editing',
    icon: 'settings',
    category: 'intermediate',
    duration: 8,
    tags: ['components', 'properties', 'customization'],
    steps: [
      {
        id: 'intro',
        title: 'Master Component Properties',
        description: 'Every component has properties you can customize. Let\'s explore all the options available.',
        placement: 'center',
        showPrevious: false
      },
      {
        id: 'select-component',
        title: 'Select a Component',
        description: 'Click any component on the canvas to see its properties in the editor panel.',
        targetElement: '.canvas-container',
        placement: 'left',
        spotlight: true,
        interactive: true
      },
      {
        id: 'content-properties',
        title: 'Content Properties',
        description: 'Edit text, links, images, and other content directly. These changes are instant.',
        targetElement: '.property-editor .content-section',
        placement: 'left',
        spotlight: true
      },
      {
        id: 'appearance-properties',
        title: 'Appearance',
        description: 'Control backgrounds, borders, shadows, and opacity. Use gradients for modern designs.',
        targetElement: '.property-editor .appearance-section',
        placement: 'left',
        spotlight: true
      },
      {
        id: 'layout-properties',
        title: 'Layout Options',
        description: 'Change display types, positioning, and dimensions. Flexbox and Grid options appear for containers.',
        targetElement: '.property-editor .layout-section',
        placement: 'left',
        spotlight: true
      },
      {
        id: 'spacing-properties',
        title: 'Spacing Control',
        description: 'Adjust padding and margin for perfect spacing. Use the visual editor or input exact values.',
        targetElement: '.property-editor .spacing-section',
        placement: 'left',
        spotlight: true
      },
      {
        id: 'typography-properties',
        title: 'Typography',
        description: 'Fine-tune fonts, sizes, weights, line heights, and more for perfect text styling.',
        targetElement: '.property-editor .typography-section',
        placement: 'left',
        spotlight: true
      },
      {
        id: 'effects-properties',
        title: 'Effects & Animations',
        description: 'Add hover effects, transitions, transforms, and filters for interactive designs.',
        targetElement: '.property-editor .effects-section',
        placement: 'left',
        spotlight: true
      },
      {
        id: 'complete',
        title: 'Property Expert!',
        description: 'You now understand all component properties. Combine them creatively for stunning designs!',
        placement: 'center',
        showNext: false
      }
    ]
  },

  {
    id: 'layout-components',
    name: 'Layout Components',
    description: 'Build responsive layouts with containers',
    icon: 'layout',
    category: 'intermediate',
    duration: 6,
    tags: ['layout', 'containers', 'grid', 'flexbox'],
    steps: [
      {
        id: 'intro',
        title: 'Layout Components',
        description: 'Layout components are the foundation of your design. Learn to use Containers, Sections, Grids, and Flexbox.',
        placement: 'center',
        showPrevious: false
      },
      {
        id: 'container-component',
        title: 'Container Component',
        description: 'Containers provide responsive max-width and center your content. Essential for professional layouts.',
        targetElement: '.component-library [data-component="container"]',
        placement: 'right',
        spotlight: true
      },
      {
        id: 'section-component',
        title: 'Section Component',
        description: 'Sections span full width and group related content. Use them to create distinct page areas.',
        targetElement: '.component-library [data-component="section"]',
        placement: 'right',
        spotlight: true
      },
      {
        id: 'grid-component',
        title: 'Grid Component',
        description: 'Create multi-column layouts easily. Adjust columns and gaps in the property editor.',
        targetElement: '.component-library [data-component="grid"]',
        placement: 'right',
        spotlight: true
      },
      {
        id: 'flex-component',
        title: 'Flex Component',
        description: 'Flexbox containers offer precise control over alignment and distribution of child elements.',
        targetElement: '.component-library [data-component="flex"]',
        placement: 'right',
        spotlight: true
      },
      {
        id: 'nesting-layouts',
        title: 'Nesting Layouts',
        description: 'Combine layout components: Section > Container > Grid > Content for professional structures.',
        placement: 'center'
      },
      {
        id: 'responsive-layouts',
        title: 'Responsive by Default',
        description: 'Layout components automatically adapt to different screen sizes. Customize per device in the Responsive Editor.',
        targetElement: '.viewport-controls',
        placement: 'bottom',
        spotlight: true
      },
      {
        id: 'complete',
        title: 'Layout Master!',
        description: 'Great layouts are the foundation of great designs. Practice combining these components!',
        placement: 'center',
        showNext: false
      }
    ]
  },

  {
    id: 'content-components',
    name: 'Content Components',
    description: 'Add text, buttons, images, and more',
    icon: 'type',
    category: 'intermediate',
    duration: 5,
    tags: ['content', 'text', 'media', 'buttons'],
    steps: [
      {
        id: 'intro',
        title: 'Content Components',
        description: 'Content components bring your website to life with text, images, buttons, and interactive elements.',
        placement: 'center',
        showPrevious: false
      },
      {
        id: 'heading-component',
        title: 'Headings',
        description: 'Use headings (H1-H6) to create hierarchy. H1 for main titles, H2 for sections, etc.',
        targetElement: '.component-library [data-component="heading"]',
        placement: 'right',
        spotlight: true
      },
      {
        id: 'text-component',
        title: 'Text Blocks',
        description: 'Text components for paragraphs and body content. Supports rich formatting.',
        targetElement: '.component-library [data-component="text"]',
        placement: 'right',
        spotlight: true
      },
      {
        id: 'button-component',
        title: 'Buttons',
        description: 'Interactive buttons with hover effects. Link them to pages, sections, or external URLs.',
        targetElement: '.component-library [data-component="button"]',
        placement: 'right',
        spotlight: true
      },
      {
        id: 'image-component',
        title: 'Images',
        description: 'Add images with various display options. Upload your own or use URLs.',
        targetElement: '.component-library [data-component="image"]',
        placement: 'right',
        spotlight: true
      },
      {
        id: 'icon-component',
        title: 'Icons',
        description: 'Choose from hundreds of icons to enhance your design.',
        targetElement: '.component-library [data-component="icon"]',
        placement: 'right',
        spotlight: true
      },
      {
        id: 'complete',
        title: 'Content Ready!',
        description: 'Combine these components creatively to tell your story effectively!',
        placement: 'center',
        showNext: false
      }
    ]
  },

  // ============== DESIGN & STYLING ==============
  {
    id: 'styling-basics',
    name: 'Styling Basics',
    description: 'Learn to style components',
    icon: 'palette',
    category: 'intermediate',
    duration: 7,
    tags: ['design', 'styling', 'colors', 'typography'],
    steps: [
      {
        id: 'intro',
        title: 'Styling Your Components',
        description: 'Transform plain components into beautiful designs with colors, typography, and effects.',
        placement: 'center',
        showPrevious: false
      },
      {
        id: 'colors',
        title: 'Colors & Backgrounds',
        description: 'Set solid colors, gradients, or images as backgrounds. Use the color picker for precise control.',
        targetElement: '.property-editor .background-control',
        placement: 'left',
        spotlight: true
      },
      {
        id: 'borders',
        title: 'Borders & Radius',
        description: 'Add borders with custom width, style, and color. Round corners with border radius.',
        targetElement: '.property-editor .border-control',
        placement: 'left',
        spotlight: true
      },
      {
        id: 'shadows',
        title: 'Shadows',
        description: 'Add depth with box shadows. Choose from presets or create custom shadows.',
        targetElement: '.property-editor .shadow-control',
        placement: 'left',
        spotlight: true
      },
      {
        id: 'typography',
        title: 'Typography',
        description: 'Choose fonts, sizes, weights, and spacing. Good typography is crucial for readability.',
        targetElement: '.property-editor .typography-section',
        placement: 'left',
        spotlight: true
      },
      {
        id: 'hover-states',
        title: 'Hover Effects',
        description: 'Make elements interactive with hover states. Change colors, scale, or add transitions.',
        targetElement: '.property-editor .hover-state-toggle',
        placement: 'left',
        spotlight: true
      },
      {
        id: 'quick-styles',
        title: 'Quick Style Switcher',
        description: 'Apply pre-designed styles instantly with the Quick Style Switcher.',
        targetElement: '.quick-style-switcher',
        placement: 'left',
        spotlight: true
      },
      {
        id: 'complete',
        title: 'Styling Pro!',
        description: 'Great design is in the details. Experiment with different combinations!',
        placement: 'center',
        showNext: false
      }
    ]
  },

  {
    id: 'responsive-design',
    name: 'Responsive Design',
    description: 'Create mobile-friendly websites',
    icon: 'smartphone',
    category: 'intermediate',
    duration: 6,
    tags: ['responsive', 'mobile', 'tablet', 'adaptive'],
    steps: [
      {
        id: 'intro',
        title: 'Responsive Design',
        description: 'Make your website look perfect on all devices - desktop, tablet, and mobile.',
        placement: 'center',
        showPrevious: false
      },
      {
        id: 'viewport-switcher',
        title: 'Device Preview',
        description: 'Switch between desktop, tablet, and mobile views to see how your site adapts.',
        targetElement: '.viewport-controls',
        placement: 'bottom',
        spotlight: true,
        interactive: true
      },
      {
        id: 'responsive-editor',
        title: 'Responsive Editor',
        description: 'Click the responsive icon to set device-specific styles. Changes only apply to selected device sizes.',
        targetElement: '.responsive-editor-toggle',
        placement: 'left',
        spotlight: true
      },
      {
        id: 'device-visibility',
        title: 'Show/Hide on Devices',
        description: 'Control component visibility per device. Hide desktop menus on mobile, or show mobile-only elements.',
        targetElement: '.device-visibility-controls',
        placement: 'left',
        spotlight: true
      },
      {
        id: 'responsive-spacing',
        title: 'Responsive Spacing',
        description: 'Adjust padding and margins for each device size. Smaller spacing on mobile for better use of space.',
        targetElement: '.responsive-spacing-controls',
        placement: 'left',
        spotlight: true
      },
      {
        id: 'mobile-first',
        title: 'Mobile-First Approach',
        description: 'Design for mobile first, then enhance for larger screens. This ensures great mobile experience.',
        placement: 'center'
      },
      {
        id: 'test-all-sizes',
        title: 'Test Everything',
        description: 'Always preview your design on all device sizes before publishing.',
        targetElement: '.viewport-controls',
        placement: 'bottom',
        spotlight: true
      },
      {
        id: 'complete',
        title: 'Responsive Expert!',
        description: 'Your websites will now look amazing on every device!',
        placement: 'center',
        showNext: false
      }
    ]
  },

  {
    id: 'themes',
    name: 'Using Themes',
    description: 'Apply and customize themes',
    icon: 'brush',
    category: 'intermediate',
    duration: 5,
    tags: ['themes', 'design', 'colors', 'branding'],
    steps: [
      {
        id: 'intro',
        title: 'Theme System',
        description: 'Themes provide consistent colors, typography, and spacing across your entire website.',
        placement: 'center',
        showPrevious: false
      },
      {
        id: 'open-themes',
        title: 'Theme Selector',
        description: 'Click the theme button to see available themes.',
        targetElement: '.header-btn-theme',
        placement: 'bottom',
        spotlight: true,
        interactive: true
      },
      {
        id: 'browse-themes',
        title: 'Browse Themes',
        description: 'Choose from Default, Dark, Corporate, Playful, or Minimal themes. Each has unique personality.',
        targetElement: '.theme-selector',
        placement: 'center',
        spotlight: true,
        interactive: true
      },
      {
        id: 'apply-theme',
        title: 'Apply a Theme',
        description: 'Click any theme to apply it instantly. All components update to match.',
        targetElement: '.theme-option',
        placement: 'top',
        spotlight: true,
        interactive: true
      },
      {
        id: 'customize-theme',
        title: 'Customize Colors',
        description: 'Adjust theme colors to match your brand. Changes apply globally.',
        targetElement: '.theme-customizer',
        placement: 'left',
        spotlight: true
      },
      {
        id: 'design-tokens',
        title: 'Design Tokens',
        description: 'Themes use design tokens for colors, spacing, and typography. This ensures consistency.',
        placement: 'center'
      },
      {
        id: 'complete',
        title: 'Theme Master!',
        description: 'Themes save time and ensure professional, consistent designs!',
        placement: 'center',
        showNext: false
      }
    ]
  },

  {
    id: 'animations',
    name: 'Adding Animations',
    description: 'Bring your site to life with animations',
    icon: 'play-circle',
    category: 'advanced',
    duration: 8,
    tags: ['animations', 'effects', 'interactions', 'motion'],
    steps: [
      {
        id: 'intro',
        title: 'Animation System',
        description: 'Add professional animations to make your website engaging and interactive.',
        placement: 'center',
        showPrevious: false
      },
      {
        id: 'open-animator',
        title: 'Animation Editor',
        description: 'Select a component and click the animation icon to open the animation editor.',
        targetElement: '.animation-editor-toggle',
        placement: 'left',
        spotlight: true,
        interactive: true
      },
      {
        id: 'animation-presets',
        title: 'Animation Presets',
        description: 'Choose from fade, slide, zoom, rotate, and bounce animations. Preview them instantly.',
        targetElement: '.animation-presets',
        placement: 'center',
        spotlight: true
      },
      {
        id: 'animation-triggers',
        title: 'Animation Triggers',
        description: 'Set when animations play: on page load, scroll into view, hover, or click.',
        targetElement: '.animation-triggers',
        placement: 'left',
        spotlight: true
      },
      {
        id: 'animation-timeline',
        title: 'Timeline Editor',
        description: 'Fine-tune timing with the visual timeline. Adjust duration, delay, and easing.',
        targetElement: '.animation-timeline',
        placement: 'bottom',
        spotlight: true
      },
      {
        id: 'animation-preview',
        title: 'Preview Animations',
        description: 'Use playback controls to preview your animation. Make adjustments until perfect.',
        targetElement: '.animation-preview-controls',
        placement: 'top',
        spotlight: true
      },
      {
        id: 'scroll-animations',
        title: 'Scroll Animations',
        description: 'Scroll-triggered animations create engaging experiences as users explore your page.',
        placement: 'center'
      },
      {
        id: 'performance-tip',
        title: 'Performance Tip',
        description: 'Use animations sparingly. Too many can slow down your site and distract users.',
        placement: 'center'
      },
      {
        id: 'complete',
        title: 'Animation Expert!',
        description: 'Your websites will now come to life with smooth, professional animations!',
        placement: 'center',
        showNext: false
      }
    ]
  },

  // ============== ADVANCED FEATURES ==============
  {
    id: 'form-builder',
    name: 'Form Builder',
    description: 'Create contact and signup forms',
    icon: 'file-input',
    category: 'advanced',
    duration: 7,
    tags: ['forms', 'input', 'contact', 'advanced'],
    steps: [
      {
        id: 'intro',
        title: 'Form Builder',
        description: 'Create professional forms for contact, newsletter signups, and more.',
        placement: 'center',
        showPrevious: false
      },
      {
        id: 'open-form-builder',
        title: 'Access Form Builder',
        description: 'Find the Form Builder in the component library under the Forms section.',
        targetElement: '.form-builder-toggle',
        placement: 'right',
        spotlight: true,
        interactive: true
      },
      {
        id: 'form-templates',
        title: 'Form Templates',
        description: 'Start with templates: Contact, Newsletter, Login, Registration, or build custom.',
        targetElement: '.form-templates',
        placement: 'center',
        spotlight: true
      },
      {
        id: 'add-fields',
        title: 'Add Form Fields',
        description: 'Drag form elements like Input, Textarea, Select, Checkbox, and Radio buttons.',
        targetElement: '.form-elements',
        placement: 'right',
        spotlight: true
      },
      {
        id: 'field-properties',
        title: 'Field Settings',
        description: 'Configure field properties: labels, placeholders, validation rules, and required status.',
        targetElement: '.field-properties',
        placement: 'left',
        spotlight: true
      },
      {
        id: 'form-settings',
        title: 'Form Configuration',
        description: 'Set form action URL, method (POST/GET), and success messages.',
        targetElement: '.form-settings',
        placement: 'left',
        spotlight: true
      },
      {
        id: 'form-styling',
        title: 'Style Your Form',
        description: 'Customize form appearance to match your design.',
        targetElement: '.form-styling-options',
        placement: 'left',
        spotlight: true
      },
      {
        id: 'complete',
        title: 'Form Builder Pro!',
        description: 'You can now create any type of form for your website!',
        placement: 'center',
        showNext: false
      }
    ]
  },

  {
    id: 'multi-page',
    name: 'Multi-Page Websites',
    description: 'Create websites with multiple pages',
    icon: 'files',
    category: 'advanced',
    duration: 6,
    tags: ['pages', 'navigation', 'multi-page', 'advanced'],
    steps: [
      {
        id: 'intro',
        title: 'Multi-Page Websites',
        description: 'Build complete websites with multiple pages and navigation.',
        placement: 'center',
        showPrevious: false
      },
      {
        id: 'open-pages',
        title: 'Pages Manager',
        description: 'Click the Pages button to manage your website pages.',
        targetElement: '.header-btn-pages',
        placement: 'bottom',
        spotlight: true,
        interactive: true
      },
      {
        id: 'create-page',
        title: 'Create New Page',
        description: 'Add pages like About, Services, Contact, etc. Each page has its own content.',
        targetElement: '.add-page-button',
        placement: 'right',
        spotlight: true
      },
      {
        id: 'page-settings',
        title: 'Page Settings',
        description: 'Configure page name, URL path, and SEO settings for each page.',
        targetElement: '.page-settings',
        placement: 'left',
        spotlight: true
      },
      {
        id: 'navigation-menu',
        title: 'Navigation Menus',
        description: 'Create header and footer navigation menus that link to your pages.',
        targetElement: '.navigation-editor',
        placement: 'left',
        spotlight: true
      },
      {
        id: 'switch-pages',
        title: 'Switch Between Pages',
        description: 'Click any page to edit its content. Changes are saved per page.',
        targetElement: '.page-list',
        placement: 'right',
        spotlight: true
      },
      {
        id: 'home-page',
        title: 'Set Home Page',
        description: 'Designate which page loads first when visitors arrive.',
        targetElement: '.set-home-button',
        placement: 'right',
        spotlight: true
      },
      {
        id: 'complete',
        title: 'Multi-Page Master!',
        description: 'You can now build complete multi-page websites!',
        placement: 'center',
        showNext: false
      }
    ]
  },

  {
    id: 'seo-optimization',
    name: 'SEO Optimization',
    description: 'Optimize for search engines',
    icon: 'search',
    category: 'advanced',
    duration: 5,
    tags: ['seo', 'optimization', 'meta', 'advanced'],
    steps: [
      {
        id: 'intro',
        title: 'SEO Optimization',
        description: 'Make your website discoverable by optimizing for search engines.',
        placement: 'center',
        showPrevious: false
      },
      {
        id: 'open-seo',
        title: 'SEO Panel',
        description: 'Click the SEO button to open optimization settings.',
        targetElement: '.header-btn-seo',
        placement: 'bottom',
        spotlight: true,
        interactive: true
      },
      {
        id: 'page-title',
        title: 'Page Title',
        description: 'Write compelling titles under 60 characters. This appears in search results.',
        targetElement: '.seo-title-input',
        placement: 'left',
        spotlight: true
      },
      {
        id: 'meta-description',
        title: 'Meta Description',
        description: 'Describe your page in 160 characters. This is your search result preview text.',
        targetElement: '.seo-description-input',
        placement: 'left',
        spotlight: true
      },
      {
        id: 'keywords',
        title: 'Keywords',
        description: 'Add relevant keywords that describe your content.',
        targetElement: '.seo-keywords-input',
        placement: 'left',
        spotlight: true
      },
      {
        id: 'social-preview',
        title: 'Social Media Preview',
        description: 'Configure how your site appears when shared on social media.',
        targetElement: '.social-preview',
        placement: 'left',
        spotlight: true
      },
      {
        id: 'structured-headings',
        title: 'Use Proper Headings',
        description: 'Use H1 for main titles, H2 for sections. This helps search engines understand your content.',
        placement: 'center'
      },
      {
        id: 'complete',
        title: 'SEO Ready!',
        description: 'Your website is now optimized for search engines!',
        placement: 'center',
        showNext: false
      }
    ]
  },

  {
    id: 'custom-code',
    name: 'Custom Code',
    description: 'Add custom HTML, CSS, and JavaScript',
    icon: 'code',
    category: 'power-user',
    duration: 6,
    tags: ['code', 'custom', 'html', 'css', 'javascript'],
    steps: [
      {
        id: 'intro',
        title: 'Custom Code',
        description: 'Extend OpenBuild with custom HTML, CSS, and JavaScript for advanced functionality.',
        placement: 'center',
        showPrevious: false
      },
      {
        id: 'code-viewer',
        title: 'View Generated Code',
        description: 'See the HTML and CSS generated for your design. Great for learning!',
        targetElement: '.header-btn-code',
        placement: 'bottom',
        spotlight: true
      },
      {
        id: 'global-code',
        title: 'Global Code Editor',
        description: 'Add custom CSS and JavaScript that applies to your entire site.',
        targetElement: '.header-btn-global-code',
        placement: 'bottom',
        spotlight: true
      },
      {
        id: 'custom-css',
        title: 'Custom CSS',
        description: 'Override styles or add new CSS classes. Use browser DevTools to find selectors.',
        targetElement: '.global-css-editor',
        placement: 'center',
        spotlight: true
      },
      {
        id: 'custom-js',
        title: 'Custom JavaScript',
        description: 'Add interactivity, analytics, or third-party integrations with JavaScript.',
        targetElement: '.global-js-editor',
        placement: 'center',
        spotlight: true
      },
      {
        id: 'head-injection',
        title: 'Head HTML',
        description: 'Add meta tags, fonts, or external scripts to the document head.',
        targetElement: '.head-html-editor',
        placement: 'center',
        spotlight: true
      },
      {
        id: 'export-clean',
        title: 'Clean Export',
        description: 'When you export, all custom code is included in production-ready files.',
        placement: 'center'
      },
      {
        id: 'complete',
        title: 'Code Master!',
        description: 'You now have complete control over your website\'s code!',
        placement: 'center',
        showNext: false
      }
    ]
  }
]

// Helper function to get tutorials by category
export function getTutorialsByCategory(categoryId: string): Tutorial[] {
  const category = tutorialCategories.find(c => c.id === categoryId)
  if (!category) return []
  return tutorials.filter(t => category.tutorials.includes(t.id))
}

// Helper function to get tutorial by ID
export function getTutorialById(id: string): Tutorial | undefined {
  return tutorials.find(t => t.id === id)
}

// Helper function to check if tutorial has prerequisites met
export function arePrerequisitesMet(
  tutorialId: string,
  completedTutorials: Set<string>
): boolean {
  const tutorial = getTutorialById(tutorialId)
  if (!tutorial?.prerequisites) return true
  return tutorial.prerequisites.every(prereq => completedTutorials.has(prereq))
}

// Helper function to get next recommended tutorial
export function getNextRecommendedTutorial(
  completedTutorials: Set<string>
): Tutorial | undefined {
  // Find first uncompleted tutorial with met prerequisites
  for (const category of tutorialCategories) {
    const categoryTutorials = getTutorialsByCategory(category.id)
    for (const tutorial of categoryTutorials) {
      if (!completedTutorials.has(tutorial.id) &&
          arePrerequisitesMet(tutorial.id, completedTutorials)) {
        return tutorial
      }
    }
  }
  return undefined
}