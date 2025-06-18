"use client";
import { JSX } from "react";
import Header from "../components/Header";
import Footer from "@/components/Footer";
import DashboardContent from "../components/DashboardContent";


export default function DashboardPage(): JSX.Element {

    return (
      <>
      <Header />
      <DashboardContent />
      <Footer />
      </> 
    );
}