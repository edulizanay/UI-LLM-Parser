// ABOUTME: Project grid component displaying recent parsing projects with status indicators
// ABOUTME: Implements Zone 3 (Recent Projects) from @dashboard-design.md specifications

'use client'

import { FolderOpen } from 'lucide-react'
import type { ProjectSummary } from '@/types'
import { formatProcessedDate } from '@/lib/dashboardData'

interface ProjectGridProps {
  projects: ProjectSummary[]
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <section className="bg-surface-white p-ds-medium rounded-ds-lg shadow-panel">
        <h3 className="text-ds-body font-medium text-text-primary mb-ds-small">
          Recent Projects
        </h3>

        <div className="flex flex-col items-center justify-center py-ds-medium text-center">
          <FolderOpen className="w-8 h-8 text-text-muted mb-ds-small" />
          <p className="text-ds-small text-text-secondary mb-ds-micro">
            No projects yet
          </p>
          <p className="text-ds-micro text-text-muted">
            Your parsed conversations will appear here
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-surface-white p-ds-medium rounded-ds-lg shadow-panel max-w-[600px]">
      <div className="flex items-center justify-between mb-ds-small">
        <h3 className="text-ds-body font-medium text-text-primary">
          Recent Projects
        </h3>
        <button className="text-ds-small text-primary-blue hover:text-primary-blue-hover hover:underline">
          View All →
        </button>
      </div>

      <div
        data-testid="projects-grid"
        className="space-y-1 max-h-[300px] overflow-y-auto"
      >
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between py-2 px-2 rounded hover:bg-surface-background
                     transition-colors duration-200 cursor-pointer text-ds-small"
          >
            <div className="flex items-center gap-ds-small min-w-0 flex-1">
              {/* Status dot */}
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                project.status === 'completed'
                  ? 'bg-state-success'
                  : project.status === 'processing'
                  ? 'bg-state-warning'
                  : 'bg-text-muted'
              }`} />

              {/* Project name */}
              <span className="text-text-primary font-medium truncate">
                {project.name}
              </span>
            </div>

            {/* Date only - no clutter */}
            <span className="text-text-muted text-right flex-shrink-0 ml-4">
              {formatProcessedDate(project.lastModified)}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}