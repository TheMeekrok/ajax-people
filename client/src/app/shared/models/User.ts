import { IInterest } from './Interest';

export class User {
  id: number
  mail: string
  isAdmin: boolean;
  rating: number
  password: string
  firstName: string
  lastName: string
  age: number
  isModerated: number
  course: number
  statusUser: string
  educationLevel: string
  studyProgram: string
  school: string
  interests: IInterest[]
  avatarPath: string
  admissionYear: number
  graduationYear: number
}
