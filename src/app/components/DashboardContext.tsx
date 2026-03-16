import React, { createContext, useContext, useState, useCallback } from "react";

export interface Project {
  id: string;
  name: string;
  createdAt: string;
}

export interface Dashboard {
  id: string;
  projectId: string | null;
  name: string;
  createdAt: string;
  published: boolean;
  publishUrl?: string;
  thumbnail: "chart" | "table" | "kpi" | "mixed";
  fromTemplate?: string;
}

export type TemplateCategory = "全部" | "3C场景" | "医疗设备" | "智慧工厂" | "能源管理" | "通用";

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: "chart" | "table" | "kpi" | "mixed";
  category: TemplateCategory;
  createdAt: string;
}

export type DataSourceType = "mysql" | "postgresql" | "mongodb" | "api" | "csv" | "oracle";

export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  description: string;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  connectionMethod?: "hostname" | "jdbc";
  status: "connected" | "disconnected" | "error";
  createdAt: string;
}

export interface DataSet {
  id: string;
  name: string;
  sourceId: string;
  tableName?: string;
  query?: string;
  fields: string[];
  rowCount: number;
  createdAt: string;
  updatedAt: string;
}

interface DashboardContextType {
  projects: Project[];
  dashboards: Dashboard[];
  templates: Template[];
  templateCategories: TemplateCategory[];
  dataSources: DataSource[];
  dataSets: DataSet[];
  addProject: (name: string) => string;
  renameProject: (id: string, name: string) => void;
  deleteProject: (id: string) => void;
  addDashboard: (projectId: string | null, name: string, thumbnail?: Dashboard["thumbnail"]) => string;
  deleteDashboard: (id: string) => void;
  renameDashboard: (id: string, name: string) => void;
  moveDashboard: (id: string, projectId: string | null) => void;
  togglePublish: (id: string) => void;
  getDashboardsByProject: (projectId: string) => Dashboard[];
  addDataSource: (ds: Omit<DataSource, "id" | "createdAt" | "status">) => string;
  updateDataSource: (id: string, ds: Partial<DataSource>) => void;
  deleteDataSource: (id: string) => void;
  addDataSet: (ds: Omit<DataSet, "id" | "createdAt" | "updatedAt">) => string;
  deleteDataSet: (id: string) => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function useDashboards() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboards must be used within DashboardProvider");
  return ctx;
}

const templateCategories: TemplateCategory[] = [
  "全部", "3C场景", "医疗设备", "智慧工厂", "能源管理", "通用",
];

const initialTemplates: Template[] = [
  {
    id: "tpl-1",
    name: "销售数据看板",
    description: "包含销售额、订单量、转化率等核心指标的综合看板模板",
    thumbnail: "chart",
    category: "3C场景",
    createdAt: "2026-01-15T08:00:00Z",
  },
  {
    id: "tpl-2",
    name: "运营监控面板",
    description: "实时监控系统运行状态、用户活跃度、错误率等运维指标",
    thumbnail: "mixed",
    category: "通用",
    createdAt: "2026-02-20T08:00:00Z",
  },
  {
    id: "tpl-3",
    name: "医疗设备监控",
    description: "实时监控CT、MRI、超声等医疗设备的运行状态、维护周期与使用率",
    thumbnail: "kpi",
    category: "医疗设备",
    createdAt: "2026-01-25T08:00:00Z",
  },
  {
    id: "tpl-4",
    name: "智慧产线看板",
    description: "生产线OEE、良品率、节拍时间等关键产线指标实时展示",
    thumbnail: "mixed",
    category: "智慧工厂",
    createdAt: "2026-02-05T08:00:00Z",
  },
  {
    id: "tpl-5",
    name: "能耗分析仪表盘",
    description: "电力、水力、燃气等能源消耗趋势分析与能效评估看板",
    thumbnail: "chart",
    category: "能源管理",
    createdAt: "2026-02-12T08:00:00Z",
  },
  {
    id: "tpl-6",
    name: "3C产品质检报告",
    description: "手机、平板、笔电等3C产品的出厂质检数据看板",
    thumbnail: "table",
    category: "3C场景",
    createdAt: "2026-03-01T08:00:00Z",
  },
  {
    id: "tpl-7",
    name: "病房床位管理",
    description: "病房占用率、床位周转率、科室负载等医院运营指标看板",
    thumbnail: "kpi",
    category: "医疗设备",
    createdAt: "2026-02-28T08:00:00Z",
  },
  {
    id: "tpl-8",
    name: "通用KPI看板",
    description: "适用于各行业的通用KPI指标展示模板，可自由配置",
    thumbnail: "kpi",
    category: "通用",
    createdAt: "2026-03-05T08:00:00Z",
  },
];

const initialProjects: Project[] = [
  { id: "proj-1", name: "销售分析", createdAt: "2026-02-01T08:00:00Z" },
  { id: "proj-2", name: "产品运营", createdAt: "2026-02-15T10:00:00Z" },
  { id: "proj-3", name: "财务报表", createdAt: "2026-03-01T09:00:00Z" },
];

const initialDashboards: Dashboard[] = [
  { id: "db-1", projectId: "proj-1", name: "Q1 销售报表", createdAt: "2026-02-10T10:30:00Z", published: true, publishUrl: "/preview/db-1", thumbnail: "chart" },
  { id: "db-2", projectId: "proj-1", name: "用户增长分析", createdAt: "2026-02-28T14:20:00Z", published: false, thumbnail: "kpi" },
  { id: "db-3", projectId: "proj-2", name: "产品运营周报", createdAt: "2026-03-05T09:00:00Z", published: true, publishUrl: "/preview/db-3", thumbnail: "mixed" },
  { id: "db-4", projectId: "proj-3", name: "财务月度概览", createdAt: "2026-03-08T16:45:00Z", published: false, thumbnail: "table" },
  { id: "db-5", projectId: "proj-2", name: "活跃用户趋势", createdAt: "2026-03-06T11:30:00Z", published: false, thumbnail: "chart" },
];

const initialDataSources: DataSource[] = [
  {
    id: "ds-1",
    name: "生产数据库",
    type: "mysql",
    description: "主要业务数据源",
    host: "192.168.1.100",
    port: 3306,
    database: "production_db",
    username: "readonly",
    connectionMethod: "hostname",
    status: "connected",
    createdAt: "2026-01-10T08:00:00Z",
  },
  {
    id: "ds-2",
    name: "日志存储",
    type: "mongodb",
    description: "系统运行日志数据",
    host: "192.168.1.105",
    port: 27017,
    database: "logs_db",
    username: "admin",
    connectionMethod: "hostname",
    status: "connected",
    createdAt: "2026-02-01T08:00:00Z",
  },
  {
    id: "ds-3",
    name: "外部API接口",
    type: "api",
    description: "第三方数据接口",
    status: "disconnected",
    createdAt: "2026-02-20T08:00:00Z",
  },
];

const initialDataSets: DataSet[] = [
  {
    id: "dset-1",
    name: "销售订单表",
    sourceId: "ds-1",
    tableName: "orders",
    fields: ["id", "product", "amount", "date", "region"],
    rowCount: 52480,
    createdAt: "2026-01-15T08:00:00Z",
    updatedAt: "2026-03-08T12:00:00Z",
  },
  {
    id: "dset-2",
    name: "用户行为日志",
    sourceId: "ds-2",
    tableName: "user_events",
    fields: ["event_id", "user_id", "action", "timestamp", "page"],
    rowCount: 1283400,
    createdAt: "2026-02-05T08:00:00Z",
    updatedAt: "2026-03-09T06:00:00Z",
  },
  {
    id: "dset-3",
    name: "产品库存",
    sourceId: "ds-1",
    tableName: "inventory",
    fields: ["sku", "name", "quantity", "warehouse", "updated_at"],
    rowCount: 8320,
    createdAt: "2026-02-10T08:00:00Z",
    updatedAt: "2026-03-07T18:00:00Z",
  },
];

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [dashboards, setDashboards] = useState<Dashboard[]>(initialDashboards);
  const [dataSources, setDataSources] = useState<DataSource[]>(initialDataSources);
  const [dataSets, setDataSets] = useState<DataSet[]>(initialDataSets);

  const addProject = useCallback((name: string) => {
    const id = `proj-${Date.now()}`;
    setProjects((prev) => [...prev, { id, name, createdAt: new Date().toISOString() }]);
    return id;
  }, []);

  const renameProject = useCallback((id: string, name: string) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setDashboards((prev) => prev.map((d) => (d.projectId === id ? { ...d, projectId: null } : d)));
  }, []);

  const addDashboard = useCallback(
    (projectId: string | null, name: string, thumbnail?: Dashboard["thumbnail"]) => {
      const id = `db-${Date.now()}`;
      setDashboards((prev) => [
        ...prev,
        { id, projectId, name, createdAt: new Date().toISOString(), published: false, thumbnail: thumbnail || "chart" },
      ]);
      return id;
    },
    []
  );

  const deleteDashboard = useCallback((id: string) => {
    setDashboards((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const renameDashboard = useCallback((id: string, name: string) => {
    setDashboards((prev) => prev.map((d) => (d.id === id ? { ...d, name } : d)));
  }, []);

  const moveDashboard = useCallback((id: string, projectId: string | null) => {
    setDashboards((prev) => prev.map((d) => (d.id === id ? { ...d, projectId } : d)));
  }, []);

  const togglePublish = useCallback((id: string) => {
    setDashboards((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, published: !d.published, publishUrl: !d.published ? `/preview/${d.id}` : undefined }
          : d
      )
    );
  }, []);

  const getDashboardsByProject = useCallback(
    (projectId: string) =>
      dashboards
        .filter((d) => d.projectId === projectId)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    [dashboards]
  );

  const addDataSource = useCallback((ds: Omit<DataSource, "id" | "createdAt" | "status">) => {
    const id = `ds-${Date.now()}`;
    setDataSources((prev) => [
      ...prev,
      { ...ds, id, status: "disconnected", createdAt: new Date().toISOString() },
    ]);
    return id;
  }, []);

  const updateDataSource = useCallback((id: string, updates: Partial<DataSource>) => {
    setDataSources((prev) => prev.map((ds) => (ds.id === id ? { ...ds, ...updates } : ds)));
  }, []);

  const deleteDataSource = useCallback((id: string) => {
    setDataSources((prev) => prev.filter((ds) => ds.id !== id));
    setDataSets((prev) => prev.filter((d) => d.sourceId !== id));
  }, []);

  const addDataSet = useCallback((ds: Omit<DataSet, "id" | "createdAt" | "updatedAt">) => {
    const id = `dset-${Date.now()}`;
    const now = new Date().toISOString();
    setDataSets((prev) => [...prev, { ...ds, id, createdAt: now, updatedAt: now }]);
    return id;
  }, []);

  const deleteDataSet = useCallback((id: string) => {
    setDataSets((prev) => prev.filter((d) => d.id !== id));
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        projects,
        dashboards,
        templates: initialTemplates,
        templateCategories,
        dataSources,
        dataSets,
        addProject,
        renameProject,
        deleteProject,
        addDashboard,
        deleteDashboard,
        renameDashboard,
        moveDashboard,
        togglePublish,
        getDashboardsByProject,
        addDataSource,
        updateDataSource,
        deleteDataSource,
        addDataSet,
        deleteDataSet,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}