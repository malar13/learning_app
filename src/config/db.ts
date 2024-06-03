import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../models/user";
import { Course } from "../models/course";
import { Enrollment } from "../models/enrollment";
import { Score } from "../models/score";

export const AppDataSource = new DataSource({
  type: "mongodb",
  url: "mongodb+srv://malar:mongodb@123@cluster0.x12sqd0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  useNewUrlParser: true,
  synchronize: true,
  logging: true,
  entities: [User, Course, Enrollment, Score]
});
