// ABOUTME: TypeScript definitions for navigation and routing functionality
// ABOUTME: Defines data structures for navigation state and route management

export type RouteKey = 'dashboard' | 'parse' | 'categorize' | 'prompt-refiner'

export interface NavigationItem {
  key: RouteKey
  title: string
  href: string
  icon?: string
  isActive: boolean
  isDisabled: boolean
}

export interface BreadcrumbItem {
  title: string
  href?: string
  isCurrentPage: boolean
}

export interface NavigationState {
  currentRoute: RouteKey
  previousRoute?: RouteKey
  breadcrumbs: BreadcrumbItem[]
  canGoBack: boolean
}

export interface RouterParams {
  file?: string
  fields?: string
  step?: string
  project?: string
}

export interface NavigationContext {
  state: NavigationState
  navigate: (route: RouteKey, params?: RouterParams) => void
  goBack: () => void
  updateBreadcrumbs: (items: BreadcrumbItem[]) => void
}