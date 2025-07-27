import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoriteFunction {
  id: string
  name: string
  language: string
  category: string
  addedAt: Date
}

interface FavoritesStore {
  favorites: FavoriteFunction[]
  addToFavorites: (func: Omit<FavoriteFunction, 'addedAt'>) => void
  removeFromFavorites: (id: string) => void
  isFavorite: (id: string) => boolean
  clearFavorites: () => void
  getFavoritesByLanguage: (language: string) => FavoriteFunction[]
  getFavoritesByCategory: (category: string) => FavoriteFunction[]
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      addToFavorites: (func) => {
        const { favorites } = get()
        const isAlreadyFavorite = favorites.some(fav => fav.id === func.id)
        
        if (!isAlreadyFavorite) {
          set({
            favorites: [...favorites, { ...func, addedAt: new Date() }]
          })
        }
      },
      
      removeFromFavorites: (id) => {
        const { favorites } = get()
        set({
          favorites: favorites.filter(fav => fav.id !== id)
        })
      },
      
      isFavorite: (id) => {
        const { favorites } = get()
        return favorites.some(fav => fav.id === id)
      },
      
      clearFavorites: () => {
        set({ favorites: [] })
      },
      
      getFavoritesByLanguage: (language) => {
        const { favorites } = get()
        return favorites.filter(fav => fav.language === language)
      },
      
      getFavoritesByCategory: (category) => {
        const { favorites } = get()
        return favorites.filter(fav => fav.category === category)
      }
    }),
    {
      name: 'favorites-storage',
      partialize: (state) => ({ favorites: state.favorites })
    }
  )
)
