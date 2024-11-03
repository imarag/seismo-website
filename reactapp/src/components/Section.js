import React from 'react'

export default function Section({ className, children }) {
  return (
    <section className={className + " container mx-auto py-14"}>
        { children }
    </section>
  )
}
