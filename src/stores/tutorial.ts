import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Tutorial, TutorialStep, TutorialProgress, TutorialState } from '@/types/tutorial'
import { tutorials, getTutorialById, getNextRecommendedTutorial } from '@/data/tutorials'
import { TutorialEngine } from '@/services/tutorialEngine'

export const useTutorialStore = defineStore('tutorial', () => {
  // State
  const isActive = ref(false)
  const currentTutorial = ref<Tutorial | null>(null)
  const currentStepIndex = ref(0)
  const currentStep = ref<TutorialStep | null>(null)
  const progress = ref<Map<string, TutorialProgress>>(new Map())
  const completedTutorials = ref<Set<string>>(new Set())
  const showLauncher = ref(false)
  const minimized = ref(false)
  const canProceed = ref(true)

  // Preferences
  const preferences = ref({
    autoStart: true,
    showTooltips: true,
    playSound: false,
    theme: 'auto' as 'light' | 'dark' | 'auto',
    neverShowAgain: false
  })

  // Tutorial engine instance
  let engine: TutorialEngine | null = null

  // Computed
  const totalSteps = computed(() => currentTutorial.value?.steps.length || 0)

  const currentProgress = computed(() => {
    if (!currentTutorial.value) return 0
    return ((currentStepIndex.value + 1) / totalSteps.value) * 100
  })

  const hasCompletedTutorial = computed(() => (tutorialId: string) => {
    return completedTutorials.value.has(tutorialId)
  })

  const getTutorialProgress = computed(() => (tutorialId: string) => {
    return progress.value.get(tutorialId)
  })

  const nextRecommendedTutorial = computed(() => {
    return getNextRecommendedTutorial(completedTutorials.value)
  })

  const isFirstTime = computed(() => {
    return completedTutorials.value.size === 0 && !preferences.value.neverShowAgain
  })

  // Actions
  async function startTutorial(tutorialId: string, startFromStep = 0) {
    const tutorial = getTutorialById(tutorialId)
    if (!tutorial) return

    // Stop current tutorial if any
    if (engine) {
      await engine.stop()
    }

    // Initialize new tutorial
    currentTutorial.value = tutorial
    currentStepIndex.value = startFromStep
    isActive.value = true
    minimized.value = false
    showLauncher.value = false

    // Create progress entry
    const tutorialProgress: TutorialProgress = {
      tutorialId,
      currentStepIndex: startFromStep,
      completed: false,
      completedSteps: [],
      startedAt: new Date()
    }
    progress.value.set(tutorialId, tutorialProgress)

    // Start tutorial engine
    engine = new TutorialEngine()
    await engine.start(tutorial, {
      startFromStep,
      onStepChange: (step, index) => {
        currentStep.value = step
        currentStepIndex.value = index
        updateProgress(tutorialId, index)
      },
      onComplete: () => {
        completeTutorial(tutorialId)
      },
      onSkip: () => {
        skipTutorial(tutorialId)
      },
      onProgress: (progressValue) => {
        // Update progress percentage
        const tutProgress = progress.value.get(tutorialId)
        if (tutProgress) {
          tutProgress.currentStepIndex = currentStepIndex.value
        }
      }
    })

    // Set first step
    if (tutorial.steps[startFromStep]) {
      currentStep.value = tutorial.steps[startFromStep]
    }

    // Save to localStorage
    saveProgress()
  }

  async function nextStep() {
    if (!engine) return
    const success = await engine.nextStep()
    if (success) {
      saveProgress()
    }
  }

  async function previousStep() {
    if (!engine) return
    const success = await engine.previousStep()
    if (success) {
      saveProgress()
    }
  }

  async function goToStep(index: number) {
    if (!engine) return
    const success = await engine.goToStep(index)
    if (success) {
      currentStepIndex.value = index
      currentStep.value = currentTutorial.value?.steps[index] || null
      saveProgress()
    }
  }

  function skipTutorial(tutorialId?: string) {
    const id = tutorialId || currentTutorial.value?.id
    if (!id) return

    const tutProgress = progress.value.get(id)
    if (tutProgress) {
      tutProgress.skipped = true
    }

    stopTutorial()
    saveProgress()
  }

  function completeTutorial(tutorialId?: string) {
    const id = tutorialId || currentTutorial.value?.id
    if (!id) return

    // Mark as completed
    completedTutorials.value.add(id)

    // Update progress
    const tutProgress = progress.value.get(id)
    if (tutProgress) {
      tutProgress.completed = true
      tutProgress.completedAt = new Date()
    }

    stopTutorial()
    saveProgress()

    // Show next recommended tutorial after a delay
    setTimeout(() => {
      const next = nextRecommendedTutorial.value
      if (next && preferences.value.autoStart) {
        showLauncher.value = true
      }
    }, 2000)
  }

  async function stopTutorial() {
    if (engine) {
      await engine.stop()
      engine = null
    }

    isActive.value = false
    currentTutorial.value = null
    currentStep.value = null
    currentStepIndex.value = 0
    minimized.value = false
  }

  function toggleLauncher() {
    showLauncher.value = !showLauncher.value
  }

  function toggleMinimized() {
    minimized.value = !minimized.value
  }

  function updateProgress(tutorialId: string, stepIndex: number) {
    const tutProgress = progress.value.get(tutorialId)
    if (tutProgress) {
      tutProgress.currentStepIndex = stepIndex
      if (!tutProgress.completedSteps.includes(currentTutorial.value?.steps[stepIndex]?.id || '')) {
        tutProgress.completedSteps.push(currentTutorial.value?.steps[stepIndex]?.id || '')
      }
    }
    saveProgress()
  }

  function setCanProceed(value: boolean) {
    canProceed.value = value
  }

  function updatePreferences(newPreferences: Partial<typeof preferences.value>) {
    preferences.value = { ...preferences.value, ...newPreferences }
    saveProgress()
  }

  function resetAllProgress() {
    progress.value.clear()
    completedTutorials.value.clear()
    localStorage.removeItem('tutorial_progress')
    localStorage.removeItem('tutorial_preferences')
  }

  // Persistence
  function saveProgress() {
    localStorage.setItem('tutorial_progress', JSON.stringify({
      completedTutorials: Array.from(completedTutorials.value),
      progress: Array.from(progress.value.entries())
    }))
    localStorage.setItem('tutorial_preferences', JSON.stringify(preferences.value))
  }

  function loadProgress() {
    try {
      const savedProgress = localStorage.getItem('tutorial_progress')
      if (savedProgress) {
        const data = JSON.parse(savedProgress)
        completedTutorials.value = new Set(data.completedTutorials || [])
        progress.value = new Map(data.progress || [])
      }

      const savedPreferences = localStorage.getItem('tutorial_preferences')
      if (savedPreferences) {
        preferences.value = { ...preferences.value, ...JSON.parse(savedPreferences) }
      }
    } catch (error) {
      console.error('Failed to load tutorial progress:', error)
    }
  }

  // Initialize on store creation
  loadProgress()

  // Check if we should show the launcher on first visit
  if (isFirstTime.value && preferences.value.autoStart) {
    // Delay showing launcher to let the app initialize
    setTimeout(() => {
      showLauncher.value = true
    }, 1500)
  }

  return {
    // State
    isActive,
    currentTutorial,
    currentStep,
    currentStepIndex,
    progress,
    completedTutorials,
    showLauncher,
    minimized,
    canProceed,
    preferences,

    // Computed
    totalSteps,
    currentProgress,
    hasCompletedTutorial,
    getTutorialProgress,
    nextRecommendedTutorial,
    isFirstTime,

    // Actions
    startTutorial,
    nextStep,
    previousStep,
    goToStep,
    skipTutorial,
    completeTutorial,
    stopTutorial,
    toggleLauncher,
    toggleMinimized,
    updateProgress,
    setCanProceed,
    updatePreferences,
    resetAllProgress,
    saveProgress,
    loadProgress
  }
})