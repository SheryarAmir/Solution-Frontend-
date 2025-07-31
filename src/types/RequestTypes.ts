export interface RequestData {
  id: number;
  empName: string;
  empImgUrl: string;
  department: string;
  Shift_date?: Date;
  Start_time?: Date;
  End_Time?: Date;
  Shift_status?: string;
  Start_date?: Date;
  End_date?: Date;
  Leave_status?: string;
  Profile_status?: string;
}

export type CardType = 
  | 'SHIFTS' | 'LEAVES' | 'PROFILE' 
  | 'SHIFTS1' | 'LEAVES1' | 'PROFILE1';

export type TabType = 'EMPLOYEES' | 'MY REQUEST';