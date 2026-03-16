/// <reference types="vite/client" />
import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { ProjectsPage } from "./components/ProjectsPage";
import { ProjectDetailPage } from "./components/ProjectDetailPage";
import { TemplatesPage } from "./components/TemplatesPage";
import { DataConfigPage } from "./components/DataConfigPage";
import { DashboardEditor } from "./components/DashboardEditor";
import { PreviewPage } from "./components/PreviewPage";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: Layout,
      children: [
        { index: true, Component: ProjectsPage },
        { path: "project/:projectId", Component: ProjectDetailPage },
        { path: "templates", Component: TemplatesPage },
        { path: "data-config", Component: DataConfigPage },
      ],
    },
    {
      path: "/editor/:id",
      Component: DashboardEditor,
    },
    {
      path: "/preview/:id",
      Component: PreviewPage,
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);
