import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Home } from "./pages/Home.tsx";
import { Auth } from "./pages/Auth.tsx";
import { Dashboard } from "./pages/Dashboard.tsx";
import { ConfigContext, AppConfig } from "./hooks/useConfig.ts";
import { Layout } from "./Layout.tsx";
import { isAuthenticated } from "./services/authApi.ts";

// 创建一个新的 QueryClient 实例，用于TanStack Query的数据缓存和管理
const queryClient = new QueryClient();

function App() {
  // AppConfig 状态，可以为 AppConfig 类型或 null
  const [config, setConfig] = useState<AppConfig | null>(null);

  useEffect(() => {
    // 组件挂载后，从后端 /config 接口获取前端配置
    axios.get<AppConfig>("/config").then((res) => {
      setConfig(res.data);
    });
  }, []); // 空依赖数组确保此 effect 只运行一次

  // 在配置加载完成前，显示加载中状态
  if (!config) {
    return (
      <div className="bg-[#1f2023] text-white w-screen h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    // 使用 ConfigContext.Provider 将配置信息提供给所有子组件
    <ConfigContext.Provider value={config}>
      {/* 使用 QueryClientProvider 为应用提供 React Query 功能 */}
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* 公开路由 */}
            <Route path="/auth" element={<Auth />} />
            
            {/* 主路由：Dashboard（需要登录） */}
            <Route 
              path="/" 
              element={isAuthenticated() ? <Dashboard /> : <Navigate to="/auth" />} 
            />
            
            {/* 兼容旧路由 */}
            <Route 
              path="/dashboard" 
              element={<Navigate to="/" replace />} 
            />
            
            {/* 旧版首页（保留兼容，但需要通过特定路径访问） */}
            <Route element={<Layout />}>
              <Route path="/legacy" element={<Home />} />
            </Route>
            
            {/* 默认重定向 */}
            <Route path="*" element={<Navigate to={isAuthenticated() ? "/" : "/auth"} />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ConfigContext.Provider>
  );
}

export default App;
