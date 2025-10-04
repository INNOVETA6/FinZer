// src/pages/VisualGuidePage.tsx
import { Link, useParams } from "react-router-dom";
import Header from "@/components/DynamicNavbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// If alias isn't configured, use relative path: "../data/learningHub"
import { infographics } from "@/data/Learningdata";


export default function VisualGuidePage() {
    const { id } = useParams();
    const guide = infographics.find((g) => String(g.id) === String(id));

    if (!guide) {
        return (
            <>
                <Header />
                <div className="max-w-3xl mx-auto p-6">
                    <h1 className="text-2xl font-semibold mb-4">Guide not found</h1>
                    <Button asChild>
                        <Link to="/">Back to hub</Link>
                    </Button>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-white">
                <section className="py-10 px-6">
                    <div className="max-w-4xl mx-auto">
                        <Button asChild variant="secondary">
                            <Link to="/">Back</Link>
                        </Button>

                        <Card className="mt-4 p-4">
                            <img src={guide.image} alt={guide.title} className="w-full h-auto rounded-lg" />
                            <h1 className="text-3xl font-bold mt-4">{guide.title}</h1>

                            <div className="mt-4 flex gap-2">
                                <Button
                                    onClick={() => {
                                        const a = document.createElement("a");
                                        a.href = guide.image;
                                        a.download = `${guide.title}.jpg`;
                                        a.click();
                                    }}
                                >
                                    Download
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={async () => {
                                        const url = `${window.location.origin}/visual-guides/${guide.id}`;
                                        await navigator.clipboard.writeText(url);
                                    }}
                                >
                                    Copy link
                                </Button>
                            </div>
                        </Card>
                    </div>
                </section>
            </main>
        </>
    );
}
