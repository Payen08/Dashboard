import React, { useState } from "react";
import { RotateCw, Trash2, ChevronDown, Filter, Palette, Sparkles, BarChart3, Zap } from "lucide-react";

const tabs = [
  { id: "customize", label: "定制", Icon: Palette },
  { id: "animation", label: "动画", Icon: Sparkles },
  { id: "data", label: "数据", Icon: BarChart3 },
  { id: "event", label: "事件", Icon: Zap },
];

interface RightPanelProps {
  selectedChartId: string | null;
  selectedChartType: string | null;
}

export function RightPanel({ selectedChartId, selectedChartType }: RightPanelProps) {
  const [activeTab, setActiveTab] = useState("customize");

  if (!selectedChartId) {
    return (
      <div className="w-[280px] bg-white border-l border-slate-200 flex items-center justify-center text-slate-400 text-[13px] shrink-0">
        <div className="text-center px-6">
          <p>请选中画布上的组件</p>
          <p className="text-[11px] mt-1 text-slate-300">选中后可在此配置属性</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[280px] bg-white border-l border-slate-200 flex flex-col shrink-0 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-slate-100 px-2 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-[13px] border-b-2 transition-colors ${activeTab === tab.id
              ? "border-blue-500 text-blue-600 font-medium"
              : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === "customize" && <CustomizePanel />}
        {activeTab === "animation" && <PlaceholderPanel label="动画" />}
        {activeTab === "data" && <DataPanel />}
        {activeTab === "event" && <PlaceholderPanel label="事件" />}
      </div>
    </div>
  );
}

function CustomizePanel() {
  return (
    <div className="flex flex-col gap-4">
      {/* Color */}
      <div>
        <label className="text-[12px] text-slate-600 mb-1.5 block">主色调</label>
        <div className="flex gap-2">
          {["#6366f1", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"].map((color) => (
            <button
              key={color}
              className="w-6 h-6 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-200 hover:ring-blue-400 transition-all"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Border radius */}
      <div>
        <label className="text-[12px] text-slate-600 mb-1.5 block">圆角</label>
        <input type="range" min="0" max="20" defaultValue="4" className="w-full h-1 bg-slate-200 rounded-full appearance-none accent-blue-500" />
      </div>

      {/* Show legend */}
      <div className="flex items-center justify-between">
        <label className="text-[12px] text-slate-600">显示图例</label>
        <button className="w-8 h-[18px] rounded-full bg-blue-500 relative transition-colors">
          <span className="absolute right-0.5 top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform" />
        </button>
      </div>

      {/* Show grid */}
      <div className="flex items-center justify-between">
        <label className="text-[12px] text-slate-600">显示网格线</label>
        <button className="w-8 h-[18px] rounded-full bg-blue-500 relative transition-colors">
          <span className="absolute right-0.5 top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform" />
        </button>
      </div>

      {/* Background */}
      <div>
        <label className="text-[12px] text-slate-600 mb-1.5 block">背景色</label>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded border border-slate-200 bg-white" />
          <input
            type="text"
            defaultValue="#FFFFFF"
            className="flex-1 h-7 px-2 text-[12px] bg-slate-50 border border-slate-200 rounded outline-none focus:border-blue-400"
          />
        </div>
      </div>
    </div>
  );
}

function DataPanel() {
  return (
    <div className="flex flex-col gap-4">
      {/* Data source */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[12px] text-slate-600">类别轴 / 维度 <span className="text-red-400">*</span></label>
          <button className="text-slate-400 hover:text-slate-600">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
        <div className="h-8 px-2 bg-slate-50 border border-slate-200 rounded flex items-center justify-between cursor-pointer hover:border-blue-400 transition-colors">
          <span className="text-[12px] text-slate-400">拖拽字段至此处</span>
        </div>
      </div>

      {/* Dataset selector */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[12px] text-slate-500">选择数据集</span>
        </div>
        <div className="h-8 px-2 bg-slate-50 border border-slate-200 rounded flex items-center justify-between cursor-pointer hover:border-blue-400 transition-colors">
          <span className="text-[12px] text-slate-400">选择数据集</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </div>
      </div>

      {/* Fields */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[12px] text-slate-600">字段</label>
          <RotateCw className="w-3 h-3 text-slate-400 cursor-pointer hover:text-blue-500" />
        </div>
        <div className="relative mb-1.5">
          <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="搜索 字段"
            className="w-full h-7 pl-6 pr-2 text-[12px] bg-slate-50 border border-slate-200 rounded outline-none focus:border-blue-400"
          />
        </div>
        <div className="text-[11px] text-blue-500 cursor-pointer hover:underline">维度</div>
      </div>

      {/* Metrics */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[12px] text-slate-600">信号 / 指标 <span className="text-slate-400 text-[10px]">ⓘ</span></label>
          <button className="text-slate-400 hover:text-slate-600">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
        <div className="h-8 px-2 bg-slate-50 border border-slate-200 rounded flex items-center justify-between cursor-pointer hover:border-blue-400 transition-colors">
          <span className="text-[12px] text-slate-400">拖拽字段至此处</span>
        </div>
      </div>

      {/* Paste / Dimension */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[12px] text-slate-600">粘取 / 维度</label>
          <button className="text-slate-400 hover:text-slate-600">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
        <div className="h-8 px-2 bg-slate-50 border border-slate-200 rounded flex items-center justify-between cursor-pointer hover:border-blue-400 transition-colors">
          <span className="text-[12px] text-slate-400">拖拽字段至此处</span>
        </div>
      </div>

      {/* Filter */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[12px] text-slate-600">过滤器</label>
          <button className="text-slate-400 hover:text-slate-600">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
        <button className="w-full h-8 px-2 bg-slate-50 border border-slate-200 rounded flex items-center justify-center gap-1 cursor-pointer hover:border-blue-400 transition-colors text-[12px] text-slate-500">
          <Filter className="w-3 h-3" />
          过滤
        </button>
      </div>
    </div>
  );
}

function PlaceholderPanel({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center h-full text-slate-400 text-[13px]">
      {label}配置（即将上线）
    </div>
  );
}

function Search(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}