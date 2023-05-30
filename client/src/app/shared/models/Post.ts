import {IInterest} from "./Interest";

export interface IPost {
  author: any;
  userId: number
  text: string
  publicationTime?: Date
  tags: IInterest[]
}

