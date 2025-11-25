import { Helmet } from 'react-helmet-async';

interface HeadMetaProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
}

export function HeadMeta({
    title = "Ikoranabuhanga Rigezweho® - Building Rwanda's Future through Digital Literacy",
    description = "A Rwandan social enterprise empowering youth through digital literacy training, ICT career guidance, and responsible technology use.",
    image = "/og-image.png",
    url = "https://ikoranabuhanga.rw"
}: HeadMetaProps) {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />
        </Helmet>
    );
}
