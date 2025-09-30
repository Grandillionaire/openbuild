export interface Component {
  id: string;
  type: ComponentType;
  displayName: string;
  props: ComponentProps;
  styles: ResponsiveStyles;
  children?: Component[];
  parent?: string;
  locked?: boolean;
}

export interface CustomCode {
  css?: string;
  javascript?: string;
  beforeMount?: string;
  onMount?: string;
  onClick?: string;
  onHover?: string;
  onScroll?: string;
}

export interface ComponentProps {
  content?: string | Record<string, any>;
  attributes?: Record<string, string>;
  settings?: {
    visible?: boolean;
    animation?: AnimationSettings;
  };
  animations?: Animation[];
  customCode?: CustomCode;
  style?: CSSProperties;
  responsiveStyles?: Record<string, CSSProperties>;
  className?: string;
  [key: string]: any;
}

export interface ResponsiveStyles {
  base: CSSProperties;
  sm?: CSSProperties;
  md?: CSSProperties;
  lg?: CSSProperties;
  xl?: CSSProperties;
  [key: string]: CSSProperties | undefined;
}

export interface CSSProperties {
  [key: string]: string | number;
}

export type ComponentType =
  | 'container' | 'section' | 'grid' | 'flex' | 'spacer'
  | 'heading' | 'text' | 'button' | 'link' | 'image'
  | 'hero' | 'features' | 'cta' | 'footer' | 'navigation'
  | 'form' | 'input' | 'textarea' | 'select' | 'checkbox'
  | 'radio' | 'label' | 'formGroup' | 'submitButton';

export interface ComponentVariant {
  id: string;
  name: string;
  styles: ResponsiveStyles;
  props?: Partial<ComponentProps>;
  isDefault?: boolean;
}

export interface ComponentDefinition {
  type: ComponentType;
  displayName: string;
  category: 'layout' | 'content' | 'media' | 'blocks';
  icon: string;
  defaultProps: ComponentProps;
  defaultStyles: ResponsiveStyles;
  acceptsChildren?: boolean;
  maxChildren?: number;
  variants?: ComponentVariant[];
  supportsTheme?: boolean;
  generateHTML: (component: Component) => string;
  generateCSS: (component: Component) => string;
}

export interface AnimationKeyframe {
  time: number; // 0-1
  properties: {
    transform?: string;
    opacity?: number;
    scale?: number;
    rotate?: number;
    translateX?: string;
    translateY?: string;
    // Additional properties
    [key: string]: string | number | undefined;
  };
}

export interface Animation {
  id: string;
  name: string;
  trigger: 'onLoad' | 'onScroll' | 'onHover' | 'onClick' | 'continuous';
  timeline: AnimationKeyframe[];
  options: {
    duration: number;
    delay: number;
    easing: string;
    loop?: boolean;
    direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  };
  scrollOptions?: {
    threshold?: number; // 0-1, when to trigger
    rootMargin?: string;
  };
}

export interface AnimationSettings {
  type?: 'fade' | 'slide' | 'scale' | 'bounce';
  duration?: number;
  delay?: number;
  easing?: string;
}