import { Task } from '../types/task';

export const mockTasks: Task[] = [
  {
    id: 'TASK-001',
    title: 'Implement user authentication',
    description: 'Add OAuth2 authentication with Google and GitHub providers. Ensure secure token storage and refresh token handling.',
    status: 'development',
    priority: 'highest',
    assignee: {
      name: 'Sarah Chen',
      avatar: '',
      initials: 'SC'
    },
    reporter: {
      name: 'John Doe',
      avatar: '',
      initials: 'JD'
    },
    createdAt: '2025-11-15',
    updatedAt: '2025-12-04',
    dueDate: '2025-12-10',
    labels: ['backend', 'security'],
    activity: [
      {
        id: 'act-1',
        type: 'comment',
        user: { name: 'Sarah Chen', avatar: '', initials: 'SC' },
        timestamp: '2025-12-04T10:30:00',
        content: 'Started implementation of OAuth2 flow'
      },
      {
        id: 'act-2',
        type: 'status',
        user: { name: 'Sarah Chen', avatar: '', initials: 'SC' },
        timestamp: '2025-12-03T14:20:00',
        content: 'Changed status from To-Do to Development'
      }
    ]
  },
  {
    id: 'TASK-002',
    title: 'Design landing page mockups',
    description: 'Create high-fidelity mockups for the new landing page with focus on conversion optimization.',
    status: 'review',
    priority: 'high',
    assignee: {
      name: 'Mike Johnson',
      avatar: '',
      initials: 'MJ'
    },
    reporter: {
      name: 'Emily Brown',
      avatar: '',
      initials: 'EB'
    },
    createdAt: '2025-11-20',
    updatedAt: '2025-12-05',
    dueDate: '2025-12-08',
    labels: ['design', 'frontend'],
    activity: [
      {
        id: 'act-3',
        type: 'comment',
        user: { name: 'Mike Johnson', avatar: '', initials: 'MJ' },
        timestamp: '2025-12-05T09:15:00',
        content: 'Mockups ready for review'
      }
    ]
  },
  {
    id: 'TASK-003',
    title: 'Fix mobile responsive issues',
    description: 'Address layout breaking on mobile devices, particularly on iPhone SE and smaller screens.',
    status: 'todo',
    priority: 'high',
    assignee: {
      name: 'Alex Kim',
      avatar: '',
      initials: 'AK'
    },
    reporter: {
      name: 'John Doe',
      avatar: '',
      initials: 'JD'
    },
    createdAt: '2025-12-01',
    updatedAt: '2025-12-01',
    dueDate: '2025-12-12',
    labels: ['frontend', 'bug'],
    activity: []
  },
  {
    id: 'TASK-004',
    title: 'Database migration script',
    description: 'Create migration script for moving from PostgreSQL 14 to 15 with zero downtime.',
    status: 'development',
    priority: 'medium',
    assignee: {
      name: 'David Lee',
      avatar: '',
      initials: 'DL'
    },
    reporter: {
      name: 'Sarah Chen',
      avatar: '',
      initials: 'SC'
    },
    createdAt: '2025-11-25',
    updatedAt: '2025-12-03',
    dueDate: '2025-12-15',
    labels: ['backend', 'database'],
    activity: [
      {
        id: 'act-4',
        type: 'update',
        user: { name: 'David Lee', avatar: '', initials: 'DL' },
        timestamp: '2025-12-03T16:45:00',
        content: 'Updated migration strategy documentation'
      }
    ]
  },
  {
    id: 'TASK-005',
    title: 'Update API documentation',
    description: 'Refresh all API endpoint documentation with new authentication requirements and examples.',
    status: 'merge',
    priority: 'medium',
    assignee: {
      name: 'Lisa Wang',
      avatar: '',
      initials: 'LW'
    },
    reporter: {
      name: 'Mike Johnson',
      avatar: '',
      initials: 'MJ'
    },
    createdAt: '2025-11-18',
    updatedAt: '2025-12-05',
    dueDate: '2025-12-06',
    labels: ['documentation'],
    activity: [
      {
        id: 'act-5',
        type: 'comment',
        user: { name: 'Lisa Wang', avatar: '', initials: 'LW' },
        timestamp: '2025-12-05T11:00:00',
        content: 'PR ready for merge'
      }
    ]
  },
  {
    id: 'TASK-006',
    title: 'Implement search functionality',
    description: 'Add full-text search with Elasticsearch integration for products and articles.',
    status: 'done',
    priority: 'high',
    assignee: {
      name: 'Chris Taylor',
      avatar: '',
      initials: 'CT'
    },
    reporter: {
      name: 'Emily Brown',
      avatar: '',
      initials: 'EB'
    },
    createdAt: '2025-10-20',
    updatedAt: '2025-11-30',
    dueDate: '2025-11-30',
    labels: ['backend', 'feature'],
    activity: [
      {
        id: 'act-6',
        type: 'status',
        user: { name: 'Chris Taylor', avatar: '', initials: 'CT' },
        timestamp: '2025-11-30T17:00:00',
        content: 'Changed status to Done'
      }
    ]
  },
  {
    id: 'TASK-007',
    title: 'Setup CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment to staging and production.',
    status: 'done',
    priority: 'highest',
    assignee: {
      name: 'Sarah Chen',
      avatar: '',
      initials: 'SC'
    },
    reporter: {
      name: 'John Doe',
      avatar: '',
      initials: 'JD'
    },
    createdAt: '2025-10-15',
    updatedAt: '2025-11-25',
    dueDate: '2025-11-25',
    labels: ['devops'],
    activity: []
  },
  {
    id: 'TASK-008',
    title: 'Code review best practices guide',
    description: 'Document team code review guidelines and standards.',
    status: 'todo',
    priority: 'low',
    assignee: {
      name: 'Mike Johnson',
      avatar: '',
      initials: 'MJ'
    },
    reporter: {
      name: 'Sarah Chen',
      avatar: '',
      initials: 'SC'
    },
    createdAt: '2025-12-02',
    updatedAt: '2025-12-02',
    dueDate: '2025-12-20',
    labels: ['documentation'],
    activity: []
  },
  {
    id: 'TASK-009',
    title: 'Performance optimization',
    description: 'Optimize query performance for the analytics dashboard. Target load time under 2 seconds.',
    status: 'review',
    priority: 'medium',
    assignee: {
      name: 'David Lee',
      avatar: '',
      initials: 'DL'
    },
    reporter: {
      name: 'John Doe',
      avatar: '',
      initials: 'JD'
    },
    createdAt: '2025-11-28',
    updatedAt: '2025-12-04',
    dueDate: '2025-12-11',
    labels: ['backend', 'performance'],
    activity: [
      {
        id: 'act-7',
        type: 'comment',
        user: { name: 'David Lee', avatar: '', initials: 'DL' },
        timestamp: '2025-12-04T15:30:00',
        content: 'Reduced query time by 60%'
      }
    ]
  },
  {
    id: 'TASK-010',
    title: 'Email notification system',
    description: 'Implement email notifications for task assignments and status changes using SendGrid.',
    status: 'development',
    priority: 'medium',
    assignee: {
      name: 'Alex Kim',
      avatar: '',
      initials: 'AK'
    },
    reporter: {
      name: 'Emily Brown',
      avatar: '',
      initials: 'EB'
    },
    createdAt: '2025-11-22',
    updatedAt: '2025-12-05',
    dueDate: '2025-12-14',
    labels: ['backend', 'feature'],
    activity: []
  },
  {
    id: 'TASK-011',
    title: 'Archived task example',
    description: 'This is an archived task that should appear in admin view.',
    status: 'done',
    priority: 'low',
    assignee: {
      name: 'Lisa Wang',
      avatar: '',
      initials: 'LW'
    },
    reporter: {
      name: 'John Doe',
      avatar: '',
      initials: 'JD'
    },
    createdAt: '2025-09-10',
    updatedAt: '2025-10-05',
    dueDate: '2025-10-05',
    labels: ['archived'],
    archived: true,
    activity: []
  }
];
