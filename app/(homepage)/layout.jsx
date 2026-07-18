import React from 'react'
import Header from "@/components/Homepage/Header";
import Footer from "@/components/Homepage/Footer";

export default function HomepageLayout({children}) {
  return (
    <main>
        <Header />

        {children}
        
        <Footer />
    </main>
  )
}
