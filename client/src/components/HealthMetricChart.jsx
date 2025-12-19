import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const HealthMetricChart = ({ data, metricType, className, height = 300 }) => {
    // ... logic remains same ...

    // Transform data for chart
    const chartData = data.map(item => ({
        date: new Date(item.recordedAt).toLocaleDateString(),
        value: typeof item.value === 'object' ? 0 : item.value, // Placeholder for sorting/min/max
        ...item.value, // Spread systolic/diastolic if present
        displayValue: typeof item.value === 'object' ? `${item.value.systolic}/${item.value.diastolic}` : item.value
    }));

    const renderChartLines = () => {
        if (metricType === 'BLOOD_PRESSURE') {
            return (
                <>
                    <Line type="monotone" dataKey="systolic" stroke="#ef4444" name="Systolic (mmHg)" strokeWidth={2} />
                    <Line type="monotone" dataKey="diastolic" stroke="#3b82f6" name="Diastolic (mmHg)" strokeWidth={2} />
                </>
            );
        } else {
            let color = '#3b82f6';
            let label = 'Value';

            if (metricType === 'GLUCOSE') { color = '#10b981'; label = 'Glucose (mg/dL)'; }
            if (metricType === 'WEIGHT') { color = '#f59e0b'; label = 'Weight (kg)'; }
            if (metricType === 'HEART_RATE') { color = '#ef4444'; label = 'Heart Rate (bpm)'; }

            return <Line type="monotone" dataKey="realValue" stroke={color} name={label} strokeWidth={2} />;
        }
    };

    // Refined data processing
    const processedData = data.map(item => {
        const d = new Date(item.recordedAt);
        return {
            date: `${d.getDate()}/${d.getMonth() + 1} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`,
            ...(metricType === 'BLOOD_PRESSURE' ? item.value : { realValue: item.value }),
            original: item
        };
    });

    return (
        <div style={{ width: '100%', height: height }} className={className}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={processedData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickMargin={10} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        formatter={(value, name) => [value, name]}
                    />
                    <Legend />
                    {renderChartLines()}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default HealthMetricChart;
