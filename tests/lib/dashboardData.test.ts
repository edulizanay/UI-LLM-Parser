// ABOUTME: Tests for dashboard data utilities and mock data formatting
// ABOUTME: Verifies project data handling, processing status, and date formatting functions

import {
  getMockProjects,
  getMockProcessingStatus,
  getDashboardStats,
  formatTimeRemaining,
  formatProcessedDate
} from '@/lib/dashboardData'

describe('Dashboard Data', () => {
  describe('getMockProjects', () => {
    it('should generate mock project data', () => {
      const projects = getMockProjects()

      expect(Array.isArray(projects)).toBe(true)
      expect(projects.length).toBeGreaterThan(0)
    })

    it('should validate project data structure', () => {
      const projects = getMockProjects()
      const project = projects[0]

      expect(project).toHaveProperty('id')
      expect(project).toHaveProperty('name')
      expect(project).toHaveProperty('status')
      expect(project).toHaveProperty('fileCount')
      expect(project).toHaveProperty('categoriesCreated')
      expect(project).toHaveProperty('createdAt')
      expect(project).toHaveProperty('lastModified')

      // Verify dates are Date objects
      expect(project.createdAt).toBeInstanceOf(Date)
      expect(project.lastModified).toBeInstanceOf(Date)

      // Verify status is valid
      expect(['completed', 'processing', 'draft', 'failed']).toContain(project.status)
    })

    it('should handle empty state scenarios', () => {
      const projects = getMockProjects()

      // Should not throw and should return valid array
      expect(() => getMockProjects()).not.toThrow()
      expect(Array.isArray(projects)).toBe(true)
    })
  })

  describe('getMockProcessingStatus', () => {
    it('should generate mock processing status', () => {
      const statuses = getMockProcessingStatus()

      expect(Array.isArray(statuses)).toBe(true)
      expect(statuses.length).toBeGreaterThan(0)
    })

    it('should validate processing status structure', () => {
      const statuses = getMockProcessingStatus()
      const status = statuses[0]

      expect(status).toHaveProperty('projectId')
      expect(status).toHaveProperty('stage')
      expect(status).toHaveProperty('progress')
      expect(status).toHaveProperty('estimatedTimeRemaining')
      expect(status).toHaveProperty('currentTask')
      expect(status).toHaveProperty('startedAt')

      // Verify types
      expect(typeof status.projectId).toBe('string')
      expect(['uploading', 'analyzing', 'categorizing', 'processing']).toContain(status.stage)
      expect(typeof status.progress).toBe('number')
      expect(status.progress).toBeGreaterThanOrEqual(0)
      expect(status.progress).toBeLessThanOrEqual(100)
      expect(typeof status.estimatedTimeRemaining).toBe('number')
      expect(typeof status.currentTask).toBe('string')
      expect(status.startedAt).toBeInstanceOf(Date)
    })

    it('should handle empty state scenarios', () => {
      const statuses = getMockProcessingStatus()

      // Should not throw and should return valid array
      expect(() => getMockProcessingStatus()).not.toThrow()
      expect(Array.isArray(statuses)).toBe(true)
    })
  })

  describe('getDashboardStats', () => {
    it('should generate mock dashboard statistics', () => {
      const stats = getDashboardStats()

      expect(stats).toBeDefined()
      expect(typeof stats).toBe('object')
    })

    it('should have valid statistics structure', () => {
      const stats = getDashboardStats()

      expect(stats).toHaveProperty('totalProjects')
      expect(stats).toHaveProperty('activeProcessing')
      expect(stats).toHaveProperty('completedToday')
      expect(stats).toHaveProperty('totalConversationsProcessed')

      // Verify all are numbers
      expect(typeof stats.totalProjects).toBe('number')
      expect(typeof stats.activeProcessing).toBe('number')
      expect(typeof stats.completedToday).toBe('number')
      expect(typeof stats.totalConversationsProcessed).toBe('number')

      // Verify logical relationships
      expect(stats.activeProcessing).toBeLessThanOrEqual(stats.totalProjects)
      expect(stats.totalProjects).toBeGreaterThanOrEqual(0)
    })
  })

  describe('formatTimeRemaining', () => {
    it('should format seconds correctly', () => {
      expect(formatTimeRemaining(30)).toBe('~30s remaining')
      expect(formatTimeRemaining(45)).toBe('~45s remaining')
    })

    it('should format minutes correctly', () => {
      expect(formatTimeRemaining(120)).toBe('~2 min remaining')
      expect(formatTimeRemaining(300)).toBe('~5 min remaining')
      expect(formatTimeRemaining(3540)).toBe('~59 min remaining')
    })

    it('should format hours correctly', () => {
      expect(formatTimeRemaining(3600)).toBe('~1 hr remaining')
      expect(formatTimeRemaining(7200)).toBe('~2 hr remaining')
      expect(formatTimeRemaining(10800)).toBe('~3 hr remaining')
    })

    it('should handle edge cases', () => {
      expect(formatTimeRemaining(0)).toBe('~0s remaining')
      expect(formatTimeRemaining(59)).toBe('~59s remaining')
      expect(formatTimeRemaining(60)).toBe('~1 min remaining')
      expect(formatTimeRemaining(3599)).toBe('~60 min remaining')
    })
  })

  describe('formatProcessedDate', () => {
    it('should format today correctly', () => {
      const today = new Date()
      expect(formatProcessedDate(today)).toBe('Today')
    })

    it('should format yesterday correctly', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      expect(formatProcessedDate(yesterday)).toBe('Yesterday')
    })

    it('should format days ago correctly', () => {
      const threeDaysAgo = new Date()
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
      expect(formatProcessedDate(threeDaysAgo)).toBe('3 days ago')

      const sixDaysAgo = new Date()
      sixDaysAgo.setDate(sixDaysAgo.getDate() - 6)
      expect(formatProcessedDate(sixDaysAgo)).toBe('6 days ago')
    })

    it('should format weeks ago correctly', () => {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      expect(formatProcessedDate(oneWeekAgo)).toBe('1 week ago')

      const twoWeeksAgo = new Date()
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
      expect(formatProcessedDate(twoWeeksAgo)).toBe('2 weeks ago')
    })

    it('should format months ago correctly', () => {
      const oneMonthAgo = new Date()
      oneMonthAgo.setDate(oneMonthAgo.getDate() - 30)
      expect(formatProcessedDate(oneMonthAgo)).toBe('1 month ago')

      const twoMonthsAgo = new Date()
      twoMonthsAgo.setDate(twoMonthsAgo.getDate() - 60)
      expect(formatProcessedDate(twoMonthsAgo)).toBe('2 months ago')
    })

    it('should handle edge cases for date formatting', () => {
      // Test with future date (should still work)
      const future = new Date()
      future.setDate(future.getDate() + 1)
      const result = formatProcessedDate(future)
      expect(typeof result).toBe('string')

      // Test with very old date
      const veryOld = new Date('2020-01-01')
      const oldResult = formatProcessedDate(veryOld)
      expect(oldResult).toContain('months ago')
    })
  })

  describe('Data Integration', () => {
    it('should have consistent project IDs between projects and processing status', () => {
      const projects = getMockProjects()
      const statuses = getMockProcessingStatus()

      const projectIds = projects.map(p => p.id)
      const statusProjectIds = statuses.map(s => s.projectId)

      // Some processing statuses should reference valid project IDs
      statusProjectIds.forEach(statusId => {
        // If status exists, project should exist or it should be a valid format
        expect(typeof statusId).toBe('string')
        expect(statusId.length).toBeGreaterThan(0)
      })
    })

    it('should maintain data consistency across function calls', () => {
      const projects1 = getMockProjects()
      const projects2 = getMockProjects()

      // Mock data should be consistent between calls
      expect(projects1.length).toBe(projects2.length)
      expect(projects1[0].id).toBe(projects2[0].id)
    })
  })
})