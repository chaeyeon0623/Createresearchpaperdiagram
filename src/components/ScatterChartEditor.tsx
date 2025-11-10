import { useState, useRef } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Plus, Trash2, Download, Upload } from 'lucide-react';
import Papa from 'papaparse';
import { toast } from 'sonner@2.0.3';

const initialData1 = [
  { x: 100, y: 200 },
  { x: 120, y: 100 },
  { x: 170, y: 300 },
  { x: 140, y: 250 },
  { x: 150, y: 400 },
  { x: 110, y: 280 },
];

const initialData2 = [
  { x: 200, y: 260 },
  { x: 240, y: 290 },
  { x: 190, y: 290 },
  { x: 198, y: 250 },
  { x: 180, y: 280 },
  { x: 210, y: 220 },
];

export function ScatterChartEditor() {
  const [data1, setData1] = useState(initialData1);
  const [data2, setData2] = useState(initialData2);
  const [title, setTitle] = useState('산점도');
  const [xAxisLabel, setXAxisLabel] = useState('X 변수');
  const [yAxisLabel, setYAxisLabel] = useState('Y 변수');
  const [series1Label, setSeries1Label] = useState('그룹 A');
  const [series2Label, setSeries2Label] = useState('그룹 B');

  const addDataPoint1 = () => {
    setData1([...data1, { x: 0, y: 0 }]);
  };

  const addDataPoint2 = () => {
    setData2([...data2, { x: 0, y: 0 }]);
  };

  const removeDataPoint1 = (index: number) => {
    if (data1.length > 1) {
      setData1(data1.filter((_, i) => i !== index));
    }
  };

  const removeDataPoint2 = (index: number) => {
    if (data2.length > 1) {
      setData2(data2.filter((_, i) => i !== index));
    }
  };

  const updateDataPoint1 = (index: number, field: string, value: number) => {
    const newData = [...data1];
    newData[index] = { ...newData[index], [field]: value };
    setData1(newData);
  };

  const updateDataPoint2 = (index: number, field: string, value: number) => {
    const newData = [...data2];
    newData[index] = { ...newData[index], [field]: value };
    setData2(newData);
  };

  const downloadChart = () => {
    alert('차트 다운로드 기능은 실제 구현에서 html2canvas 라이브러리를 사용하여 구현할 수 있습니다.');
  };

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  const handleFileUpload1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const parsedData = results.data.map((row: any) => ({
            x: parseFloat(row.x || row.X || '0'),
            y: parseFloat(row.y || row.Y || '0'),
          }));
          
          if (parsedData.length > 0) {
            setData1(parsedData);
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

  const handleFileUpload2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const parsedData = results.data.map((row: any) => ({
            x: parseFloat(row.x || row.X || '0'),
            y: parseFloat(row.y || row.Y || '0'),
          }));
          
          if (parsedData.length > 0) {
            setData2(parsedData);
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div>
                <Input
                  value={series1Label}
                  onChange={(e) => setSeries1Label(e.target.value)}
                  className="mb-2 w-48"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => fileInputRef1.current?.click()} size="sm" variant="outline">
                  <Upload className="w-4 h-4 mr-1" />
                  CSV
                </Button>
                <Button onClick={addDataPoint1} size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  추가
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-64 overflow-y-auto">
            <input
              ref={fileInputRef1}
              type="file"
              accept=".csv"
              onChange={handleFileUpload1}
              className="hidden"
            />
            {data1.map((item, index) => (
              <div key={index} className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label>X</Label>
                  <Input
                    type="number"
                    value={item.x}
                    onChange={(e) => updateDataPoint1(index, 'x', Number(e.target.value))}
                  />
                </div>
                <div className="flex-1">
                  <Label>Y</Label>
                  <Input
                    type="number"
                    value={item.y}
                    onChange={(e) => updateDataPoint1(index, 'y', Number(e.target.value))}
                  />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeDataPoint1(index)}
                  disabled={data1.length <= 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div>
                <Input
                  value={series2Label}
                  onChange={(e) => setSeries2Label(e.target.value)}
                  className="mb-2 w-48"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => fileInputRef2.current?.click()} size="sm" variant="outline">
                  <Upload className="w-4 h-4 mr-1" />
                  CSV
                </Button>
                <Button onClick={addDataPoint2} size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  추가
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-64 overflow-y-auto">
            <input
              ref={fileInputRef2}
              type="file"
              accept=".csv"
              onChange={handleFileUpload2}
              className="hidden"
            />
            {data2.map((item, index) => (
              <div key={index} className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label>X</Label>
                  <Input
                    type="number"
                    value={item.x}
                    onChange={(e) => updateDataPoint2(index, 'x', Number(e.target.value))}
                  />
                </div>
                <div className="flex-1">
                  <Label>Y</Label>
                  <Input
                    type="number"
                    value={item.y}
                    onChange={(e) => updateDataPoint2(index, 'y', Number(e.target.value))}
                  />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeDataPoint2(index)}
                  disabled={data2.length <= 1}
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
            <ResponsiveContainer width="100%" height={500}>
              <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  type="number"
                  dataKey="x" 
                  name={xAxisLabel}
                  label={{ value: xAxisLabel, position: 'insideBottom', offset: -10 }}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  type="number"
                  dataKey="y" 
                  name={yAxisLabel}
                  label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px'
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                />
                <Scatter 
                  name={series1Label} 
                  data={data1} 
                  fill="#3b82f6"
                />
                <Scatter 
                  name={series2Label} 
                  data={data2} 
                  fill="#8b5cf6"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
