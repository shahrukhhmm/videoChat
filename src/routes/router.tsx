import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Room from "../components/Room";
import JoinByLink from "../components/JoinByLink";




export const router = createBrowserRouter([
    {
        path: 'room/:roomId',
        element: <Room />,

    },
    {
        path: 'room/joining/:roomId',
        element: <JoinByLink />,

    },
    {
        path: `/`,
        element: <App />,
    },
]);
