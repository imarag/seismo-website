import { socialMediaInfo } from "@/utils/static"

export default function SocialMedia({ bg, hoverBg }) {
    return (
        <div className="flex flex-row justify-center gap-2">
            {
                socialMediaInfo.map(el => {
                    const AppIcon = el.icon
                    return (
                        <a key={el.app} href={el.url} target="_blank" className={`btn btn-circle p-3 border bg-${bg} hover:bg-${hoverBg}`}>
                            { <AppIcon className="size-5" /> }
                        </a>
                    )
                })
            }
        </div>
    )
}