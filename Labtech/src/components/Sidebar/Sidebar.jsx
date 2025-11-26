

import React from "react";
import "./Sidebar.css";
import Logo from "/src/assets/logos/logo.svg";
import Profile from "/src/assets/icons/profile.svg";

export function Sidebar(){

    return(

       
        <nav className="sidebar">

            <div className="sidebar-header"> 
                <div className="sidebar-avatar"/>
                <img src={Profile} alt="Perfil do Usuário" className="sidebar-avatar"/>
            </div>
          
        </nav>


    );
}