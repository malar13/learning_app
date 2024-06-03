import { BaseEntity, Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";
import { IsInt, IsNotEmpty } from "class-validator";

@Entity("scores")
// BaseEntity gives all the method access to entity like find,save,findone
export class Score extends BaseEntity {

  @ObjectIdColumn()
  _id?: ObjectId;

  id?: string;

  @IsNotEmpty()
  @Column()
  user_id?: string;

  @IsNotEmpty()
  @Column()
  course_id?: string;

  @IsNotEmpty()
  @IsInt()
  @Column()
  score?: number;

  @IsNotEmpty()
  @Column()
  user_role?: string;

}
