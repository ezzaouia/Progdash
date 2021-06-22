import { TraceService } from './trace.service';
import { UserService } from './user.service';
import { ProgdashDataService } from './progdash-data.service';
import { TeacherService } from './teacher.service';

export const fromSerices = [
  ProgdashDataService,
  TraceService,
  UserService,
    TeacherService,
];

export * from './user.service';
export * from './progdash-data.service';
export * from './trace.service';
export * from './teacher.service';
