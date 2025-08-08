import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ReputationAction {
  id: string
  userId: string
  action: 'function_created' | 'function_approved' | 'function_liked' | 'comment_posted' | 'helpful_review' | 'daily_login' | 'contribution_featured'
  points: number
  description: string
  timestamp: number
  metadata?: Record<string, unknown>
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  requirement: number
  type: 'contribution' | 'engagement' | 'achievement' | 'special'
}

export interface UserLevel {
  level: number
  title: string
  minPoints: number
  maxPoints: number
  color: string
  benefits: string[]
}

export interface UserReputation {
  userId: string
  totalPoints: number
  level: number
  badges: string[] // badge IDs
  streak: number // consecutive login days
  lastActiveDate?: number
  achievements: ReputationAction[]
}

const POINT_VALUES: Record<ReputationAction['action'], number> = {
  function_created: 10,
  function_approved: 25,
  function_liked: 3,
  comment_posted: 2,
  helpful_review: 5,
  daily_login: 1,
  contribution_featured: 50
}

const BADGES: Badge[] = [
  {
    id: 'first_contribution',
    name: 'First Steps',
    description: 'Created your first function',
    icon: '🚀',
    color: 'green',
    requirement: 1,
    type: 'contribution'
  },
  {
    id: 'prolific_contributor',
    name: 'Prolific Contributor',
    description: 'Created 10 functions',
    icon: '📚',
    color: 'blue',
    requirement: 10,
    type: 'contribution'
  },
  {
    id: 'popular_creator',
    name: 'Popular Creator',
    description: 'Received 100 likes',
    icon: '⭐',
    color: 'yellow',
    requirement: 100,
    type: 'engagement'
  },
  {
    id: 'helpful_reviewer',
    name: 'Helpful Reviewer',
    description: 'Posted 25 helpful reviews',
    icon: '🔍',
    color: 'purple',
    requirement: 25,
    type: 'engagement'
  },
  {
    id: 'streak_warrior',
    name: 'Streak Warrior',
    description: '30-day login streak',
    icon: '🔥',
    color: 'orange',
    requirement: 30,
    type: 'achievement'
  },
  {
    id: 'veteran_contributor',
    name: 'Veteran',
    description: 'Created 50 functions',
    icon: '🏆',
    color: 'gold',
    requirement: 50,
    type: 'contribution'
  },
  {
    id: 'community_champion',
    name: 'Community Champion',
    description: 'Reached 1000 reputation points',
    icon: '👑',
    color: 'purple',
    requirement: 1000,
    type: 'special'
  }
]

const USER_LEVELS: UserLevel[] = [
  {
    level: 1,
    title: 'Newcomer',
    minPoints: 0,
    maxPoints: 49,
    color: 'gray',
    benefits: ['Access to basic features']
  },
  {
    level: 2,
    title: 'Contributor',
    minPoints: 50,
    maxPoints: 149,
    color: 'green',
    benefits: ['Can create functions', 'Can comment on functions']
  },
  {
    level: 3,
    title: 'Regular',
    minPoints: 150,
    maxPoints: 349,
    color: 'blue',
    benefits: ['Priority support', 'Advanced search filters']
  },
  {
    level: 4,
    title: 'Expert',
    minPoints: 350,
    maxPoints: 699,
    color: 'purple',
    benefits: ['Can review functions', 'Beta feature access']
  },
  {
    level: 5,
    title: 'Master',
    minPoints: 700,
    maxPoints: 1499,
    color: 'orange',
    benefits: ['Moderator privileges', 'Featured contributions']
  },
  {
    level: 6,
    title: 'Legend',
    minPoints: 1500,
    maxPoints: Infinity,
    color: 'gold',
    benefits: ['All privileges', 'Custom profile themes', 'Exclusive badges']
  }
]

interface ReputationState {
  userReputations: Record<string, UserReputation>
  badges: Badge[]
  levels: UserLevel[]
  
  // Actions
  awardPoints: (userId: string, action: ReputationAction['action'], metadata?: Record<string, unknown>) => void
  getUserReputation: (userId: string) => UserReputation
  getUserLevel: (userId: string) => UserLevel
  getEarnedBadges: (userId: string) => Badge[]
  getNextBadges: (userId: string) => Badge[]
  updateStreak: (userId: string) => void
  getLeaderboard: (limit?: number) => { userId: string; reputation: UserReputation; level: UserLevel }[]
}

export const useReputationStore = create<ReputationState>()(
  persist(
    (set, get) => ({
      userReputations: {},
      badges: BADGES,
      levels: USER_LEVELS,

      awardPoints: (userId: string, action: ReputationAction['action'], metadata = {}) => {
        const points = POINT_VALUES[action]
        const { userReputations } = get()
        
        const currentReputation = userReputations[userId] || {
          userId,
          totalPoints: 0,
          level: 1,
          badges: [],
          streak: 0,
          achievements: []
        }

        const newAchievement: ReputationAction = {
          id: `${action}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId,
          action,
          points,
          description: getActionDescription(action, metadata),
          timestamp: Date.now(),
          metadata
        }

        const newTotalPoints = currentReputation.totalPoints + points
        const newLevel = calculateLevel(newTotalPoints)
        const newBadges = calculateBadges(userId, { ...currentReputation, totalPoints: newTotalPoints, achievements: [...currentReputation.achievements, newAchievement] })

        const updatedReputation: UserReputation = {
          ...currentReputation,
          totalPoints: newTotalPoints,
          level: newLevel.level,
          badges: newBadges,
          achievements: [...currentReputation.achievements, newAchievement]
        }

        set({
          userReputations: {
            ...userReputations,
            [userId]: updatedReputation
          }
        })
      },

      getUserReputation: (userId: string) => {
        const { userReputations } = get()
        return userReputations[userId] || {
          userId,
          totalPoints: 0,
          level: 1,
          badges: [],
          streak: 0,
          achievements: []
        }
      },

      getUserLevel: (userId: string) => {
        const reputation = get().getUserReputation(userId)
        return calculateLevel(reputation.totalPoints)
      },

      getEarnedBadges: (userId: string) => {
        const reputation = get().getUserReputation(userId)
        const { badges } = get()
        return badges.filter(badge => reputation.badges.includes(badge.id))
      },

      getNextBadges: (userId: string) => {
        const reputation = get().getUserReputation(userId)
        const { badges } = get()
        return badges
          .filter(badge => !reputation.badges.includes(badge.id))
          .map(badge => {
            const progress = getBadgeProgress(badge, reputation)
            return { ...badge, progress }
          })
          .sort((a, b) => (b.progress || 0) - (a.progress || 0))
          .slice(0, 3)
      },

      updateStreak: (userId: string) => {
        const { userReputations } = get()
        const currentReputation = get().getUserReputation(userId)
        const now = Date.now()
        const oneDayMs = 24 * 60 * 60 * 1000
        
        let newStreak = currentReputation.streak
        
        if (currentReputation.lastActiveDate) {
          const daysSinceLastActive = Math.floor((now - currentReputation.lastActiveDate) / oneDayMs)
          
          if (daysSinceLastActive === 1) {
            // Consecutive day
            newStreak++
          } else if (daysSinceLastActive > 1) {
            // Streak broken
            newStreak = 1
          }
          // Same day, no change to streak
        } else {
          // First login
          newStreak = 1
        }

        const updatedReputation: UserReputation = {
          ...currentReputation,
          streak: newStreak,
          lastActiveDate: now
        }

        set({
          userReputations: {
            ...userReputations,
            [userId]: updatedReputation
          }
        })

        // Award daily login points
        get().awardPoints(userId, 'daily_login', { streak: newStreak })
      },

      getLeaderboard: (limit = 10) => {
        const { userReputations } = get()
        return Object.values(userReputations)
          .map(reputation => ({
            userId: reputation.userId,
            reputation,
            level: calculateLevel(reputation.totalPoints)
          }))
          .sort((a, b) => b.reputation.totalPoints - a.reputation.totalPoints)
          .slice(0, limit)
      }
    }),
    {
      name: 'reputation-store',
      partialize: (state) => ({
        userReputations: state.userReputations
      })
    }
  )
)

function calculateLevel(points: number): UserLevel {
  return USER_LEVELS.find(level => points >= level.minPoints && points <= level.maxPoints) || USER_LEVELS[0]
}

function calculateBadges(userId: string, reputation: UserReputation): string[] {
  const earnedBadges = [...reputation.badges]
  
  BADGES.forEach(badge => {
    if (!earnedBadges.includes(badge.id)) {
      const progress = getBadgeProgress(badge, reputation)
      if (progress >= badge.requirement) {
        earnedBadges.push(badge.id)
      }
    }
  })
  
  return earnedBadges
}

function getBadgeProgress(badge: Badge, reputation: UserReputation): number {
  switch (badge.id) {
    case 'first_contribution':
    case 'prolific_contributor':
    case 'veteran_contributor':
      return reputation.achievements.filter(a => a.action === 'function_created').length
    
    case 'popular_creator':
      return reputation.achievements.filter(a => a.action === 'function_liked').reduce((sum, a) => sum + a.points, 0) / 3 // 3 points per like
    
    case 'helpful_reviewer':
      return reputation.achievements.filter(a => a.action === 'helpful_review').length
    
    case 'streak_warrior':
      return reputation.streak
    
    case 'community_champion':
      return reputation.totalPoints
    
    default:
      return 0
  }
}

function getActionDescription(action: ReputationAction['action'], metadata: Record<string, unknown>): string {
  switch (action) {
    case 'function_created':
      return `Created function "${metadata.functionName || 'Unknown'}"`
    case 'function_approved':
      return `Function "${metadata.functionName || 'Unknown'}" was approved`
    case 'function_liked':
      return `Received a like on "${metadata.functionName || 'your function'}"`
    case 'comment_posted':
      return `Posted a comment`
    case 'helpful_review':
      return `Wrote a helpful review`
    case 'daily_login':
      return `Daily login (${metadata.streak || 1} day streak)`
    case 'contribution_featured':
      return `Function "${metadata.functionName || 'Unknown'}" was featured`
    default:
      return 'Unknown action'
  }
}
