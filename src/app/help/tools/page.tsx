"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Wrench,
  Timer,
  Calendar,
  Calculator,
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const tools = [
  { id: "pomodoro", label: "番茄钟", icon: Timer },
  { id: "countdown", label: "考试倒计时", icon: Calendar },
  { id: "gpa", label: "GPA 计算器", icon: Calculator },
];

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState("pomodoro");

  return (
    <div className="container py-8 max-w-2xl">
      {/* 顶部 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link href="/help" className="hover:text-primary">互助社区</Link>
          <span>/</span>
          <span>学习小工具</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Wrench className="h-7 w-7 text-orange-500" />
          学习小工具
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          实用小工具，随手就能用
        </p>
      </div>

      {/* 工具切换 */}
      <div className="flex gap-2 mb-6 bg-muted/50 p-1 rounded-xl">
        {tools.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTool === t.id
                  ? "bg-card shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* 工具内容 */}
      <Card>
        <CardContent className="p-6 md:p-8">
          {activeTool === "pomodoro" && <PomodoroTool />}
          {activeTool === "countdown" && <CountdownTool />}
          {activeTool === "gpa" && <GpaCalculator />}
        </CardContent>
      </Card>
    </div>
  );
}

// ========== 番茄钟 ==========
const POMODORO_WORK = 25 * 60;
const POMODORO_BREAK = 5 * 60;

function PomodoroTool() {
  const [mode, setMode] = useState<"work" | "break">("work");
  const [timeLeft, setTimeLeft] = useState(POMODORO_WORK);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            if (mode === "work") {
              setPomodoroCount((c) => c + 1);
              setMode("break");
              return POMODORO_BREAK;
            } else {
              setMode("work");
              return POMODORO_WORK;
            }
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode]);

  const toggleRun = () => setIsRunning(!isRunning);

  const reset = () => {
    setIsRunning(false);
    setMode("work");
    setTimeLeft(POMODORO_WORK);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = mode === "work"
    ? ((POMODORO_WORK - timeLeft) / POMODORO_WORK) * 100
    : ((POMODORO_BREAK - timeLeft) / POMODORO_BREAK) * 100;

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Badge
          variant={mode === "work" ? "default" : "secondary"}
          className="text-xs"
        >
          {mode === "work" ? (
            <> <Target className="h-3 w-3 mr-1" /> 专注中</>
          ) : (
            <> <Coffee className="h-3 w-3 mr-1" /> 休息中</>
          )}
        </Badge>
        <Badge variant="outline" className="text-xs">
          已完成 {pomodoroCount} 个番茄
        </Badge>
      </div>

      {/* 圆形进度 + 时间 */}
      <div className="relative w-56 h-56 mx-auto mb-8">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-muted/20"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={283}
            strokeDashoffset={283 - (283 * progress) / 100}
            className={mode === "work" ? "text-primary" : "text-green-500"}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl font-bold tabular-nums">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {mode === "work" ? "专注时间" : "休息时间"}
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center justify-center gap-3">
        <Button variant="outline" size="icon" onClick={reset}>
          <RotateCcw className="h-5 w-5" />
        </Button>
        <Button size="lg" className="w-32" onClick={toggleRun}>
          {isRunning ? (
            <><Pause className="h-5 w-5 mr-2" /> 暂停</>
          ) : (
            <><Play className="h-5 w-5 mr-2" /> 开始</>
          )}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mt-6">
        💡 番茄工作法：25 分钟专注 + 5 分钟休息，每 4 个番茄后长休息 15-30 分钟
      </p>
    </div>
  );
}

// ========== 考试倒计时 ==========
function CountdownTool() {
  const [examName, setExamName] = useState("考研");
  const [examDate, setExamDate] = useState(() => {
    // 默认下一年 12 月 21 日（考研常见日期）
    const now = new Date();
    const year = now.getMonth() >= 11 ? now.getFullYear() + 1 : now.getFullYear();
    return `${year}-12-21`;
  });
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const target = new Date(examDate).getTime();
  const diff = Math.max(0, target - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const presets = [
    { name: "考研", date: "2026-12-21" },
    { name: "英语四级", date: "2026-06-14" },
    { name: "英语六级", date: "2026-06-14" },
    { name: "高考", date: "2026-06-07" },
  ];

  return (
    <div className="text-center">
      <div className="mb-6">
        <Input
          value={examName}
          onChange={(e) => setExamName(e.target.value)}
          className="text-center text-xl font-bold border-none shadow-none focus-visible:ring-0 bg-transparent"
          placeholder="考试名称"
        />
      </div>

      {/* 倒计时数字 */}
      <div className="flex items-center justify-center gap-2 md:gap-4 mb-8">
        {[
          { label: "天", value: days },
          { label: "时", value: hours },
          { label: "分", value: minutes },
          { label: "秒", value: seconds },
        ].map((item, i) => (
          <div key={item.label} className="flex items-center">
            <div className="bg-muted rounded-lg p-3 md:p-4 min-w-[60px] md:min-w-[72px]">
              <div className="text-2xl md:text-3xl font-bold tabular-nums">
                {String(item.value).padStart(2, "0")}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
            </div>
            {i < 3 && (
              <span className="text-xl font-bold text-muted-foreground mx-1">:</span>
            )}
          </div>
        ))}
      </div>

      {/* 日期选择 */}
      <div className="max-w-xs mx-auto mb-4">
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          考试日期
        </label>
        <input
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          className="w-full h-10 px-3 rounded-lg border bg-background text-sm text-center"
        />
      </div>

      {/* 快捷设置 */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {presets.map((p) => (
          <button
            key={p.name}
            onClick={() => {
              setExamName(p.name);
              setExamDate(p.date);
            }}
            className="px-3 py-1 rounded-full text-xs bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            {p.name}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-6">
        📅 数据保存在本页面，刷新后会重置，仅供快速参考
      </p>
    </div>
  );
}

// ========== GPA 计算器 ==========
function GpaCalculator() {
  const [courses, setCourses] = useState([
    { id: 1, name: "高等数学", credit: 4, score: 85 },
    { id: 2, name: "大学英语", credit: 3, score: 78 },
    { id: 3, name: "程序设计", credit: 3, score: 92 },
  ]);
  const [method, setMethod] = useState<"4.0" | "5.0">("4.0");
  const nextId = useRef(4);

  const addCourse = () => {
    setCourses([
      ...courses,
      { id: nextId.current++, name: "", credit: 2, score: 80 },
    ]);
  };

  const removeCourse = (id: number) => {
    if (courses.length <= 1) return;
    setCourses(courses.filter((c) => c.id !== id));
  };

  const updateCourse = (id: number, field: string, value: string | number) => {
    setCourses(
      courses.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  // 计算 GPA
  const totalCredits = courses.reduce((sum, c) => sum + Number(c.credit || 0), 0);

  const scoreToGpa = (score: number) => {
    if (method === "4.0") {
      // 标准 4.0 算法
      if (score >= 90) return 4.0;
      if (score >= 85) return 3.7;
      if (score >= 82) return 3.3;
      if (score >= 78) return 3.0;
      if (score >= 75) return 2.7;
      if (score >= 72) return 2.3;
      if (score >= 68) return 2.0;
      if (score >= 64) return 1.5;
      if (score >= 60) return 1.0;
      return 0;
    } else {
      // 5.0 算法（常见：分数 - 50）/ 10
      if (score < 60) return 0;
      return Math.max(0, Math.min(5, (score - 50) / 10));
    }
  };

  const totalGpaPoints = courses.reduce(
    (sum, c) => sum + scoreToGpa(Number(c.score || 0)) * Number(c.credit || 0),
    0
  );
  const gpa = totalCredits > 0 ? (totalGpaPoints / totalCredits).toFixed(2) : "0.00";
  const avgScore = totalCredits > 0
    ? (courses.reduce((sum, c) => sum + Number(c.score || 0) * Number(c.credit || 0), 0) / totalCredits).toFixed(1)
    : "0.0";

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">课程成绩</h3>
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => setMethod("4.0")}
            className={`px-2 py-1 rounded ${
              method === "4.0" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            4.0 制
          </button>
          <button
            onClick={() => setMethod("5.0")}
            className={`px-2 py-1 rounded ${
              method === "5.0" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            5.0 制
          </button>
        </div>
      </div>

      {/* 课程列表 */}
      <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
        {courses.map((c, i) => (
          <div key={c.id} className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-5">{i + 1}.</span>
            <Input
              value={c.name}
              onChange={(e) => updateCourse(c.id, "name", e.target.value)}
              placeholder="课程名"
              className="flex-1 text-sm"
            />
            <Input
              type="number"
              min={0}
              max={10}
              step={0.5}
              value={c.credit}
              onChange={(e) => updateCourse(c.id, "credit", parseFloat(e.target.value) || 0)}
              className="w-16 text-sm text-center"
            />
            <Input
              type="number"
              min={0}
              max={100}
              value={c.score}
              onChange={(e) => updateCourse(c.id, "score", parseFloat(e.target.value) || 0)}
              className="w-16 text-sm text-center"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeCourse(c.id)}
              className="text-destructive hover:text-destructive"
              disabled={courses.length <= 1}
            >
              ×
            </Button>
          </div>
        ))}
      </div>

      <Button variant="outline" className="w-full mb-6" onClick={addCourse}>
        + 添加课程
      </Button>

      {/* 结果 */}
      <div className="bg-primary/5 rounded-xl p-5 border border-primary/20">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{gpa}</div>
            <div className="text-xs text-muted-foreground mt-1">GPA ({method})</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{avgScore}</div>
            <div className="text-xs text-muted-foreground mt-1">加权平均分</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{totalCredits}</div>
            <div className="text-xs text-muted-foreground mt-1">总学分</div>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        📊 算法仅供参考，具体以学校官方计算方式为准
      </p>
    </div>
  );
}
