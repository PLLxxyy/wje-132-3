import { createBrowserRouter, Navigate } from 'react-router-dom';
import { CertReview } from '../pages/CertReview';
import { Dashboard } from '../pages/Dashboard';
import { IncidentManage } from '../pages/IncidentManage';
import { InspectionManage } from '../pages/InspectionManage';
import { TrainingManage } from '../pages/TrainingManage';
import { AuditLogs } from '../pages/AuditLogs';
import { AppShell } from '../AppShell';
import { UserRole } from '../types/enums';
import { RoleGuard } from './guards';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'incidents', element: <IncidentManage /> },
      { path: 'inspections', element: <InspectionManage /> },
      { path: 'trainings', element: <TrainingManage /> },
      {
        path: 'certifications',
        element: (
          <RoleGuard allowedRoles={[UserRole.Admin, UserRole.SafetyManager, UserRole.Inspector, UserRole.Worker]}>
            <CertReview />
          </RoleGuard>
        ),
      },
      {
        path: 'audit-logs',
        element: (
          <RoleGuard allowedRoles={[UserRole.Admin, UserRole.SafetyManager]}>
            <AuditLogs />
          </RoleGuard>
        ),
      },
    ],
  },
]);
