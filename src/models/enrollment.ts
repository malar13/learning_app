import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";
import { IsDate, IsNotEmpty } from "class-validator";

@Entity("enrollments")
export class Enrollment {

  @ObjectIdColumn()
  _id?: ObjectId;

  @IsNotEmpty()
  @Column()
  user_id?: string;

  @IsNotEmpty()
  @Column()
  course_id?: string;

  @IsDate()
  @Column()
  enrollment_date?: Date;

  @IsNotEmpty()
  @Column()
  enrollment_status?: string;
}
