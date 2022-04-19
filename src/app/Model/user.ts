import { Comment } from "./comment";

export class User {
  id: number;
  username: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  avatar: string;
  balance: number;
  dob: String;
  status: boolean;
  roles: string[];
  comments!: Comment[];
  constructor(
    id: number,
    username: string,
    email: string,
    password: string,
    phone: string,
    roles: string[],
    address: string,
    avatar: string,
    balance: number,
    dob: String,
    status: boolean,
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.roles = roles;
    this.address = address;
    this.avatar = avatar;
    this.balance = balance;
    this.dob = dob;
    this.status = status;
  }
}
