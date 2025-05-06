import { socialMediaInfo } from "@/utils/static"

export default function SocialMedia() {
    return (
        <div className="flex flex-row justify-center gap-2">
            {
                socialMediaInfo.map(el => {
                    const AppIcon = el.icon
                    return (
                        <a key={el.app} href={el.url} target="_blank" className={`btn btn-circle p-3 border bg-base-300 hover:bg-primary`}>
                            {<AppIcon className="size-5" />}
                        </a>
                    )
                })
            }
        </div>
    )
}