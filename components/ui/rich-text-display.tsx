interface RichTextDisplayProps {
    html: string
    className?: string
}

export default function RichTextDisplay({html, className}: RichTextDisplayProps) {
    if (!html) return null

    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{__html: html}}
            style={{
                lineHeight: 1.7,
            }}
        />
    )
}
