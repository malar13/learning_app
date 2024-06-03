import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";
import { IsEmail, IsNotEmpty, IsStrongPassword, Length } from "class-validator";

@Entity("users")
export class User {

  @ObjectIdColumn()
  _id?: ObjectId;

  id?: string;

  @IsNotEmpty()
  @Length(5,20)
  @Column()
  user_name?: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @Column()
  user_password?: string;

  @IsNotEmpty()
  @IsEmail()
  @Column()
  user_email?: string;

  @IsNotEmpty()
  @Column()
  user_role?: string; // user role is student and tutor based on this give route access
}
