import { Refine } from "@refinedev/core";
import routerBindings from "@refinedev/react-router";
import dataProvider from "@refinedev/simple-rest";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// ponytail: basic mock rest provider, upgrade to backend express/next api when routes ready
const API_URL = import.meta.env.VITE_API_URL || "https://api.fake-rest.refine.dev";

function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800">Media Social Analytic Dashboard</h1>
        <p className="text-slate-600 mt-2">Refine + Vite + Tailwind</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Refine
        dataProvider={dataProvider(API_URL)}
        routerProvider={routerBindings}
        resources={[
          {
            name: "posts",
            list: "/",
          },
        ]}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Refine>
    </BrowserRouter>
  );
}
