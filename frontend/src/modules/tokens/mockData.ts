import { Dataset, Token } from './interface';

// Mock datasets
export const mockDatasets: Dataset[] = [
  {
    id: '1',
    name: 'COVID-19_Cases_2023.parquet',
    size: 2048576, // 2MB
    created_at: '2023-01-15T10:30:00Z',
    description: 'COVID-19 case data for 2023 with regional breakdowns',
  },
  {
    id: '2',
    name: 'Population_Demographics.parquet',
    size: 5242880, // 5MB
    created_at: '2023-02-20T14:15:00Z',
    description: 'Population demographics by age group and region',
  },
  {
    id: '3',
    name: 'Healthcare_Facilities.parquet',
    size: 1024000, // ~1MB
    created_at: '2023-03-10T09:45:00Z',
    description: 'Healthcare facility locations and capacity data',
  },
  {
    id: '4',
    name: 'Economic_Indicators.parquet',
    size: 3145728, // 3MB
    created_at: '2023-04-05T16:20:00Z',
    description: 'Economic indicators and GDP data by region',
  },
  {
    id: '5',
    name: 'Disease_Surveillance.parquet',
    size: 7340032, // ~7MB
    created_at: '2023-05-12T11:00:00Z',
    description: 'Disease surveillance data including outbreak monitoring',
  },
];

// Mock tokens
export const mockTokens: Token[] = [
  {
    id: '1',
    name: 'Research Project Alpha',
    datasets: [mockDatasets[0], mockDatasets[1]],
    created_at: '2023-06-01T12:00:00Z',
    expires_at: '2024-06-01T12:00:00Z',
    is_active: true,
    last_used: '2023-11-15T08:30:00Z',
  },
  {
    id: '2',
    name: 'WHO Collaboration Token',
    datasets: [mockDatasets[2], mockDatasets[4]],
    created_at: '2023-07-15T14:30:00Z',
    is_active: true,
    last_used: '2023-11-20T10:15:00Z',
  },
  {
    id: '3',
    name: 'Quarterly Report Access',
    datasets: [mockDatasets[3]],
    created_at: '2023-08-20T09:00:00Z',
    expires_at: '2023-12-31T23:59:59Z',
    is_active: false,
    last_used: '2023-10-01T16:45:00Z',
  },
  {
    id: '4',
    name: 'CDC Data Sharing Initiative',
    datasets: [mockDatasets[0], mockDatasets[2], mockDatasets[4]],
    created_at: '2023-09-10T11:20:00Z',
    expires_at: '2024-09-10T11:20:00Z',
    is_active: true,
    last_used: '2023-12-01T14:22:00Z',
  },
  {
    id: '5',
    name: 'Emergency Response Team',
    datasets: [mockDatasets[4], mockDatasets[2]],
    created_at: '2023-10-05T08:45:00Z',
    is_active: true,
    last_used: '2023-12-15T09:10:00Z',
  },
  {
    id: '6',
    name: 'Academic Research Portal',
    datasets: [mockDatasets[1], mockDatasets[3]],
    created_at: '2023-11-12T16:30:00Z',
    expires_at: '2024-11-12T16:30:00Z',
    is_active: true,
    last_used: '2023-12-10T13:45:00Z',
  },
  {
    id: '7',
    name: 'Public Health Dashboard',
    datasets: [mockDatasets[0]],
    created_at: '2023-12-01T10:15:00Z',
    expires_at: '2024-03-01T10:15:00Z',
    is_active: true,
    last_used: '2023-12-20T11:30:00Z',
  },
  {
    id: '8',
    name: 'Policy Analysis Team',
    datasets: [mockDatasets[1], mockDatasets[3], mockDatasets[4]],
    created_at: '2023-05-20T13:40:00Z',
    expires_at: '2023-11-20T13:40:00Z',
    is_active: false,
    last_used: '2023-09-15T10:20:00Z',
  },
  {
    id: '9',
    name: 'International Cooperation',
    datasets: mockDatasets,
    created_at: '2023-03-15T09:25:00Z',
    is_active: true,
    last_used: '2023-12-18T15:55:00Z',
  },
  {
    id: '10',
    name: 'Temporary Data Export 1',
    datasets: [mockDatasets[2]],
    created_at: '2023-12-10T14:50:00Z',
    expires_at: '2023-12-25T14:50:00Z',
    is_active: false,
    last_used: '2023-12-12T16:20:00Z',
  },
  {
    id: '11',
    name: 'Temporary Data Export 2',
    datasets: [mockDatasets[2]],
    created_at: '2023-12-11T14:50:00Z',
    expires_at: '2023-12-22T14:50:00Z',
    is_active: false,
    last_used: '2023-12-12T16:20:00Z',
  },
];

// Simulate API responses
export const getMockDatasets = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        datasets: mockDatasets,
        count: mockDatasets.length,
      });
    }, 500);
  });
};

export const getMockTokens = (page: number = 1, limit: number = 10) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedTokens = mockTokens.slice(startIndex, endIndex);

      resolve({
        tokens: paginatedTokens,
        count: mockTokens.length,
        page,
        limit,
        totalPages: Math.ceil(mockTokens.length / limit),
        hasNext: endIndex < mockTokens.length,
        hasPrev: page > 1,
      });
    }, 500);
  });
};

export const createMockToken = (tokenData: {
  name: string;
  dataset_ids: string[];
  expires_at?: string;
}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const selectedDatasets = mockDatasets.filter((dataset) =>
        tokenData.dataset_ids.includes(dataset.id)
      );

      const newToken = {
        id: (mockTokens.length + 1).toString(),
        token: `repan-${Math.random()
          .toString(36)
          .substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`,
        name: tokenData.name,
        datasets: selectedDatasets,
        created_at: new Date().toISOString(),
        expires_at: tokenData.expires_at,
      };

      mockTokens.push({
        ...newToken,
        is_active: true,
      });

      resolve(newToken);
    }, 1000);
  });
};
