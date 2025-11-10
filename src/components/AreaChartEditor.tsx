import { useState, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Plus, Trash2, Download, Upload } from 'lucide-react';
import Papa from 'papaparse';
import { toast } from 'sonner@2.0.3';

const initialData = [
  { name: '1주', value: 4000, value2: 2400 },
  { name: '2주', value: 3000, value2: 1398 },
  { name: '3주', value: 2000, value2: 9800 },
  { name: '4주', value: 2780, value2: 3908 },
  { name: '5주', value: 1890, value2: 4800 },
  { name: '6주', value: 2390, value2: 3800 },
];

export function AreaChartEditor() {
  const [data, setData] = useState(initialData);
  const [title, setTitle] = useState('면적 그래프');
  const [xAxisLabel, setXAxisLabel] = useState('기간');
  const [yAxisLabel, setYAxisLabel] = useState('값');
  const [area1Label, setArea1Label] = useState('측정값 1');
  const [area2Label, setArea2Label] = useState('측정값 2');

  const addDataPoint = () => {
    setData([...data, { name: `${data.length + 1}주`, value: 0, value2: 0 }]);
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
            value: parseFloat(row.value || row.Value || row.value1 || row.Value1 || '0'),
            value2: parseFloat(row.value2 || row.Value2 || row.value_2 || row.Value_2 || '0'),
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
            <div>
              <Label htmlFor="xaxis">X축 라벨</Label>
              <Input
                id="xaxis"
                value={xAxisLabel}
                onChange={(e) => setXAxisLabel(e.target.value)}
                placeholder="X축 라벨"
              />
            </div>
            <div>
              <Label htmlFor="yaxis">Y축 라벨</Label>
              <Input
                id="yaxis"
                value={yAxisLabel}
                onChange={(e) => setYAxisLabel(e.target.value)}
                placeholder="Y축 라벨"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="area1">영역 1 이름</Label>
                <Input
                  id="area1"
                  value={area1Label}
                  onChange={(e) => setArea1Label(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="area2">영역 2 이름</Label>
                <Input
                  id="area2"
                  value={area2Label}
                  onChange={(e) => setArea2Label(e.target.value)}
                />
              </div>
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
              <div key={index} className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label>레이블</Label>
                  <Input
                    value={item.name}
                    onChange={(e) => updateDataPoint(index, 'name', e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <Label>값 1</Label>
                  <Input
                    type="number"
                    value={item.value}
                    onChange={(e) => updateDataPoint(index, 'value', Number(e.target.value))}
                  />
                </div>
                <div className="flex-1">
                  <Label>값 2</Label>
                  <Input
                    type="number"
                    value={item.value2}
                    onChange={(e) => updateDataPoint(index, 'value2', Number(e.target.value))}
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
              <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorValue2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  label={{ value: xAxisLabel, position: 'insideBottom', offset: -10 }}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px'
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorValue)"
                  name={area1Label}
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="value2" 
                  stroke="#8b5cf6" 
                  fillOpacity={1} 
                  fill="url(#colorValue2)"
                  name={area2Label}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
