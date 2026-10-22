import { Refine } from "@refinedev/core";
import routerBindings from "@refinedev/react-router";
import dataProvider from "@refinedev/simple-rest";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./providers/auth";
import { LoginPage } from "./pages/login";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { DashboardOverview } from "./pages/dashboard";
import { PostsPage } from "./pages/posts";
import { RecommendationsPage } from "./pages/recommendations";
import { BotLogsPage } from "./pages/bot-logs";

// ponytail: connects to nextjs backend api, fallback to dummy internally
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
              name: "recommendations",
              list: "/dashboard/recommendations",
            },
            {
              name: "bot-logs",
              list: "/dashboard/bot-logs",
            },
          ]}
        >
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="posts" element={<PostsPage />} />
              <Route path="recommendations" element={<RecommendationsPage />} />
              <Route path="bot-logs" element={<BotLogsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Refine>
      </AuthProvider>
    </BrowserRouter>
  );
}
