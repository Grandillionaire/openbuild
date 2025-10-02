import type { Tutorial, TutorialStep, TutorialProgress } from '@/types/tutorial'
import { nextTick } from 'vue'

export class TutorialEngine {
  private currentTutorial: Tutorial | null = null
  private currentStepIndex = 0
  private observers: Map<string, MutationObserver> = new Map()
  private eventListeners: Map<string, Function> = new Map()
  private onStepChange?: (step: TutorialStep, index: number) => void
  private onComplete?: () => void
  private onSkip?: () => void
  private onProgress?: (progress: number) => void

  constructor() {
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  async start(
    tutorial: Tutorial,
    options?: {
      onStepChange?: (step: TutorialStep, index: number) => void
      onComplete?: () => void
      onSkip?: () => void
      onProgress?: (progress: number) => void
      startFromStep?: number
    }
  ) {
    this.currentTutorial = tutorial
    this.currentStepIndex = options?.startFromStep ?? 0
    this.onStepChange = options?.onStepChange
    this.onComplete = options?.onComplete
    this.onSkip = options?.onSkip
    this.onProgress = options?.onProgress

    // Add keyboard listeners
    document.addEventListener('keydown', this.handleKeyPress)

    // Start first step
    await this.goToStep(this.currentStepIndex)
  }

  async stop() {
    this.cleanupObservers()
    this.cleanupEventListeners()
    document.removeEventListener('keydown', this.handleKeyPress)

    // Call exit handler for current step
    const currentStep = this.getCurrentStep()
    if (currentStep?.onExit) {
      currentStep.onExit()
    }

    this.currentTutorial = null
    this.currentStepIndex = 0
  }

  async nextStep() {
    if (!this.currentTutorial) return

    const currentStep = this.getCurrentStep()

    // Validate current step before proceeding
    if (currentStep?.validation && !await this.validateStep(currentStep)) {
      return false
    }

    // Call exit handler
    if (currentStep?.onExit) {
      currentStep.onExit()
    }

    if (this.currentStepIndex < this.currentTutorial.steps.length - 1) {
      this.currentStepIndex++
      await this.goToStep(this.currentStepIndex)
      return true
    } else {
      // Tutorial completed
      this.complete()
      return true
    }
  }

  async previousStep() {
    if (!this.currentTutorial || this.currentStepIndex === 0) return false

    const currentStep = this.getCurrentStep()

    // Call exit handler
    if (currentStep?.onExit) {
      currentStep.onExit()
    }

    this.currentStepIndex--
    await this.goToStep(this.currentStepIndex)
    return true
  }

  async goToStep(index: number) {
    if (!this.currentTutorial || index < 0 || index >= this.currentTutorial.steps.length) {
      return false
    }

    this.currentStepIndex = index
    const step = this.currentTutorial.steps[index]

    // Update progress
    const progress = ((index + 1) / this.currentTutorial.steps.length) * 100
    this.onProgress?.(progress)

    // Call enter handler
    if (step.onEnter) {
      step.onEnter()
    }

    // Wait for element to be available
    if (step.targetElement) {
      await this.waitForElement(step.targetElement)
    }

    // Setup validation observers if needed
    if (step.validation) {
      this.setupValidation(step)
    }

    // Perform automatic action if specified
    if (step.action?.type === 'wait') {
      setTimeout(() => this.nextStep(), step.action.value || 3000)
    }

    // Notify listeners
    this.onStepChange?.(step, index)

    return true
  }

  skip() {
    const currentStep = this.getCurrentStep()
    if (currentStep?.allowSkip !== false) {
      this.onSkip?.()
      this.stop()
    }
  }

  complete() {
    this.onComplete?.()
    this.stop()
  }

  getCurrentStep(): TutorialStep | null {
    if (!this.currentTutorial) return null
    return this.currentTutorial.steps[this.currentStepIndex] || null
  }

  getProgress(): number {
    if (!this.currentTutorial) return 0
    return ((this.currentStepIndex + 1) / this.currentTutorial.steps.length) * 100
  }

  getTotalSteps(): number {
    return this.currentTutorial?.steps.length || 0
  }

  getCurrentStepIndex(): number {
    return this.currentStepIndex
  }

  private async waitForElement(selector: string, timeout = 5000): Promise<HTMLElement | null> {
    const startTime = Date.now()

    while (Date.now() - startTime < timeout) {
      await nextTick()
      const element = document.querySelector(selector) as HTMLElement
      if (element) {
        return element
      }
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.warn(`Element ${selector} not found within timeout`)
    return null
  }

  private async validateStep(step: TutorialStep): Promise<boolean> {
    if (!step.validation) return true

    switch (step.validation.type) {
      case 'element-exists':
        return !!document.querySelector(step.validation.target!)

      case 'element-clicked':
        // This would be tracked by event listeners
        return true

      case 'value-equals':
        const element = document.querySelector(step.validation.target!) as HTMLInputElement
        return element?.value === step.validation.value

      case 'custom':
        return step.validation.customValidator?.() ?? true

      default:
        return true
    }
  }

  private setupValidation(step: TutorialStep) {
    if (!step.validation?.target) return

    const target = document.querySelector(step.validation.target)
    if (!target) return

    switch (step.validation.type) {
      case 'element-clicked':
        const clickHandler = () => {
          this.nextStep()
          target.removeEventListener('click', clickHandler)
        }
        target.addEventListener('click', clickHandler)
        this.eventListeners.set(`${step.id}-click`, clickHandler)
        break

      case 'value-equals':
        const inputHandler = (e: Event) => {
          const input = e.target as HTMLInputElement
          if (input.value === step.validation!.value) {
            this.nextStep()
            target.removeEventListener('input', inputHandler)
          }
        }
        target.addEventListener('input', inputHandler)
        this.eventListeners.set(`${step.id}-input`, inputHandler)
        break
    }
  }

  private cleanupObservers() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers.clear()
  }

  private cleanupEventListeners() {
    this.eventListeners.forEach((handler, key) => {
      const [stepId, event] = key.split('-')
      const step = this.currentTutorial?.steps.find(s => s.id === stepId)
      if (step?.validation?.target) {
        const target = document.querySelector(step.validation.target)
        target?.removeEventListener(event, handler as EventListener)
      }
    })
    this.eventListeners.clear()
  }

  private handleKeyPress(e: KeyboardEvent) {
    const currentStep = this.getCurrentStep()

    // ESC to skip/exit
    if (e.key === 'Escape' && currentStep?.allowSkip !== false) {
      this.skip()
    }

    // Arrow keys for navigation (if allowed)
    if (e.key === 'ArrowRight' && currentStep?.showNext !== false) {
      this.nextStep()
    }

    if (e.key === 'ArrowLeft' && currentStep?.showPrevious !== false) {
      this.previousStep()
    }
  }

  // Utility methods for common actions
  async highlightElement(selector: string) {
    const element = await this.waitForElement(selector)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return element
    }
    return null
  }

  async simulateClick(selector: string) {
    const element = await this.waitForElement(selector)
    if (element) {
      element.click()
      return true
    }
    return false
  }

  async simulateType(selector: string, text: string) {
    const element = await this.waitForElement(selector) as HTMLInputElement
    if (element) {
      element.focus()
      element.value = text
      element.dispatchEvent(new Event('input', { bubbles: true }))
      element.dispatchEvent(new Event('change', { bubbles: true }))
      return true
    }
    return false
  }
}