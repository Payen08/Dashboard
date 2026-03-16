import React, { useState } from "react";
import {
  Database,
  Plus,
  Trash2,
  RefreshCw,
  ChevronRight,
  Table2,
  Search,
  X,
  Server,
  Globe,
  FileSpreadsheet,
  AlertCircle,
} from "lucide-react";
import {
  useDashboards,
  type DataSource,
  type DataSourceType,
  type DataSet,
} from "./DashboardContext";

const sourceTypeConfig: Record<
  DataSourceType,
  { label: string; color: string; icon: React.ReactNode }
> = {
  mysql: {
    label: "MySQL",
    color: "bg-blue-100 text-blue-700",
    icon: <Server className="w-5 h-5 text-blue-600" />,
  },
  postgresql: {
    label: "PostgreSQL",
    color: "bg-indigo-100 text-indigo-700",
    icon: <Server className="w-5 h-5 text-indigo-600" />,
  },
  mongodb: {
    label: "MongoDB",
    color: "bg-emerald-100 text-emerald-700",
    icon: <Database className="w-5 h-5 text-emerald-600" />,
  },
  oracle: {
    label: "Oracle",
    color: "bg-red-100 text-red-700",
    icon: <Server className="w-5 h-5 text-red-600" />,
  },
  api: {
    label: "API 接口",
    color: "bg-amber-100 text-amber-700",
    icon: <Globe className="w-5 h-5 text-amber-600" />,
  },
  csv: {
    label: "CSV 文件",
    color: "bg-slate-100 text-slate-700",
    icon: <FileSpreadsheet className="w-5 h-5 text-slate-600" />,
  },
};

type Tab = "sources" | "datasets";

export function DataConfigPage() {
  const [activeTab, setActiveTab] = useState<Tab>("sources");

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-slate-800">数据配置</h2>
        <p className="text-[14px] text-slate-500 mt-1">
          管理数据源连接和数据集，为仪表盘提供数据支撑
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 bg-slate-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab("sources")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-[14px] transition-all ${
            activeTab === "sources"
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Database className="w-4 h-4" />
          数据源
        </button>
        <button
          onClick={() => setActiveTab("datasets")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-[14px] transition-all ${
            activeTab === "datasets"
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Table2 className="w-4 h-4" />
          数据集
        </button>
      </div>

      {activeTab === "sources" ? <DataSourcesPanel /> : <DataSetsPanel />}
    </div>
  );
}

/* ==================== Data Sources Panel ==================== */
function DataSourcesPanel() {
  const { dataSources, addDataSource, updateDataSource, deleteDataSource } =
    useDashboards();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedType, setSelectedType] = useState<DataSourceType | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = dataSources.filter((ds) =>
    searchQuery
      ? ds.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ds.type.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  const handleCreateSource = () => {
    setSelectedType(null);
    setShowCreateModal(true);
  };

  const handleSelectType = (type: DataSourceType) => {
    setSelectedType(type);
  };

  const statusColor = (s: DataSource["status"]) => {
    if (s === "connected") return "bg-emerald-500";
    if (s === "error") return "bg-red-500";
    return "bg-slate-300";
  };

  const statusLabel = (s: DataSource["status"]) => {
    if (s === "connected") return "已连接";
    if (s === "error") return "连接异常";
    return "未连接";
  };

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索数据源..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
          />
        </div>
        <button
          onClick={handleCreateSource}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="text-[13px]">新建数据源</span>
        </button>
      </div>

      {/* Source list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <Database className="w-12 h-12 text-slate-200 mb-4" />
          <p className="text-[14px]">
            {searchQuery ? "未找到匹配的数据源" : "暂无数据源，点击「新建数据源」添加"}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((ds) => {
            const cfg = sourceTypeConfig[ds.type];
            const date = new Date(ds.createdAt);
            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

            return (
              <div
                key={ds.id}
                className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                      {cfg.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[15px] text-slate-800">
                          {ds.name}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] ${cfg.color}`}
                        >
                          {cfg.label}
                        </span>
                        <span className="flex items-center gap-1">
                          <span
                            className={`w-2 h-2 rounded-full ${statusColor(ds.status)}`}
                          />
                          <span
                            className={`text-[11px] ${
                              ds.status === "connected"
                                ? "text-emerald-600"
                                : ds.status === "error"
                                ? "text-red-500"
                                : "text-slate-400"
                            }`}
                          >
                            {statusLabel(ds.status)}
                          </span>
                        </span>
                      </div>
                      <p className="text-[13px] text-slate-500">
                        {ds.description}
                      </p>
                      <div className="flex items-center gap-4 mt-1.5 text-[12px] text-slate-400">
                        {ds.host && (
                          <span>
                            {ds.host}:{ds.port}
                          </span>
                        )}
                        {ds.database && <span>{ds.database}</span>}
                        <span>创建于 {dateStr}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() =>
                        updateDataSource(ds.id, {
                          status:
                            ds.status === "connected"
                              ? "disconnected"
                              : "connected",
                        })
                      }
                      className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors"
                      title="切换连接状态"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(ds.id)}
                      className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateDataSourceModal
          selectedType={selectedType}
          onSelectType={handleSelectType}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedType(null);
          }}
          onCreate={(ds) => {
            addDataSource(ds);
            setShowCreateModal(false);
            setSelectedType(null);
          }}
        />
      )}

      {/* Delete Confirm */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]"
          onClick={() => setShowDeleteConfirm(null)}
        >
          <div
            className="bg-white rounded-xl p-6 w-[400px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-slate-800 mb-2">确认删除</h3>
            <p className="text-slate-500 text-[14px] mb-2">
              确定要删除此数据源吗？
            </p>
            <p className="text-red-400 text-[13px] mb-6 flex items-start gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              删除数据源会同时删除其关联的所有数据集，此操作不可恢复。
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  deleteDataSource(showDeleteConfirm);
                  setShowDeleteConfirm(null);
                }}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                确定删除
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ==================== Create Data Source Modal ==================== */
function CreateDataSourceModal({
  selectedType,
  onSelectType,
  onClose,
  onCreate,
}: {
  selectedType: DataSourceType | null;
  onSelectType: (type: DataSourceType) => void;
  onClose: () => void;
  onCreate: (ds: Omit<DataSource, "id" | "createdAt" | "status">) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    connectionMethod: "hostname" as "hostname" | "jdbc",
    host: "",
    port: "",
    database: "",
    username: "",
    password: "",
  });

  const types: DataSourceType[] = [
    "mysql",
    "postgresql",
    "mongodb",
    "oracle",
    "api",
    "csv",
  ];

  const handleSubmit = () => {
    if (!selectedType || !form.name) return;
    onCreate({
      name: form.name,
      type: selectedType,
      description: form.description,
      host: form.host || undefined,
      port: form.port ? parseInt(form.port) : undefined,
      database: form.database || undefined,
      username: form.username || undefined,
      connectionMethod: form.connectionMethod,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-[680px] max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-slate-800">
            {selectedType ? "配置数据源" : "创建方式"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {!selectedType ? (
            /* Type selection */
            <div className="p-6">
              <p className="text-[14px] text-slate-500 mb-4">
                选择要创建的数据源类型
              </p>
              <div className="grid grid-cols-3 gap-3">
                {types.map((type) => {
                  const cfg = sourceTypeConfig[type];
                  return (
                    <button
                      key={type}
                      onClick={() => onSelectType(type)}
                      className="flex flex-col items-center gap-2 p-5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
                        {cfg.icon}
                      </div>
                      <span className="text-[14px] text-slate-700">
                        {cfg.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Config form */
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => onSelectType(null as any)}
                  className="text-[13px] text-blue-600 hover:text-blue-700"
                >
                  &larr; 返回选择
                </button>
                <span className="text-[13px] text-slate-400">|</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[12px] ${sourceTypeConfig[selectedType].color}`}
                >
                  {sourceTypeConfig[selectedType].label}
                </span>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <FormField
                  label="数据源名称"
                  value={form.name}
                  onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                  placeholder="请输入数据源名称"
                  required
                />

                {/* Description */}
                <FormField
                  label="描述"
                  value={form.description}
                  onChange={(v) => setForm((f) => ({ ...f, description: v }))}
                  placeholder="请输入描述信息"
                />

                {/* Connection Method */}
                {selectedType !== "api" && selectedType !== "csv" && (
                  <>
                    <div>
                      <label className="text-[14px] text-slate-700 mb-2 block">
                        连接方式
                      </label>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <span
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              form.connectionMethod === "hostname"
                                ? "border-emerald-500"
                                : "border-slate-300"
                            }`}
                          >
                            {form.connectionMethod === "hostname" && (
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            )}
                          </span>
                          <input
                            type="radio"
                            className="hidden"
                            checked={form.connectionMethod === "hostname"}
                            onChange={() =>
                              setForm((f) => ({
                                ...f,
                                connectionMethod: "hostname",
                              }))
                            }
                          />
                          <span className="text-[14px] text-slate-700">
                            主机名
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <span
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              form.connectionMethod === "jdbc"
                                ? "border-emerald-500"
                                : "border-slate-300"
                            }`}
                          >
                            {form.connectionMethod === "jdbc" && (
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            )}
                          </span>
                          <input
                            type="radio"
                            className="hidden"
                            checked={form.connectionMethod === "jdbc"}
                            onChange={() =>
                              setForm((f) => ({
                                ...f,
                                connectionMethod: "jdbc",
                              }))
                            }
                          />
                          <span className="text-[14px] text-slate-700">
                            JDBC
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Host */}
                    <FormField
                      label="IP地址"
                      value={form.host}
                      onChange={(v) => setForm((f) => ({ ...f, host: v }))}
                      placeholder="例如: 192.168.1.100"
                    />

                    {/* Port */}
                    <FormField
                      label="端口"
                      value={form.port}
                      onChange={(v) => setForm((f) => ({ ...f, port: v }))}
                      placeholder={
                        selectedType === "mysql"
                          ? "3306"
                          : selectedType === "postgresql"
                          ? "5432"
                          : selectedType === "mongodb"
                          ? "27017"
                          : selectedType === "oracle"
                          ? "1521"
                          : ""
                      }
                    />

                    {/* Database */}
                    <FormField
                      label="数据库名称"
                      value={form.database}
                      onChange={(v) => setForm((f) => ({ ...f, database: v }))}
                      placeholder="请输入数据库名称"
                    />

                    {/* Username */}
                    <FormField
                      label="用户名"
                      value={form.username}
                      onChange={(v) => setForm((f) => ({ ...f, username: v }))}
                      placeholder="请输入用户名"
                    />

                    {/* Password */}
                    <div>
                      <label className="text-[14px] text-slate-700 mb-2 block">
                        密码
                      </label>
                      <input
                        type="password"
                        value={form.password}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, password: e.target.value }))
                        }
                        placeholder="请输入密码"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[14px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
                      />
                    </div>

                    {/* SSH hint */}
                    <button className="text-[14px] text-blue-600 hover:text-blue-700">
                      ssh设置
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {selectedType && (
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              disabled={!form.name}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              保存
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-[14px] text-slate-700 mb-2 block">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[14px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
      />
    </div>
  );
}

/* ==================== Data Sets Panel ==================== */
function DataSetsPanel() {
  const { dataSets, dataSources, deleteDataSet } = useDashboards();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const filtered = dataSets.filter((ds) =>
    searchQuery
      ? ds.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  const getSourceName = (sourceId: string) => {
    return dataSources.find((s) => s.id === sourceId)?.name || "未知数据源";
  };

  const getSourceType = (sourceId: string) => {
    const src = dataSources.find((s) => s.id === sourceId);
    return src ? sourceTypeConfig[src.type] : null;
  };

  const formatRows = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return String(n);
  };

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索数据集..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          <span className="text-[13px]">新建数据集</span>
        </button>
      </div>

      {/* Dataset list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <Table2 className="w-12 h-12 text-slate-200 mb-4" />
          <p className="text-[14px]">
            {searchQuery ? "未找到匹配的数据集" : "暂无数据集"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_140px_180px_100px_120px_60px] gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200 text-[12px] text-slate-500">
            <span>数据集名称</span>
            <span>数据源</span>
            <span>字段</span>
            <span>数据量</span>
            <span>更新时间</span>
            <span>操作</span>
          </div>

          {/* Table rows */}
          {filtered.map((ds) => {
            const srcCfg = getSourceType(ds.sourceId);
            const updDate = new Date(ds.updatedAt);
            const updStr = `${String(updDate.getMonth() + 1).padStart(2, "0")}-${String(updDate.getDate()).padStart(2, "0")} ${String(updDate.getHours()).padStart(2, "0")}:${String(updDate.getMinutes()).padStart(2, "0")}`;

            return (
              <div
                key={ds.id}
                className="grid grid-cols-[1fr_140px_180px_100px_120px_60px] gap-2 px-4 py-3 border-b border-slate-100 hover:bg-slate-50/50 transition-colors items-center"
              >
                <div className="flex items-center gap-2">
                  <Table2 className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-[13px] text-slate-800 truncate">
                    {ds.name}
                  </span>
                  {ds.tableName && (
                    <span className="text-[11px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      {ds.tableName}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  {srcCfg && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[11px] ${srcCfg.color}`}
                    >
                      {srcCfg.label}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 overflow-hidden">
                  {ds.fields.slice(0, 3).map((f) => (
                    <span
                      key={f}
                      className="text-[11px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded shrink-0"
                    >
                      {f}
                    </span>
                  ))}
                  {ds.fields.length > 3 && (
                    <span className="text-[11px] text-slate-400">
                      +{ds.fields.length - 3}
                    </span>
                  )}
                </div>
                <span className="text-[13px] text-slate-600">
                  {formatRows(ds.rowCount)} 行
                </span>
                <span className="text-[12px] text-slate-400">{updStr}</span>
                <button
                  onClick={() => setShowDeleteConfirm(ds.id)}
                  className="p-1 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors w-fit"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirm */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]"
          onClick={() => setShowDeleteConfirm(null)}
        >
          <div
            className="bg-white rounded-xl p-6 w-[400px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-slate-800 mb-2">确认删除数据集</h3>
            <p className="text-slate-500 text-[14px] mb-6">
              确定要删除此数据集吗？删除后使用该数据集的图表将无法显示数据。
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  deleteDataSet(showDeleteConfirm);
                  setShowDeleteConfirm(null);
                }}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                确定删除
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
