export default function HeaderProps({ title, description }: { title: string, description: string }) {
    return (
        <div className="max-w-full flex flex-col items-centerjsutify-start py-2 pb-6">
            <h1 className="text-[24px] text-[#525866] font-dmsans font-medium">{title}</h1>
            <h2 className="text-[16px] text-[#525866] font-dmsans font-normal">{description}</h2>
        </div>

    )
}