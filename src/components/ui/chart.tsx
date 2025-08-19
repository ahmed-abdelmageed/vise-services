
import * as React from "react"
import { Bar, Line, Pie } from "recharts"
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart as RechartsPie,
  BarChart as RechartsBar,
  LineChart as RechartsLine,
} from "recharts"

import { cn } from "@/lib/utils"

export type ChartProps = {
  data: any
  options?: any
  className?: string
}

export const PieChart = ({ data, options, className }: ChartProps) => {
  return (
    <div className={cn("w-full h-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPie data={data.datasets[0].data.map((value: number, index: number) => ({
          name: data.labels[index],
          value,
        }))}>
          <Pie
            data={data.datasets[0].data.map((value: number, index: number) => ({
              name: data.labels[index],
              value,
            }))}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.datasets[0].data.map((_: any, index: number) => (
              <React.Fragment key={`cell-${index}`}>
                {data.datasets[0].backgroundColor && (
                  <Tooltip
                    formatter={(value: any) => [value, data.labels[data.datasets[0].data.indexOf(value)]]}
                  />
                )}
              </React.Fragment>
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </RechartsPie>
      </ResponsiveContainer>
    </div>
  )
}

export const BarChart = ({ data, options, className }: ChartProps) => {
  return (
    <div className={cn("w-full h-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBar
          data={data.labels.map((label: string, index: number) => ({
            name: label,
            value: data.datasets[0].data[index],
          }))}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="value"
            fill={data.datasets[0].backgroundColor || "#8884d8"}
            name={data.datasets[0].label}
          />
        </RechartsBar>
      </ResponsiveContainer>
    </div>
  )
}

export const LineChart = ({ data, options, className }: ChartProps) => {
  return (
    <div className={cn("w-full h-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLine
          data={data.labels.map((label: string, index: number) => ({
            name: label,
            value: data.datasets[0].data[index],
          }))}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke={data.datasets[0].borderColor || "#8884d8"}
            activeDot={{ r: 8 }}
            name={data.datasets[0].label}
          />
        </RechartsLine>
      </ResponsiveContainer>
    </div>
  )
}
