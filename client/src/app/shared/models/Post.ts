import {IInterest} from "./Interest";

export interface IPost {
  userId: number
  text: string
  publicationTime?: Date
  tags: IInterest[]
}

