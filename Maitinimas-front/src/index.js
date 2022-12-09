import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { StyledEngineProvider } from "@mui/material/styles";
//import epiEndpoint from './components/06Services/endpoint';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// ReactDOM.render(
//   <React.StrictMode>
//     <BrowserRouter basename={process.env.PUBLIC_URL}>
//       <Switch>
//         <StyledEngineProvider injectFirst>
//           <Route path="*" component={App} />
//         </StyledEngineProvider>
//       </Switch>
//     </BrowserRouter>
//   </React.StrictMode>,
//   document.getElementById("root")
// );

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(

    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Switch>
        <StyledEngineProvider injectFirst>
          <Route path="*" component={App} />
        </StyledEngineProvider>
      </Switch>
    </BrowserRouter>

)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
