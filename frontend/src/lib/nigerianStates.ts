import { useQuery } from '@tanstack/react-query'
import { getSports } from '@/lib/api_services/sportApiServices'

export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
  'Yobe', 'Zamfara',
]




export function useSports(): string[] {
  const { data } = useQuery({
    queryKey: ['sports'],
    queryFn: () => getSports(true),
    staleTime: 300_000,
  })
  return Array.isArray(data) ? data.map((s) => s.name) : []
}





