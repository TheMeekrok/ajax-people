import { IInterest } from './Interest';

export class User {
  id: number
  email: string
  password: string
  firstName: string
  lastName: string
  age: number
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
