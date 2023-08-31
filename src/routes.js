import {createBrowserRouter} from "react-router-dom";
import ExamView from "./views/ExamView";
import NewWordView from "./views/NewWordView";

export const routes = createBrowserRouter([
  {
    path: "/new",
    element: <NewWordView/>,
  },
  {
    path: "/",
    element: <ExamView/>,
  },
])
