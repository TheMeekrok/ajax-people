import {IInterest} from "./Interest";

export interface IPost {
  author: any;
  userId: number
  text: string
  publicationTime?: Date
  tags: IInterest[]
}

export class Post {
  id: number;
  author: any;
  userId: number
  text: string
  publicationTime?: Date
  tags: IInterest[]
}
