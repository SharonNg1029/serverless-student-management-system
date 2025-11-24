import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  {
    id: "root-layout",
    file: "./root.tsx",
    children: [
      index("./page.tsx"),
      
      // Authentication routes
      route("login", "./pages/auth/login.tsx"),
      route("auth/reset-password", "./pages/auth/reset-password.tsx"),
      
      // Common routes (all roles)
      route("profile", "./pages/common/profile/index.tsx"),
      route("home", "./pages/home.tsx"),
      
      // Admin routes
      route("admin/dashboard", "./pages/admin/dashboard.tsx"),
      route("admin/settings", "./pages/admin/settings.tsx"),
      route("admin/audit-logs", "./pages/admin/audit-logs.tsx"),
      
      route("admin/users-management/list", "./pages/admin/users-management/list.tsx"),
      route("admin/users-management/create", "./pages/admin/users-management/create.tsx"),
      route("admin/users-management/edit/:userId", "./pages/admin/users-management/edit.tsx"),
      
      route("admin/subjects-management/list", "./pages/admin/subjects-management/list.tsx"),
      route("admin/subjects-management/form", "./pages/admin/subjects-management/form.tsx", { id: "admin-subjects-create" }),
      route("admin/subjects-management/edit/:subjectId", "./pages/admin/subjects-management/form.tsx", { id: "admin-subjects-edit" }),
      
      route("admin/classes-management/list", "./pages/admin/classes-management/list.tsx"),
      route("admin/classes-management/form", "./pages/admin/classes-management/form.tsx", { id: "admin-classes-create" }),
      route("admin/classes-management/edit/:classId", "./pages/admin/classes-management/form.tsx", { id: "admin-classes-edit" }),
      
      // Lecturer routes
      route("lecturer/classes-management/list", "./pages/lecturer/classes-management/list.tsx"),
      route("lecturer/classes-management/details/:classId", "./pages/lecturer/classes-management/details.tsx"),
      route("lecturer/classes-management/form", "./pages/lecturer/classes-management/form.tsx", { id: "lecturer-classes-create" }),
      route("lecturer/classes-management/edit/:classId", "./pages/lecturer/classes-management/form.tsx", { id: "lecturer-classes-edit" }),
      
      route("lecturer/assignments-management/list", "./pages/lecturer/assignments-management/list.tsx"),
      route("lecturer/assignments-management/form", "./pages/lecturer/assignments-management/form.tsx", { id: "lecturer-assignments-create" }),
      route("lecturer/assignments-management/edit/:assignmentId", "./pages/lecturer/assignments-management/form.tsx", { id: "lecturer-assignments-edit" }),
      route("lecturer/assignments-management/grade/:assignmentId", "./pages/lecturer/assignments-management/grade.tsx"),
      
      route("lecturer/reports", "./pages/lecturer/reports.tsx"),
      route("lecturer/ranking-analyst", "./pages/lecturer/ranking-analyst.tsx"),
      route("lecturer/chat-moderate", "./pages/lecturer/chat-moderate.tsx"),
      route("lecturer/notifications-send", "./pages/lecturer/notifications-send.tsx"),
      
      route("lecturer/students-management/list", "./pages/lecturer/students-management/list.tsx"),
      route("lecturer/students-management/edit/:studentId", "./pages/lecturer/students-management/edit.tsx"),
      
      // Student routes
      route("student/dashboard", "./pages/student/dashboard.tsx"),
      route("student/my-courses", "./pages/student/my-courses.tsx"),
      route("student/all-courses", "./pages/student/all-courses.tsx"),
      route("student/ranking", "./pages/student/ranking.tsx"),
      route("student/notifications-receive", "./pages/student/notifications-receive.tsx"),
    ],
  },
] satisfies RouteConfig;

