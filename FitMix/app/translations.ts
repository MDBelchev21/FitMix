export const translations = {
  en: {
    // Common
    welcome: 'Welcome',
    appName: 'FitMix',

    // Menu items
    menu: {
      workouts: {
        title: 'Workouts',
        description: 'Start your fitness journey'
      },
      progress: {
        title: 'Progress',
        description: 'Track your improvements'
      },
      nutrition: {
        title: 'Nutrition',
        description: 'Plan your healthy meals'
      },
      community: {
        title: 'Community',
        description: 'Connect with others'
      },
      settings: {
        title: 'Settings',
        description: 'Customize your experience'
      }
    },

    // Progress page
    progress: {
      title: 'Progress',
      totalWorkouts: 'Total Workouts Completed',
      progressLevel: 'Progress Level',
      muscles: {
        shoulders: 'Shoulders',
        biceps: 'Biceps',
        chest: 'Chest',
        triceps: 'Triceps',
        back: 'Back',
        abs: 'Abs',
        quads: 'Quads',
        calves: 'Calves'
      },
      levels: {
        excellent: 'Excellent (80-100%)',
        good: 'Good (60-79%)',
        average: 'Average (40-59%)',
        fair: 'Fair (20-39%)',
        needsWork: 'Needs Work (0-19%)'
      }
    },

    // Nutrition page
    nutrition: {
      title: 'Smart Meal Planner',
      ingredients: 'Enter your ingredients',
      generate: 'Generate Meal',
      loading: 'Generating your meal plan...',
      error: 'Error',
      noIngredients: 'Please enter some ingredients',
      updateFailed: 'Failed to generate meal plan',
      mealPlanner: 'Smart Meal Planner',
      enterIngredients: 'Enter ingredients separated by commas...',
      generating: 'Generating your meal plan...',
      nutritionalInfo: 'Nutritional Information',
      cookingInstructions: 'Cooking Instructions',
      benefits: 'Benefits',
      tryAgain: 'Try Again'
    }
  },
  bg: {
    // Common
    welcome: 'Добре дошли',
    appName: 'FitMix',

    // Menu items
    menu: {
      workouts: {
        title: 'Тренировки',
        description: 'Започнете вашето фитнес пътуване'
      },
      progress: {
        title: 'Прогрес',
        description: 'Проследете вашите подобрения'
      },
      nutrition: {
        title: 'Хранене',
        description: 'Планирайте здравословните си ястия'
      },
      community: {
        title: 'Общност',
        description: 'Свържете се с други'
      },
      settings: {
        title: 'Настройки',
        description: 'Персонализирайте вашето изживяване'
      }
    },

    // Progress page
    progress: {
      title: 'Прогрес',
      totalWorkouts: 'Общо завършени тренировки',
      progressLevel: 'Ниво на прогрес',
      muscles: {
        shoulders: 'Рамене',
        biceps: 'Бицепси',
        chest: 'Гърди',
        triceps: 'Трицепси',
        back: 'Гръб',
        abs: 'Коремни',
        quads: 'Бедра',
        calves: 'Прасци'
      },
      levels: {
        excellent: 'Отлично (80-100%)',
        good: 'Добро (60-79%)',
        average: 'Средно (40-59%)',
        fair: 'Задоволително (20-39%)',
        needsWork: 'Нуждае се от работа (0-19%)'
      }
    },

    // Nutrition page
    nutrition: {
      title: 'Умен планировчик на хранене',
      ingredients: 'Въведете вашите съставки',
      generate: 'Генерирай ястие',
      loading: 'Генериране на вашия хранителен план...',
      error: 'Грешка',
      noIngredients: 'Моля, въведете съставки',
      updateFailed: 'Грешка при генериране на хранителния план',
      mealPlanner: 'Умен планировчик на хранене',
      enterIngredients: 'Въведете съставки, разделени със запетаи...',
      generating: 'Генериране на вашия хранителен план...',
      nutritionalInfo: 'Хранителна информация',
      cookingInstructions: 'Инструкции за приготвяне',
      benefits: 'Ползи',
      tryAgain: 'Опитай отново'
    }
  }
} as const;

// Export type for type safety
export type TranslationType = typeof translations.en;
