import { create } from 'zustand';

// Define the types for the tag and suggestion
export interface Tag {
  key: string;
  value: string;
}

interface Suggestion {
  key: string;
  value: string;
}

// Define the interface for the store state and actions
interface StoreState {
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
  input: string;
  setInput: (input: string) => void;
  suggestions: Suggestion[];
}

// Create the Zustand store with the defined types
const useStore = create<StoreState>((set) => ({
  tags: [],
  setTags: (tags) => set({ tags }),
  input: '',
  setInput: (input) => set({ input }),
  suggestions: [
    { key: 'Payment Processing Fees', value: '1000' },
    { key: 'Payroll Bonus G&A', value: '2000' },
    { key: 'SUM', value: '+' },
    { key: 'Salary Increase Month', value: '3000' },
    { key: 'Bonus Payout Month', value: '4000' },
    { key: 'Health Insurance Expense', value: '5000' },
    { key: 'Health Insurance per Employee', value: '6000' },
    { key: 'COGS Headcount', value: '7000' },
    { key: 'Contractors G&A', value: '8000' },
    { key: 'Gross Margin %', value: '9000' },
    { key: 'S&M Headcount', value: '10000' },
  ],
}));

export default useStore;
