import { type RouteConfig, route, index, layout } from '@react-router/dev/routes'

export default [
  {
    id: 'root-layout',
    file: './root.tsx',
    children: [
      index('./page.tsx'),

      // Authentication routes (no layout)
      route('login', './pages/auth/login.tsx'),
      route('auth/reset-password', './pages/auth/reset-password.tsx'),

      // Admin routes with AdminLayout
      layout('components/layout/AdminLayout.tsx', [
        route('admin/dashboard', './pages/admin/dashboard.tsx'),
        route('admin/settings', './pages/admin/settings.tsx'),
        route('admin/audit-logs', './pages/admin/audit-logs.tsx'),
        route('admin/analytics', './pages/admin/analytics.tsx'),
        route('admin/notifications-send', './pages/admin/notifications/send.tsx'),

        route('admin/users-management/list', './pages/admin/users-management/list.tsx'),
        route('admin/users-management/create', './pages/admin/users-management/create.tsx'),
        route('admin/users-management/edit/:userId', './pages/admin/users-management/edit.tsx'),

        route('admin/subjects-management/list', './pages/admin/subjects-management/list.tsx'),
        route('admin/subjects-management/create', './pages/admin/subjects-management/create.tsx'),
        route('admin/subjects-management/edit/:subjectId', './pages/admin/subjects-management/edit.tsx'),

        route('admin/classes-management/list', './pages/admin/classes-management/list.tsx'),
        route('admin/classes-management/create', './pages/admin/classes-management/create.tsx'),
        route('admin/classes-management/edit/:classId', './pages/admin/classes-management/edit.tsx')
      ]),

      // User routes with UserLayout (Student, Lecturer, Common)
      layout('components/layout/UserLayout.tsx', [
        // Common routes
        route('profile', './pages/common/profile/index.tsx'),
        route('home', './pages/home.tsx'),

        route('lecturer/dashboard', './pages/lecturer/dashboard.tsx'),

        // Lecturer routes - My Courses and Class Detail (New Clean Structure)
        route('lecturer', './pages/lecturer/index.tsx'),  // Redirect to my-courses
        route('lecturer/my-courses', './pages/lecturer/my-courses.tsx'),
        route('lecturer/classes/:classId', './pages/lecturer/classes/[classId]/index.tsx'),

        // Student routes
        route('student/dashboard', './pages/student/dashboard.tsx'),
        route('student/my-courses', './pages/student/my-courses.tsx'),
        route('student/all-courses', './pages/student/all-courses.tsx'),
        route('student/ranking', './pages/student/ranking.tsx'),
        route('student/notifications-receive', './pages/student/notifications-receive.tsx')
      ])
    ]
  }
] satisfies RouteConfig
