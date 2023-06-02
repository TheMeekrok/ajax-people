export interface ILoginUser {
  mail: string
  password: string
}

export interface IPersonalData {
  telegram?: string;
  vk?: string;
  telephone?: string;
}

export interface IUser {
  id?: number;
  mail?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  admissionYear?: number;
  statusUserId?: number;
  educationLevelId?: number;
  studyProgramId?: number;
  schoolId?: number;
  interests?: number[];
  interestIds?: string;
  isAdmin?: boolean;
  personalData?: IPersonalData;
  telegram?: string,
  vk?: string,
  telephone?: string,
  rating?: number,
}
