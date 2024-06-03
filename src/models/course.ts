import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";
import { IsNotEmpty, Length } from "class-validator";

@Entity("courses")
export class Course {

  @ObjectIdColumn()
  _id?: ObjectId;

  @IsNotEmpty()
  @Column()
  course_id?: string;

  @IsNotEmpty()
  @Length(5, 20)
  @Column()
  course_title?: string;

  @Length(20, 30)
  @Column()
  course_description?: string;

  @IsNotEmpty()
  @Length(5,20)
  @Column()
  course_tutor?: string;

  @IsNotEmpty()
  @Column()
  user_role?: string;

}
