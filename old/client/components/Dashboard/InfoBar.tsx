import Image from "next/image";

const data = [
    {
        title: "Introducing tags",
        description:
            "Easily categorize and find your notes by adding tags. Keep your workspace clutter-free and efficient.",
    },
    {
        title: "Share Notes Instantly",
        description:
            "Effortlessly share your notes with others via email or link. Enhance collaboration with quick sharing options.",
    },
    {
        title: "Access Anywhere",
        description:
            "Sync your notes across all devices. Stay productive whether you're on your phone, tablet, or computer.",
    },
];
const InfoBar = () => {
    return (
        <div className="flex gap-10 py-12">
            {data.map((d, i) => (
                <div key={i} className="flex gap-3">
                    <Image
                        src={`/assets/images/infobar_${i + 1}.svg`}
                        alt={`infobar_${i + 1}`}
                        width={250}
                        height={250}
                    />
                    <div className="text-gray-500">
                        <h1 className="text-xl font-semibold">{d.title}</h1>
                        <p className="text-lg text-wrap">{d.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InfoBar;
