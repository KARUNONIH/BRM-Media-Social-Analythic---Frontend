import { Refine } from "@refinedev/core";
import routerBindings from "@refinedev/react-router";
import dataProvider from "@refinedev/simple-rest";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./providers/auth";
import { LoginPage } from "./pages/login";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { DashboardOverview } from "./pages/dashboard";
import { PostsPage } from "./pages/posts";
import { AnalyticsPage } from "./pages/analytics";
import { BotLogsPage } from "./pages/bot-logs";
import { AccessManagementPage } from "./pages/access";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Refine
          dataProvider={dataProvider(API_URL)}
          routerProvider={routerBindings}
          resources={[
            {
              name: "posts",
              list: "/dashboard/posts",
            },
            {
              name: "analytics",
              list: "/dashboard/analytics",
            },
            {
              name: "bot-logs",
              list: "/dashboard/bot-logs",
            },
            {
              name: "access",
              list: "/dashboard/access",
            },
          ]}
        >
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="posts" element={<PostsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="bot-logs" element={<BotLogsPage />} />
              <Route path="access" element={<AccessManagementPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Refine>
      </AuthProvider>
    </BrowserRouter>
  );
}
