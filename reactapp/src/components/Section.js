import React from 'react'

export default function Section({ className, children }) {
  return (
    <section className={className + " container-lg mx-auto py-5"}>
        { children }
    </section>
  )
}
