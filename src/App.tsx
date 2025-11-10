import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { BarChartEditor } from './components/BarChartEditor';
import { LineChartEditor } from './components/LineChartEditor';
import { ScatterChartEditor } from './components/ScatterChartEditor';
import { PieChartEditor } from './components/PieChartEditor';
import { AreaChartEditor } from './components/AreaChartEditor';
import { FileBarChart, LineChart, ScatterChart, PieChart, AreaChart } from 'lucide-react';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-slate-900 mb-2">논문 도표 생성기</h1>
          <p className="text-slate-600">학술 논문에 사용할 수 있는 전문적인 차트와 그래프를 만들어보세요.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>차트 유형 선택</CardTitle>
            <CardDescription>생성하고자 하는 도표 유형을 선택하고 데이터를 입력하세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="bar" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="bar" className="flex items-center gap-2">
                  <FileBarChart className="w-4 h-4" />
                  막대 그래프
                </TabsTrigger>
                <TabsTrigger value="line" className="flex items-center gap-2">
                  <LineChart className="w-4 h-4" />
                  선 그래프
                </TabsTrigger>
                <TabsTrigger value="scatter" className="flex items-center gap-2">
                  <ScatterChart className="w-4 h-4" />
                  산점도
                </TabsTrigger>
                <TabsTrigger value="pie" className="flex items-center gap-2">
                  <PieChart className="w-4 h-4" />
                  원 그래프
                </TabsTrigger>
                <TabsTrigger value="area" className="flex items-center gap-2">
                  <AreaChart className="w-4 h-4" />
                  면적 그래프
                </TabsTrigger>
              </TabsList>

              <TabsContent value="bar">
                <BarChartEditor />
              </TabsContent>

              <TabsContent value="line">
                <LineChartEditor />
              </TabsContent>

              <TabsContent value="scatter">
                <ScatterChartEditor />
              </TabsContent>

              <TabsContent value="pie">
                <PieChartEditor />
              </TabsContent>

              <TabsContent value="area">
                <AreaChartEditor />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
