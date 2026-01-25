"use client"

import * as React from "react"
import { usePathname, useSearchParams } from "next/navigation"
import NProgress from "nprogress"

// Configure NProgress
NProgress.configure({
    showSpinner: false,
    trickleSpeed: 100,
    minimum: 0.08,
    easing: "ease",
    speed: 400,
})

function ProgressBarComponent() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    React.useEffect(() => {
        NProgress.done()
    }, [pathname, searchParams])

    React.useEffect(() => {
        // Inject nprogress styles
        const style = document.createElement("style")
        style.innerHTML = `
      #nprogress {
        pointer-events: none;
      }
      #nprogress .bar {
        background: hsl(var(--primary));
        position: fixed;
        z-index: 9999;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
      }
      #nprogress .peg {
        display: block;
        position: absolute;
        right: 0px;
        width: 100px;
        height: 100%;
        box-shadow: 0 0 10px hsl(var(--primary)), 0 0 5px hsl(var(--primary));
        opacity: 1.0;
        transform: rotate(3deg) translate(0px, -4px);
      }
    `
        document.head.appendChild(style)

        return () => {
            document.head.removeChild(style)
        }
    }, [])

    // Listen to clicks on links to trigger progress bar
    React.useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const anchor = target.closest("a")
            if (anchor && anchor.href && anchor.href.startsWith(window.location.origin)) {
                NProgress.start()
            }
        }

        document.addEventListener("click", handleClick)
        return () => {
            document.removeEventListener("click", handleClick)
        }
    }, [])

    return null
}

export function ProgressBar() {
    return (
        <React.Suspense fallback={null}>
            <ProgressBarComponent />
        </React.Suspense>
    )
}
