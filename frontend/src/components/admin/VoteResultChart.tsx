'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { VoteResult } from '@/types'

interface VoteResultChartProps {
  results: VoteResult[]
}

export function VoteResultChart({ results }: VoteResultChartProps) {
  if (!results || results.length === 0) return (
    <div className="text-center text-gray-400 py-10">No results to display</div>
  )

  return (
    <div className="space-y-8">
      {results.map((position) => (
        <div key={position.positionId} className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-bold text-gray-900 mb-1">{position.positionTitle}</h3>
          <p className="text-gray-400 text-sm mb-5">Total votes: {position.totalVotes}</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={position.candidates}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="candidateName"
                tick={{ fontSize: 11, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value: number, name: string) => [value, 'Votes']}
                contentStyle={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="voteCount" radius={[6, 6, 0, 0]} maxBarSize={60}>
                {position.candidates.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? '#d4a017' : index === 1 ? '#1a6b3a' : '#2d9a57'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {position.candidates.map((c) => (
              <div key={c.candidateId} className="flex items-center justify-between text-sm bg-gray-50 rounded-lg px-3 py-2">
                <span className="text-gray-700 truncate">{c.candidateName}</span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="font-bold text-gray-900">{c.voteCount}</span>
                  <span className="text-gray-400 text-xs">({c.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
