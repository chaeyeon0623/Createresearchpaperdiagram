import { useState, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Plus, Trash2, Download, Upload } from 'lucide-react';
import Papa from 'papaparse';
import { toast } from 'sonner@2.0.3';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1', '#14b8a6', '#f97316'];

const initialData = [
  { name: '항목 A', value: 400 },
  { name: '항목 B', value: 300 },
  { name: '항목 C', value: 300 },
  { name: '항목 D', value: 200 },
];

export function PieChartEditor() {
  const [data, setData] = useState(initialData);
  const [title, setTitle] = useState('원 그래프');

  const addDataPoint = () => {
    setData([...data, { name: `항목 ${String.fromCharCode(65 + data.length)}`, value: 100 }]);
  };

  const removeDataPoint = (index: number) => {
    if (data.length > 2) {
      setData(data.filter((_, i) => i !== index));
    }
  };

  const updateDataPoint = (index: number, field: string, value: string | number) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    setData(newData);
  };

  const downloadChart = () => {
    alert('차트 다운로드 기능은 실제 구현에서 html2canvas 라이브러리를 사용하여 구현할 수 있습니다.');
  };

  const renderLabel = (entry: any) => {
    const percent = ((entry.value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1);
    return `${percent}%`;
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const parsedData = results.data.map((row: any) => ({
            name: row.name || row.Name || row.label || row.Label || '',
            value: parseFloat(row.value || row.Value || '0'),
          }));
          
          if (parsedData.length > 0) {
            setData(parsedData);
            toast.success(`${parsedData.length}개의 데이터 포인트를 불러왔습니다.`);
          } else {
            toast.error('CSV 파일에서 유효한 데이터를 찾을 수 없습니다.');
          }
        } catch (error) {
          toast.error('CSV 파일 파싱 중 오류가 발생했습니다.');
        }
      },
      error: (error) => {
        toast.error(`파일 읽기 오류: ${error.message}`);
      },
    });

    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>차트 설정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">차트 제목</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="차트 제목 입력"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              데이터 입력
              <div className="flex gap-2">
                <Button onClick={() => fileInputRef.current?.click()} size="sm" variant="outline">
                  <Upload className="w-4 h-4 mr-1" />
                  CSV
                </Button>
                <Button onClick={addDataPoint} size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  추가
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            {data.map((item, index) => (
              <div key={index} className="flex gap-2 items-center">
                <div 
                  className="w-6 h-6 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <div className="flex-1">
                  <Input
                    value={item.name}
                    onChange={(e) => updateDataPoint(index, 'name', e.target.value)}
                    placeholder="항목 이름"
                  />
                </div>
                <div className="w-32">
                  <Input
                    type="number"
                    value={item.value}
                    onChange={(e) => updateDataPoint(index, 'value', Number(e.target.value))}
                    placeholder="값"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeDataPoint(index)}
                  disabled={data.length <= 2}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {title}
              <Button onClick={downloadChart} size="sm" variant="outline">
                <Download className="w-4 h-4 mr-1" />
                다운로드
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={renderLabel}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px'
                  }}
                />
                <Legend 
                  verticalAlign="bottom"
                  height={36}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
