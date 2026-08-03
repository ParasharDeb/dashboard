export type PriorityLevel = 'low' | 'medium' | 'high';
export type TodoStatus = 'pending' | 'in_progress' | 'completed';

export interface ITodo {
  _id: string;
  title: string;
  description?: string;
  priority: PriorityLevel;
  status: TodoStatus;
  dueDate?: string;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface IRoutineHistory {
  date: string;
  completed: boolean;
  value: number;
}

export interface IRoutine {
  _id: string;
  title: string;
  category: string;
  timeOfDay: TimeOfDay;
  targetValue: number;
  unit: string;
  history?: IRoutineHistory[];
  completedToday?: boolean;
  valueToday?: number;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface INutritionLog {
  _id: string;
  date: string;
  mealType: MealType;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface INutritionGoal {
  _id?: string;
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
}

export interface IWeightLog {
  _id: string;
  date: string;
  weight: number;
  unit: 'kg' | 'lbs';
  notes?: string;
}

export interface IWeightStats {
  latest: number | null;
  starting: number | null;
  min: number | null;
  max: number | null;
  avg: number | null;
  change: number;
  count: number;
}

export interface IBirthday {
  _id: string;
  name: string;
  dateOfBirth: string;
  relationship: string;
  notes?: string;
  avatarUrl?: string;
  daysRemaining?: number;
  turningAge?: number;
  isToday?: boolean;
  isThisWeek?: boolean;
  zodiac?: string;
}

export interface IDashboardSummary {
  todos: {
    total: number;
    pending: number;
    completed: number;
    highPriority: number;
  };
  routines: {
    total: number;
    completedToday: number;
    completionRate: number;
  };
  nutrition: {
    caloriesToday: number;
    calorieGoal: number;
    proteinToday: number;
    proteinGoal: number;
  };
  weight: {
    latest: number | null;
    change: number;
    unit: 'kg' | 'lbs';
  };
  upcomingBirthdays: {
    _id: string;
    name: string;
    relationship: string;
    daysRemaining: number;
    turningAge: number;
    isToday: boolean;
  }[];
}

export interface IParsedRecord<T> {
  id: string;
  entityType: 'todo' | 'routine' | 'nutrition' | 'weight' | 'birthday';
  isValid: boolean;
  errors: string[];
  data: T;
}

export interface IImportPreview {
  todos: IParsedRecord<Partial<ITodo>>[];
  routines: IParsedRecord<Partial<IRoutine>>[];
  nutrition: IParsedRecord<Partial<INutritionLog>>[];
  weight: IParsedRecord<Partial<IWeightLog>>[];
  birthdays: IParsedRecord<Partial<IBirthday>>[];
}
