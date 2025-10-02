export interface TutorialStep {
  id: string
  title: string
  description: string
  targetElement?: string // CSS selector for the element to highlight
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center'
  action?: {
    type: 'click' | 'drag' | 'type' | 'scroll' | 'wait'
    target?: string
    value?: any
  }
  validation?: {
    type: 'element-exists' | 'element-clicked' | 'value-equals' | 'custom'
    target?: string
    value?: any
    customValidator?: () => boolean
  }
  allowSkip?: boolean
  showNext?: boolean
  showPrevious?: boolean
  spotlight?: boolean // Whether to spotlight the target element
  spotlightPadding?: number
  onEnter?: () => void
  onExit?: () => void
  customContent?: any // For custom Vue components
  interactive?: boolean // Whether user can interact with highlighted elements
}

export interface Tutorial {
  id: string
  name: string
  description: string
  icon: string
  category: 'basic' | 'intermediate' | 'advanced' | 'power-user'
  duration: number // Estimated minutes
  steps: TutorialStep[]
  prerequisites?: string[] // IDs of other tutorials that should be completed first
  tags?: string[]
  completed?: boolean
  progress?: number // Percentage of completion
  lastAccessedAt?: Date
}

export interface TutorialCategory {
  id: string
  name: string
  description: string
  icon: string
  tutorials: string[] // Tutorial IDs
  order: number
}

export interface TutorialProgress {
  tutorialId: string
  currentStepIndex: number
  completed: boolean
  completedSteps: string[]
  startedAt: Date
  completedAt?: Date
  skipped?: boolean
}

export interface TutorialState {
  isActive: boolean
  currentTutorial: Tutorial | null
  currentStepIndex: number
  progress: Map<string, TutorialProgress>
  completedTutorials: Set<string>
  showLauncher: boolean
  minimized: boolean
  preferences: {
    autoStart: boolean
    showTooltips: boolean
    playSound: boolean
    theme: 'light' | 'dark' | 'auto'
  }
}