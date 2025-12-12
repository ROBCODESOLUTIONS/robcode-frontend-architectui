import Books from "./books/reducer";
import Courses from "./courses/reducer";
import Events from "./events/reducer";
import Entities from "./entities/reducer";
import Projects from "./projects/reducer";
import RobcodeService from "./RobcodeService"
import Seasons from "./seasons/reducer";
import Students from "./students/reducer";
import Teachers from "./teachers/reducer";
import ThemeOptions from "./ThemeOptions";

const reducer = {
  ThemeOptions,
  RobcodeService,
  Entities,
  Projects,
  Books,
  Seasons,
  Courses,
  Students,
  Teachers,
  Events,
};

export default reducer;
